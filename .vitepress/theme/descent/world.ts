// The Descent scene: one voxel world, one camera that travels down through its layers.
// Generated in the browser, so there are no model files to load. three is imported lazily
// so the server render and first paint never wait for it.
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
function noise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
  const u = ease(x - xi), v = ease(y - yi), w = ease(z - zi)
  const l = (a: number, b: number, t: number) => a + (b - a) * t
  return l(
    l(l(hash(xi, yi, zi), hash(xi + 1, yi, zi), u), l(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), u), v),
    l(l(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), u), l(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), u), v), w)
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

export async function createWorld(canvas: HTMLCanvasElement, reduced: boolean): Promise<World> {
  const T = await import('three')
  const renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.setClearColor(0x090d0d, 1)
  const scene = new T.Scene()
  scene.fog = new T.Fog(0x090d0d, 70, 215)
  const camera = new T.PerspectiveCamera(42, 1, 0.2, 400)

  scene.add(new T.HemisphereLight(0xdfeee0, 0x10160f, 1.7))
  const sun = new T.DirectionalLight(0xffedd3, 2.6)
  sun.position.set(-30, 50, 40)
  scene.add(sun)
  const lantern = new T.PointLight(0xc4f566, 420, 40, 2)
  scene.add(lantern)

  const C = {
    grass: new T.Color(0x5b8736), dirt: new T.Color(0x75573a), stone: new T.Color(0x7a8078), deep: new T.Color(0x3b4247),
    lime: new T.Color(0xc4f566), leaf: new T.Color(0x4f8a3a), wood: new T.Color(0x5b4129),
  }
  type Block = { x: number; y: number; z: number; c: THREE.Color; s?: number; rx?: number; ry?: number }

  function buildIsland(R: number, seed: number, depthMax: number, decor: boolean) {
    const key = (x: number, y: number, z: number) => `${x}|${y}|${z}`
    const all = new Map<string, { x: number; y: number; z: number; k: number }>()
    const cols: { x: number; z: number; top: number; d: number; edge: number }[] = []
    const solid: Block[] = [], ore: Block[] = [], tops: { x: number; y: number; z: number }[] = []
    const topAt: Record<string, number> = {}
    for (let x = -R; x <= R; x++) for (let z = -R; z <= R; z++) {
      const d = Math.hypot(x, z)
      const edge = R * (1 + (noise(x * 0.22 + seed, 1, z * 0.22) - 0.5) * 0.34)
      if (d > edge) continue
      const top = Math.round(noise(x * 0.13 + seed, 5, z * 0.13) * 2.6 - d * 0.045)
      const depth = Math.max(2, Math.round(Math.pow(1 - d / edge, 1.2) * depthMax + 2 + noise(x * 0.35, 2, z * 0.35 + seed) * 2.2))
      cols.push({ x, z, top, d, edge })
      topAt[`${x}|${z}`] = top
      tops.push({ x, y: top, z })
      for (let k = 0; k < depth; k++) all.set(key(x, top - k, z), { x, y: top - k, z, k })
    }
    all.forEach(b => {
      const exposed = !all.has(key(b.x + 1, b.y, b.z)) || !all.has(key(b.x - 1, b.y, b.z)) || !all.has(key(b.x, b.y + 1, b.z)) ||
        !all.has(key(b.x, b.y - 1, b.z)) || !all.has(key(b.x, b.y, b.z + 1)) || !all.has(key(b.x, b.y, b.z - 1))
      if (!exposed) return
      const jitter = 0.86 + hash(b.x, b.y, b.z) * 0.28
      let base: THREE.Color, isOre = false
      if (b.k === 0) base = C.grass
      else if (b.k <= 2) base = C.dirt
      else { base = b.k > depthMax * 0.55 ? C.deep : C.stone; if (noise(b.x * 0.5 + seed, b.y * 0.5, b.z * 0.5) > 0.76) isOre = true }
      if (isOre) ore.push({ x: b.x, y: b.y, z: b.z, c: C.lime.clone().multiplyScalar(0.72 + hash(b.z, b.x, b.y) * 0.4) })
      else solid.push({ x: b.x, y: b.y, z: b.z, c: base.clone().multiplyScalar(jitter) })
    })
    let portalTop = 0
    if (decor) {
      for (const c of cols) {
        if (hash(c.x, 9, c.z) > 0.975 && c.d > 4 && c.d < c.edge - 3 && !(c.x > 1 && c.x < 11 && c.z > -5 && c.z < 3)) {
          for (let t = 1; t <= 2; t++) solid.push({ x: c.x, y: c.top + t, z: c.z, c: C.wood.clone() })
          for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) for (let ly = 3; ly <= 4; ly++)
            solid.push({ x: c.x + dx, y: c.top + ly, z: c.z + dz, c: C.leaf.clone().multiplyScalar(0.85 + hash(c.x + dx, ly, c.z + dz) * 0.3) })
          solid.push({ x: c.x, y: c.top + 5, z: c.z, c: C.leaf.clone() })
        }
      }
      portalTop = -99
      for (let px = 4; px <= 8; px++) portalTop = Math.max(portalTop, topAt[`${px}|-1`] ?? 0)
      for (let ix = 4; ix <= 8; ix++) for (let iy = 0; iy <= 6; iy++)
        if (ix === 4 || ix === 8 || iy === 0 || iy === 6) ore.push({ x: ix, y: portalTop + 1 + iy, z: -1, c: C.lime.clone() })
    }
    return { solid, ore, tops, portalTop }
  }

  const box = new T.BoxGeometry(1, 1, 1)
  const solidMat = new T.MeshLambertMaterial({ color: 0xffffff })
  const oreMat = new T.MeshBasicMaterial({ color: 0xffffff })
  const dummy = new T.Object3D()
  const instance = (list: Block[], mat: THREE.Material) => {
    const mesh = new T.InstancedMesh(box, mat, Math.max(1, list.length))
    list.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.setScalar(b.s || 1)
      dummy.rotation.set(b.rx || 0, b.ry || 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
      mesh.setColorAt(i, b.c)
    })
    mesh.count = list.length
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    return mesh
  }
  const islandGroup = (data: { solid: Block[]; ore: Block[] }) => {
    const g = new T.Group()
    g.add(instance(data.solid, solidMat), instance(data.ore, oreMat))
    return g
  }

  // The main island, with the same lime gate the live hero is built around.
  const main = buildIsland(15, 1.7, 21, true)
  scene.add(islandGroup(main))
  const gate = new T.Mesh(new T.PlaneGeometry(3, 5), new T.MeshBasicMaterial({
    color: 0xc4f566, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }))
  gate.position.set(6, main.portalTop + 4.5, -1)
  scene.add(gate)

  // Distant islands: they cross the screen slower than near ones only because they are farther away.
  const sky = [
    { p: [-72, 34, -72], R: 7, s: 3 }, { p: [64, 52, -104], R: 9, s: 7 }, { p: [-42, 92, -150], R: 6, s: 11 },
    { p: [90, 18, -44], R: 5, s: 5 }, { p: [-98, 66, -34], R: 6, s: 9 },
  ].map(o => {
    const g = islandGroup(buildIsland(o.R, o.s, Math.round(o.R * 0.9), false))
    g.position.set(o.p[0], o.p[1], o.p[2])
    g.userData.y0 = o.p[1]
    scene.add(g)
    return g
  })

  // Camera path. Look targets sit to the left of the islands so the world rides the right of the screen,
  // clear of the copy.
  const v3 = (a: number[]) => new T.Vector3(a[0], a[1], a[2])
  const camCurve = new T.CatmullRomCurve3([[6, 25, 68], [-9, 10, 57], [36, -4, 40], [-23, -28, 38], [18, -60, 40], [2, -92, 30]].map(v3), false, 'catmullrom', 0.5)
  const lookCurve = new T.CatmullRomCurve3([[-16, 4, 0], [-14, 2, 0], [-10, -9, 6], [-12, -34, -9], [-20, -66, -8], [-9, -100, 0]].map(v3), false, 'catmullrom', 0.5)
  const pathSamples = camCurve.getPoints(160)

  // Debris that whips past the camera on the way down. Nothing is placed on the camera's own path.
  const debris: Block[] = [], glints: Block[] = [], probe = new T.Vector3()
  for (let n = 0; n < 420 && debris.length + glints.length < 260; n++) {
    const a = hash(n, 1, 2) * Math.PI * 2, r = 14 + Math.sqrt(hash(n, 3, 4)) * 66, y = 6 - hash(n, 5, 6) * 116
    const x = Math.cos(a) * r, z = Math.sin(a) * r
    if (Math.hypot(x, z) < 20 && y > -30) continue
    probe.set(x, y, z)
    if (pathSamples.some(s => s.distanceTo(probe) < 6.5)) continue
    const size = 0.5 + hash(n, 7, 8) * 2.4, glint = hash(n, 9, 1) > 0.9
    ;(glint ? glints : debris).push({ x, y, z, s: glint ? size * 0.45 : size, rx: hash(n, 2, 2) * 3, ry: hash(n, 3, 3) * 3,
      c: glint ? C.lime.clone().multiplyScalar(0.8) : (y < -22 ? C.deep : C.stone).clone().multiplyScalar(0.7 + hash(n, 4, 4) * 0.5) })
  }
  scene.add(instance(debris, solidMat), instance(glints, oreMat))

  // Backups: stacked ghost copies of the island's surface, one per saved snapshot.
  const ghostMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false })
  const snaps: THREE.Group[] = [], anchors: THREE.Vector3[] = []
  for (let s = 0; s < SNAPSHOTS; s++) {
    const list = main.tops.map(t => ({ x: t.x, y: t.y, z: t.z, c: C.lime.clone().multiplyScalar(1 - s * 0.17) }))
    const g = new T.Group()
    g.add(instance(list, ghostMat))
    g.scale.setScalar(0.55)
    g.position.set(0, -46 - s * 10, 0)
    g.rotation.y = s * 0.5
    scene.add(g)
    snaps.push(g)
    anchors.push(new T.Vector3(9.5, -46 - s * 10, 0))
  }

  // The Start block at bedrock.
  const startCube = new T.Mesh(new T.BoxGeometry(4.6, 4.6, 4.6), new T.MeshBasicMaterial({ color: 0xc4f566 }))
  const startEdges = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(5.1, 5.1, 5.1)), new T.LineBasicMaterial({ color: 0xefeee6 }))
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
  scene.add(new T.Points(eGeo, new T.PointsMaterial({ color: 0xc4f566, size: 0.28, transparent: true, opacity: 0.8, depthWrite: false })))

  let time = 0, cx = 0, cy = 0, narrow = false
  const lookAt = new T.Vector3(), fwd = new T.Vector3(), right = new T.Vector3(), up = new T.Vector3(), proj = new T.Vector3()
  let lostHandler = () => {}
  const lost = (event: Event) => { event.preventDefault(); lostHandler() }
  canvas.addEventListener('webglcontextlost', lost)

  return {
    frame(dt, u, px, py) {
      time += dt
      const t = u / (KEYS.length - 1)
      camCurve.getPoint(t, camera.position)
      lookCurve.getPoint(t, lookAt)
      const k = reduced ? 0 : 1 - Math.exp(-7 * dt)
      cx += (px - cx) * k; cy += (py - cy) * k
      // Moving the camera and re-aiming at the same target is what makes near blocks shift more than far ones.
      camera.lookAt(lookAt)
      camera.translateX(cx * 3.4); camera.translateY(-cy * 2.2)
      camera.lookAt(lookAt)
      camera.getWorldDirection(fwd)
      right.crossVectors(fwd, camera.up).normalize()
      up.crossVectors(right, fwd).normalize()
      lantern.position.copy(camera.position).addScaledVector(fwd, 15).addScaledVector(right, cx * 10).addScaledVector(up, -cy * 6.5)

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
        ;(gate.material as THREE.MeshBasicMaterial).opacity = 0.2 + Math.sin(time * 1.6) * 0.06
      }
      renderer.render(scene, camera)
    },
    project(index, width, height) {
      proj.copy(anchors[index]).project(camera)
      return { x: (proj.x * 0.5 + 0.5) * width, y: (-proj.y * 0.5 + 0.5) * height, visible: proj.z < 1 }
    },
    resize(width, height) {
      narrow = width < 760
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
