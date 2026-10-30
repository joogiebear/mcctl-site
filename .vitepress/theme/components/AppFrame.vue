<script setup lang="ts">
// The frame a capture or the live console sits in. `hero` adds the one shadow on the site.
withDefaults(defineProps<{ title?: string; hero?: boolean }>(), { hero: false })
</script>

<template>
  <div class="app-frame" :class="{ hero }">
    <div v-if="title" class="bar"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="title">{{ title }}</span></div>
    <div class="body"><slot /></div>
  </div>
</template>

<style scoped>
.app-frame { border: 1px solid var(--line-strong); border-radius: var(--r1); background: var(--bg-1); overflow: hidden; min-width: 0; }
.app-frame.hero { border-radius: var(--r2); box-shadow: var(--shadow-frame); }
.bar { display: flex; align-items: center; gap: var(--s3); height: 36px; padding: 0 var(--s4); border-bottom: 1px solid var(--line); background: var(--bg-2); }
.dots { display: flex; gap: 6px; }
.dots i { width: 8px; height: 8px; border-radius: 50%; background: var(--line-strong); }
.title { font: 400 var(--t-caption)/1 var(--mono); color: var(--fg-3); letter-spacing: .04em; }
.body :deep(img) { display: block; width: 100%; height: auto; }
</style>
