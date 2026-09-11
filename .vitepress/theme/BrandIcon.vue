<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 24 })

// Drawn on the same 24-unit grid: square terminals, bevelled silhouettes,
// and substantial 1.8-unit strokes remain clear at small interface sizes.
const outlines: Record<string, string[]> = {
  world: ['M3 7 12 2l9 5v10l-9 5-9-5Z', 'm3 7 9 5 9-5M12 12v10', 'm7.5 4.5 9 5v5l-4.5 2.5'],
  plugins: ['M8 3v5H3v8h5v5h8v-5h5V8h-5V3Z', 'M8 8h3M16 16h-3'],
  backup: ['m3 7 9-4 9 4-9 4Z', 'm3 12 9 4 9-4', 'm3 17 9 4 9-4'],
  terminal: ['M3 4h18v16H3Z', 'm7 9 3 3-3 3', 'M13 15h4'],
  shield: ['M12 2 3 6v7c0 4 9 9 9 9s9-5 9-9V6Z', 'm8 12 3 3 5-6'],
  bolt: ['M13 2 4 14h7l-1 8 10-13h-8Z'],
  arrow: ['M4 12h16', 'm13 5 7 7-7 7'],
  windows: ['M3 4h7v7H3ZM13 3l8-1v9h-8ZM3 14h7v7H3ZM13 14h8v9l-8-1Z'],
  chevron: ['m9 5 7 7-7 7'],
  cube: ['m12 2 9 5v10l-9 5-9-5V7Z', 'm3 7 9 5 9-5M12 12v10'],
  check: ['m4 12 5 5L20 6'],
  close: ['M5 5 19 19M19 5 5 19'],
  menu: ['M3 6h18M3 12h18M3 18h12'],
  play: ['M7 3v18l14-9Z'],
  download: ['M12 2v13m-5-5 5 5 5-5', 'M3 15v6h18v-6'],
  external: ['M13 3h8v8M21 3 10 14', 'M9 3H3v18h18v-6'],
  spark: ['m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z'],
}
const filled: Record<string, string[]> = {
  github: ['M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.61-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.6 9.6 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z'],
  mark: ['M7.5 3H21v4.5H9v2.25h7.5l4.5 4.5V21H3v-4.5h12v-2.25H7.5L3 9.75V7.5Z'],
}
const paths = computed(() => outlines[props.name] ?? (filled[props.name] ? [] : outlines.cube))
const solids = computed(() => filled[props.name] ?? [])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
    class="brand-icon"
  >
    <path v-for="(d, index) in paths" :key="`line-${index}`" :d="d" stroke="currentColor" stroke-width="1.8" stroke-linejoin="miter" stroke-linecap="square" />
    <path v-for="(d, index) in solids" :key="`solid-${index}`" :d="d" fill="currentColor" />
  </svg>
</template>

<style scoped>
.brand-icon { display: inline-block; flex: 0 0 auto; vertical-align: middle; }
</style>
