<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import BrandIcon from './BrandIcon.vue'
defineProps<{ placement: 'before' | 'after' | 'sidebar' }>()
const { page } = useData()
const isReference = computed(() => page.value.relativePath.startsWith('reference/'))
</script>
<template>
  <a v-if="placement==='sidebar'" class="library-link" href="/guide/"><BrandIcon name="world" :size="25" /><span>THE FIELD GUIDE<small>Browse all documentation</small></span><BrandIcon name="arrow" :size="15" /></a>
  <nav v-else-if="placement==='before'" class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/guide/">Field guide</a><BrandIcon name="chevron" :size="12" /><span>{{isReference ? 'Reference' : 'Guides'}}</span></nav>
  <div v-else class="doc-support"><BrandIcon name="spark" :size="27" /><div><strong>Still working it out?</strong><p>Find a fix in troubleshooting, or ask the community.</p><a href="/guide/troubleshooting">Troubleshooting <BrandIcon name="arrow" :size="14" /></a><a href="https://github.com/joogiebear/spawnloft/discussions">Ask a question <BrandIcon name="external" :size="14" /></a></div></div>
</template>
<style scoped>
.library-link { display:flex; align-items:center; gap:12px; padding:9px 0 28px; margin-bottom:12px; border-bottom:1px solid #c4f56630; color:#c4f566; }.library-link>span { flex:1; font:9px var(--mono); letter-spacing:.08em; }.library-link small { display:block; font:11px var(--ui); letter-spacing:0; color:#a7b29f; margin-top:7px; }.library-link:hover small { color:#efeee6; }
.doc-breadcrumb { display:flex; align-items:center; gap:10px; font:10px var(--mono); margin-bottom:28px; color:#737d6b; }.doc-breadcrumb a { color:#3f6221; }.doc-breadcrumb a:hover { text-decoration:underline; }
.doc-support { display:flex; gap:18px; padding:28px 0; margin-top:32px; border-top:1px solid #c7ccbe; color:#304d23; }.doc-support strong { font:600 22px var(--display); letter-spacing:-.035em; color:#162014; }.doc-support p { color:#616b5a; font-size:13px; line-height:1.7; margin:9px 0 15px; }.doc-support a { display:inline-flex; align-items:center; gap:9px; margin:0 23px 8px 0; font-size:12px; text-decoration:underline; text-underline-offset:4px; }
</style>
