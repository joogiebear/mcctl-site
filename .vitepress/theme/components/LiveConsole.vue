<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BrandIcon from '../BrandIcon.vue'
import Pill from './Pill.vue'

// The hero: an HTML replica of the panel fed by a real-shaped Paper log. About 6 KB, crisp at any
// pixel density, animated without video or WebGL, and still at rest when the person has asked for
// reduced motion. The caption on the page says it is a replica; the layout mirrors the shipped panel.
type Line = { level: 'INFO' | 'WARN'; text: string; tone?: 'warn' | 'good' }
const SCRIPT: Line[] = [
  { level: 'INFO', text: '[Chunky] Task running for world. Processed: 75183 chunks (97.99%), ETA: 0:00:02' },
  { level: 'INFO', text: '[Chunky] Task finished for world. Processed: 76729 chunks (100.00%), Total time: 0:02:32' },
  { level: 'INFO', text: 'UUID of player Wunga_ is 6f3c…a91e' },
  { level: 'INFO', text: 'Wunga_[/192.168.1.42:51204] logged in with entity id 318 at (12.5, 71.0, -8.5)', tone: 'good' },
  { level: 'INFO', text: 'Wunga_ joined the game' },
  { level: 'INFO', text: '<Wunga_> anyone else on?' },
  { level: 'INFO', text: 'Kestrel_42 joined the game' },
  { level: 'INFO', text: '<Kestrel_42> omw, bringing the shulkers' },
  { level: 'INFO', text: '[WorldEdit] Loaded 7 schematics from /schematics' },
  { level: 'WARN', text: "Can't keep up! Is the server overloaded? Running 2043ms or 40 ticks behind", tone: 'warn' },
  { level: 'INFO', text: 'TPS from last 1m, 5m, 15m: 20.0, 20.0, 19.98' },
  { level: 'INFO', text: '[SpawnLoft] Snapshot started: scheduled · worlds + plugins + config' },
  { level: 'INFO', text: 'Saving the game (this may take a moment!)' },
  { level: 'INFO', text: 'Saved the game' },
  { level: 'INFO', text: '[SpawnLoft] Snapshot verified · 212 MB · read back 1,418 files · ok', tone: 'good' },
  { level: 'INFO', text: '<Wunga_> backups are on btw' },
  { level: 'INFO', text: 'There are 3 of a max of 10 players online: Wunga_, Kestrel_42, mossy_mina' },
]
const KEEP = 14
const lines = ref<(Line & { stamp: string; id: number })[]>([])
const count = ref(214)
const seconds = ref(8 * 60 + 25)
const two = (v: number) => String(v).padStart(2, '0')
const stamp = () => { const d = new Date(); return `${two(d.getHours())}:${two(d.getMinutes())}:${two(d.getSeconds())}` }
const uptime = () => `${Math.floor(seconds.value / 60)}m ${two(seconds.value % 60)}s`
let next = 0, id = 0
const timers: number[] = []
function add() {
  lines.value.push({ ...SCRIPT[next % SCRIPT.length], stamp: stamp(), id: id++ })
  next++
  if (lines.value.length > KEEP) lines.value.shift()
  count.value++
}
onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  for (let i = 0; i < (reduced ? KEEP : 9); i++) add()
  if (reduced) return
  timers.push(window.setInterval(add, 1700), window.setInterval(() => { seconds.value++ }, 1000))
})
onBeforeUnmount(() => timers.forEach(t => window.clearInterval(t)))
const dock = [['terminal', 'Console'], ['plugins', 'Plugins'], ['files', 'Files'], ['world', 'Worlds'], ['backup', 'Backups'], ['players', 'Players'], ['stats', 'Stats'], ['clock', 'Schedule']]
</script>

<template>
  <div class="console" role="img" aria-label="A replica of the SpawnLoft panel: a running Paper server named Weekend World, its live console, and the tools dock.">
    <div class="tabs" aria-hidden="true">
      <span class="brandmini"><BrandIcon name="mark" :size="16" />SpawnLoft</span>
      <span class="tab on"><i></i>Weekend World</span>
      <span class="tab">Creative Test</span>
      <span class="tab dim">+</span>
    </div>
    <div class="head" aria-hidden="true">
      <div class="title"><span class="name">Weekend World</span><Pill tone="ok">Running · {{ uptime() }}</Pill><span class="meta">Paper 1.21.10 · localhost:25565 · Java 21</span></div>
      <div class="stats">
        <div class="stat"><span class="k">Players</span><span class="v">3<small>/ 10</small></span></div>
        <div class="stat"><span class="k">TPS</span><span class="v">20.0</span></div>
        <div class="stat"><span class="k">Memory</span><span class="v">2.1<small>/ 4 GB</small></span><span class="bar"><i></i></span></div>
        <div class="stat"><span class="k">Last backup</span><span class="v">10m<small>ago</small></span></div>
      </div>
    </div>
    <div class="body" aria-hidden="true">
      <div class="main">
        <div class="toolbar"><span>Console</span><span class="seg"><span class="on">All</span><span>Warnings</span><span>Errors</span></span><span class="count">{{ count }} lines</span></div>
        <div class="log">
          <span v-for="line in lines" :key="line.id" class="ln" :class="line.tone"><span class="t">[{{ line.stamp }} {{ line.level }}]:</span> {{ line.text }}</span>
        </div>
        <div class="input"><span class="field">Type a command<span class="caret"></span></span><span class="send">Send</span></div>
      </div>
      <nav class="dock">
        <a v-for="([icon, label], index) in dock" :key="label" :class="{ on: index === 0 }"><BrandIcon :name="icon" :size="18" />{{ label }}</a>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.console { background: var(--bg); color: var(--fg); font: 400 var(--t-small)/1.4 var(--text); text-align: left; }
