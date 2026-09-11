<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
const props = withDefaults(defineProps<{ progress?: number; compact?: boolean }>(), { progress: 0, compact: false })
const host = ref<HTMLElement>()
const ready = ref(false)
let dispose = () => {}
let stopped = false
onMounted(async () => {
  const el = host.value!
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  if (motion.matches) return
  try {
    const [THREE, { GLTFLoader }] = await Promise.all([import('three'), import('three/addons/loaders/GLTFLoader.js')])
    if (stopped) return
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.25
    el.appendChild(renderer.domElement)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, .1, 100)
    camera.position.set(8, 8, 12); camera.lookAt(0, .3, 0)
    scene.add(new THREE.HemisphereLight(0xc7dbff, 0x333340, 2.5))
    const key = new THREE.DirectionalLight(0xffe0b2, 3.8); key.position.set(-3, 8, 5); scene.add(key)
    const rim = new THREE.DirectionalLight(0x769cff, 4); rim.position.set(4, 4, -4); scene.add(rim)
    let model: import('three').Group | undefined
    let frame = 0, remaining = 0, visible = false, progress = 0, pointerX = 0, pointerY = 0
    const render = () => {
      frame = 0
      if (!visible || stopped || document.hidden || motion.matches || !model) return
      progress += (props.progress - progress) * .065
      model.rotation.y += (-.12 + progress * .32 + pointerX * .07 - model.rotation.y) * .045
      model.rotation.x += (pointerY * .025 - model.rotation.x) * .045
      const explode = Math.max(0, (progress - .50) * 2)
      const surface = model.getObjectByName('Surface'), strata = model.getObjectByName('Strata'), core = model.getObjectByName('Core'), additions = model.getObjectByName('Additions')
      if (surface) surface.position.y = explode * .55
      if (strata) strata.position.y = -explode * .12
      if (core) core.position.y = -explode * .65
      if (additions) { additions.position.y = explode * .55; additions.scale.setScalar(.75 + Math.min(1, progress * 3) * .25) }
      renderer.render(scene, camera)
      if (--remaining > 0) frame = requestAnimationFrame(render)
    }
    // Render only while responding to input; stop once the movement settles.
    const resume = () => { remaining = 100; if (!frame) render() }
    const unwatch = watch(() => props.progress, resume)
    const resize = new ResizeObserver(() => {
      const { width, height } = el.getBoundingClientRect()
      if (!width || !height) return
      const aspect = width / height, span = props.compact ? 5.1 : 4.65
      camera.left = -span * aspect; camera.right = span * aspect
      camera.top = span; camera.bottom = -span; camera.updateProjectionMatrix()
      renderer.setSize(width, height); resume()
    })
    resize.observe(el)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; resume() }); observer.observe(el)
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const box = el.getBoundingClientRect()
      pointerX = (event.clientX - box.left) / box.width - .5; pointerY = (event.clientY - box.top) / box.height - .5
      resume()
    }
    const reset = () => { pointerX = 0; pointerY = 0; resume() }
    const changeMotion = () => { ready.value = !motion.matches && !!model; resume() }
    const contextLost = (event: Event) => { event.preventDefault(); ready.value = false; visible = false }
    el.addEventListener('pointermove', pointer); el.addEventListener('pointerleave', reset)
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    motion.addEventListener('change', changeMotion); document.addEventListener('visibilitychange', resume)
    const freeModel = (root: import('three').Group) => root.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach(m => m.dispose())
      }
    })
    dispose = () => {
      cancelAnimationFrame(frame); unwatch(); resize.disconnect(); observer.disconnect()
      document.removeEventListener('visibilitychange', resume); motion.removeEventListener('change', changeMotion)
      el.removeEventListener('pointermove', pointer); el.removeEventListener('pointerleave', reset)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      if (model) freeModel(model)
      renderer.dispose(); renderer.domElement.remove()
    }
    new GLTFLoader().load('/models/spawnloft-island.glb', gltf => {
      if (stopped) { freeModel(gltf.scene); return }
      model = gltf.scene; scene.add(model); ready.value = !motion.matches; resume()
    }, undefined, () => { ready.value = false; dispose() })
  } catch { ready.value = false; dispose() }
})
onBeforeUnmount(() => { stopped = true; dispose() })
</script>
<template>
  <div ref="host" class="island-scene" :class="{ ready }" role="img" aria-label="A floating woodland island with a timber cabin and a blue-lit server beneath the stone">
    <img src="/models/island-poster.webp" width="1400" height="1200" alt="" :fetchpriority="compact ? 'auto' : 'high'" decoding="async">
  </div>
</template>
<style scoped>
.island-scene { position: relative; width: 100%; height: 100%; }
.island-scene img, .island-scene :deep(canvas) { position:absolute; inset:0; width:100%; height:100%; object-fit:contain; }
.island-scene img { transition:opacity .6s; }
.island-scene.ready img { opacity:0; }
.island-scene :deep(canvas) { opacity:0; transition:opacity .7s; }
.island-scene.ready :deep(canvas) { opacity:1; }
@media(prefers-reduced-motion:reduce) { .island-scene img,.island-scene :deep(canvas) { transition:none; } }
</style>
