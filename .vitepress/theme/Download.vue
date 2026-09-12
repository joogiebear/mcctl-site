<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{ size?: 'lg' | 'md'; fine?: boolean }>(), { size: 'md', fine: false })
const release = 'https://github.com/joogiebear/spawnloft/releases/download/'
const version = ref('v1.0.0')
const platforms = ref([
  { id: 'windows', title: 'Windows', detail: '10 / 11 · x64', file: 'SpawnLoft-Setup-1.0.0.exe', match: /^SpawnLoft-Setup-[\d.]+\.exe$/ },
  { id: 'arm64', title: 'macOS', detail: 'Apple Silicon', file: 'SpawnLoft-1.0.0-mac-arm64.dmg', match: /^SpawnLoft-[\d.]+-mac-arm64\.dmg$/ },
  { id: 'x64', title: 'macOS', detail: 'Intel', file: 'SpawnLoft-1.0.0-mac-x64.dmg', match: /^SpawnLoft-[\d.]+-mac-x64\.dmg$/ },
])

onMounted(async () => {
  if (!props.fine) return
  try {
    const response = await fetch('https://api.github.com/repos/joogiebear/spawnloft/releases/latest', { headers: { accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(8000) })
    if (!response.ok) return
    const latest = await response.json()
    if (latest.draft || latest.prerelease || !/^v\d+\.\d+\.\d+$/.test(latest.tag_name)) return
    const assets = platforms.value.map(platform => latest.assets?.find((asset: { name: string }) => platform.match.test(asset.name)))
    // Keep the known complete release if the API is unavailable or a release is incomplete.
    if (assets.some(asset => !asset)) return
    platforms.value = platforms.value.map((platform, index) => ({ ...platform, file: assets[index].name }))
    version.value = latest.tag_name
  } catch { /* The verified 1.0 links work without a GitHub API response. */ }
})
</script>

<template>
  <div class="dl" :class="{ 'dl-full': fine }">
    <a v-if="!fine" class="btn primary" :class="size" href="/#download">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13h11"/></svg>
      Get SpawnLoft
    </a>
    <template v-else>
      <span class="release-label">{{ version }} · FREE DESKTOP APP</span>
      <div class="platforms" role="group" aria-label="Download SpawnLoft for your computer">
        <a v-for="platform in platforms" :key="platform.id" class="platform" :href="release + version + '/' + platform.file" :aria-label="'Download for ' + platform.title + ', ' + platform.detail">
          <span class="platform-title">{{ platform.title }}<svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M2.5 13h11"/></svg></span>
          <small>{{ platform.detail }}</small>
        </a>
        <button class="platform coming" type="button" disabled><span class="platform-title">Linux</span><small>Coming soon</small></button>
      </div>
      <span class="fine">Signed installers · macOS 13+ · MIT licence<br>Managed MySQL on Mac needs macOS 15+. Minecraft needs Java.</span>
      <a class="setup-link" href="/guide/getting-started">First time here? Read the setup guide →</a>
    </template>
  </div>
</template>

<style scoped>
.dl { display: inline-flex; align-items: center; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 2px; border: 1px solid var(--lapis); background: var(--lapis); color: #090d0d; font: 600 14px var(--ui); text-decoration: none; }
.btn:hover { filter: brightness(1.1); text-decoration: none; }
.btn.lg { padding: 13px 20px; font-size: 15px; }
.dl-full { display: flex; flex-direction: column; align-items: stretch; gap: 18px; width: 100%; max-width: 760px; margin-inline: auto; }
.release-label { font: 10px var(--mono); letter-spacing: .08em; }
.platforms { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 10px; }
.platform { display: flex; flex-direction: column; gap: 12px; text-align: left; padding: 20px 16px; border: 1px solid currentColor; border-radius: 2px; background: transparent; color: inherit; text-decoration: none; transition: background .15s, color .15s; }
.platform-title { display: flex; justify-content: space-between; align-items: center; gap: 16px; font: 600 18px var(--ui); }
.platform small { font: 10px/1.6 var(--mono); }
a.platform:hover { background: #090d0d; color: #c4f566; text-decoration: none; }
.coming { opacity: .5; cursor: not-allowed; }
.fine { font: 12px/1.8 var(--ui); opacity: .75; }
.setup-link { font: 12px var(--ui); color: inherit; text-underline-offset: 4px; }
a:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
@media(max-width:700px) { .platforms { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media(max-width:360px) { .platform { padding: 16px 12px; }.platform-title { font-size: 16px; gap: 8px; } }
@media(prefers-reduced-motion:reduce) { .platform { transition: none; } }
</style>
