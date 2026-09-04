<script setup lang="ts">
// The hero: a server booting, in real time, inside the panel's own chrome. The log lines are the
// ones Paper actually prints, and the moment they end in "Done" the lamp goes green and the uptime
// starts. It plays once; Replay runs it again. With reduced motion the finished state is shown.
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Line = { t: string; text: string; kind?: 'info' | 'warn' | 'cmd' | 'mcctl' }

const SCRIPT: { text: string; wait: number; kind?: Line['kind']; progress?: boolean }[] = [
  { text: 'Starting org.bukkit.craftbukkit.Main', wait: 120 },
  { text: 'Loading libraries, please wait...', wait: 900 },
  { text: 'Starting minecraft server version 26.2', wait: 180 },
  { text: 'Loading properties', wait: 60 },
  { text: 'This server is running Paper version 26.2-86-main', wait: 140 },
  { text: 'Default game type: SURVIVAL', wait: 40 },
  { text: 'Generating keypair', wait: 260 },
  { text: 'Starting Minecraft server on *:25565', wait: 90 },
  { text: 'Using default channel type', wait: 60 },
  { text: '[spark] Loading...', wait: 110 },
  { text: '[EssentialsX] Loading EssentialsX v2.21.2', wait: 70 },
  { text: '[LuckPerms] Loading server plugin LuckPerms v5.5.0', wait: 220 },
  { text: 'Preparing level "world"', wait: 320 },
  { text: 'Preparing start region for dimension minecraft:overworld', wait: 200 },
  { text: 'Preparing spawn area: 0%', wait: 160, progress: true },
  { text: 'Time elapsed: 1268 ms', wait: 120 },
  { text: 'Starting remote control listener', wait: 40 },
  { text: 'RCON running on 0.0.0.0:25575', wait: 60 },
  { text: 'Running delayed init tasks', wait: 240 },
  { text: 'Done (6.412s)! For help, type "help"', wait: 0 },
]

const lines = ref<Line[]>([])
const state = ref<'stopped' | 'starting' | 'running'>('stopped')
const uptime = ref(0)
const typed = ref('')
const done = ref(false)
let timers: number[] = []
let tick: number | undefined
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const stamp = () => new Date().toTimeString().slice(0, 8)
const later = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }
const push = (text: string, kind: Line['kind'] = 'info') => { lines.value.push({ t: stamp(), text, kind }) }

function finish() {
  state.value = 'running'
  uptime.value = 0
  tick = window.setInterval(() => { uptime.value++ }, 1000)
}

function play() {
  stop()
  lines.value = []
  typed.value = ''
  done.value = false
  state.value = 'starting'
  if (reduced()) {
    for (const s of SCRIPT) push(s.progress ? 'Preparing spawn area: 100%' : s.text)
    finish()
    typed.value = 'list'
    push('There are 0 of a max of 20 players online', 'info')
    done.value = true
    return
  }
  let at = 300
  for (const s of SCRIPT) {
    if (s.progress) {
      later(() => push('Preparing spawn area: 0%'), at)
      for (const [i, p] of [23, 51, 78, 100].entries()) {
        later(() => { lines.value[lines.value.length - 1].text = `Preparing spawn area: ${p}%` }, at + 140 * (i + 1))
      }
      at += 140 * 5 + s.wait
      continue
    }
    later(() => push(s.text), at)
    at += s.wait
  }
  later(finish, at + 40)
  // Then someone asks the server a question, the way you would from the panel.
  const cmd = 'list'
  at += 1400
  for (let i = 1; i <= cmd.length; i++) later(() => { typed.value = cmd.slice(0, i) }, at + i * 110)
  at += cmd.length * 110 + 500
  later(() => { push('There are 0 of a max of 20 players online'); typed.value = ''; done.value = true }, at)
}

function stop() {
  for (const t of timers) clearTimeout(t)
  timers = []
  if (tick) clearInterval(tick)
  tick = undefined
}

onMounted(() => { later(play, 500) })
onBeforeUnmount(stop)

