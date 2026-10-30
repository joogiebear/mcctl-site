<script setup lang="ts">
import Eyebrow from './Eyebrow.vue'
// A hairline frame on bg-1. A card is a container, not a decoration: it groups a title and a
// few lines, optionally as one link.
withDefaults(defineProps<{ title?: string; eyebrow?: string; href?: string; level?: 'h3' | 'h4' }>(), { level: 'h3' })
</script>

<template>
  <component :is="href ? 'a' : 'div'" class="card" :class="{ link: !!href }" :href="href">
    <Eyebrow v-if="eyebrow">{{ eyebrow }}</Eyebrow>
    <component :is="level" v-if="title" class="title">{{ title }}</component>
    <div class="card-body"><slot /></div>
  </component>
</template>

<style scoped>
.card { display: grid; gap: var(--s3); align-content: start; padding: var(--s5); border: 1px solid var(--line); border-radius: var(--r1); background: var(--bg-1); color: inherit; text-decoration: none; min-width: 0; }
.card.link { transition: border-color var(--d1) var(--ease); }
.card.link:hover { border-color: var(--fg); }
.title { margin: 0; font: 600 var(--t-h3)/1.25 var(--display); letter-spacing: -.02em; }
.card-body { color: var(--fg-2); font-size: var(--t-ui); line-height: 1.55; }
.card-body :deep(p) { margin: 0 0 var(--s3); }
.card-body :deep(p:last-child) { margin-bottom: 0; }
</style>
