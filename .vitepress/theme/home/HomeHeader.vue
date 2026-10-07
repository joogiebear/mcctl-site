<script setup lang="ts">
import { ref } from 'vue'
import BrandIcon from '../BrandIcon.vue'
defineEmits<{ download: [] }>()
const menu = ref(false)
const links = [
  { text: 'Features', href: '#features' },
  { text: 'How it works', href: '#how-it-works' },
  { text: 'Docs', href: '/guide/' },
  { text: 'Blog', href: '/blog/' },
  { text: 'GitHub', href: 'https://github.com/joogiebear/spawnloft' },
]
</script>
<template>
  <header class="home-header" @keydown.esc="menu = false">
    <div class="home-container header-row">
      <a href="/" class="home-brand" aria-label="SpawnLoft home"><img src="/brand/mark.svg" alt="" width="38" height="38"><span>spawnloft.</span></a>
      <nav class="home-desktop-nav" aria-label="Main navigation"><a v-for="link in links" :key="link.href" :href="link.href">{{ link.text }}</a></nav>
      <div class="header-actions">
        <a href="/#download" class="home-button header-download" @click.prevent="$emit('download')">Download</a>
        <button type="button" class="home-menu-toggle" :aria-expanded="menu" aria-controls="home-mobile-navigation" :aria-label="menu ? 'Close navigation' : 'Open navigation'" @click="menu = !menu"><BrandIcon :name="menu ? 'close' : 'menu'" /></button>
      </div>
    </div>
    <nav v-if="menu" id="home-mobile-navigation" class="home-mobile-nav" aria-label="Mobile navigation" @click="menu = false"><a v-for="link in links" :key="link.href" :href="link.href">{{ link.text }}</a></nav>
  </header>
</template>
