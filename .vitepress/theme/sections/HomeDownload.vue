<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Eyebrow from '../components/Eyebrow.vue'
import PlatformPicker from '../components/PlatformPicker.vue'
</script>

<template>
  <section class="section" id="download">
    <div class="wrap dl">
      <div class="words" v-reveal>
        <Eyebrow accent>Download</Eyebrow>
        <h2 class="h1">Running in about ten minutes.</h2>
        <p class="lede">Install it, add a server, press Start. Java is the one thing it cannot install for you, and it tells you which one you need before it downloads anything.</p>
        <p class="small">Signed Windows and Mac installers · macOS 13 or later · Ubuntu 22.04+, Debian 12+, Fedora, RHEL 9 · Managed MySQL needs macOS 15+ on a Mac and x64 on Linux.</p>
        <ArrowLink href="/guide/getting-started">First time here? Read the setup guide</ArrowLink>
      </div>
      <PlatformPicker compact v-reveal />
    </div>
  </section>
</template>

<style scoped>
.dl { display: grid; grid-template-columns: 1.1fr 1fr; gap: var(--s8); align-items: start; }
.words { display: grid; gap: var(--s5); align-content: start; }
.words .h1 { margin-top: calc(var(--s1) * -1); }
@media (max-width: 900px) { .dl { grid-template-columns: minmax(0, 1fr); gap: var(--s7); } }
</style>
