<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import demo from './demo.json'

// The recording is the real app on a fresh data folder: create a server, start it, add a plugin, take
// a backup. It plays itself while it is on screen, stops when it is not, and never starts at all for
// someone who has asked for reduced motion. The steps under it are real buttons, so the same story is
// there as text and can be jumped through. tools/demo/ rebuilds the video and demo.json.
const video = ref<HTMLVideoElement>()
const stage = ref<HTMLElement>()
const playing = ref(false), reduced = ref(false), step = ref(1)
let userPaused = false, observer: IntersectionObserver | undefined

const chapters = demo.captions

function toggle() {
  const el = video.value
  if (!el) return
  if (el.paused) { userPaused = false; el.play().catch(() => {}) } else { userPaused = true; el.pause() }
}
function seek(start: number) {
  const el = video.value
  if (!el) return
  userPaused = false
  el.currentTime = start + 0.05
  el.play().catch(() => {})
}
function tick() {
  const el = video.value
  if (!el) return
  const now = chapters.find(c => el.currentTime >= c.start && el.currentTime < c.end)
  if (now) step.value = now.n
}

onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced.value || !stage.value) return
  observer = new IntersectionObserver(entries => {
    const el = video.value
    if (!el) return
    for (const entry of entries) {
      if (entry.isIntersecting && !userPaused) el.play().catch(() => {})
      else if (!entry.isIntersecting) el.pause()
    }
  }, { threshold: 0.4 })
  observer.observe(stage.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section class="demo" aria-labelledby="demo-title">
    <div class="demo-head">
      <span class="demo-eyebrow">SEE IT RUN</span>
      <h2 id="demo-title">From nothing<br> to a running server.</h2>
      <p>This is the real app on a fresh install. The waiting has been sped up, and nothing else has been changed.</p>
    </div>
    <div ref="stage" class="demo-stage">
      <video ref="video" muted loop playsinline preload="none" poster="/demo/poster.webp" :controls="reduced" :width="demo.w" :height="demo.h"
        aria-label="A recording of SpawnLoft: creating a server, starting it, installing the WorldEdit plugin and taking a backup."
        @play="playing = true" @pause="playing = false" @timeupdate="tick">
        <source src="/demo/demo.webm" type="video/webm">
        <source src="/demo/demo.mp4" type="video/mp4">
      </video>
      <button v-if="!reduced" class="demo-toggle" type="button" :aria-label="playing ? 'Pause the demo' : 'Play the demo'" @click="toggle">
        <svg v-if="playing" width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1.5" width="3.4" height="11" rx="1"/><rect x="8.6" y="1.5" width="3.4" height="11" rx="1"/></svg>
        <svg v-else width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1.6v10.8a.5.5 0 0 0 .76.43l8.6-5.4a.5.5 0 0 0 0-.86l-8.6-5.4A.5.5 0 0 0 3 1.6Z"/></svg>
        <span>{{ playing ? 'Pause' : 'Play' }}</span>
      </button>
    </div>
    <ol class="demo-steps">
      <li v-for="chapter in chapters" :key="chapter.n">
        <button type="button" :aria-current="step === chapter.n ? 'step' : undefined" @click="seek(chapter.start)">
          <span class="demo-n">0{{ chapter.n }}</span>{{ chapter.text }}
        </button>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.demo { background:#090d0d; border-top:1px solid #c4f56622; padding:80px 5vw 70px; color:#efeee6; }
.demo-eyebrow { font:11px var(--mono); letter-spacing:.14em; color:#91a380; }
.demo-head { display:grid; grid-template-columns:1fr 1fr; column-gap:5vw; row-gap:0; align-items:end; margin-bottom:44px; }
.demo-head h2 { grid-column:1; font:600 clamp(36px,4.6vw,66px)/1 var(--display); letter-spacing:-.05em; margin:18px 0 0; }
.demo-eyebrow { grid-column:1 / -1; }
.demo-head p { grid-column:2; margin:0; font-size:14px; line-height:1.75; color:#a9b59d; max-width:420px; justify-self:end; }
.demo-stage { position:relative; max-width:1120px; margin:0 auto; border:1px solid #c4f56630; border-radius:10px; overflow:hidden; background:#080c0a; box-shadow:0 30px 80px -30px #000, 0 0 0 1px #000; }
.demo-stage video { display:block; width:100%; height:auto; aspect-ratio:8 / 5; }
.demo-toggle { position:absolute; right:14px; bottom:14px; display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:6px; border:1px solid #c4f56640; background:#0a100bd9; color:#efeee6; font:11px var(--mono); letter-spacing:.08em; text-transform:uppercase; cursor:pointer; backdrop-filter:blur(6px); }
.demo-toggle:hover { border-color:var(--sl-lime,#c4f566); color:var(--sl-lime,#c4f566); }
.demo-toggle:focus-visible, .demo-steps button:focus-visible { outline:2px solid var(--sl-lime,#c4f566); outline-offset:3px; }
.demo-steps { list-style:none; display:grid; grid-template-columns:repeat(4,1fr); gap:0; max-width:1120px; margin:26px auto 0; padding:0; }
.demo-steps li { border-top:1px solid #9bb38530; }
.demo-steps button { display:flex; gap:14px; align-items:baseline; width:100%; text-align:left; padding:16px 12px 0 0; color:#8f9c86; font:500 17px var(--display); letter-spacing:-.03em; cursor:pointer; background:none; border:0; transition:color .2s; }
.demo-steps li:has(button[aria-current=step]) { border-top-color:var(--sl-lime,#c4f566); }
.demo-steps button[aria-current=step] { color:#efeee6; }
.demo-steps button:hover { color:#efeee6; }
.demo-n { font:11px var(--mono); letter-spacing:.1em; color:var(--sl-lime,#c4f566); }
@media(max-width:850px) { .demo-head { grid-template-columns:1fr; row-gap:18px; } .demo-head p { grid-column:1; justify-self:start; } .demo-steps { grid-template-columns:1fr 1fr; gap:0 20px; } .demo-steps button { padding-bottom:14px; } }
@media(max-width:560px) { .demo { padding:52px 22px 46px; } .demo-stage { border-radius:8px; } .demo-toggle { right:8px; bottom:8px; padding:6px 9px; } .demo-steps { grid-template-columns:1fr; } .demo-steps button { font-size:16px; } }
@media(prefers-reduced-motion:reduce) { .demo-steps button { transition:none; } }
</style>
