<script setup lang="ts">
// A scroll-driven descent through one voxel world. The page has three planes of motion that all read
// the same smoothed scroll value: the 3D camera, the copy, and the giant outlined chapter words.
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BrandIcon from './BrandIcon.vue'
import { KEYS, SNAPSHOTS, createWorld, layerName, mapU, yAt, yPercent, type World } from './descent/world'

// Copy comes from the live page, so the demo says what the product says.
const chapters = [
  { c: KEYS[0], word: 'World', eyebrow: 'Minecraft servers. Personally yours.', title: 'Your world. Within reach.',
    body: 'A free desktop app for running a Minecraft server on your own PC, without the terminal. Scroll to dig down through it.' },
  { c: KEYS[1], word: 'Command', eyebrow: 'Surface · Command', title: 'Less terminal. More control.',
    body: 'Start, stop, and understand your server from one place. Follow the console, find the errors that matter, and send commands without losing the conversation.' },
  { c: KEYS[2], word: 'Customize', eyebrow: 'Stone · Customize', title: 'Room for your weird ideas.',
    body: 'Try a new plugin. Import a map. Clone a server into a test world and see what happens.' },
  { c: 0.7, word: 'Protect', eyebrow: 'Deepslate · Protect', title: 'More uptime. Less upkeep.',
    body: 'Scheduled backups. Planned restarts. Automatic recovery when things go sideways. Each ghost island below is one saved copy of your world.' },
  { c: KEYS[5], word: 'Start', eyebrow: 'Bedrock · Start', title: 'Press Start. Get building.',
    body: 'Your world comes online. Keep the controls close and let the adventure happen.', cta: true },
]
const PROTECT = 0.7
const tags = ['NOW', '6 H AGO', '12 H AGO', '18 H AGO', '24 H AGO'].slice(0, SNAPSHOTS)
const ticks = [{ y: 64, label: 'Y 64 SEA LEVEL' }, { y: 0, label: 'Y 0 DEEPSLATE' }, { y: -64, label: 'Y -64 BEDROCK' }]

const scroller = ref<HTMLElement>(), stage = ref<HTMLElement>(), canvas = ref<HTMLCanvasElement>()
const panelEls: HTMLElement[] = [], wordEls: HTMLElement[] = [], tagEls: HTMLElement[] = []
const markEl = ref<HTMLElement>(), hintEl = ref<HTMLElement>()
const yText = ref('Y 150'), layerText = ref('SKY'), webgl = ref(true), ready = ref(false)

let world: World | undefined
let frame = 0, last = 0, visible = true, destroyed = false
let progress = 0, target = 0, pointerX = 0, pointerY = 0
let cleanup = () => {}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
const smooth = (s: number) => s * s * (3 - 2 * s)

function readScroll() {
  const section = scroller.value, view = stage.value
  if (!section || !view) return
  const box = section.getBoundingClientRect()
  target = clamp(-box.top / Math.max(1, box.height - view.clientHeight), 0, 1)
}

function paint(u: number) {
  chapters.forEach((chapter, i) => {
    const d = progress - chapter.c
    const panel = panelEls[i], word = wordEls[i]
    const show = smooth(clamp(1 - (Math.abs(d) - 0.04) / 0.07, 0, 1))
    if (panel) {
      panel.style.opacity = String(show)
      panel.style.setProperty('--d', d.toFixed(4))
      panel.classList.toggle('on', show > 0.6)
      panel.setAttribute('aria-hidden', show < 0.3 ? 'true' : 'false')
    }
    if (word) {
      word.style.opacity = (smooth(clamp(1 - (Math.abs(d) - 0.04) / 0.08, 0, 1)) * 0.2).toFixed(3)
      word.style.setProperty('--d', d.toFixed(4))
    }
  })
  const y = yAt(u)
  yText.value = `Y ${Math.round(y)}`
  layerText.value = layerName(y)
  if (markEl.value) markEl.value.style.top = `${yPercent(y)}%`
  if (hintEl.value) hintEl.value.style.opacity = progress < 0.02 ? '1' : '0'
  if (world && stage.value) {
    const protect = smooth(clamp(1 - (Math.abs(progress - PROTECT) - 0.04) / 0.07, 0, 1))
    const w = stage.value.clientWidth, h = stage.value.clientHeight
    tagEls.forEach((el, i) => {
      const spot = world!.project(i, w, h)
      el.style.opacity = spot.visible && protect > 0.05 ? String(protect * (1 - i * 0.14)) : '0'
      el.style.transform = `translate3d(${(spot.x + 14).toFixed(1)}px, ${(spot.y - 10).toFixed(1)}px, 0)`
    })
  }
}