.tabs { display: flex; align-items: center; gap: var(--s4); height: 44px; padding: 0 var(--s4); border-bottom: 1px solid var(--line); background: var(--bg-1); color: var(--fg-2); overflow: hidden; }
.brandmini { display: inline-flex; gap: var(--s2); align-items: center; font: 600 var(--t-small)/1 var(--display); color: var(--fg); }
.brandmini svg { color: var(--accent); }
.tab { display: inline-flex; align-items: center; gap: var(--s2); height: 44px; padding: 0 var(--s4); border-bottom: 2px solid transparent; white-space: nowrap; }
.tab.on { color: var(--fg); border-color: var(--accent); }
.tab.dim { color: var(--fg-3); }
.tab i { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 10px var(--ok); }
.head { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--s4) var(--s6); align-items: center; padding: var(--s4) var(--s5); border-bottom: 1px solid var(--line); }
.title { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--s2) var(--s4); min-width: 0; }
.name { font: 600 var(--t-h3)/1.1 var(--display); letter-spacing: -.02em; }
.meta { font: 400 var(--t-caption)/1.5 var(--mono); color: var(--fg-3); }
.stats { display: flex; gap: var(--s6); }
.stat { display: grid; gap: 2px; }
.stat .k { font: 500 var(--t-caption)/1.4 var(--mono); letter-spacing: .08em; color: var(--fg-3); text-transform: uppercase; }
.stat .v { font: 600 var(--t-lede)/1.1 var(--display); font-variant-numeric: tabular-nums; }
.stat .v small { font: 400 var(--t-caption)/1 var(--mono); color: var(--fg-3); margin-left: var(--s1); }
.bar { width: 90px; height: 4px; background: var(--bg-3); border-radius: 2px; overflow: hidden; }
.bar i { display: block; height: 100%; width: 52%; background: var(--accent); }
.body { display: grid; grid-template-columns: minmax(0, 1fr) 112px; min-height: 340px; }
.main { display: grid; grid-template-rows: auto 1fr auto; min-width: 0; }
.toolbar { display: flex; align-items: center; gap: var(--s3); padding: var(--s3) var(--s5); border-bottom: 1px solid var(--line); color: var(--fg-3); font-size: var(--t-code); }
.seg { display: inline-flex; border: 1px solid var(--line); border-radius: var(--r1); overflow: hidden; }
.seg span { padding: 4px 10px; }
.seg span.on { background: var(--bg-3); color: var(--fg); }
.count { margin-left: auto; font: 400 var(--t-caption)/1 var(--mono); }
.log { position: relative; height: 264px; overflow: hidden; padding: var(--s3) var(--s5); font: 400 var(--t-code)/1.7 var(--mono); color: var(--fg-2); white-space: pre-wrap; word-break: break-word; display: flex; flex-direction: column; justify-content: flex-end; }
.log::after { content: ""; position: absolute; inset: 0 0 auto; height: 28px; background: linear-gradient(var(--bg), transparent); pointer-events: none; }
.ln { display: block; animation: ln-in var(--d2) var(--ease) both; }
.ln .t { color: var(--fg-3); }
.ln.warn { color: var(--warn); }
.ln.good { color: var(--accent-text); }
@keyframes ln-in { from { opacity: 0; transform: translateY(4px); } }
.input { display: flex; gap: var(--s3); align-items: center; padding: var(--s3) var(--s5); border-top: 1px solid var(--line); }
.field { flex: 1; min-width: 0; height: 38px; display: flex; align-items: center; padding: 0 var(--s3); border: 1px solid var(--line-strong); border-radius: var(--r1); font: 400 var(--t-code)/1 var(--mono); color: var(--fg-3); }
.caret { width: 1px; height: 16px; background: var(--accent); margin-left: 2px; animation: caret 1s steps(2) infinite; }
@keyframes caret { 50% { opacity: 0; } }
.send { height: 38px; display: inline-flex; align-items: center; padding: 0 var(--s4); background: var(--accent); color: var(--accent-fg); border-radius: var(--r1); font: 600 var(--t-code)/1 var(--text); }
.dock { border-left: 1px solid var(--line); display: grid; align-content: start; padding: var(--s2) 0; }
.dock a { display: grid; justify-items: center; gap: var(--s1); padding: 10px var(--s1); font: 500 var(--t-caption)/1 var(--mono); color: var(--fg-3); }
.dock a.on { color: var(--accent-text); }
@media (max-width: 760px) {
  .head { grid-template-columns: minmax(0, 1fr); }
  .stats { gap: var(--s5); flex-wrap: wrap; }
  .body { grid-template-columns: minmax(0, 1fr); }
  .dock, .seg { display: none; }
  .log { height: 220px; font-size: var(--t-caption); }
}
@media (prefers-reduced-motion: reduce) { .ln, .caret { animation: none; } }
</style>
