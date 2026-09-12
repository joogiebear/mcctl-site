<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { marked, Renderer } from 'marked'
import BrandIcon from './BrandIcon.vue'

type Release = {
  tag_name: string; name: string; body: string; html_url: string; published_at: string; prerelease: boolean
  assets: { name: string; browser_download_url: string; size: number }[]
}
const releases = ref<Release[]>([])
const state = ref<'loading' | 'ok' | 'failed'>('loading')
const visibleCount = ref(6)
const featured = computed(() => releases.value[0])
const archive = computed(() => releases.value.slice(1, visibleCount.value + 1))
const remaining = computed(() => Math.max(0, releases.value.length - visibleCount.value - 1))
let request: AbortController | undefined
const title = (release: Release) => {
  const match = /^\s*v?[\d.]+(?:-[\w.]+)?\s*[—–-]\s*(.+)$/.exec(release.name || '')
  return match ? match[1] : release.name || release.tag_name
}
const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const escape = (text: string) => text.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!))
const safeUrl = (href: string) => {
  try {
    const url = new URL(href, 'https://github.com/joogiebear/spawnloft/')
    return ['https:', 'http:'].includes(url.protocol) ? escape(url.href) : ''
  } catch { return '' }
}
// Release Markdown is external content. Keep formatting without executing embedded HTML.
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
    const response = await fetch('https://api.github.com/repos/joogiebear/spawnloft/releases?per_page=100', {
      headers: { accept: 'application/vnd.github+json' }, signal: controller.signal,
    })
    if (!response.ok) throw new Error('Release feed unavailable')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Invalid release feed')
    releases.value = data.filter(release => !release.draft && release.tag_name && release.published_at)
      .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at))
    state.value = 'ok'
    let hash = window.location.hash.slice(1)
    try { hash = decodeURIComponent(hash) } catch { /* Ignore a malformed link fragment. */ }
    const linkedIndex = releases.value.findIndex(release => release.tag_name === hash)
    if (linkedIndex >= 0) {
      visibleCount.value = Math.max(visibleCount.value, linkedIndex)
      await nextTick()
      const element = document.getElementById(hash)
      if (element instanceof HTMLDetailsElement) element.open = true
      element?.scrollIntoView({ block: 'start' })
    }
  } catch {
    if (request === controller) state.value = 'failed'
  } finally { window.clearTimeout(timeout) }
}
async function showMore() {
  const firstNew = releases.value[visibleCount.value + 1]?.tag_name
  visibleCount.value += 6
  await nextTick()
  if (firstNew) document.getElementById(firstNew)?.querySelector('summary')?.focus({ preventScroll: true })
}
onMounted(load)
onBeforeUnmount(() => request?.abort())
</script>