onMounted(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const view = stage.value!
  readScroll()
  progress = target
  paint(mapU(progress))

  const onScroll = () => readScroll()
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType && event.pointerType !== 'mouse') return
    const box = view.getBoundingClientRect()
    pointerX = (event.clientX - box.left) / box.width * 2 - 1
    pointerY = (event.clientY - box.top) / box.height * 2 - 1
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
  observer.observe(view)
  let resizer: ResizeObserver | undefined

  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60
    last = now
    if (!visible || document.hidden || destroyed) return
    progress += (target - progress) * (reduced ? 1 : 1 - Math.exp(-5.5 * dt))
    const u = mapU(progress)
    if (world) { world.frame(dt, u, pointerX, pointerY); ready.value = true }
    paint(u)
  }

  const fallback = () => { webgl.value = false; world?.dispose(); world = undefined }
  ;(async () => {
    try {
      world = await createWorld(canvas.value!, reduced)
      if (destroyed) { world.dispose(); world = undefined; return }
      world.onContextLost(fallback)
      resizer = new ResizeObserver(() => world?.resize(view.clientWidth, view.clientHeight))
      resizer.observe(view)
      world.resize(view.clientWidth, view.clientHeight)
    } catch { fallback() }
    frame = requestAnimationFrame(loop)
  })()

  cleanup = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointer)
    observer.disconnect()
    resizer?.disconnect()
    world?.dispose()
  }
})
onBeforeUnmount(() => { destroyed = true; cleanup() })
</script>

<template>
  <div class="descent">
    <header class="descent-bar">
      <a class="descent-brand" href="/" aria-label="SpawnLoft home"><img src="/brand/mark.svg" alt="" width="26" height="26"><b>spawnloft</b></a>
      <nav aria-label="Main navigation">
        <a href="/guide/">Docs <BrandIcon name="arrow" :size="12" /></a>
        <a class="descent-get" href="/#download">Get SpawnLoft <BrandIcon name="arrow" :size="15" /></a>
      </nav>
    </header>

    <main>
      <section ref="scroller" class="descent-scroller" aria-label="Scroll to descend through the world">
        <div ref="stage" class="descent-stage" :class="{ 'no-gl': !webgl }">
          <canvas ref="canvas" class="descent-canvas" :class="{ on: ready }" aria-hidden="true"></canvas>
          <div class="descent-scrim"></div>

          <div class="descent-words" aria-hidden="true">
            <div v-for="(chapter, i) in chapters" :key="chapter.word" :ref="el => { if (el) wordEls[i] = el as HTMLElement }" class="descent-word">{{ chapter.word }}</div>
          </div>

          <article v-for="(chapter, i) in chapters" :key="chapter.title" :ref="el => { if (el) panelEls[i] = el as HTMLElement }" class="descent-panel" :class="{ first: i === 0 }">
            <div class="descent-copy">
              <p class="descent-eyebrow">{{ chapter.eyebrow }}</p>
              <h2 v-if="i > 0">{{ chapter.title }}</h2>
              <h1 v-else>{{ chapter.title }}</h1>
              <p class="descent-body">{{ chapter.body }}</p>
              <a v-if="chapter.cta" class="descent-cta" href="/#download">Get SpawnLoft <BrandIcon name="arrow" :size="15" /></a>
            </div>
          </article>

          <div class="descent-tags" aria-hidden="true">
            <span v-for="(tag, i) in tags" :key="tag" :ref="el => { if (el) tagEls[i] = el as HTMLElement }">{{ tag }}</span>
          </div>

          <aside class="descent-gauge" aria-hidden="true">
            <div class="descent-readout"><span>{{ yText }}</span><em>{{ layerText }}</em></div>
            <div class="descent-rail"></div>
            <div v-for="tick in ticks" :key="tick.y" class="descent-tick" :style="{ top: yPercent(tick.y) + '%' }"><span>{{ tick.label }}</span></div>
            <div ref="markEl" class="descent-mark"></div>
          </aside>

          <div ref="hintEl" class="descent-hint">Scroll to dig</div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.descent { --gutter: clamp(16px, 6vw, 96px); background: var(--void); color: var(--ink); min-height: 100vh; }
.descent a { color: inherit; }
.descent :focus-visible { outline: 2px solid var(--lapis); outline-offset: 3px; }

.descent-bar { position: fixed; z-index: 20; inset: 0 0 auto 0; display: flex; justify-content: space-between; align-items: center; gap: 12px;
  padding: 14px var(--gutter); background: linear-gradient(180deg, rgba(9,13,13,.88), rgba(9,13,13,0)); }
