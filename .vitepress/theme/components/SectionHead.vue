<script setup lang="ts">
// Every section on every page opens this way: eyebrow, title, optional lede, optional aside
// action, hairline. The rhythm is the same from the home page to the changelog.
import Eyebrow from './Eyebrow.vue'
withDefaults(defineProps<{
  title: string
  eyebrow?: string
  lede?: string
  level?: 'h1' | 'h2' | 'h3'
  id?: string
  rule?: boolean
}>(), { level: 'h2', rule: true })
</script>

<template>
  <header class="sec-head" :class="{ rule, 'has-aside': !!$slots.aside }">
    <div class="words">
      <Eyebrow v-if="eyebrow">{{ eyebrow }}</Eyebrow>
      <component :is="level" :id="id" class="title" :class="level">{{ title }}</component>
      <p v-if="lede || $slots.default" class="lede"><slot>{{ lede }}</slot></p>
    </div>
    <div v-if="$slots.aside" class="aside"><slot name="aside" /></div>
  </header>
</template>

<style scoped>
.sec-head { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--s4) var(--s8); align-items: end; }
.sec-head.has-aside { grid-template-columns: minmax(0, 1fr) auto; }
.sec-head.rule { padding-bottom: var(--s5); border-bottom: 1px solid var(--line); }
.words { display: grid; gap: var(--s3); }
.title { margin: 0; font-family: var(--display); font-weight: 600; letter-spacing: -.03em; text-wrap: balance; }
.title.h1 { font-size: var(--t-h1); line-height: 1.02; letter-spacing: -.035em; }
.title.h2 { font-size: var(--t-h2); line-height: 1.08; }
.title.h3 { font-size: var(--t-h3); line-height: 1.25; letter-spacing: -.02em; }
.lede { margin: 0; font-size: var(--t-lede); line-height: 1.5; color: var(--fg-2); max-width: var(--measure); text-wrap: pretty; }
.aside { padding-bottom: var(--s1); }
@media (max-width: 640px) { .sec-head.has-aside { grid-template-columns: minmax(0, 1fr); } }
</style>
