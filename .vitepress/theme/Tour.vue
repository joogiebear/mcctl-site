<script setup lang="ts">
// The panel, one tab at a time. Real captures of the app, not mockups, so what the page promises
// is what installs.
import { ref } from 'vue'

const tabs = [
  { id: 'console', name: 'Console', title: 'A console you can read', text: 'Search, filter to warnings or errors, pause, wrap, line numbers. Stack traces stay with the error that caused them. Send commands and get the reply back.' },
  { id: 'plugins', name: 'Plugins', title: 'Modrinth and Hangar, searched together', text: 'Every result names its source and is checked against the server\'s version. Updates are checked by hash and applied with a snapshot taken first. Plugins you dropped in by hand are left alone.' },
  { id: 'worlds', name: 'Worlds', title: 'Import a map, switch worlds, export one', text: 'Every world the server holds, with the active one named. A downloaded map drops in from a zip or folder, found wherever it is nested, never overwriting.' },
  { id: 'backups', name: 'Backups', title: 'Snapshots that verify', text: 'Take one now at a chosen scope, or leave it to a nightly schedule with a retention limit. Safe while running: the world is flushed first. Every snapshot can be read back end to end.' },
  { id: 'players', name: 'Players', title: 'Everyone the server knows about', text: 'Gathered from operators, bans, the whitelist, the name cache and the world folder, since none of those is complete on its own. Op, ban or wipe a player from here.' },
  { id: 'performance', name: 'Performance', title: 'Processor and memory, sampled every ten seconds', text: 'The last minute to the last four hours. Both scales follow the data, because a fixed 0 to 100% axis draws every ordinary server as a flat line on the floor.' },
  { id: 'scheduler', name: 'Scheduler', title: 'Backups, restarts and commands on a clock', text: 'Run by Windows Task Scheduler, so they happen whether or not the window is open. A restart can warn the players first, at the full figure, one minute, and ten seconds.' },
  { id: 'settings', name: 'Settings', title: 'The part of server.properties people actually change', text: 'Who can join, MOTD, difficulty, game mode, PvP, whitelist, view distance. Changing who can join on a world with players warns first, and says how many are affected.' },
]
// By id, not identity: ref() wraps the object in a proxy, and `t === active` would never match.
const active = ref(tabs[0].id)
const current = () => tabs.find((t) => t.id === active.value)!
</script>

<template>
  <div class="tour">
    <div class="tabs" role="tablist">
      <button v-for="t in tabs" :key="t.id" role="tab" :aria-selected="t.id === active" @click="active = t.id">{{ t.name }}</button>
    </div>
    <div class="stage">
      <div class="shot">
        <img v-for="t in tabs" :key="t.id" v-show="t.id === active" :src="`/img/tabs/${t.id}.png`" :alt="`The ${t.name} tab of the mcctl panel`" width="2558" height="1392" loading="lazy" decoding="async">
      </div>
      <div class="cap">
        <h3>{{ current().title }}</h3>
        <p>{{ current().text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tour { display: grid; gap: 16px; }
.tabs { display: flex; flex-wrap: wrap; gap: 4px; border-bottom: 1px solid var(--line); }
.tabs button { background: transparent; border: 0; border-bottom: 2px solid transparent; margin-bottom: -1px; padding: 10px 12px; color: var(--ink-2); font: 500 14px var(--ui); cursor: pointer; }
.tabs button:hover { color: var(--ink); }
.tabs button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--lapis); font-weight: 600; }
.stage { display: grid; gap: 18px; }
.shot { border: 1px solid var(--edge); border-radius: var(--r); overflow: hidden; background: var(--surface); box-shadow: var(--lift), 0 30px 80px rgba(0, 0, 0, .55); aspect-ratio: 2558 / 1392; }
.shot img { display: block; width: 100%; height: auto; }
.cap { display: grid; gap: 4px; max-width: 720px; }
.cap h3 { margin: 0; font-size: 17px; font-weight: 600; }
.cap p { margin: 0; color: var(--ink-2); font-size: 15px; }
</style>