.descent-brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
.descent-brand b { font: 700 1.15rem/1 var(--display); letter-spacing: -.01em; }
.descent-bar nav { display: flex; align-items: center; gap: 22px; font: 500 .9rem/1 var(--ui); }
.descent-bar nav a { text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.descent-bar nav a:hover { color: var(--lapis); }
.descent-get { padding: 11px 16px; background: var(--lapis-dim); color: var(--void) !important; border: 1px solid var(--lapis); border-radius: var(--r-sm); font-weight: 600; }
.descent-get:hover { background: #d9ffa1; }

.descent-scroller { position: relative; height: 640vh; }
.descent-stage { position: sticky; top: 0; height: 100vh; min-height: 520px; overflow: hidden;
  background: radial-gradient(120% 90% at 70% 30%, #16201a 0%, var(--void) 60%); }
.descent-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; transition: opacity .9s ease; }
.descent-canvas.on { opacity: 1; }
.no-gl .descent-canvas { display: none; }
.descent-scrim { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(9,13,13,.82) 0%, rgba(9,13,13,.35) 38%, rgba(9,13,13,0) 62%); }

.descent-words { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.descent-word { position: absolute; right: -2vw; bottom: 4vh; font: 800 clamp(5rem, 21vw, 17rem)/.8 var(--display); letter-spacing: -.045em; text-transform: uppercase;
  color: transparent; -webkit-text-stroke: 1.5px var(--lapis); opacity: 0; white-space: nowrap; transform: translate3d(calc(var(--d, 0) * -1200px), 0, 0); }

.descent-panel { position: absolute; inset: 0; display: flex; align-items: center; padding: 72px var(--gutter); pointer-events: none; opacity: 0; }
/* Resting state, so the first view is complete before any script runs. The scroll code sets inline opacity from then on. */
.descent-panel.first { opacity: 1; }
.descent-panel.on { pointer-events: auto; }
.descent-copy { max-width: 30rem; min-width: 0; }
.descent-eyebrow { margin: 0 0 18px; font: 500 .72rem/1.3 var(--mono); letter-spacing: .16em; text-transform: uppercase; color: var(--lapis); }
.descent-copy :is(h1, h2) { margin: 0 0 18px; font: 700 clamp(2.4rem, 6.2vw, 5rem)/.94 var(--display); letter-spacing: -.035em; text-wrap: balance;
  transform: translate3d(0, calc(var(--d, 0) * -300px), 0); }
.descent-body { margin: 0; max-width: 27rem; color: var(--ink-2); font-size: 1.05rem; transform: translate3d(0, calc(var(--d, 0) * -440px), 0); }
.descent-cta { margin-top: 28px; display: inline-flex; align-items: center; gap: 12px; padding: 14px 22px; background: var(--lapis-dim); color: var(--void) !important;
  border: 1px solid var(--lapis); border-radius: var(--r-sm); font: 600 .95rem/1 var(--ui); text-decoration: none; transform: translate3d(0, calc(var(--d, 0) * -560px), 0); }
.descent-cta:hover { background: #d9ffa1; }

.descent-gauge { position: absolute; right: var(--gutter); top: 50%; height: 46vh; min-height: 220px; width: 120px; transform: translateY(-50%); pointer-events: none;
  font: 500 .66rem/1 var(--mono); letter-spacing: .1em; color: var(--ink-2); }
.descent-rail { position: absolute; right: 0; top: 0; bottom: 0; width: 1px; background: var(--line); }
.descent-tick { position: absolute; right: 0; display: flex; align-items: center; gap: 8px; transform: translateY(-50%); white-space: nowrap; }
.descent-tick::after { content: ""; width: 10px; height: 1px; background: var(--ink-2); }
.descent-mark { position: absolute; right: -4px; top: 0; width: 9px; height: 9px; background: var(--lapis); transform: translateY(-50%); box-shadow: 0 0 14px 2px rgba(196,245,102,.6); }
.descent-readout { position: absolute; right: 0; top: -52px; text-align: right; color: var(--ink); white-space: nowrap; }
.descent-readout em { display: block; margin-top: 5px; font-style: normal; color: var(--lapis); }

.descent-tags span { position: absolute; left: 0; top: 0; padding: 4px 7px; border: 1px solid rgba(196,245,102,.4); background: rgba(9,13,13,.6);
  font: 500 .66rem/1 var(--mono); letter-spacing: .12em; color: var(--lapis); opacity: 0; white-space: nowrap; pointer-events: none; }
.descent-hint { position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 10px;
  font: 500 .68rem/1 var(--mono); letter-spacing: .2em; text-transform: uppercase; color: var(--ink-2); transition: opacity .4s; pointer-events: none; }
.descent-hint::after { content: ""; width: 1px; height: 28px; background: linear-gradient(var(--lapis), transparent); }

@media (max-width: 760px) {
  .descent-bar nav a:not(.descent-get) { display: none; }
  .descent-scrim { background: linear-gradient(0deg, rgba(9,13,13,.9) 0%, rgba(9,13,13,.55) 38%, rgba(9,13,13,0) 66%); }
  .descent-panel { align-items: flex-end; padding-bottom: 76px; }
  .descent-copy :is(h1, h2) { font-size: clamp(2.1rem, 11vw, 3rem); margin-bottom: 12px; }
  .descent-body { font-size: .98rem; }
  .descent-copy :is(h1, h2) { transform: translate3d(0, calc(var(--d, 0) * -160px), 0); }
  .descent-body { transform: translate3d(0, calc(var(--d, 0) * -230px), 0); }
  .descent-cta { transform: translate3d(0, calc(var(--d, 0) * -300px), 0); }
  .descent-gauge { width: 56px; height: 34vh; right: 16px; top: 38%; }
  .descent-tick span, .descent-readout { display: none; }
  .descent-word { font-size: 28vw; bottom: auto; top: 12vh; right: -4vw; }
}
@media (prefers-reduced-motion: reduce) { .descent-canvas, .descent-hint { transition: none; } }
</style>
