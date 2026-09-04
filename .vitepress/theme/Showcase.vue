<script setup lang="ts">
// The panel, tab by tab, driven by scrolling: the capture stays pinned while the captions pass,
// and whichever caption is crossing the middle of the screen decides which tab is showing.
// Narrow screens get each capture beside its own caption instead, which is the same content
// with no trickery.
import { onBeforeUnmount, onMounted, ref } from 'vue'

const steps = [
  { id: 'console', name: 'Console', title: 'A console you can read', text: 'Search, filter to warnings or errors, pause, wrap, line numbers. Stack traces stay with the error that caused them. Send commands and get the reply back.' },
  { id: 'plugins', name: 'Plugins', title: 'Modrinth and Hangar, searched together', text: 'Every result names its source and is checked against the server\'s version. Updates are checked by hash and applied with a snapshot taken first. Plugins you dropped in by hand are left alone.' },
  { id: 'worlds', name: 'Worlds', title: 'Import a map, switch worlds, export one', text: 'Every world the server holds, with the active one named. A downloaded map drops in from a zip or folder, found wherever it is nested, never overwriting.' },
  { id: 'backups', name: 'Backups', title: 'Snapshots that verify', text: 'Take one now at a chosen scope, or leave it to a nightly schedule with a retention limit. Safe while running: the world is flushed first. Every snapshot can be read back end to end.' },
  { id: 'players', name: 'Players', title: 'Everyone the server knows about', text: 'Gathered from operators, bans, the whitelist, the name cache and the world folder, since none of those is complete on its own. Op, ban or wipe a player from here.' },
  { id: 'performance', name: 'Performance', title: 'Processor and memory, every ten seconds', text: 'The last minute to the last four hours. Both scales follow the data, because a fixed 0 to 100% axis draws every ordinary server as a flat line on the floor.' },
  { id: 'scheduler', name: 'Scheduler', title: 'Backups, restarts and commands on a clock', text: 'Run by Windows Task Scheduler, so they happen whether or not the window is open. A restart can warn the players first, at the full figure, one minute, and ten seconds.' },
  { id: 'settings', name: 'Settings', title: 'The part of server.properties people change', text: 'Who can join, MOTD, difficulty, game mode, PvP, whitelist, view distance. Changing who can join on a world with players warns first, and says how many are affected.' },
]
const active = ref(0)
const els = ref<HTMLElement[]>([])
let io: IntersectionObserver | undefined

onMounted(() => {
  io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = Number((e.target as HTMLElement).dataset.i)
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 })
  for (const el of els.value) io.observe(el)
})
onBeforeUnmount(() => io?.disconnect())
const src = (id: string) => `/img/tabs/${id}.png`
</script>

<template>
  <div class="show">
    <div class="stage">
      <div class="frame">
        <img v-for="(s, i) in steps" :key="s.id" :src="src(s.id)" :alt="`The ${s.name} tab`" width="2558" height="1392" :class="{ on: i === active }" loading="lazy" decoding="async">
      </div>
      <div class="dots" aria-hidden="true">
        <span v-for="(s, i) in steps" :key="s.id" :class="{ on: i === active }">{{ s.name }}</span>
      </div>
    </div>
    <ol class="steps">
      <li v-for="(s, i) in steps" :key="s.id" :data-i="i" :ref="(el) => { if (el) els[i] = el as HTMLElement }" :class="{ on: i === active }">
        <div class="own"><img :src="src(s.id)" :alt="`The ${s.name} tab`" width="2558" height="1392" loading="lazy" decoding="async"></div>
        <span class="tab">{{ s.name }}</span>
        <h3>{{ s.title }}</h3>
        <p>{{ s.text }}</p>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.show { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(280px, 1fr); gap: 48px; align-items: start; }
.stage { position: sticky; top: 88px; display: grid; gap: 12px; }
.frame { position: relative; aspect-ratio: 2558 / 1392; border: 1px solid var(--edge); border-radius: var(--r); overflow: hidden; background: var(--surface); box-shadow: var(--lift), 0 30px 80px rgba(0, 0, 0, .55); }
.frame img { position: absolute; inset: 0; width: 100%; height: auto; opacity: 0; transform: scale(1.015); transition: opacity .45s ease, transform .6s ease; }
.frame img.on { opacity: 1; transform: none; }
.dots { display: flex; flex-wrap: wrap; gap: 4px 12px; font: 500 11px var(--mono); color: var(--ink-3); }
.dots span { display: inline-flex; align-items: center; gap: 6px; transition: color .3s; }
.dots span::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--line); transition: background .3s, box-shadow .3s; }
.dots span.on { color: var(--ink); }
.dots span.on::before { background: var(--live); box-shadow: 0 0 8px var(--live); }
.steps { list-style: none; margin: 0; padding: 0; }
.steps li { position: relative; padding: 14vh 0 14vh 22px; border-left: 1px solid var(--line); transition: opacity .3s; opacity: .42; }
.steps li.on { opacity: 1; }
.steps li::before { content: ''; position: absolute; left: -4px; top: calc(14vh + 6px); width: 7px; height: 7px; border-radius: 50%; background: var(--line); transition: background .3s, box-shadow .3s; }
.steps li.on::before { background: var(--live); box-shadow: 0 0 8px var(--live); }
.steps li:first-child { padding-top: 4px; }
.steps li:first-child::before { top: 10px; }
.steps li:last-child { padding-bottom: 30vh; }
.tab { font: 600 11px var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--lapis); }
.steps h3 { margin: 6px 0 6px; font-size: 19px; font-weight: 600; letter-spacing: -.01em; }
.steps p { margin: 0; color: var(--ink-2); font-size: 15px; line-height: 1.55; }
.own { display: none; }
@media (max-width: 900px) {
  .show { grid-template-columns: 1fr; }
  .stage { display: none; }
  .steps li, .steps li:first-child, .steps li:last-child { padding: 28px 0 28px 18px; opacity: 1; }
  .steps li::before, .steps li:first-child::before { top: 34px; }
  .own { display: block; margin-bottom: 14px; border: 1px solid var(--edge); border-radius: var(--r-sm); overflow: hidden; background: var(--surface); }
  .own img { display: block; width: 100%; height: auto; }
}
@media (prefers-reduced-motion: reduce) { .frame img, .steps li, .dots span::before, .steps li::before { transition: none; } }
</style>
