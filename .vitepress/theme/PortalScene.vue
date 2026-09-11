<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Group, Mesh, Object3D, Texture, Material } from 'three'

const props = withDefaults(defineProps<{ progress?: number }>(), { progress: 0 })
const host = ref<HTMLElement>()
const ready = ref(false)
let destroyed = false
let cleanup = () => {}

onMounted(() => {
  const element = host.value!
  const motion = matchMedia('(prefers-reduced-motion: reduce)')
  let initialized = false
  let disposeScene = () => {}
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
      disposeScene = () => { disposed = true; renderer.dispose(); renderer.domElement.remove() }
      renderer.setClearColor(0x000000, 0)
      renderer.outputColorSpace = T.SRGBColorSpace
      renderer.toneMapping = T.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.1
      renderer.domElement.setAttribute('aria-hidden', 'true')
      element.appendChild(renderer.domElement)
      const scene = new T.Scene()
      const root = new T.Group()
      scene.add(root)
      const camera = new T.PerspectiveCamera(42, 1, .06, 60)
      scene.add(new T.HemisphereLight(0xe9f5e3, 0x192018, 2))
      const key = new T.DirectionalLight(0xffedd3, 3.5)
      key.position.set(-4, 6, 8)
      scene.add(key)
      const rim = new T.DirectionalLight(0xc4f566, 3)
      rim.position.set(4, 1, -4)
      scene.add(rim)
      const fill = new T.DirectionalLight(0xb7d3e4, 1.6)
      fill.position.set(5, -2, 5)
      scene.add(fill)

      let model: Group | undefined
      let shards: Object3D | undefined
      let frame = 0, previous = 0, elapsed = 0, lastPaint = 0
      let visible = false, contextAvailable = true, narrow = false
      let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0
      let progress = Math.max(0, Math.min(1, props.progress))
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
        geometries.forEach(geometry => geometry.dispose())
        materials.forEach(material => material.dispose())
        textures.forEach(texture => texture.dispose())
      }
      const render = (now: number) => {
        frame = 0
        if (disposed || destroyed || !visible || document.hidden || motion.matches || !contextAvailable || !model) { previous = 0; return }
        if (narrow && now - lastPaint < 30) { frame = requestAnimationFrame(render); return }
        lastPaint = now
        const dt = previous ? Math.min((now - previous) / 1000, .06) : 1 / 60
        previous = now
        elapsed += dt
        const smoothing = 1 - Math.exp(-20 * dt)
        progress += (Math.max(0, Math.min(1, props.progress)) - progress) * smoothing
        currentX += (pointerX - currentX) * smoothing
        currentY += (pointerY - currentY) * smoothing
        // The camera always faces -Z. It passes every frame and stays beyond them
        // at progress=1; lookAt(origin) here would flip it back toward the portal.
        const align = 1 - Math.min(1, progress / .55)
        const distance = narrow ? 15 : 11.5
        camera.position.set(0, 0, distance - (distance + 5) * progress)
        camera.rotation.set(0, 0, 0)
        root.position.set((narrow ? 0 : 1.25) * align, (narrow ? 1.9 : .35) * align, 0)
        root.rotation.set((-.10 + currentY * .025) * align, (-.3 + currentX * .07) * align, -.065 * align)
        if (shards) {
          shards.rotation.z = Math.sin(elapsed * .35) * .035
          shards.position.y = Math.sin(elapsed * .8) * .06 * align
        }
        renderer.render(scene, camera)
        ready.value = true
        frame = requestAnimationFrame(render)
      }
      wake = () => { if (!frame && !disposed) frame = requestAnimationFrame(render) }
      const resize = () => {
        const width = element.clientWidth, height = element.clientHeight
        if (!width || !height || disposed) return
        narrow = window.innerWidth < 760
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, narrow ? 1.2 : 1.5))
        renderer.setSize(width, height, false)
        camera.aspect = width / height
        // Keep the complete gateway in frame on narrow screens.
        camera.fov = narrow ? 52 : 42
        camera.updateProjectionMatrix()
        wake()
      }
      const resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(element)
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake() })
      observer.observe(element)
      const pointer = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') return
        const box = element.getBoundingClientRect()
        pointerX = (event.clientX - box.left) / box.width * 2 - 1
        pointerY = (event.clientY - box.top) / box.height * 2 - 1
      }
      const resetPointer = () => { pointerX = pointerY = 0 }
      const lost = (event: Event) => { event.preventDefault(); contextAvailable = false; ready.value = false }
      const restored = () => { contextAvailable = true; resize(); wake() }
      const unwatch = watch(() => props.progress, wake)
      element.addEventListener('pointermove', pointer, { passive: true })
      element.addEventListener('pointerleave', resetPointer)
      document.addEventListener('visibilitychange', wake)
      renderer.domElement.addEventListener('webglcontextlost', lost)
      renderer.domElement.addEventListener('webglcontextrestored', restored)
      disposeScene = () => {
        if (disposed) return
        disposed = true
        cancelAnimationFrame(frame)
        unwatch()
        observer.disconnect()
        resizeObserver.disconnect()
        element.removeEventListener('pointermove', pointer)
        element.removeEventListener('pointerleave', resetPointer)
        document.removeEventListener('visibilitychange', wake)
        renderer.domElement.removeEventListener('webglcontextlost', lost)
        renderer.domElement.removeEventListener('webglcontextrestored', restored)
        if (model) freeModel(model)
        renderer.dispose()
        renderer.domElement.remove()
      }
      resize()
      new GLTFLoader().load('/models/spawnloft-portal.glb', gltf => {
        if (destroyed || disposed) { freeModel(gltf.scene); return }
        model = gltf.scene
        shards = model.getObjectByName('Shards')
        root.add(model)
        wake()
      }, undefined, () => { ready.value = false; disposeScene() })
    } catch { ready.value = false; disposeScene() }
  }
  const changeMotion = () => {
    if (motion.matches) ready.value = false
    else if (!initialized) void initialize()
    wake()
  }
  motion.addEventListener('change', changeMotion)
  cleanup = () => { motion.removeEventListener('change', changeMotion); disposeScene() }
  void initialize()
})
onBeforeUnmount(() => { destroyed = true; cleanup() })
</script>

<template>
  <div ref="host" class="portal-scene" :class="{ 'is-ready': ready }" role="img" aria-label="A sculpted graphite and lime gateway. Scroll to travel through its illuminated frames.">
    <img src="/models/portal-poster.webp" width="1500" height="1350" alt="" fetchpriority="high" decoding="async" draggable="false">
  </div>
</template>

<style scoped>
.portal-scene { position:relative; width:100%; height:100%; }
.portal-scene img { position:absolute; width:68%; height:86%; left:23%; top:1%; object-fit:contain; user-select:none; transition:opacity .2s; }
.portal-scene :deep(canvas) { position:absolute; inset:0; width:100%; height:100%; display:block; opacity:0; }
.portal-scene.is-ready img { opacity:0; }
.portal-scene.is-ready :deep(canvas) { opacity:1; }
@media(max-width:760px) { .portal-scene img { width:100%; height:53%; left:0; top:12%; } }
@media(prefers-reduced-motion:reduce) { .portal-scene img { transition:none; } }
</style>
