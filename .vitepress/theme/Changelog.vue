<script setup lang="ts">
// Every release, straight from GitHub. The notes are written once, in the release, and this page
// renders them, so it can never disagree with what the app offers as an update. Pre-releases are
// listed but marked, because a stable install never sees them.
import { onMounted, ref } from 'vue'
import { marked } from 'marked'

type Release = {
  tag_name: string
  name: string
  body: string
  html_url: string
  published_at: string
  prerelease: boolean
  assets: { name: string; browser_download_url: string; size: number }[]
}

const releases = ref<Release[]>([])
const state = ref<'loading' | 'ok' | 'failed'>('loading')

const title = (r: Release) => {
  // Titles are "v0.11.2 — Click the name instead of typing it"; the tag already says the version.
  const m = /^\s*v?[\d.]+(?:-[\w.]+)?\s*[—–-]\s*(.+)$/.exec(r.name || '')
  return m ? m[1] : r.name || r.tag_name
}
const when = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const installer = (r: Release) => r.assets.find((a) => /\.exe$/i.test(a.name))
// The notes open with their own title line, which the heading above already shows; drop it.
const html = (r: Release) => {
  const lines = (r.body || '').replace(/\r\n/g, '\n').split('\n')
  if (lines[0] && lines[0].trim() === title(r).trim()) lines.shift()
  return marked.parse(lines.join('\n').trim(), { async: false }) as string
}

onMounted(async () => {
  try {
    const r = await fetch('https://api.github.com/repos/joogiebear/mcctl/releases?per_page=100', {
      headers: { accept: 'application/vnd.github+json' },
    })
    if (!r.ok) throw new Error(String(r.status))
    releases.value = (await r.json()).filter((x: any) => !x.draft)
    state.value = 'ok'
  } catch {
    state.value = 'failed'
  }
})
</script>

<template>
  <div class="changelog">
    <p v-if="state === 'loading'" class="note">Loading releases from GitHub…</p>
    <p v-else-if="state === 'failed'" class="note">
      GitHub did not answer. The releases are at
      <a href="https://github.com/joogiebear/mcctl/releases">github.com/joogiebear/mcctl/releases</a>.
    </p>
    <template v-else>
      <article v-for="r in releases" :key="r.tag_name" :id="r.tag_name" class="release">
        <header>
          <h2>
            <a :href="'#' + r.tag_name" class="anchor">{{ title(r) }}</a>
          </h2>
          <div class="meta">
            <code>{{ r.tag_name }}</code>
            <span v-if="r.prerelease" class="pre">pre-release</span>
            <span>{{ when(r.published_at) }}</span>
            <a v-if="installer(r)" :href="installer(r)!.browser_download_url">installer</a>
            <a :href="r.html_url">on GitHub</a>
          </div>
        </header>
        <div class="body vp-doc" v-html="html(r)"></div>
      </article>
    </template>
  </div>
</template>

<style scoped>
.note { color: var(--ink-2); }
.release { padding: 28px 0; border-top: 1px solid var(--line); }
.release:first-of-type { border-top: 0; padding-top: 8px; }
.release h2 { margin: 0 0 6px; padding: 0; border: 0; font-size: 22px; letter-spacing: -.01em; }
.release h2 a { color: var(--ink); text-decoration: none; font-weight: 700; }
.release h2 a:hover { color: var(--lapis); }
.meta { display: flex; flex-wrap: wrap; gap: 6px 14px; align-items: center; font-size: 13px; color: var(--ink-3); margin-bottom: 14px; }
.meta code { font-size: 12px; }
.pre { font: 600 11px var(--ui); letter-spacing: .06em; text-transform: uppercase; color: var(--warn); border: 1px solid rgba(240, 182, 77, .35); border-radius: 999px; padding: 2px 8px; }
.body :deep(h2) { font-size: 15px; margin: 18px 0 6px; padding: 0; border: 0; color: var(--ink-2); text-transform: uppercase; letter-spacing: .06em; }
.body :deep(h3) { font-size: 15px; margin: 14px 0 4px; }
.body :deep(p:first-child) { font-size: 16px; color: var(--ink-2); }
.body :deep(ul) { padding-left: 1.2em; }
.body :deep(li) { margin: 4px 0; }
</style>
