<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
import ArrowLink from '../components/ArrowLink.vue'
import Button from '../components/Button.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Figure from '../components/Figure.vue'
import SectionHead from '../components/SectionHead.vue'
import { computed, ref } from 'vue'
import { docGroups } from '../../docs-nav'

// The front of the docs: three ways in for the three reasons people arrive, then the library.
const quick = [
  ['I am just getting started', '/guide/getting-started'],
  ['I want to do more with it', '/guide/panel'],
  ['Something needs a fix', '/guide/troubleshooting'],
]
const query = ref('')
// A plain filter over the same list the sidebar uses: title and description, every word must match.
const groups = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return docGroups
  return docGroups
    .map(group => ({ ...group, items: group.items.filter(item => words.every(word => `${item.text} ${item.desc}`.toLowerCase().includes(word))) }))
    .filter(group => group.items.length)
})
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
        <label class="filter"><span class="sr-only">Filter the guides</span><input v-model="query" type="search" placeholder="Filter the guides, for example backups or plugins" autocomplete="off" /></label>
        <div class="columns">
          <div v-for="group in groups" :key="group.label" class="column">
            <Eyebrow>{{ group.label }}</Eyebrow>
            <h3 class="h3">{{ group.title }}</h3>
            <a v-for="item in group.items" :key="item.link" :href="item.link" class="entry">
              <span class="entry-words"><b>{{ item.text }}</b><span class="small">{{ item.desc }}</span></span>
              <BrandIcon name="arrow" :size="16" />
            </a>
          </div>
        </div>
        <p v-if="!groups.length" class="body empty" role="status">Nothing matches that. Try one word, or <a href="/guide/faq">read the questions page</a>.</p>
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
        <Figure src="/img/tabs/console" :widths="[800, 1280, 2558]" sizes="(min-width: 1400px) 900px, (min-width: 900px) 66vw, 100vw" alt="The SpawnLoft console, showing server controls and live logs." :width="2558" :height="1392" label="Console" v-reveal />
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
.filter { display: block; margin-top: var(--s6); }
.filter input { width: 100%; max-width: 32rem; min-height: 44px; padding: 0 var(--s4); border: 1px solid var(--line-strong); border-radius: var(--r0); background: var(--bg-1); color: var(--fg); font: 400 var(--t-body)/1 var(--text); }
.filter input:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.empty { margin-top: var(--s6); }
.columns { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s7) var(--s6); margin-top: var(--s6); }
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
@media (max-width: 1000px) { .columns { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 980px) { .intro { grid-template-columns: minmax(0, 1fr); gap: var(--s7); } .two { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
@media (max-width: 640px) { .columns { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
</style>
