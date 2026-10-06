// The Descent scene: the authored SpawnLoft island, and a camera that travels down through its layers.
// three and the model load lazily, so the server render and first paint never wait for them.
import type * as THREE from 'three'

// Chapter keyframes. `KEYS` are scroll progress values; `Y_KEYS` is the Minecraft height the
// gauge shows at each one (64 is sea level, 0 is where deepslate starts, -64 is bedrock).
export const KEYS = [0, 0.2, 0.42, 0.58, 0.76, 1]
export const Y_KEYS = [150, 70, 40, 0, -30, -64]
export const Y_TOP = 150
export const Y_BOTTOM = -64

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const ease = (s: number) => s * s * (3 - 2 * s)

/** Scroll progress to a curve position, easing inside each segment so every chapter holds for a beat. */
export function mapU(p: number) {
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1]) i++
  return i + ease(clamp((p - KEYS[i]) / (KEYS[i + 1] - KEYS[i]), 0, 1))
}
export function yAt(u: number) {
  const i = Math.min(Math.floor(u), Y_KEYS.length - 2)
  return Y_KEYS[i] + (Y_KEYS[i + 1] - Y_KEYS[i]) * (u - i)
}
export const layerName = (y: number) => y >= 64 ? (y > 110 ? 'SKY' : 'SURFACE') : y >= 0 ? 'STONE' : y > -50 ? 'DEEPSLATE' : 'BEDROCK'
export const yPercent = (y: number) => (Y_TOP - y) / (Y_TOP - Y_BOTTOM) * 100

function hash(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453
  return h - Math.floor(h)
}

export interface World {
  /** Advance the scene. `u` comes from mapU; pointer values run -1..1 across the stage. */
  frame(dt: number, u: number, pointerX: number, pointerY: number): void
  /** Screen position of the label anchor for backup snapshot `index`. */
  project(index: number, width: number, height: number): { x: number; y: number; visible: boolean }
  resize(width: number, height: number): void
  onContextLost(handler: () => void): void
  dispose(): void
}
export const SNAPSHOTS = 5

// The model is about 8 units wide (see art/WORLD.md); this scales it to fill the scene.
const MODEL_URL = '/models/spawnloft-world.glb'
const SCALE = 5

