<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { marked, Renderer } from 'marked'
import ArrowLink from '../components/ArrowLink.vue'
import Button from '../components/Button.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Pill from '../components/Pill.vue'
import Prose from '../components/Prose.vue'
import SectionHead from '../components/SectionHead.vue'
import { RELEASES_URL, REPO } from '../release'

// Every release, in the words it shipped with, read from GitHub in the browser. The latest
// stable leads. Betas are published far more often and would otherwise be the whole page, so
// they stay out of the archive until asked for, except the one a link points at.
type Release = {
  tag_name: string; name: string; body: string; html_url: string; published_at: string; prerelease: boolean; draft?: boolean
  assets: { name: string; browser_download_url: string; size: number }[]
}
const PAGE = 8
const releases = ref<Release[]>([])
const state = ref<'loading' | 'ok' | 'failed'>('loading')
const showPre = ref(false)
const visibleCount = ref(PAGE)
const featured = computed(() => releases.value.find(release => !release.prerelease) ?? releases.value[0])
const others = computed(() => releases.value.filter(release => release !== featured.value))
const preCount = computed(() => others.value.filter(release => release.prerelease).length)
const listed = computed(() => showPre.value ? others.value : others.value.filter(release => !release.prerelease))
const archive = computed(() => listed.value.slice(0, visibleCount.value))
const remaining = computed(() => Math.max(0, listed.value.length - visibleCount.value))
let request: AbortController | undefined

const title = (release: Release) => {
  const match = /^\s*v?[\d.]+(?:-[\w.]+)?\s*[—–-]\s*(.+)$/.exec(release.name || '')
  return match ? match[1] : release.name || release.tag_name
}
const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const escape = (text: string) => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!))
const safeUrl = (href: string) => {
  try {
    const url = new URL(href, `https://github.com/${REPO}/`)
    return ['https:', 'http:'].includes(url.protocol) ? escape(url.href) : ''
  } catch { return '' }
}
// Release Markdown is external content. Keep its formatting without executing embedded HTML.
const renderer = new Renderer()
renderer.html = ({ text }) => escape(text.replace(/<!--[\s\S]*?-->/g, ''))
renderer.link = function ({ href, tokens }) {
  const label = this.parser.parseInline(tokens)
  const url = safeUrl(href)
  return url ? `<a href="${url}">${label}</a>` : label
}
renderer.image = ({ href, text }) => {
  const url = safeUrl(href)
  return url ? `<img src="${url}" alt="${escape(text)}" loading="lazy" decoding="async">` : escape(text)
}
function html(release: Release) {
  const lines = (release.body || '').replace(/\r\n/g, '\n').split('\n')
  if (lines[0]?.replace(/^#+\s*/, '').trim() === title(release).trim()) lines.shift()
  return marked.parse(lines.join('\n').trim(), { async: false, renderer }) as string
}

async function load() {
  request?.abort()
  const controller = new AbortController()
  request = controller
  state.value = 'loading'
  const timeout = window.setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers: { accept: 'application/vnd.github+json' }, signal: controller.signal })
    if (!response.ok) throw new Error('Release feed unavailable')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Invalid release feed')
    releases.value = (data as Release[]).filter(release => !release.draft && release.tag_name && release.published_at)
      .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
    state.value = 'ok'
    await openLinked()
  } catch {
    if (request === controller) state.value = 'failed'
  } finally { window.clearTimeout(timeout) }
}
// A link to one release (#v1.5.0) opens it, even when it is a beta behind the toggle.
async function openLinked() {
  let hash = window.location.hash.slice(1)
  try { hash = decodeURIComponent(hash) } catch { /* a malformed fragment is ignored */ }
  if (!hash) return
  const target = others.value.find(release => release.tag_name === hash)
  if (!target && hash !== featured.value?.tag_name) return
  if (target?.prerelease) showPre.value = true
  await nextTick()
  const index = listed.value.indexOf(target as Release)
  if (index >= 0) visibleCount.value = Math.max(visibleCount.value, index + 1)
  await nextTick()
  const element = document.getElementById(hash)
  if (element instanceof HTMLDetailsElement) element.open = true
  element?.scrollIntoView({ block: 'start' })
}
async function showMore() {
  const firstNew = listed.value[visibleCount.value]?.tag_name
  visibleCount.value += PAGE
  await nextTick()
  if (firstNew) document.getElementById(firstNew)?.querySelector('summary')?.focus({ preventScroll: true })
}
onMounted(load)
onBeforeUnmount(() => request?.abort())
</script>

