<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
import ArrowLink from '../components/ArrowLink.vue'
import Button from '../components/Button.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Figure from '../components/Figure.vue'
import SectionHead from '../components/SectionHead.vue'

// The front of the docs: three ways in for the three reasons people arrive, then the library.
const quick = [
  ['I am just getting started', '/guide/getting-started'],
  ['I want to do more with it', '/guide/panel'],
  ['Something needs a fix', '/guide/troubleshooting'],
]
const library = [
  { label: 'Start here', title: 'Get up and running.', links: [
    ['Getting started', 'Install the app, check Java, and start a server.', '/guide/getting-started'],
    ['The desktop app', 'Updates, data folders, and life outside the window.', '/guide/desktop'],
    ['Downloads and platforms', 'Windows, Mac and Linux installers, and what each supports.', '/guide/beta'],
    ['Server software', 'Understand the loaders and choose your setup.', '/reference/servers'],
  ] },
  { label: 'Start something', title: 'Do more with it.', links: [
    ['Host for friends', 'From the first start to a server that looks after itself.', '/guide/host-for-friends'],
    ['Paper, Fabric or NeoForge', 'Pick the software by what you want to do.', '/guide/choose-software'],
    ['Try things safely', 'Test a plugin or an update on a copy first.', '/guide/try-it-safely'],
    ['Run a modpack', 'A whole modded server from one Modrinth pack.', '/guide/modpack-server'],
    ['The game launcher', 'Play on your own server from a window, in the 1.6 betas.', '/guide/launcher'],
  ] },
  { label: 'Make it yours', title: 'Find your way around.', links: [
    ['The panel', 'Your console, plugins, worlds and backups.', '/guide/panel'],
    ['Plugins and mods', 'Install, update and manage what your server loads.', '/guide/plugins'],
    ['Backups', 'Snapshots, schedules, verification and restore.', '/guide/backups'],
    ['Databases', 'Managed setup, connection details, and manual plugin configs.', '/guide/databases'],
    ['How it works', 'The engine underneath the control room.', '/guide/how-it-works'],
    ['Command reference', 'Commands, structured JSON, and performance exports.', '/reference/commands'],
  ] },
  { label: 'Get a hand', title: 'Keep things running.', links: [
    ['Troubleshooting', 'Recognise the error. Find the next step.', '/guide/troubleshooting'],
    ['Sharing your server', 'How friends join, and what to switch on first.', '/guide/sharing'],
    ['Security', 'What stays local, and why.', '/guide/security'],
    ['Questions', 'Straight answers to the things people ask.', '/guide/faq'],
    ['Compare', 'SpawnLoft next to Aternos, Pterodactyl and Crafty.', '/guide/compare'],
    ['AI assistants', 'Let an AI app you choose check on and run your servers.', '/guide/ai-assistants'],
  ] },
]
</script>

<template>
  <main class="docs-index">
    <section class="section top">
      <div class="wrap intro">
        <div class="words">
          <Eyebrow accent>Docs</Eyebrow>
          <h1 class="h1">The field guide.</h1>
          <p class="lede">From your first server to your next big idea: the steps, the tools and the answers, written for the person at the keyboard.</p>
          <div><Button href="/guide/getting-started" size="lg">Start your first server<template #trailing><BrandIcon name="arrow" :size="16" /></template></Button></div>
        </div>
        <nav class="quick" aria-label="Quick answers">
          <Eyebrow>What brings you here?</Eyebrow>
          <a v-for="[text, href] in quick" :key="href" :href="href"><span>{{ text }}</span><BrandIcon name="arrow" :size="16" /></a>
        </nav>
      </div>
    </section>

    <section class="section paper" id="library">
      <div class="wrap">
        <SectionHead eyebrow="The library" title="A good place to find your feet.">
          <template #aside><p class="small">Guides and reference</p></template>
        </SectionHead>
        <div class="columns">
          <div v-for="column in library" :key="column.label" class="column">
            <Eyebrow>{{ column.label }}</Eyebrow>
            <h3 class="h3">{{ column.title }}</h3>
            <a v-for="[title, text, href] in column.links" :key="href" :href="href" class="entry">
              <span class="entry-words"><b>{{ title }}</b><span class="small">{{ text }}</span></span>
              <BrandIcon name="arrow" :size="16" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="panel">
      <div class="wrap-wide two">
        <div class="words" v-reveal>
          <Eyebrow>Know your control room</Eyebrow>
          <h2 class="h2">Everything has its place.</h2>
          <p class="body">Follow the console. Add a plugin. Take a backup. Get familiar with the panel you will use every day.</p>
          <ArrowLink href="/guide/panel">Take a look around</ArrowLink>
        </div>
        <Figure src="/img/tabs/console" :widths="[800, 1280, 2558]" sizes="(min-width: 1400px) 900px, (min-width: 900px) 66vw, 100vw" alt="The SpawnLoft console, showing server controls and live logs." :width="2558" :height="1392" label="Console" caption="Captured from the app, not a mockup" detail="2558 × 1392" v-reveal />
      </div>
    </section>

    <section class="section hairline">
      <div class="wrap">
        <SectionHead eyebrow="Built in the open" title="See what is new, follow what is next, or help shape the app." :rule="false">
          <template #aside>
            <div class="links"><ArrowLink href="/changelog">Release notes</ArrowLink><ArrowLink href="/roadmap">The roadmap</ArrowLink><ArrowLink href="https://github.com/joogiebear/spawnloft/discussions" external>Join the conversation</ArrowLink></div>
          </template>
        </SectionHead>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); }
.intro { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: var(--s9); align-items: start; }
.words { display: grid; gap: var(--s5); align-content: start; }
.quick { display: grid; align-content: start; padding-top: var(--s2); }
.quick .eyebrow { margin-bottom: var(--s3); }
.quick a { display: flex; justify-content: space-between; align-items: center; gap: var(--s4); padding: var(--s4) 0; border-top: 1px solid var(--line); font: 500 var(--t-body)/1.3 var(--display); letter-spacing: -.01em; }
.quick a:last-child { border-bottom: 1px solid var(--line); }
.quick a svg { color: var(--accent-text); transition: transform var(--d1) var(--ease); }
.quick a:hover svg { transform: translateX(3px); }
.columns { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s7) var(--s6); margin-top: var(--s7); }
.column { display: grid; align-content: start; }
.column .h3 { margin: var(--s2) 0 var(--s4); }
.entry { display: flex; align-items: center; gap: var(--s3); padding: var(--s4) 0; border-top: 1px solid var(--line); }
.entry:last-child { border-bottom: 1px solid var(--line); }
.entry-words { flex: 1; display: grid; gap: var(--s1); min-width: 0; }
.entry b { font: 600 var(--t-ui)/1.3 var(--text); }
.entry svg { color: var(--accent-text); flex: none; transition: transform var(--d1) var(--ease); }
.entry:hover b { text-decoration: underline; text-underline-offset: 4px; }
.entry:hover svg { transform: translateX(3px); }
.two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 2fr); gap: var(--s8); align-items: center; }
.two .words { gap: var(--s4); }
.links { display: flex; flex-wrap: wrap; gap: var(--s3) var(--s6); }
@media (max-width: 1100px) { .columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 980px) { .intro { grid-template-columns: minmax(0, 1fr); gap: var(--s7); } .two { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
@media (max-width: 640px) { .columns { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
</style>
