<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Eyebrow from '../components/Eyebrow.vue'
const software = ['Paper', 'Purpur', 'Folia', 'Spigot', 'Vanilla', 'Fabric', 'NeoForge', 'Modrinth modpacks']
</script>

<template>
  <div class="compat">
    <div class="wrap-wide row">
      <Eyebrow>Runs</Eyebrow>
      <span v-for="name in software" :key="name" class="name">{{ name }}</span>
      <ArrowLink class="more" href="/reference/servers">Every server software</ArrowLink>
    </div>
  </div>
</template>

<style scoped>
.compat { border-block: 1px solid var(--line); }
.row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s3) var(--s6); padding-block: var(--s4); }
.row .eyebrow { margin-right: var(--s3); }
.name { font: 500 var(--t-ui)/1.4 var(--display); color: var(--fg-2); }
.more { margin-left: auto; }
@media (max-width: 640px) { .row { gap: var(--s2) var(--s4); } .more { margin-left: 0; flex-basis: 100%; margin-top: var(--s2); } }
</style>