<template>
  <main class="changelog-page">
    <section class="section top">
      <div class="wrap">
        <SectionHead level="h1" eyebrow="Changelog" title="Every release, in the words it shipped with." lede="New tools, fixes and the details that make a server feel like home, read straight from the GitHub releases. Stable releases first; the betas between them are a toggle away.">
          <template #aside><ArrowLink :href="RELEASES_URL" external>Follow on GitHub</ArrowLink></template>
        </SectionHead>
      </div>
    </section>

    <section v-if="state !== 'ok' || !featured" class="section-tight">
      <div class="wrap status" aria-live="polite" :aria-busy="state === 'loading'">
        <template v-if="state === 'loading'">
          <Eyebrow>Connecting to GitHub</Eyebrow>
          <h2 class="h3">Getting the latest.</h2>
          <p class="body">Fetching the published release notes.</p>
        </template>
        <template v-else-if="state === 'failed'">
          <Eyebrow>The feed is unavailable</Eyebrow>
          <h2 class="h3">The releases could not be loaded.</h2>
          <p class="body">GitHub did not answer, or answered too slowly. Try again, or read them at the source.</p>
          <div class="actions"><Button variant="secondary" @click="load">Try again</Button><ArrowLink :href="RELEASES_URL" external>Open GitHub releases</ArrowLink></div>
        </template>
        <template v-else>
          <Eyebrow>Nothing published yet</Eyebrow>
          <h2 class="h3">No releases were returned.</h2>
          <div class="actions"><ArrowLink :href="RELEASES_URL" external>View the release page</ArrowLink></div>
        </template>
      </div>
    </section>

    <template v-else>
      <section class="section paper">
        <article :id="featured.tag_name" class="wrap featured">
          <aside class="index">
            <Eyebrow>{{ featured.prerelease ? 'Latest published' : 'Latest stable' }}</Eyebrow>
            <a class="version h2" :href="'#' + featured.tag_name">{{ featured.tag_name }}</a>
            <time class="small" :datetime="featured.published_at">{{ when(featured.published_at) }}</time>
            <Pill :tone="featured.prerelease ? 'warn' : 'ok'">{{ featured.prerelease ? 'Pre-release' : 'Stable release' }}</Pill>
          </aside>
          <div class="story">
            <h2 class="h2">{{ title(featured) }}</h2>
            <Prose v-if="featured.body?.trim()" class="notes"><div v-html="html(featured)"></div></Prose>
            <p v-else class="body">No release notes were included with this version.</p>
            <div class="actions">
              <Button v-if="!featured.prerelease" href="/download">Download SpawnLoft</Button>
              <ArrowLink :href="featured.html_url" external>Read on GitHub</ArrowLink>
            </div>
            <p v-if="featured.prerelease" class="small">This is a pre-release. Stable installations are not offered pre-release updates.</p>
          </div>
        </article>
      </section>

      <section class="section" id="archive">
        <div class="wrap">
          <SectionHead eyebrow="Previously shipped" title="The work along the way.">
            <template #aside>
              <label v-if="preCount" class="toggle"><input v-model="showPre" type="checkbox" @change="visibleCount = PAGE" /><span>Show pre-releases</span><span class="small mono">{{ preCount }}</span></label>
            </template>
          </SectionHead>
          <p v-if="!archive.length" class="body empty">{{ showPre ? 'This is the first release in the feed.' : 'No earlier stable release is in the feed. Turn on pre-releases to see the betas.' }}</p>
          <div v-else class="releases">
            <details v-for="release in archive" :id="release.tag_name" :key="release.tag_name" class="rel">
              <summary>
                <span class="rel-when"><span class="tag mono">{{ release.tag_name }}</span><time class="small" :datetime="release.published_at">{{ when(release.published_at) }}</time></span>
                <span class="rel-title"><span class="h4">{{ title(release) }}</span><Pill v-if="release.prerelease" tone="warn">Pre-release</Pill></span>
                <i aria-hidden="true"></i>
              </summary>
              <div class="rel-body">
                <Prose v-if="release.body?.trim()" class="notes"><div v-html="html(release)"></div></Prose>
                <p v-else class="body">No release notes were included with this version.</p>
                <div class="actions"><ArrowLink :href="release.html_url" external>Release on GitHub</ArrowLink><a class="small permalink" :href="'#' + release.tag_name">Permalink</a></div>
              </div>
            </details>
          </div>
          <div class="more">
            <Button v-if="remaining" variant="secondary" @click="showMore">Show {{ Math.min(remaining, PAGE) }} more</Button>
            <ArrowLink :href="RELEASES_URL" external>Full archive on GitHub</ArrowLink>
          </div>
        </div>
      </section>
    </template>

    <section class="section hairline">
      <div class="wrap">
        <SectionHead eyebrow="Always moving" title="See where it is headed." :rule="false">
          <template #aside><ArrowLink href="/roadmap">The roadmap</ArrowLink></template>
        </SectionHead>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); padding-bottom: var(--s7); }
