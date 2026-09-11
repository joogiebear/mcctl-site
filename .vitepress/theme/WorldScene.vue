<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Group, Material, Mesh, Object3D, Texture, Vector3 } from 'three'

const props = withDefaults(defineProps<{
  progress?: number
  mode?: 'hero' | 'explore'
  active?: boolean
}>(), { progress: 0, mode: 'hero', active: true })
const emit = defineEmits<{ ready: [] }>()
const host = ref<HTMLElement>()
const ready = ref(false)
let destroyed = false
let cleanup = () => {}

onMounted(() => {
  const element = host.value!
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  let initialized = false
  let runningCleanup = () => {}
  let wake = () => {}

  const initialize = async () => {
    if (initialized || destroyed || motion.matches) return
    initialized = true
    try {
      const [T, { GLTFLoader }] = await Promise.all([
        import('three'), import('three/addons/loaders/GLTFLoader.js'),
      ])
      if (destroyed) return
      const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
      let disposed = false
      // Register the minimum cleanup immediately, including if later setup fails.
      runningCleanup = () => { disposed = true; renderer.dispose(); renderer.domElement.remove() }
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = T.SRGBColorSpace
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = .95
      renderer.shadowMap.type = T.PCFShadowMap
      renderer.domElement.setAttribute('aria-hidden', 'true')
      element.appendChild(renderer.domElement)

      const scene = new T.Scene()
      const camera = new T.OrthographicCamera(-7, 7, 5, -5, .1, 100)
      camera.position.set(9, 8, 12)
      camera.lookAt(0, .65, 0)
      const root = new T.Group()
      scene.add(root)
      scene.add(new T.HemisphereLight(0xd9e5ee, 0x141b16, 1.05))
      const sun = new T.DirectionalLight(0xffe9c4, 2.7)
      sun.position.set(-5, 10, 8)
      sun.castShadow = true
      sun.shadow.mapSize.set(1024, 1024)
      sun.shadow.camera.left = -8
      sun.shadow.camera.right = 8
      sun.shadow.camera.top = 8
      sun.shadow.camera.bottom = -8
      sun.shadow.camera.near = .5
      sun.shadow.camera.far = 30
      sun.shadow.normalBias = .035
      sun.shadow.bias = -.00015
      sun.shadow.radius = 2
      scene.add(sun)
      const rim = new T.DirectionalLight(0xc4f566, 1.4)
      rim.position.set(4, 5, -7)
      scene.add(rim)
      const portalLight = new T.PointLight(0xc4f566, 8, 6, 2)
      const portalPosition = new T.Vector3()
      root.add(portalLight)

      // Tiny additive sprites make the gateway luminous without a bloom render pass.
      const glowCanvas = document.createElement('canvas')
      glowCanvas.width = glowCanvas.height = 64
      const ctx = glowCanvas.getContext('2d')!
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(213,255,144,.75)')
      gradient.addColorStop(.22, 'rgba(172,235,83,.26)')
      gradient.addColorStop(1, 'rgba(129,190,35,0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
      const glowTexture = new T.CanvasTexture(glowCanvas)
      const glowMaterial = new T.SpriteMaterial({ map: glowTexture, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: .55 })
      const glow = new T.Sprite(glowMaterial)
      glow.scale.set(4, 4, 1)
      root.add(glow)

      const motes = new T.Group()
      const moteGeometry = new T.OctahedronGeometry(.048)
      const moteMaterial = new T.MeshBasicMaterial({ color: 0xdcff9f, toneMapped: false })
      for (let i = 0; i < 12; i++) {
        const mote = new T.Mesh(moteGeometry, moteMaterial)
        mote.scale.setScalar(i % 3 === 0 ? 1.4 : .65)
        motes.add(mote)
      }
      root.add(motes)

      let model: Group | undefined
      const pieces: { object: Object3D; origin: Vector3; name: string; yaw: number }[] = []
      let frame = 0
      let visible = false
      let contextAvailable = true
      let elapsed = 0
      let entrance = 0
      let previous = 0
      let currentProgress = Math.max(0, Math.min(1, props.progress))
      let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0
      let lastPaint = 0
      let narrow = false
      let horizontalRadius = 5.3
      let modelHeight = 6.6
      let didEmit = false

      const freeModel = (object: Object3D) => {
        const geometries = new Set<import('three').BufferGeometry>()
        const materials = new Set<Material>()
        const textures = new Set<Texture>()
        object.traverse(child => {
          const mesh = child as Mesh
          if (!mesh.isMesh) return
          geometries.add(mesh.geometry)
          for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
            materials.add(material)
            for (const value of Object.values(material)) if (value && typeof value === 'object' && (value as Texture).isTexture) textures.add(value as Texture)
          }
        })
        textures.forEach(texture => texture.dispose())
        materials.forEach(material => material.dispose())
        geometries.forEach(geometry => geometry.dispose())
      }

      const render = (now: number) => {
        frame = 0
        if (disposed || destroyed || !visible || !props.active || document.hidden || motion.matches || !contextAvailable || !model) {
          previous = 0
          return
        }
        // Mobile gets the same time-based motion with a lower rendering budget.
        if (narrow && now - lastPaint < 30) { frame = requestAnimationFrame(render); return }
        lastPaint = now
        const dt = previous ? Math.min((now - previous) / 1000, .06) : 1 / 60
        previous = now
        elapsed += dt
        entrance = Math.min(1, entrance + dt / .72)
        const assemble = 1 - Math.pow(1 - entrance, 4)
        const smoothing = 1 - Math.exp(-15 * dt)
        const target = Math.max(0, Math.min(1, props.progress))
        currentProgress += (target - currentProgress) * smoothing
        currentX += (pointerX - currentX) * smoothing
        currentY += (pointerY - currentY) * smoothing
        const explore = props.mode === 'explore'
        const spread = explore
          ? Math.sin(Math.min(1, currentProgress * 1.2) * Math.PI / 2)
          : Math.max(0, currentProgress - .15) * .55

        root.rotation.y = -.08 + currentProgress * (explore ? 2.08 : 1.05) + currentX * .20 - (1 - assemble) * .30
        root.rotation.x = currentY * .055
        root.position.y = Math.sin(elapsed * .85) * .06
        const opening = 1 - assemble
        for (const piece of pieces) {
          piece.object.position.copy(piece.origin)
          if (piece.name === 'Foundation') piece.object.position.y -= spread * 1.20 + opening * 3.2
          if (piece.name === 'Core') {
            piece.object.position.y -= spread * 2.0 + opening * 5.2
            piece.object.rotation.y = piece.yaw + elapsed * .17 + spread * .6
          }
          if (piece.name === 'World' || piece.name === 'Details' || piece.name === 'Portal') piece.object.position.y += spread * .8 + opening * 3.3
          if (piece.name === 'Satellites') {
            piece.object.rotation.y = piece.yaw + currentProgress * 1.15 + Math.sin(elapsed * .25) * .035
            piece.object.position.y += Math.sin(elapsed * 1.1) * .13 + opening * 2.3
            piece.object.scale.setScalar(1 + spread * .12)
          }
        }
        const portal = pieces.find(piece => piece.name === 'Portal')
        if (portal) {
          portalLight.position.y = portalPosition.y + portal.object.position.y - portal.origin.y
          glow.position.y = portalLight.position.y
        }
        glowMaterial.opacity = .39 + Math.sin(elapsed * 1.8) * .07
        portalLight.intensity = 8 + Math.sin(elapsed * 1.8) * 1.2
        motes.children.forEach((mote, index) => {
          const angle = elapsed * (.15 + (index % 3) * .025) + index * Math.PI * 2 / 12
          const radius = 4.6 + Math.sin(index * 2.1) * .45
          mote.position.set(Math.cos(angle) * radius, .5 + Math.sin(angle * 2 + index) * 1.4, Math.sin(angle) * radius * .7)
          mote.rotation.y = elapsed + index
        })
        renderer.render(scene, camera)
        if (!ready.value) ready.value = true
        if (!didEmit) { emit('ready'); didEmit = true }
        frame = requestAnimationFrame(render)
      }
      wake = () => {
        if (motion.matches) ready.value = false
        if (!frame && !disposed) frame = requestAnimationFrame(render)
      }
      const resize = () => {
        const width = element.clientWidth, height = element.clientHeight
        if (!width || !height || disposed) return
        narrow = window.innerWidth < 760
        const shadows = !narrow
        if (renderer.shadowMap.enabled !== shadows) {
          renderer.shadowMap.enabled = shadows
          // Recompile when crossing the breakpoint: mobile skips the shadow pass.
          model?.traverse(child => {
            const mesh = child as Mesh
            if (mesh.isMesh) for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) material.needsUpdate = true
          })
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.2 : 1.5))
        const aspect = width / height
        const extraHeight = props.mode === 'explore' ? 1.15 : .4
        const span = Math.max(modelHeight * .66 + extraHeight, (horizontalRadius + .4) / aspect)
        camera.left = -span * aspect
        camera.right = span * aspect
        camera.top = span
        camera.bottom = -span
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
        wake()
      }
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(element)
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake() }, { threshold: 0 })
      observer.observe(element)
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse' || motion.matches) return
        const box = element.getBoundingClientRect()
        pointerX = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1))
        pointerY = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1))
        wake()
      }
      const resetPointer = () => { pointerX = pointerY = 0; wake() }
      const contextLost = (event: Event) => { event.preventDefault(); contextAvailable = false; ready.value = false }
      const contextRestored = () => { contextAvailable = true; resize(); wake() }
      const unwatch = watch(() => [props.progress, props.active], wake)
      const unwatchMode = watch(() => props.mode, resize)
      element.addEventListener('pointermove', pointer, { passive: true })
      element.addEventListener('pointerleave', resetPointer)
      document.addEventListener('visibilitychange', wake)
      renderer.domElement.addEventListener('webglcontextlost', contextLost)
      renderer.domElement.addEventListener('webglcontextrestored', contextRestored)
      runningCleanup = () => {
        if (disposed) return
        disposed = true
        cancelAnimationFrame(frame)
        unwatch()
        unwatchMode()
        observer.disconnect()
        resizeObserver.disconnect()
        element.removeEventListener('pointermove', pointer)
        element.removeEventListener('pointerleave', resetPointer)
        document.removeEventListener('visibilitychange', wake)
        renderer.domElement.removeEventListener('webglcontextlost', contextLost)
        renderer.domElement.removeEventListener('webglcontextrestored', contextRestored)
        if (model) freeModel(model)
        glowTexture.dispose()
        glowMaterial.dispose()
        moteGeometry.dispose()
        moteMaterial.dispose()
        sun.shadow.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
      resize()
      new GLTFLoader().load('/models/spawnloft-world.glb', gltf => {
        if (destroyed || disposed) { freeModel(gltf.scene); return }
        model = gltf.scene
        model.traverse(child => {
          const mesh = child as Mesh
          if (mesh.isMesh) { mesh.castShadow = true; mesh.receiveShadow = true }
        })
        root.add(model)
        const bounds = new T.Box3().setFromObject(model)
        const size = bounds.getSize(new T.Vector3())
        horizontalRadius = Math.hypot(size.x, size.z) * .5
        modelHeight = size.y
        for (const name of ['World', 'Foundation', 'Core', 'Satellites', 'Portal', 'Details']) {
          const object = model.getObjectByName(name)
          if (object) pieces.push({ object, origin: object.position.clone(), name, yaw: object.rotation.y })
        }
        const portal = model.getObjectByName('Portal')
        if (portal) {
          new T.Box3().setFromObject(portal).getCenter(portalLight.position)
          portalPosition.copy(portalLight.position)
          glow.position.copy(portalLight.position)
        }
        resize()
        wake()
      }, undefined, () => { ready.value = false; runningCleanup() })
    } catch {
      ready.value = false
      runningCleanup()
    }
  }
  const changeMotion = () => {
    if (motion.matches) ready.value = false
    else if (!initialized) void initialize()
    wake()
  }
  motion.addEventListener('change', changeMotion)
  cleanup = () => { motion.removeEventListener('change', changeMotion); runningCleanup() }
  void initialize()
})

onBeforeUnmount(() => { destroyed = true; cleanup() })
</script>

<template>
  <div ref="host" class="world-scene" :class="{ 'is-ready': ready }" role="img" aria-label="A floating Minecraft-inspired world with a timber cabin, luminous lime spawn gateway, orbiting islands, and a crystalline server core.">
    <img src="/models/world-poster.webp" width="1500" height="1350" alt="" :fetchpriority="mode === 'hero' ? 'high' : 'auto'" :loading="mode === 'hero' ? 'eager' : 'lazy'" decoding="async" draggable="false">
  </div>
</template>

<style scoped>
.world-scene { position: relative; width: 100%; height: 100%; isolation: isolate; }
.world-scene img, .world-scene :deep(canvas) { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; }
.world-scene img { opacity: 1; transition: opacity .25s ease; user-select: none; }
.world-scene :deep(canvas) { opacity: 0; transition: opacity .25s ease; }
.world-scene.is-ready img { opacity: 0; }
.world-scene.is-ready :deep(canvas) { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .world-scene img, .world-scene :deep(canvas) { transition: none; }
}
</style>
