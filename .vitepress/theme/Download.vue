<script setup lang="ts">
// The Download button points at the releases page until GitHub says what the newest installer
// is; then it points at the .exe itself and says its version. A failed lookup changes nothing.
import { onMounted, ref } from 'vue'

withDefaults(defineProps<{ size?: 'lg' | 'md'; fine?: boolean }>(), { size: 'md', fine: false })

const href = ref('https://github.com/joogiebear/spawnloft/releases/latest')
const label = ref('Download for Windows')
const mb = ref<number | null>(null)

onMounted(async () => {
  try {
    const r = await fetch('https://api.github.com/repos/joogiebear/spawnloft/releases/latest', {
      headers: { accept: 'application/vnd.github+json' },
    })
    if (!r.ok) return
    const rel = await r.json()
    const exe = (rel.assets || []).find((a: any) => /\.exe$/i.test(a.name))
    if (!exe) return
    href.value = exe.browser_download_url
    label.value = 'Download ' + rel.tag_name + ' for Windows'
    mb.value = Math.round(exe.size / 1048576) || null
  } catch {}
})
</script>

<template>
  <span class="dl">
    <a class="btn primary" :class="size" :href="href">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13h11"/></svg>
      <span>{{ label }}</span>
    </a>
    <span v-if="fine" class="fine"><template v-if="mb">{{ mb }} MB installer · </template>MIT licence · Windows 10/11 · needs <b>Java 25</b> for current Minecraft</span>
  </span>
</template>

<style scoped>
.dl { display: inline-flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--r-sm); border: 1px solid var(--lapis); background: linear-gradient(180deg, #4a63d9, var(--lapis-dim)); color: #fff; font: 600 14px var(--ui); box-shadow: var(--lift); text-decoration: none; }
.btn:hover { filter: brightness(1.1); text-decoration: none; }
.btn.lg { padding: 13px 20px; font-size: 15px; }
.fine { font-size: 13px; color: var(--ink-3); }
.fine b { color: var(--ink-2); font-weight: 600; }
</style>
