<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BrandIcon from '../BrandIcon.vue'
import Eyebrow from './Eyebrow.vue'
import { DOWNLOADS, FALLBACK_VERSION, INTEL_MAC_URL, OS_NAMES, RELEASES_URL, detectOs, downloadUrl, fetchLatest, formatSize, type Os } from '../release'

// The one component that can send someone the wrong file. It renders the verified fallback
// links at build time, asks GitHub for the latest stable release once mounted, and moves the
// visitor's own platform to the top. It never requires an asset that no longer ships.
const props = withDefaults(defineProps<{ compact?: boolean; heading?: string }>(), { compact: false })

const version = ref(FALLBACK_VERSION)
const downloads = ref(DOWNLOADS)
const releaseUrl = ref(`${RELEASES_URL}/latest`)
const os = ref<Os | undefined>()
let controller: AbortController | undefined

const main = computed(() => {
  const list = downloads.value.filter(item => item.main)
  if (!os.value) return list
  return [...list.filter(item => item.os === os.value), ...list.filter(item => item.os !== os.value)]
})
const more = computed(() => downloads.value.filter(item => !item.main))
const url = (file: string) => downloadUrl(version.value, file)

onMounted(async () => {
  os.value = detectOs()
  controller = new AbortController()
  const timeout = window.setTimeout(() => controller?.abort(), 8000)
  try {
    const latest = await fetchLatest(controller.signal)
    version.value = latest.version
    downloads.value = latest.downloads
    releaseUrl.value = latest.url
  } catch {
    /* The verified fallback links work without an answer from GitHub. */
  } finally { window.clearTimeout(timeout) }
})
onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="picker" :class="{ compact }">
    <div class="picker-head">
      <Eyebrow>{{ heading ?? `${version} · free · MIT licensed` }}</Eyebrow>
      <span v-if="os" class="detected">Looks like {{ OS_NAMES[os] }}</span>
    </div>
    <div class="list" role="group" aria-label="Download SpawnLoft">
      <a v-for="item in main" :key="item.id" class="row" :class="{ primary: os && item.os === os }" :href="url(item.file)">
        <span class="row-words">
          <span class="os">{{ item.title }}<span v-if="os && item.os === os" class="sr-only"> (detected)</span></span>
          <span class="file">{{ item.file }}<template v-if="item.size"> · {{ formatSize(item.size) }}</template><template v-else> · {{ item.detail }}</template></span>
        </span>
        <BrandIcon name="download" :size="18" />
      </a>
    </div>
    <p class="more">
      <template v-for="item in more" :key="item.id"><a :href="url(item.file)">{{ item.title }} {{ item.detail }}</a><span aria-hidden="true"> · </span></template>
      <a href="/guide/beta#no-screen">command line only, for a server</a><span aria-hidden="true"> · </span>
      <a :href="releaseUrl">checksums and every file</a>
    </p>
    <p v-if="!compact" class="fine">
      Windows and Mac installers are signed. macOS needs 13 or later; Intel Macs stay on <a :href="INTEL_MAC_URL">1.4</a>, the last version built for them.
      Managed MySQL needs macOS 15 or later on a Mac and x64 on Linux. Minecraft needs Java, and <a href="/guide/getting-started#what-you-need">which one</a> depends on the version you run.
    </p>
  </div>
</template>

<style scoped>
.picker { display: grid; gap: var(--s4); max-width: 480px; min-width: 0; }
.picker-head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: var(--s2) var(--s4); }
.detected { font: 400 var(--t-caption)/1.5 var(--mono); color: var(--fg-3); }
.list { display: grid; gap: var(--s3); }
.row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--s4); align-items: center; padding: var(--s4) var(--s5); border: 1px solid var(--line-strong); border-radius: var(--r1); color: var(--fg); text-decoration: none; transition: border-color var(--d1) var(--ease), background var(--d1) var(--ease); }
.row:hover { border-color: var(--fg); background: var(--accent-wash); color: var(--fg); }
.row.primary { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
.row.primary:hover { background: var(--accent-hover); border-color: var(--accent-hover); color: var(--accent-fg); }
.paper .row.primary { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.paper .row.primary:hover { background: var(--paper-fg-hover); border-color: var(--paper-fg-hover); color: var(--bg); }
.row-words { display: grid; gap: 2px; min-width: 0; }
.os { font: 600 var(--t-h4)/1.2 var(--display); letter-spacing: -.02em; }
.file { font: 400 var(--t-caption)/1.5 var(--mono); color: var(--fg-2); overflow-wrap: anywhere; }
.row.primary .file { color: inherit; opacity: .8; }
.more, .fine { margin: 0; font-size: var(--t-small); line-height: 1.6; color: var(--fg-3); }
.more a, .fine a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
.more a:hover, .fine a:hover { color: var(--fg); }
.compact .fine { display: none; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
