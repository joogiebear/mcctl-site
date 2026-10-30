<script setup lang="ts">
import { nextTick, ref } from 'vue'
import BrandIcon from '../BrandIcon.vue'
import demo from '../demo.json'

// The recording is the real app on a fresh data folder: create a server, start it, add a plugin,
// take a backup. Nothing plays until it is asked to: the poster is a button, the video element is
// created on the first press, and the browser's own controls take over from there. The chapters
// under it are real buttons that seek, so the same story is there as text. tools/demo/ in the
// app repository rebuilds the video and demo.json.
const chapters = demo.captions
const started = ref(false), step = ref(0)
const video = ref<HTMLVideoElement>()
const length = `${Math.floor(demo.duration / 60)}:${String(Math.round(demo.duration % 60)).padStart(2, '0')}`

async function start(at = 0) {
  started.value = true
  await nextTick()
  const el = video.value
  if (!el) return
  if (at) el.currentTime = at + 0.05
  el.play().catch(() => {})
}
function seek(chapter: { n: number; start: number }) {
  if (!started.value) return start(chapter.start)
  const el = video.value
  if (!el) return
  el.currentTime = chapter.start + 0.05
  el.play().catch(() => {})
}
function tick() {
  const el = video.value
  if (!el) return
  const now = chapters.find(c => el.currentTime >= c.start && el.currentTime < c.end)
  step.value = now ? now.n : 0
}
</script>

<template>
  <div class="demo">
    <div class="stage">
      <video v-if="started" ref="video" controls muted playsinline preload="auto" poster="/demo/poster.webp" :width="demo.w" :height="demo.h"
        aria-label="A recording of SpawnLoft: creating a server, starting it, installing the WorldEdit plugin and taking a backup."
        @timeupdate="tick" @ended="step = 0">
        <source src="/demo/demo.webm" type="video/webm">
        <source src="/demo/demo.mp4" type="video/mp4">
      </video>
      <button v-else class="poster" type="button" @click="start()">
        <img src="/demo/poster.webp" :width="demo.w" :height="demo.h" alt="" loading="lazy" decoding="async">
        <span class="play"><BrandIcon name="play" :size="16" /><span>Play the demo</span><small class="mono">{{ length }} · no sound</small></span>
        <span class="sr-only">A recording of SpawnLoft creating a server, starting it, installing a plugin and taking a backup.</span>
      </button>
    </div>
    <ol class="chapters" aria-label="Chapters">
      <li v-for="chapter in chapters" :key="chapter.n">
        <button type="button" :aria-current="step === chapter.n ? 'step' : undefined" @click="seek(chapter)"><span class="n mono">0{{ chapter.n }}</span>{{ chapter.text }}</button>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.demo { display: grid; gap: var(--s5); }
.stage { border: 1px solid var(--line-strong); border-radius: var(--r2); overflow: hidden; background: var(--bg-1); box-shadow: var(--shadow-frame); }
.stage video, .stage img { display: block; width: 100%; height: auto; aspect-ratio: 8 / 5; }
.poster { position: relative; display: block; width: 100%; padding: 0; border: 0; background: none; cursor: pointer; }
.poster img { transition: opacity var(--d2) var(--ease); }
.poster:hover img { opacity: .85; }
.play { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: var(--s3); padding: var(--s3) var(--s5) var(--s3) var(--s4); border-radius: 999px; background: var(--accent); color: var(--accent-fg); font: 600 var(--t-ui)/1 var(--text); white-space: nowrap; transition: background var(--d1) var(--ease); }
.poster:hover .play { background: var(--accent-hover); }
.play small { font-size: var(--t-caption); font-weight: 500; opacity: .75; }
.poster:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 4px; }
.chapters { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0 var(--s5); }
.chapters li { border-top: 1px solid var(--line); }
.chapters button { display: flex; gap: var(--s3); align-items: baseline; width: 100%; padding: var(--s3) 0 var(--s2); text-align: left; font: 600 var(--t-ui)/1.3 var(--display); color: var(--fg-3); transition: color var(--d1) var(--ease); }
.chapters button:hover, .chapters button[aria-current="step"] { color: var(--fg); }
.chapters li:has(button[aria-current="step"]) { border-top-color: var(--accent); }
.n { font-size: var(--t-caption); font-weight: 500; color: var(--accent-text); }
@media (max-width: 760px) { .chapters { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 420px) { .play small { display: none; } }
</style>