<template>
  <main class="release-journal">
    <header class="journal-intro journal-wrap">
      <p class="journal-eyebrow"><BrandIcon name="spark" :size="15" /> THE RELEASE JOURNAL</p>
      <h1>Small changes.<br> <span>Better worlds.</span></h1>
      <div class="intro-bottom"><p>New tools, thoughtful fixes, and the details that make your server feel like home. Every release, in the words it shipped with.</p><a class="text-link" href="https://github.com/joogiebear/spawnloft/releases">Follow on GitHub <BrandIcon name="external" :size="17" /></a></div>
    </header>
    <section v-if="state !== 'ok' || !featured" class="journal-status journal-wrap" aria-live="polite" :aria-busy="state === 'loading'">
      <template v-if="state === 'loading'"><span class="status-rule"></span><p class="journal-eyebrow">CONNECTING TO GITHUB</p><h2>Getting the latest.</h2><p>Fetching the published release notes.</p></template>
      <template v-else-if="state === 'failed'"><p class="journal-eyebrow">THE FEED IS UNAVAILABLE</p><h2>A brief interruption.</h2><p>We couldn’t load the releases from GitHub. Try again, or read them at the source.</p><div class="status-actions"><button class="journal-button" @click="load">Try again <BrandIcon name="arrow" :size="17" /></button><a class="text-link" href="https://github.com/joogiebear/spawnloft/releases">Open GitHub releases <BrandIcon name="external" :size="17" /></a></div></template>
      <template v-else><p class="journal-eyebrow">NOTHING PUBLISHED YET</p><h2>The journal starts here.</h2><p>No published releases were returned. You can check the project directly on GitHub.</p><a class="text-link" href="https://github.com/joogiebear/spawnloft/releases">View the release page <BrandIcon name="external" :size="17" /></a></template>
    </section>
    <template v-else>
      <section class="latest-band">
        <article :id="featured.tag_name" class="featured-release journal-wrap">
          <aside class="release-index"><p class="journal-eyebrow"><span class="release-dot"></span> LATEST PUBLISHED</p><a class="featured-version" :href="'#' + featured.tag_name">{{ featured.tag_name }}</a><time :datetime="featured.published_at">{{ when(featured.published_at) }}</time><span class="release-channel">{{ featured.prerelease ? 'Pre-release' : 'Stable release' }}</span></aside>
          <div class="release-story"><h2>{{ title(featured) }}</h2><div v-if="featured.body?.trim()" class="release-prose" v-html="html(featured)"></div><p v-else class="no-notes">No release notes were included with this version.</p><div class="release-actions"><a v-if="featured.assets?.length" class="journal-button" :href="featured.html_url"><BrandIcon name="download" :size="17" /> Choose your download</a><a class="text-link" :href="featured.html_url">Read on GitHub <BrandIcon name="external" :size="16" /></a></div><p v-if="featured.prerelease" class="channel-note">This is a pre-release. Stable installations are not offered pre-release updates.</p></div>
        </article>
      </section>
      <section class="journal-archive journal-wrap" aria-labelledby="archive-title">
        <div class="archive-heading"><div><p class="journal-eyebrow">THE WORK ALONG THE WAY</p><h2 id="archive-title">Previously shipped.</h2></div><p>Open a release to read its notes.</p></div>
        <p v-if="!archive.length" class="archive-empty">This is the first release in the feed. The next chapter will appear here.</p>
        <details v-for="release in archive" :id="release.tag_name" :key="release.tag_name" class="archive-release">
          <summary><div class="archive-date"><span>{{ release.tag_name }}</span><time :datetime="release.published_at">{{ when(release.published_at) }}</time></div><div class="archive-title"><h3>{{ title(release) }}</h3><span v-if="release.prerelease" class="pre-label">PRE-RELEASE</span></div><BrandIcon name="chevron" :size="20" /></summary>
          <div class="archive-body"><div v-if="release.body?.trim()" class="release-prose" v-html="html(release)"></div><p v-else class="no-notes">No release notes were included with this version.</p><div class="release-actions"><a :href="release.html_url" class="text-link">Release on GitHub <BrandIcon name="external" :size="16" /></a><a v-if="release.assets?.length" :href="release.html_url" class="text-link">Download {{ release.tag_name }} <BrandIcon name="download" :size="16" /></a><a class="permalink" :href="'#' + release.tag_name">Permalink</a></div></div>
        </details>
        <div class="archive-bottom"><button v-if="remaining" class="journal-button archive-more" @click="showMore">Show more releases <BrandIcon name="arrow" :size="17" /></button><a class="text-link" href="https://github.com/joogiebear/spawnloft/releases">Full archive on GitHub <BrandIcon name="external" :size="17" /></a></div>
      </section>
    </template>
    <footer class="journal-footer journal-wrap"><div><p class="journal-eyebrow">ALWAYS MOVING FORWARD</p><h2>See where we’re headed.</h2><p>The ideas behind the next chapter of SpawnLoft.</p></div><a class="text-link" href="/roadmap">Explore the roadmap <BrandIcon name="arrow" :size="20" /></a></footer>
  </main>
</template>

