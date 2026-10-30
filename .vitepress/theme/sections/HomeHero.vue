<script setup lang="ts">
import { computed } from 'vue'
import BrandIcon from '../BrandIcon.vue'
import AppFrame from '../components/AppFrame.vue'
import Button from '../components/Button.vue'
import Eyebrow from '../components/Eyebrow.vue'
import LiveConsole from '../components/LiveConsole.vue'
import { OS_NAMES, formatSize, useRelease } from '../release'

const { version, downloads, os } = useRelease()
const mine = computed(() => os.value ? downloads.value.find(item => item.main && item.os === os.value) : undefined)
const label = computed(() => os.value ? `Download for ${OS_NAMES[os.value]}` : 'Download SpawnLoft')
// The Mac build is Apple Silicon only, and a browser cannot tell an Intel Mac apart, so the
// qualifier stays in view for Mac visitors above all.
const name = (item: { os: string; title: string }) => item.os === 'mac' ? 'macOS (Apple Silicon)' : item.title
const fine = computed(() => {
  const others = downloads.value.filter(item => item.main && item !== mine.value).map(name)
  const size = mine.value?.size ? ` · ${formatSize(mine.value.size)}` : ''
  const platforms = mine.value ? `${name(mine.value)}${size} · also for ${others.join(' and ')}` : 'Windows, macOS (Apple Silicon) and Linux'
  const intel = os.value === 'mac' ? ' · Intel Macs stay on 1.4' : ''
  return `${version.value} · ${platforms}${intel} · MIT licence`
})
</script>

<template>
  <section class="home-hero">
    <div class="wrap">
      <Eyebrow accent>Free · Open source · Windows, macOS and Linux</Eyebrow>
      <h1 class="display">Run a Minecraft server on your own PC.</h1>
      <p class="lede">SpawnLoft is a desktop app that sets up, runs and backs up Paper, Fabric and NeoForge servers on the computer in front of you. No cloud, no account, nothing to type into a terminal.</p>
      <div class="cta-row">
        <Button href="/download" size="lg"><template #icon><BrandIcon name="download" :size="16" /></template>{{ label }}</Button>
        <Button href="#tour" variant="quiet" size="lg">See the panel<template #trailing><BrandIcon name="arrow" :size="16" /></template></Button>
      </div>
      <p class="fine small mono">{{ fine }}</p>
    </div>
    <div class="wrap-wide">
      <AppFrame hero class="frame"><LiveConsole /></AppFrame>
      <p class="small caption">A replica of the panel in HTML, playing a scripted log shaped like a real one. The captures further down are the app itself.</p>
    </div>
  </section>
</template>

<style scoped>
/* Not `.hero`: AppFrame carries that modifier class, and a scoped rule would leak onto it. */
.home-hero { padding-block: var(--s9) var(--s8); }
.home-hero .eyebrow { margin-bottom: var(--s5); }
.display { max-width: 15em; }
.lede { margin-top: var(--s6); max-width: 34em; }
.cta-row { display: flex; flex-wrap: wrap; gap: var(--s4) var(--s5); align-items: center; margin-top: var(--s7); }
.fine { margin-top: var(--s4); }
.frame { margin-top: var(--s7); }
.caption { margin-top: var(--s3); text-align: right; }
@media (max-width: 640px) { .home-hero { padding-block: var(--s8) var(--s7); } .cta-row :deep(.btn) { width: 100%; } .caption { text-align: left; } }
</style>
