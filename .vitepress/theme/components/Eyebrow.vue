<script setup lang="ts">
// A small sentence-case label. The only small text allowed above a heading.
withDefaults(defineProps<{ as?: string; accent?: boolean }>(), { as: 'p', accent: false })
</script>

<template>
  <component :is="as" class="eyebrow" :class="{ accent }"><slot /></component>
</template>

<style scoped>
.eyebrow { margin: 0; font: 500 var(--t-small)/1.5 var(--text); letter-spacing: 0; color: var(--fg-3); }
.eyebrow.accent { color: var(--accent-text); }
</style>