<style scoped>
.release-journal{background:#090d0d;color:#efeee6;font-family:var(--ui);min-height:70vh}.journal-wrap{max-width:1200px;padding-left:40px;padding-right:40px;margin:0 auto}.journal-intro{padding-top:80px;padding-bottom:65px}.journal-eyebrow{display:flex;align-items:center;gap:10px;font:10px/1.7 var(--mono);letter-spacing:.13em;margin:0 0 24px;color:#a8b59f}.journal-intro>.journal-eyebrow{color:#c4f566}h1,h2,h3,p{margin-top:0}h1{font:600 clamp(50px,7.6vw,100px)/.98 var(--display);letter-spacing:-.065em;margin:0 0 40px}h1 span{color:#8d9b84}.intro-bottom{display:flex;align-items:end;justify-content:space-between;gap:40px}.intro-bottom p{max-width:530px;color:#a8b59f;font-size:16px;line-height:1.8;margin:0}.text-link{display:inline-flex;align-items:center;gap:13px;font-size:12px;line-height:1.6;color:#c4f566;flex-shrink:0;text-decoration:none}.text-link:hover{color:#efeee6}.journal-button{display:inline-flex;gap:12px;align-items:center;justify-content:center;padding:14px 20px;min-height:46px;background:#c4f566;color:#090d0d;font:600 12px/1.4 var(--ui);border:0;cursor:pointer;text-decoration:none}.journal-button:hover{background:#d9ffa1}.journal-button,.text-link{transition:background .15s,color .15s}.latest-band{background:#efeee6;color:#090d0d}.featured-release{display:grid;grid-template-columns:240px minmax(0,1fr);gap:60px;padding-top:66px;padding-bottom:76px;scroll-margin-top:100px}.release-index{padding-top:7px}.release-index .journal-eyebrow{font-size:9px;color:#586a48;margin-bottom:23px}.release-dot{width:6px;height:6px;background:#526b36;display:inline-block}.featured-version{display:block;font:600 34px/1.1 var(--display);letter-spacing:-.05em;color:#090d0d;margin-bottom:12px}.release-index time{display:block;font-size:12px;color:#69715f}.release-channel{display:inline-block;margin-top:22px;font:9px var(--mono);letter-spacing:.05em;border-top:1px solid #bdc3b3;padding-top:12px;color:#55624a}.release-story h2{font:600 clamp(30px,3.7vw,48px)/1.08 var(--display);letter-spacing:-.045em;margin-bottom:30px;overflow-wrap:anywhere}.release-actions{display:flex;flex-wrap:wrap;gap:20px 26px;align-items:center;margin-top:32px}.latest-band .text-link{color:#384c24}.latest-band .text-link:hover{color:#090d0d}.latest-band .journal-button{background:#090d0d;color:#c4f566}.latest-band .journal-button:hover{background:#25311c}.channel-note{font-size:12px;color:#626d58;line-height:1.7;margin:20px 0 0}.no-notes{color:#899780;font-size:14px;line-height:1.8}.latest-band .no-notes{color:#68725d}
.release-prose{font-size:15px;line-height:1.85;overflow-wrap:anywhere;color:#b7c0af}.latest-band .release-prose{color:#4d5745}.release-prose :deep(p){margin:0 0 18px}.release-prose :deep(h1),.release-prose :deep(h2),.release-prose :deep(h3),.release-prose :deep(h4){font-family:var(--display);font-weight:600;line-height:1.25;color:#efeee6;letter-spacing:-.02em;margin:30px 0 14px}.latest-band .release-prose :deep(h1),.latest-band .release-prose :deep(h2),.latest-band .release-prose :deep(h3),.latest-band .release-prose :deep(h4){color:#090d0d}.release-prose :deep(h1),.release-prose :deep(h2){font-size:24px}.release-prose :deep(h3),.release-prose :deep(h4){font-size:19px}.release-prose :deep(ul),.release-prose :deep(ol){padding-left:22px;margin:16px 0 22px}.release-prose :deep(ul){list-style:disc}.release-prose :deep(ol){list-style:decimal}.release-prose :deep(li){margin:8px 0}.release-prose :deep(strong){color:#efeee6;font-weight:600}.latest-band .release-prose :deep(strong){color:#26301f}.release-prose :deep(a){color:#c4f566;text-decoration:underline;text-underline-offset:3px}.latest-band .release-prose :deep(a){color:#425d29}.release-prose :deep(code){font:12px/1.7 var(--mono);background:#1e291c;color:#d7e4c7;padding:2px 5px;border-radius:2px}.latest-band .release-prose :deep(code){background:#dfe3d6;color:#314524}.release-prose :deep(pre){padding:18px;background:#111a12;overflow-x:auto;margin:22px 0;max-width:100%}.release-prose :deep(pre code){padding:0;background:transparent;color:#d7e4c7;white-space:pre;word-break:normal;overflow-wrap:normal}.release-prose :deep(blockquote){border-left:2px solid #728654;padding:0 0 0 20px;margin:24px 0}.release-prose :deep(img){max-width:100%;height:auto;margin:20px 0}.release-prose :deep(hr){border:0;border-top:1px solid #48523c;margin:28px 0}.release-prose :deep(table){display:block;max-width:100%;overflow-x:auto;border-collapse:collapse;font-size:13px}.release-prose :deep(th),.release-prose :deep(td){border-bottom:1px solid #56604e;text-align:left;padding:10px 14px}
.journal-archive{padding-top:74px;padding-bottom:72px}.archive-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:32px}.archive-heading .journal-eyebrow{margin-bottom:14px}.archive-heading h2,.journal-footer h2{font:600 clamp(28px,3.5vw,42px)/1.1 var(--display);letter-spacing:-.04em;margin:0}.archive-heading>p{font-size:12px;color:#8e9c85;margin:0 0 4px}.archive-release{border-top:1px solid #303b29;scroll-margin-top:94px}.archive-release:last-of-type{border-bottom:1px solid #303b29}.archive-release summary{display:grid;grid-template-columns:190px minmax(0,1fr) 20px;gap:35px;align-items:center;list-style:none;cursor:pointer;padding:28px 0}.archive-release summary::-webkit-details-marker{display:none}.archive-date>span{display:block;font:12px var(--mono);color:#c4f566;margin-bottom:8px}.archive-date time{font-size:11px;color:#8e9c85}.archive-title h3{font:500 23px/1.25 var(--display);letter-spacing:-.025em;margin:0;overflow-wrap:anywhere}.archive-release summary>.brand-icon{color:#93a185;transition:transform .18s}.archive-release[open] summary>.brand-icon{transform:rotate(90deg);color:#c4f566}.archive-release summary:hover h3{color:#c4f566}.pre-label{display:inline-block;font:8px var(--mono);letter-spacing:.1em;color:#c4f566;margin-top:9px}.archive-body{padding:0 55px 38px 225px}.permalink{font:10px var(--mono);color:#8e9c85}.archive-bottom{display:flex;align-items:center;justify-content:space-between;gap:25px;padding-top:32px}.archive-more{background:#1c2919;color:#c4f566}.archive-more:hover{background:#2a3b22}.journal-footer{border-top:1px solid #303b29;padding-top:48px;padding-bottom:66px;display:flex;align-items:center;justify-content:space-between;gap:35px}.journal-footer .journal-eyebrow{margin-bottom:13px}.journal-footer p:last-child{font-size:14px;line-height:1.7;color:#8e9c85;margin:14px 0 0}.journal-status{min-height:310px;padding-top:45px;padding-bottom:70px;border-top:1px solid #303b29}.journal-status h2{font:500 32px var(--display);letter-spacing:-.03em;margin-bottom:14px}.journal-status>p:not(.journal-eyebrow){color:#a8b59f;font-size:14px;line-height:1.8;max-width:540px}.status-actions{display:flex;gap:25px;flex-wrap:wrap;margin-top:24px}.status-rule{display:block;height:2px;background:#c4f566;width:70px;margin-bottom:26px}a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid #c4f566;outline-offset:5px}.latest-band a:focus-visible{outline-color:#314524}
@media(max-width:900px){.featured-release{grid-template-columns:180px minmax(0,1fr);gap:35px}.archive-release summary{grid-template-columns:150px minmax(0,1fr) 20px;gap:25px}.archive-body{padding-left:175px;padding-right:45px}.intro-bottom{align-items:start;flex-direction:column;gap:25px}}
@media(max-width:600px){.journal-wrap{padding-left:24px;padding-right:24px}.journal-intro{padding-top:48px;padding-bottom:42px}h1{font-size:clamp(44px,11.7vw,66px);margin-bottom:27px}.intro-bottom p{font-size:14px}.journal-eyebrow{font-size:9px}.featured-release{display:block;padding-top:38px;padding-bottom:44px}.release-index{display:grid;grid-template-columns:1fr auto;column-gap:18px;align-items:center;margin-bottom:32px}.release-index .journal-eyebrow{grid-column:1/-1;margin-bottom:15px}.featured-version{margin:0;font-size:29px}.release-index time{text-align:right;font-size:11px}.release-channel{grid-column:1/-1;justify-self:start;margin-top:14px;padding-top:9px}.release-story h2{font-size:30px;margin-bottom:23px}.release-prose{font-size:14px;line-height:1.85}.release-prose :deep(pre){padding:12px}.release-actions{gap:20px;margin-top:25px}.journal-archive{padding-top:45px;padding-bottom:48px}.archive-heading{display:block;margin-bottom:24px}.archive-heading>p{margin-top:15px}.archive-release summary{grid-template-columns:minmax(0,1fr) 20px;gap:14px;padding:24px 0}.archive-date{grid-column:1/-1;display:flex;gap:15px;align-items:center}.archive-date>span{margin:0}.archive-title h3{font-size:22px}.archive-body{padding:0 0 30px}.archive-bottom{align-items:flex-start;flex-direction:column}.journal-footer{align-items:flex-start;flex-direction:column;padding-top:35px;padding-bottom:45px}.journal-footer h2{font-size:30px}.journal-status{padding-top:38px}.archive-empty{font-size:14px;color:#a8b59f}}
@media(prefers-reduced-motion:reduce){.journal-button,.text-link,.archive-release summary>.brand-icon{transition:none}}
</style>
