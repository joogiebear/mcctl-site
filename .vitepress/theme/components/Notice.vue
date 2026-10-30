<script setup lang="ts">
// A short aside with a coloured edge: lime for "worth knowing", amber for "this can bite".
withDefaults(defineProps<{ title?: string; tone?: 'info' | 'warn' }>(), { tone: 'info' })
</script>

<template>
  <aside class="notice" :class="tone">
    <div>
      <b v-if="title">{{ title }}</b>
      <div class="notice-body"><slot /></div>
    </div>
  </aside>
</template>

<style scoped>
.notice { display: grid; grid-template-columns: 4px minmax(0, 1fr); gap: var(--s4); padding: var(--s4) var(--s4) var(--s4) 0; border: 1px solid var(--line); border-radius: var(--r1); background: var(--bg-1); }
.notice::before { content: ""; background: var(--accent); border-radius: 0 2px 2px 0; }
.notice.warn::before { background: var(--warn); }
b { display: block; font: 600 var(--t-ui)/1.3 var(--display); margin-bottom: var(--s1); }
.notice-body { font-size: var(--t-small); line-height: 1.55; color: var(--fg-2); }
.notice-body :deep(p) { margin: 0 0 var(--s2); }
.notice-body :deep(p:last-child) { margin-bottom: 0; }
.notice-body :deep(a) { color: var(--accent-text); text-decoration: underline; text-underline-offset: 3px; }
</style>
