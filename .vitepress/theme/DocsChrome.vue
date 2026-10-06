<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import BrandIcon from './BrandIcon.vue'
import { data as posts } from './blog.data'
import { formatDate } from './posts'
defineProps<{ placement: 'before' | 'after' | 'sidebar' }>()
const { page } = useData()
const isReference = computed(() => page.value.relativePath.startsWith('reference/'))
// Blog posts reuse the docs shell, so the breadcrumb and the closing block change for them.
const isPost = computed(() => page.value.relativePath.startsWith('blog/'))
const post = computed(() => posts.find(p => p.url === '/' + page.value.relativePath.replace(/\.md$/, '')))
</script>
<template>
  <a v-if="placement==='sidebar'" class="library-link" href="/guide/"><BrandIcon name="world" :size="25" /><span>THE FIELD GUIDE<small>Browse all documentation</small></span><BrandIcon name="arrow" :size="15" /></a>
  <nav v-else-if="placement==='before' && isPost" class="doc-breadcrumb post-byline" aria-label="Post details"><a href="/blog/">Blog</a><BrandIcon name="chevron" :size="12" /><template v-if="post"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span>{{ post.minutes }} min read</span><span>{{ post.author }}</span></template></nav>
  <nav v-else-if="placement==='before'" class="doc-breadcrumb" aria-label="Breadcrumb"><a href="/guide/">Field guide</a><BrandIcon name="chevron" :size="12" /><span>{{isReference ? 'Reference' : 'Guides'}}</span></nav>
  <div v-else-if="isPost" class="doc-support"><BrandIcon name="spark" :size="27" /><div><strong>More from the blog</strong><p>New posts arrive in the feed. Questions and ideas are welcome in the discussions.</p><a href="/blog/">All posts <BrandIcon name="arrow" :size="14" /></a><a href="/blog/feed.xml">RSS feed <BrandIcon name="arrow" :size="14" /></a><a href="https://github.com/joogiebear/spawnloft/discussions">Join the discussion <BrandIcon name="external" :size="14" /></a></div></div>
  <div v-else class="doc-support"><BrandIcon name="spark" :size="27" /><div><strong>Still working it out?</strong><p>Find a fix in troubleshooting, or ask the community.</p><a href="/guide/troubleshooting">Troubleshooting <BrandIcon name="arrow" :size="14" /></a><a href="https://github.com/joogiebear/spawnloft/discussions">Ask a question <BrandIcon name="external" :size="14" /></a></div></div>
</template>
<style scoped>
.library-link { display:flex; align-items:center; gap:12px; padding:9px 0 28px; margin-bottom:12px; border-bottom:1px solid #c4f56630; color:#c4f566; }.library-link>span { flex:1; font:11px var(--mono); letter-spacing:.08em; }.library-link small { display:block; font:11px var(--ui); letter-spacing:0; color:#a7b29f; margin-top:7px; }.library-link:hover small { color:#efeee6; }
.doc-breadcrumb { display:flex; align-items:center; gap:10px; font:11px var(--mono); margin-bottom:28px; color:#737d6b; }.doc-breadcrumb a { color:#3f6221; }.doc-breadcrumb a:hover { text-decoration:underline; }
.post-byline { flex-wrap:wrap; row-gap:6px; }.post-byline span::before,.post-byline time+span::before { content:"·"; margin-right:10px; color:#9aa38f; }.post-byline time { color:#58634f; }
.doc-support { display:flex; gap:18px; padding:28px 0; margin-top:32px; border-top:1px solid #c7ccbe; color:#304d23; }.doc-support strong { font:600 22px var(--display); letter-spacing:-.035em; color:#162014; }.doc-support p { color:#616b5a; font-size:13px; line-height:1.7; margin:9px 0 15px; }.doc-support a { display:inline-flex; align-items:center; gap:9px; margin:0 23px 8px 0; font-size:12px; text-decoration:underline; text-underline-offset:4px; }
</style>