const up = () => {
  const s = uptime.value
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`
}
</script>

<template>
  <div class="boot" :data-state="state">
    <div class="head">
      <span class="lamp" aria-hidden="true"></span>
      <span class="name">survival</span>
      <span class="status">
        <template v-if="state === 'stopped'">Stopped</template>
        <template v-else-if="state === 'starting'">Starting…</template>
        <template v-else>Running · up {{ up() }}</template>
      </span>
      <span class="vitals"><b>:25565</b><i>·</i><b>4G</b><i>·</i><b>paper 26.2</b></span>
    </div>
    <div class="log" aria-live="polite">
      <div v-for="(l, i) in lines" :key="i" class="ln">
        <span class="t">[{{ l.t }} INFO]:</span> <span class="x">{{ l.text }}</span>
      </div>
      <div class="ln cur" v-if="state === 'starting'"><span class="caret"></span></div>
    </div>
    <div class="prompt">
      <span class="chev">&gt;</span>
      <span class="in">{{ typed }}<span class="caret" v-if="state === 'running' && !done"></span><span class="ph" v-if="state === 'running' && done && !typed">Send a server command — try list</span></span>
      <button class="replay" type="button" @click="play" :hidden="!done">Replay</button>
    </div>
  </div>
</template>

<style scoped>
/* A fixed height, so the page does not grow line by line as the boot runs: the log keeps its
   newest lines at the bottom and lets the oldest fall off the top, the way a console does. */
.boot { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; height: 520px; border: 1px solid var(--edge); border-radius: var(--r); background: var(--surface); box-shadow: var(--lift), 0 30px 80px rgba(0, 0, 0, .55); overflow: hidden; font-family: var(--mono); }
.head { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-bottom: 1px solid var(--line); background: var(--raised); font-size: 13px; }
.lamp { width: 10px; height: 10px; border-radius: 50%; background: var(--idle, #4b5266); transition: background .4s, box-shadow .4s; }
[data-state="starting"] .lamp { background: var(--warn); box-shadow: 0 0 10px var(--warn); animation: pulse 1s ease-in-out infinite; }
[data-state="running"] .lamp { background: var(--live); box-shadow: 0 0 12px var(--live); }
@keyframes pulse { 50% { opacity: .45; } }
.name { font: 600 15px var(--ui); color: var(--ink); }
.status { color: var(--ink-2); font-family: var(--ui); font-variant-numeric: tabular-nums; }
[data-state="running"] .status { color: var(--live); }
.vitals { margin-left: auto; color: var(--ink-3); font-size: 12px; display: none; }
.vitals b { font-weight: 500; color: var(--ink-2); }
.vitals i { margin: 0 6px; font-style: normal; }
@media (min-width: 560px) { .vitals { display: inline; } }
.log { padding: 12px 14px; overflow: hidden; font-size: 12.5px; line-height: 1.55; color: var(--ink); display: flex; flex-direction: column; justify-content: flex-end; min-height: 0;
  -webkit-mask-image: linear-gradient(transparent, #000 28px); mask-image: linear-gradient(transparent, #000 28px); }
.ln { white-space: pre-wrap; word-break: break-word; animation: rise .18s ease-out; }
.t { color: var(--ink-3); }
@keyframes rise { from { opacity: 0; transform: translateY(3px); } }
.caret { display: inline-block; width: 7px; height: 13px; vertical-align: -2px; background: var(--ink-2); animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.prompt { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-top: 1px solid var(--line); background: var(--recess); font-size: 13px; }
.chev { color: var(--lapis); }
.in { flex: 1; color: var(--ink); min-height: 1.2em; }
.ph { color: var(--ink-3); font-family: var(--ui); }
.replay { all: unset; cursor: pointer; font: 500 12px var(--ui); color: var(--ink-3); padding: 4px 8px; border-radius: 4px; }
.replay:hover { color: var(--ink); background: var(--raised); }
.replay:focus-visible { outline: 2px solid var(--lapis); }
@media (max-width: 900px) { .boot { height: 400px; } }
@media (prefers-reduced-motion: reduce) { .ln, .lamp, .caret { animation: none; } }
</style>
