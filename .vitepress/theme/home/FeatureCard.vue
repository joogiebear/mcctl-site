<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
defineProps<{ title: string; icon: string; image: string; alt: string; text: string; href: string; linkLabel: string }>()
</script>
<template>
  <article class="home-feature">
    <h3><BrandIcon :name="icon" :size="32" />{{ title }}</h3>
    <a :href="`/img/tabs/${image}.webp`" target="_blank" rel="noopener" class="feature-capture" :class="`feature-${image}`" :aria-label="`Open full ${image} screenshot in a new tab`"><img :src="`/img/home/${image}.webp`" :alt="alt" width="960" height="720" loading="lazy" decoding="async" /></a>
    <p>{{ text }}</p>
    <a :href="href" class="feature-guide">{{ linkLabel }}</a>
  </article>
</template>