.status { display: grid; gap: var(--s3); min-height: 240px; align-content: start; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s3) var(--s6); margin-top: var(--s3); }
.featured { display: grid; grid-template-columns: 240px minmax(0, 1fr); gap: var(--s8); align-items: start; scroll-margin-top: calc(var(--header-h) + var(--s5)); }
.index { display: grid; gap: var(--s3); justify-items: start; position: sticky; top: calc(var(--header-h) + var(--s6)); }
.version { color: var(--fg); }
.version:hover { text-decoration: underline; text-underline-offset: 6px; }
.story { display: grid; gap: var(--s5); min-width: 0; }
.story .actions { margin-top: 0; }
.notes { max-width: 44em; overflow-wrap: anywhere; }
.toggle { display: inline-flex; align-items: center; gap: var(--s2); font: 500 var(--t-ui)/1.3 var(--text); color: var(--fg-2); cursor: pointer; }
.toggle input { width: 18px; height: 18px; margin: 0 var(--s1) 0 0; accent-color: var(--accent); cursor: pointer; }
.toggle:hover { color: var(--fg); }
.empty { margin-top: var(--s6); }
.releases { margin-top: var(--s4); }
.rel { border-bottom: 1px solid var(--line); scroll-margin-top: calc(var(--header-h) + var(--s5)); }
.rel summary { list-style: none; display: grid; grid-template-columns: 200px minmax(0, 1fr) 14px; gap: var(--s6); align-items: center; padding: var(--s5) 0; cursor: pointer; }
.rel summary::-webkit-details-marker { display: none; }
.rel-when { display: grid; gap: var(--s1); }
.tag { font-size: var(--t-small); color: var(--accent-text); }
.rel-title { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s2) var(--s3); min-width: 0; }
.rel-title .h4 { overflow-wrap: anywhere; }
.rel summary:hover .h4 { color: var(--accent-text); }
.rel summary i { position: relative; width: 14px; height: 14px; transition: transform var(--d2) var(--ease); }
.rel summary i::before, .rel summary i::after { content: ""; position: absolute; inset: 50% auto auto 0; width: 14px; height: 2px; margin-top: -1px; background: var(--accent-text); }
.rel summary i::after { transform: rotate(90deg); }
.rel[open] summary i { transform: rotate(45deg); }
.rel-body { display: grid; gap: var(--s5); padding: 0 0 var(--s6) calc(200px + var(--s6)); }
.rel-body .actions { margin-top: 0; }
.permalink { color: var(--fg-3); text-decoration: underline; text-underline-offset: 3px; }
.more { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--s4); padding-top: var(--s6); }
@media (max-width: 900px) {
  .featured { grid-template-columns: minmax(0, 1fr); gap: var(--s6); }
  .index { position: static; grid-template-columns: auto auto; align-items: center; }
  .index .eyebrow { grid-column: 1 / -1; }
  .rel summary { grid-template-columns: minmax(0, 1fr) 14px; gap: var(--s3) var(--s4); }
  .rel-when { grid-column: 1; display: flex; gap: var(--s3); align-items: baseline; }
  .rel-title { grid-column: 1; }
  .rel summary i { grid-column: 2; grid-row: 1 / span 2; }
  .rel-body { padding-left: 0; }
}
</style>