export async function createWorld(canvas: HTMLCanvasElement, reduced: boolean): Promise<World> {
  const [T, { GLTFLoader }] = await Promise.all([import('three'), import('three/addons/loaders/GLTFLoader.js')])
  const gltf = await new GLTFLoader().loadAsync(MODEL_URL)

  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x090d0d, 1)
  renderer.toneMapping = T.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95
  const scene = new T.Scene()
  scene.fog = new T.Fog(0x090d0d, 80, 230)
  const camera = new T.PerspectiveCamera(42, 1, 0.2, 400)

  // The model ships geometry and materials only, so the scene supplies the same lighting rig as the live hero.
  scene.add(new T.HemisphereLight(0xe9f5e3, 0x192018, 1.0))
  const key = new T.DirectionalLight(0xffedd3, 2.3)
  key.position.set(-40, 60, 80)
  const rim = new T.DirectionalLight(0xc4f566, 2.2)
  rim.position.set(40, 10, -40)
  const fill = new T.DirectionalLight(0xb7d3e4, 0.7)
  fill.position.set(50, -20, 50)
  scene.add(key, rim, fill)
  const lantern = new T.PointLight(0xc4f566, 520, 44, 2)
  scene.add(lantern)

  // The island, split the way the art notes describe: the surface and portal lift off, the stone foundation
  // stays, and the server core drops out below as you descend.
  const model = gltf.scene
  const part = (name: string) => model.getObjectByName(name) as THREE.Object3D
  const surface = [part('World'), part('Portal')]
  const satellites = part('Satellites')
  const core = part('Core')
  const island = new T.Group()
  island.scale.setScalar(SCALE)
  island.add(model)
  scene.add(island)

  // Distant islands are small copies of the same model, so the whole scene shares one art style.
  const sky = [
    { p: [-72, 34, -72], k: 0.34 }, { p: [64, 52, -104], k: 0.42 }, { p: [-42, 92, -150], k: 0.3 },
    { p: [90, 18, -44], k: 0.26 }, { p: [-98, 66, -34], k: 0.3 },
  ].map((o, i) => {
    const g = new T.Group()
    g.add(part('Foundation').clone(true), part('World').clone(true))
    g.scale.setScalar(SCALE * o.k)
    g.position.set(o.p[0], o.p[1], o.p[2])
    g.rotation.y = i * 1.3
    g.userData.y0 = o.p[1]
    scene.add(g)
    return g
  })

  // Camera path. Look targets sit to the left of the island so it rides the right of the screen, clear of the copy.
  const v3 = (a: number[]) => new T.Vector3(a[0], a[1], a[2])
  const camCurve = new T.CatmullRomCurve3([[30, 30, 70], [22, 16, 60], [58, -2, 44], [-30, -30, 44], [24, -62, 48], [2, -92, 30]].map(v3), false, 'catmullrom', 0.5)
  const lookCurve = new T.CatmullRomCurve3([[-13, 6, 0], [-12, 5, 0], [-30, 0, 2], [-12, -36, -10], [-15, -66, -6], [-9, -100, 0]].map(v3), false, 'catmullrom', 0.5)
  const pathSamples = camCurve.getPoints(160)

  // Debris that whips past the camera on the way down. Nothing is placed on the camera's own path.
  type Chip = { x: number; y: number; z: number; s: number; rx: number; ry: number; c: THREE.Color }
  const stone = new T.Color(0x7a8078), deep = new T.Color(0x3b4247), lime = new T.Color(0xc4f566)
  const chips: Chip[] = [], glints: Chip[] = [], probe = new T.Vector3()
  for (let n = 0; n < 420 && chips.length + glints.length < 260; n++) {
    const a = hash(n, 1, 2) * Math.PI * 2, r = 14 + Math.sqrt(hash(n, 3, 4)) * 66, y = 6 - hash(n, 5, 6) * 116
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    if (Math.hypot(x, z) < 24 && y > -36) continue
    probe.set(x, y, z)
    if (pathSamples.some(s => s.distanceTo(probe) < 6.5)) continue
    const size = 0.5 + hash(n, 7, 8) * 2.4, glint = hash(n, 9, 1) > 0.9
    ;(glint ? glints : chips).push({ x, y, z, s: glint ? size * 0.45 : size, rx: hash(n, 2, 2) * 3, ry: hash(n, 3, 3) * 3,
      c: glint ? lime.clone().multiplyScalar(0.8) : (y < -22 ? deep : stone).clone().multiplyScalar(0.7 + hash(n, 4, 4) * 0.5) })
  }
  const box = new T.BoxGeometry(1, 1, 1)
  const dummy = new T.Object3D()
  const chipMesh = (list: Chip[], mat: THREE.Material) => {
    const mesh = new T.InstancedMesh(box, mat, Math.max(1, list.length))
    list.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z); dummy.scale.setScalar(b.s); dummy.rotation.set(b.rx, b.ry, 0); dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, b.c)
    })
    mesh.count = list.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    return mesh
  }
  scene.add(chipMesh(chips, new T.MeshLambertMaterial({ color: 0xffffff })), chipMesh(glints, new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })))

  // Backups: stacked ghost copies of the island's surface, one per saved snapshot.
  const snaps: THREE.Group[] = [], anchors: THREE.Vector3[] = []
  for (let s = 0; s < SNAPSHOTS; s++) {
    // Dim, lime-lit copies: solid enough to keep the cabin readable, fainter with age.
    const ghost = new T.MeshLambertMaterial({ color: 0x1b2a12, emissive: lime.clone().multiplyScalar(0.3 * (1 - s * 0.16)), transparent: true, opacity: 0.8 - s * 0.08 })
    const copy = part('World').clone(true)
    copy.traverse(o => { if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).material = ghost })
    const g = new T.Group()
    g.add(copy)
    g.scale.setScalar(SCALE * 0.42)
    g.position.set(0, -46 - s * 10, 0)
    g.rotation.y = s * 0.5
    scene.add(g)
    snaps.push(g)
    anchors.push(new T.Vector3(8.6, -46 - s * 10, 0))
  }

  // The Start block at bedrock.
  const startCube = new T.Mesh(new T.BoxGeometry(4.6, 4.6, 4.6), new T.MeshBasicMaterial({ color: 0xc4f566, toneMapped: false }))
  const startEdges = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5.1, 5.1, 5.1)), new T.LineBasicMaterial({ color: 0xefeee6, toneMapped: false }))
  startCube.position.set(-2, -101, -6)
  startEdges.position.copy(startCube.position)
  scene.add(startCube, startEdges)
  const startLight = new T.PointLight(0xc4f566, 1400, 70, 2)
  startLight.position.set(-2, -98, 2)
  scene.add(startLight)

  // Clouds in a field behind the island, each drifting at its own speed.
  const clouds = Array.from({ length: 64 }, (_, c) => ({
    x: (hash(c, 1, 0) - 0.5) * 300, y: 16 + hash(c, 2, 0) * 48, z: -150 + hash(c, 3, 0) * 130,
    sx: 5 + hash(c, 4, 0) * 12, sz: 3 + hash(c, 5, 0) * 7, v: 0.7 + hash(c, 6, 0) * 1.4,
  }))
  const cloudMesh = new T.InstancedMesh(box, new T.MeshLambertMaterial({ color: 0xe9f1e6, emissive: 0x1d2527 }), clouds.length)
  const placeClouds = () => {
    clouds.forEach((o, i) => {
      dummy.position.set(o.x, o.y, o.z); dummy.scale.set(o.sx, 2.2, o.sz); dummy.rotation.set(0, 0, 0); dummy.updateMatrix()
      cloudMesh.setMatrixAt(i, dummy.matrix)
    })
    cloudMesh.instanceMatrix.needsUpdate = true
  }
  placeClouds()
  scene.add(cloudMesh)

  // Embers rising through every layer.
  const EMBERS = 900
  const ePos = new Float32Array(EMBERS * 3), eSpeed = new Float32Array(EMBERS)
  for (let e = 0; e < EMBERS; e++) {
    ePos[e * 3] = (hash(e, 1, 7) - 0.5) * 120; ePos[e * 3 + 1] = 30 - hash(e, 2, 7) * 150; ePos[e * 3 + 2] = (hash(e, 3, 7) - 0.5) * 120
    eSpeed[e] = 0.6 + hash(e, 4, 7) * 1.8
  }
  const eGeo = new T.BufferGeometry()
  eGeo.setAttribute('position', new T.BufferAttribute(ePos, 3))
  scene.add(new T.Points(eGeo, new T.PointsMaterial({ color: 0xc4f566, size: 0.28, transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false })))

  let time = 0, cx = 0, cy = 0
  const lookAt = new T.Vector3(), fwd = new T.Vector3(), right = new T.Vector3(), up = new T.Vector3(), proj = new T.Vector3()
  let lostHandler = () => {}
  const lost = (event: Event) => { event.preventDefault(); lostHandler() }
  canvas.addEventListener('webglcontextlost', lost)

  /** Lay the island out for scroll position `u`: assembled at the surface, pulled apart from Customize on. */
  const arrange = (u: number) => {
    const open = ease(clamp(u - 1, 0, 1))
    surface.forEach(o => { o.position.y = open * 0.8 })
    core.position.y = -open * 2.0
    satellites.position.y = open * 0.9 + (reduced ? 0 : Math.sin(time * 0.7) * 0.08)
    satellites.rotation.y = reduced ? 0 : Math.sin(time * 0.25) * 0.3
  }

  return {
    frame(dt, u, px, py) {
      time += dt
      const t = u / (KEYS.length - 1)
      camCurve.getPoint(t, camera.position)
      lookCurve.getPoint(t, lookAt)
      const k = reduced ? 0 : 1 - Math.exp(-7 * dt)
      cx += (px - cx) * k; cy += (py - cy) * k
      // Moving the camera and re-aiming at the same target is what makes near objects shift more than far ones.
      camera.lookAt(lookAt)
      camera.translateX(cx * 3.4); camera.translateY(-cy * 2.2)
      camera.lookAt(lookAt)
      camera.getWorldDirection(fwd)
      right.crossVectors(fwd, camera.up).normalize()
      up.crossVectors(right, fwd).normalize()
      lantern.position.copy(camera.position).addScaledVector(fwd, 15).addScaledVector(right, cx * 10).addScaledVector(up, -cy * 6.5)
      arrange(u)

      if (!reduced) {
        sky.forEach((g, i) => { g.position.y = g.userData.y0 + Math.sin(time * 0.5 + i * 1.7) * 1.3 })
        snaps.forEach((g, i) => { g.rotation.y += dt * 0.12 * (i % 2 ? 1 : -1) })
        clouds.forEach(o => { o.x += o.v * dt * 1.2; if (o.x > 150) o.x = -150 })
        placeClouds()
        for (let i = 0; i < EMBERS; i++) { let y = ePos[i * 3 + 1] + eSpeed[i] * dt; if (y > 32) y = -118; ePos[i * 3 + 1] = y }
        eGeo.attributes.position.needsUpdate = true
        const pulse = 1 + Math.sin(time * 2) * 0.035
        startCube.scale.setScalar(pulse); startEdges.scale.setScalar(pulse)
        startCube.rotation.y = startEdges.rotation.y = time * 0.25
      }
      renderer.render(scene, camera)
    },
    project(index, width, height) {
      proj.copy(anchors[index]).project(camera)
      return { x: (proj.x * 0.5 + 0.5) * width, y: (-proj.y * 0.5 + 0.5) * height, visible: proj.z < 1 }
    },
    resize(width, height) {
      const narrow = width < 760
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.fov = narrow ? 62 : 42
      camera.updateProjectionMatrix()
    },
    onContextLost(handler) { lostHandler = handler },
    dispose() {
      canvas.removeEventListener('webglcontextlost', lost)
      const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>()
      scene.traverse(o => {
        const m = o as THREE.Mesh
        if (m.geometry) geometries.add(m.geometry)
        if (m.material) for (const mat of Array.isArray(m.material) ? m.material : [m.material]) materials.add(mat)
      })
      geometries.forEach(g => g.dispose())
      materials.forEach(m => m.dispose())
      renderer.dispose()
    },
  }
}
