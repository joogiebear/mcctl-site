<script setup lang="ts">
import { ref } from 'vue'
import ArrowLink from '../components/ArrowLink.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Figure from '../components/Figure.vue'
import SectionHead from '../components/SectionHead.vue'

// Four captures of the real panel, given the wide column a magazine gives a photograph.
// Tabs follow the WAI-ARIA pattern: arrow keys move, the panel changes, nothing scrolls.
const tabs = [
  { id: 'console', title: 'Console', h: 'Less terminal. More control.', p: 'Follow what the server is saying, find the errors that matter, and send commands without losing the conversation.', points: ['Live console with level filters', 'Search and jump to newest', 'Share a log, with your account name removed'] },
  { id: 'plugins', title: 'Plugins', h: 'Modrinth and Hangar, one search field.', p: 'Only what your software can load, update checks across everything installed, and a snapshot before each update.', points: ['Compatibility filtered by loader and version', 'One-click updates with a way back', 'Enable and disable in place'] },
  { id: 'backups', title: 'Backups', h: 'Go a little wild. Keep a way back.', p: 'Snapshot worlds, plugins and config. Schedule them, verify they can be read back, and restore to a point you choose.', points: ['Scheduled and verified', 'Restore a world, the plugins or one file', 'Mirror every snapshot to a second place'] },
  { id: 'performance', title: 'Performance', h: 'See the signal. Skip the guesswork.', p: 'CPU, memory and TPS over time. When a server crashes, the common causes are recognised and a fix is suggested where it happened.', points: ['History, not a snapshot', 'Crash diagnosis in plain language', 'Optional automatic restart'] },
]
const current = ref(0)
const buttons = ref<HTMLButtonElement[]>([])
function select(index: number, focus = false) {
  current.value = (index + tabs.length) % tabs.length
  if (focus) buttons.value[current.value]?.focus()
}
function onKey(event: KeyboardEvent) {
  const target: Record<string, number> = { ArrowRight: current.value + 1, ArrowLeft: current.value - 1, Home: 0, End: tabs.length - 1 }
  if (!(event.key in target)) return
  event.preventDefault()
  select(target[event.key], true)
}
</script>

<template>
  <section class="section tour" id="tour">
    <div class="wrap-wide">
      <SectionHead eyebrow="The panel" title="Every server and its tools, in one window.">
        <template #aside><ArrowLink href="/product">Take the full tour</ArrowLink></template>
      </SectionHead>
      <div class="tabs" role="tablist" aria-label="Panel tour" @keydown="onKey">
        <button v-for="(tab, index) in tabs" :key="tab.id" :ref="(el) => { buttons[index] = el as HTMLButtonElement }" type="button" role="tab" :id="`tour-tab-${tab.id}`" :aria-selected="index === current" :aria-controls="`tour-panel-${tab.id}`" :tabindex="index === current ? 0 : -1" @click="select(index)">{{ tab.title }} <small>0{{ index + 1 }}</small></button>
      </div>
      <div v-for="(tab, index) in tabs" :key="tab.id" v-show="index === current" :id="`tour-panel-${tab.id}`" role="tabpanel" :aria-labelledby="`tour-tab-${tab.id}`" class="panel" tabindex="0">
        <Figure class="figure" :src="`/img/tabs/${tab.id}`" :widths="[800, 1280, 2558]" sizes="(min-width: 1400px) 1000px, (min-width: 900px) calc(100vw - 400px), 100vw" :alt="`The SpawnLoft ${tab.title.toLowerCase()} panel, captured from the running app.`" :width="2558" :height="1392" :label="tab.title" caption="Captured from the app, not a mockup" detail="2558 × 1392" :loading="index === 0 ? 'eager' : 'lazy'" />
        <div class="copy">
          <Eyebrow>0{{ index + 1 }} · {{ tab.title }}</Eyebrow>
          <h3 class="h3">{{ tab.h }}</h3>
          <p class="body">{{ tab.p }}</p>
          <ul><li v-for="point in tab.points" :key="point">{{ point }}</li></ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tour { padding-top: 0; }
.tabs { display: flex; gap: var(--s6); border-bottom: 1px solid var(--line); margin: var(--s6) 0; overflow-x: auto; scrollbar-width: none; }
.tabs button { display: inline-flex; gap: var(--s2); align-items: baseline; padding: var(--s3) 0 var(--s4); border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; background: none; font: 600 var(--t-body)/1 var(--display); color: var(--fg-3); white-space: nowrap; cursor: pointer; transition: color var(--d1) var(--ease), border-color var(--d1) var(--ease); }
.tabs button:hover { color: var(--fg-2); }
.tabs button[aria-selected="true"] { color: var(--fg); border-color: var(--accent); }
.tabs button small { font: 400 var(--t-caption)/1 var(--mono); }
.panel { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: var(--s7); align-items: start; animation: tour-in var(--d3) var(--ease); }
.panel:focus-visible { outline-offset: 8px; }
@keyframes tour-in { from { opacity: 0; transform: translateY(8px); } }
.copy { display: grid; gap: var(--s4); position: sticky; top: calc(var(--header-h) + var(--s6)); }
.copy ul { list-style: none; padding: 0; margin: var(--s2) 0 0; display: grid; gap: var(--s2); }
.copy li { display: flex; gap: var(--s3); align-items: baseline; color: var(--fg-2); font-size: var(--t-ui); }
.copy li::before { content: ""; width: 10px; height: 1px; background: var(--accent); flex: none; transform: translateY(-4px); }
@media (max-width: 900px) { .panel { grid-template-columns: minmax(0, 1fr); gap: var(--s5); } .copy { position: static; } .tabs { gap: var(--s5); } }
@media (max-width: 640px) { .tabs { flex-wrap: wrap; gap: var(--s2) var(--s5); overflow: visible; } }
@media (prefers-reduced-motion: reduce) { .panel { animation: none; } }
</style>
