<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import BackToTop from './BackToTop.vue'
import DocsChrome from './DocsChrome.vue'

// One layout, one header, one footer, for every page.
//  - `page` and `showcase` pages are the marketing shell (.sl): header, the page, footer.
//  - docs (and blog posts) keep VitePress's sidebar, outline and search, inside the same header
//    and footer, with the default nav bar hidden (docs.css).
//  - `descent` is the lab page with its own chrome, loaded only there so three.js stays out of
//    every other page's bundle.
const Landing = defineAsyncComponent(() => import('./Landing.vue'))
const Descent = defineAsyncComponent(() => import('./Descent.vue'))

const { frontmatter, page } = useData()
// VitePress's not-found page data carries `layout: 'page'`; it belongs in the docs shell.
const kind = computed<string>(() => (page.value.isNotFound ? 'doc' : frontmatter.value.layout) ?? 'doc')
</script>

<template>
  <Descent v-if="kind === 'descent'" />
  <div v-else-if="kind === 'showcase' || kind === 'page'" class="sl">
    <SiteHeader />
    <div id="main" class="sl-main" tabindex="-1">
      <Landing v-if="kind === 'showcase'" />
      <Content v-else />
    </div>
    <SiteFooter />
  </div>
  <div v-else class="sl-docs">
    <DefaultTheme.Layout>
      <template #layout-top><SiteHeader fixed search :skip="false" /></template>
      <template #doc-before><DocsChrome placement="before" /></template>
      <template #doc-after><DocsChrome placement="after" /></template>
      <template #sidebar-nav-before><DocsChrome placement="sidebar" /></template>
      <template #layout-bottom><BackToTop /><SiteFooter /></template>
    </DefaultTheme.Layout>
  </div>
</template>
