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
.library-link { display: flex; align-items: center; gap: var(--s3); padding: var(--s2) 0 var(--s5); margin-bottom: var(--s3); border-bottom: 1px solid var(--line); color: var(--accent-text); }
.library-link > span { flex: 1; font: 500 var(--t-caption)/1.5 var(--mono); letter-spacing: .08em; }
.library-link small { display: block; font: 400 var(--t-caption)/1.5 var(--text); letter-spacing: 0; color: var(--fg-3); margin-top: var(--s1); }
.library-link:hover small { color: var(--fg); }
.doc-breadcrumb { display: flex; align-items: center; gap: var(--s2); font: 400 var(--t-caption)/1.5 var(--mono); margin-bottom: var(--s6); color: var(--fg-3); }
.doc-breadcrumb a { color: var(--accent-text); }
.doc-breadcrumb a:hover { text-decoration: underline; }
.post-byline { flex-wrap: wrap; row-gap: var(--s1); }
.post-byline span::before, .post-byline time + span::before { content: "·"; margin-right: var(--s2); color: var(--fg-3); }
.post-byline time { color: var(--fg-2); }
.doc-support { display: flex; gap: var(--s4); padding: var(--s6) 0 0; margin-top: var(--s7); border-top: 1px solid var(--line); color: var(--fg-2); }
.doc-support svg { color: var(--accent-text); }
.doc-support strong { font: 600 var(--t-h3)/1.25 var(--display); letter-spacing: -.02em; color: var(--fg); }
.doc-support p { color: var(--fg-2); font-size: var(--t-small); line-height: 1.6; margin: var(--s2) 0 var(--s3); }
.doc-support a { display: inline-flex; align-items: center; gap: var(--s2); margin: 0 var(--s5) var(--s2) 0; font-size: var(--t-small); color: var(--accent-text); text-decoration: underline; text-underline-offset: 4px; }
.doc-support a:hover { color: var(--fg); }
</style>
