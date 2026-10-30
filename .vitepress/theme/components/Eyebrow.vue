<script setup lang="ts">
// Twelve-pixel mono, tracked and upper-case. The only small text allowed above a heading.
withDefaults(defineProps<{ as?: string; accent?: boolean }>(), { as: 'p', accent: false })
</script>

<template>
  <component :is="as" class="eyebrow" :class="{ accent }"><slot /></component>
</template>

<style scoped>
.eyebrow { margin: 0; font: 500 var(--t-caption)/1.5 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--fg-3); }
.eyebrow.accent { color: var(--accent-text); }
</style>
