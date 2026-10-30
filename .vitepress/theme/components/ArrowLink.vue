<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
withDefaults(defineProps<{ href: string; external?: boolean }>(), { external: false })
</script>

<template>
  <a class="arrow-link" :href="href" :rel="external ? 'noopener' : undefined"><span><slot /></span><BrandIcon :name="external ? 'external' : 'arrow'" :size="15" /></a>
</template>

<style scoped>
.arrow-link { display: inline-flex; align-items: center; gap: var(--s2); color: var(--accent-text); font: 500 var(--t-ui)/1.3 var(--text); text-decoration: none; }
.arrow-link svg { transition: transform var(--d1) var(--ease); }
.arrow-link:hover svg { transform: translateX(3px); }
.arrow-link:hover span { text-decoration: underline; text-underline-offset: 4px; }
</style>
