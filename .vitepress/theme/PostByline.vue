<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import BrandIcon from './BrandIcon.vue'
import { data as posts } from './blog.data'
import { formatDate } from './posts'
const { page } = useData()
const post = computed(() => posts.find(p => p.url === '/' + page.value.relativePath.replace(/\.md$/, '')))
</script>
<template>
  <nav class="doc-breadcrumb post-byline" aria-label="Post details"><a href="/blog/">Blog</a><BrandIcon name="chevron" :size="12" /><template v-if="post"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span>{{ post.minutes }} min read</span><span>{{ post.author }}</span></template></nav>
</template>
