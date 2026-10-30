<script setup lang="ts">
// A figure the repository can back up, with tabular numerals so columns line up.
defineProps<{ label: string; value: string | number; unit?: string }>()
</script>

<template>
  <div class="stat"><span class="k">{{ label }}</span><span class="v">{{ value }}<small v-if="unit">{{ unit }}</small></span></div>
</template>

<style scoped>
.stat { display: grid; gap: var(--s1); }
.k { font: 500 var(--t-caption)/1.4 var(--mono); letter-spacing: .1em; text-transform: uppercase; color: var(--fg-3); }
.v { font: 600 var(--t-h3)/1.1 var(--display); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.v small { font: 400 var(--t-caption)/1 var(--mono); color: var(--fg-3); margin-left: var(--s1); }
</style>
