<script setup lang="ts">
// Native details, styled: a hairline row that opens. Works without JavaScript and in search.
withDefaults(defineProps<{ summary: string; id?: string; open?: boolean }>(), { open: false })
</script>

<template>
  <details class="disc" :id="id" :open="open || undefined">
    <summary><span>{{ summary }}</span><i aria-hidden="true"></i></summary>
    <div class="disc-body"><slot /></div>
  </details>
</template>

<style scoped>
.disc { border-top: 1px solid var(--line); }
.disc:last-child { border-bottom: 1px solid var(--line); }
summary { list-style: none; display: flex; justify-content: space-between; align-items: center; gap: var(--s4); padding: var(--s4) 0; font: 600 var(--t-body)/1.3 var(--display); letter-spacing: -.01em; cursor: pointer; }
summary::-webkit-details-marker { display: none; }
summary i { position: relative; flex: none; width: 14px; height: 14px; transition: transform var(--d2) var(--ease); }
summary i::before, summary i::after { content: ""; position: absolute; inset: 50% auto auto 0; width: 14px; height: 2px; margin-top: -1px; background: var(--accent-text); }
summary i::after { transform: rotate(90deg); }
.disc[open] summary i { transform: rotate(45deg); }
.disc-body { padding-bottom: var(--s4); color: var(--fg-2); font-size: var(--t-ui); line-height: 1.6; max-width: 40em; }
.disc-body :deep(p) { margin: 0 0 var(--s3); }
.disc-body :deep(p:last-child) { margin-bottom: 0; }
.disc-body :deep(a) { color: var(--accent-text); text-decoration: underline; text-underline-offset: 4px; }
</style>
