<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
import Eyebrow from './Eyebrow.vue'
import { data as proof } from '../proof.data'

// The one footer: where to go next, who made it, and the disclaimer Mojang asks for.
const columns = [
  { title: 'Product', links: [['What it does', '/product'], ['Download', '/download'], ['Changelog', '/changelog'], ['Roadmap', '/roadmap']] },
  { title: 'Learn', links: [['Getting started', '/guide/getting-started'], ['The panel', '/guide/panel'], ['Security', '/guide/security'], ['Compare', '/guide/compare'], ['All docs', '/guide/']] },
  { title: 'Project', links: [['GitHub', 'https://github.com/joogiebear/spawnloft'], ['Discussions', 'https://github.com/joogiebear/spawnloft/discussions'], ['Issues', 'https://github.com/joogiebear/spawnloft/issues'], ['Blog', '/blog/'], ['RSS', '/blog/feed.xml'], ['Sponsor', 'https://github.com/sponsors/joogiebear']] },
]
const released = proof.latestDate ? new Date(proof.latestDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''
</script>

<template>
  <footer class="site-footer">
    <div class="inner">
      <div class="cols">
        <div class="about">
          <a class="brand" href="/" aria-label="SpawnLoft home"><BrandIcon name="mark" :size="24" /><span>spawnloft</span></a>
          <p>Minecraft servers on your own PC, without the terminal. Free and open source.</p>
          <a class="version" href="/changelog">{{ proof.latest }}<template v-if="released"> · {{ released }}</template></a>
        </div>
        <nav v-for="column in columns" :key="column.title" :aria-label="column.title">
          <Eyebrow as="h2">{{ column.title }}</Eyebrow>
          <a v-for="[text, href] in column.links" :key="href" :href="href">{{ text }}</a>
        </nav>
      </div>
      <div class="bottom">
        <span>MIT licensed. Built by <a href="https://github.com/joogiebear">joogiebear</a> and <a href="https://github.com/joogiebear/spawnloft/graphs/contributors">contributors</a>.</span>
        <span>Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer { border-top: 1px solid var(--line); background: var(--bg); color: var(--fg-2); font: 400 var(--t-small)/1.6 var(--text); -webkit-font-smoothing: antialiased; }
.inner { max-width: calc(var(--max-wide) + var(--gutter) + var(--gutter-r)); margin-inline: auto; padding: var(--s8) var(--gutter-r) var(--s6) var(--gutter); }
.cols { display: grid; grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr)); gap: var(--s6) var(--s5); }
.about { display: grid; gap: var(--s3); align-content: start; max-width: 30em; }
.about p { margin: 0; }
.brand { display: inline-flex; align-items: center; gap: var(--s2); color: var(--fg); text-decoration: none; font: 600 var(--t-h4)/1 var(--display); letter-spacing: -.03em; justify-self: start; }
.brand svg { color: var(--accent); }
.version { justify-self: start; font-family: var(--mono); font-size: var(--t-caption); color: var(--fg-2); text-decoration: none; }
.version:hover { color: var(--fg); }
nav { display: grid; gap: var(--s2); align-content: start; }
nav .eyebrow { margin-bottom: var(--s2); }
nav a { color: var(--fg-2); text-decoration: none; transition: color var(--d1) var(--ease); width: fit-content; }
nav a:hover { color: var(--fg); }
.bottom { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--s2) var(--s5); margin-top: var(--s8); padding-top: var(--s5); border-top: 1px solid var(--line); font-size: var(--t-caption); color: var(--fg-3); }
.bottom a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 900px) { .cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } .about { grid-column: 1 / -1; } }
@media (max-width: 520px) { .cols { grid-template-columns: repeat(2, minmax(0, 1fr)); } .bottom { flex-direction: column; margin-top: var(--s6); } }
</style>
