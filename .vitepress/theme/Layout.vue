<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onMounted, watch } from 'vue'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { useData, useRoute } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import BackToTop from './BackToTop.vue'
import DocsChrome from './DocsChrome.vue'

// One layout, one header, one footer, for every page.
//  - `page` pages (home, download, product, changelog...) are the marketing shell (.sl): header, the page, footer.
//  - docs (and blog posts) keep VitePress's sidebar, outline and search, inside the same header
//    and footer, with the default nav bar hidden (docs.css).
//  - `descent` is the lab page with its own chrome, loaded only there so three.js stays out of
//    every other page's bundle.
const Descent = defineAsyncComponent(() => import('./Descent.vue'))

const { frontmatter, page } = useData()
// VitePress's not-found page data carries `layout: 'page'`; it belongs in the docs shell.
const kind = computed<string>(() => (page.value.isNotFound ? 'doc' : frontmatter.value.layout) ?? 'doc')

// VitePress renders the edit link and pager in a <footer> beside <main>, which makes it a second
// contentinfo landmark next to the site footer. A footer may be a group, so it becomes one; the
// pager inside it stays a navigation landmark of its own.
const route = useRoute()
function labelDocFooter() {
  for (const el of document.querySelectorAll('.VPDocFooter')) { el.setAttribute('role', 'group'); el.setAttribute('aria-label', 'Page links') }
}
onMounted(() => { labelDocFooter(); watch(() => route.path, () => nextTick(labelDocFooter)) })
</script>

<template>
  <Descent v-if="kind === 'descent'" />
  <div v-else-if="kind === 'page'" class="sl">
    <SiteHeader />
    <div id="main" class="sl-main" tabindex="-1"><Content /></div>
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
