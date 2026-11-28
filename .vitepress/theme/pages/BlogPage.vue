<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Pill from '../components/Pill.vue'
import SectionHead from '../components/SectionHead.vue'
import { computed, ref } from 'vue'
import { data as posts } from '../blog.data'
import { formatDate } from '../posts'
// The index: a head, one featured post, topic filters and the rest newest first. Posts read in the docs shell.
const active = ref('')
// A topic becomes a filter once three posts share it, so every chip leads to a real list, and one-off tags stay as labels.
const topics = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].filter(([, n]) => n > 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([tag]) => tag)
})
const featured = computed(() => (active.value ? undefined : posts.find(post => post.featured)))
const list = computed(() => posts.filter(post => post !== featured.value && (!active.value || post.tags.includes(active.value))))
</script>

<template>
  <main class="blog-page">
    <section class="section top">
      <div class="wrap">
        <SectionHead level="h1" eyebrow="Blog" title="Guides and notes." lede="Practical guides for running a server on your own PC, release notes, and how SpawnLoft is built, in the open.">
          <template #aside><ArrowLink href="/blog/feed.xml">RSS feed</ArrowLink></template>
        </SectionHead>
        <p v-if="!posts.length" class="body empty">The first post is on its way.</p>
        <template v-else>
        <ul class="filters" aria-label="Filter by topic">
          <li><button type="button" :class="{ on: !active }" :aria-pressed="!active" @click="active = ''">All posts</button></li>
          <li v-for="topic in topics" :key="topic"><button type="button" :class="{ on: active === topic }" :aria-pressed="active === topic" @click="active = topic">{{ topic }}</button></li>
        </ul>
        <article v-if="featured" class="feature">
          <p class="small mono">Start here · {{ featured.minutes }} min read</p>
          <h2 class="h2"><a :href="featured.url">{{ featured.title }}</a></h2>
          <p class="body">{{ featured.description }}</p>
        </article>
        <div class="posts">
          <article v-for="post in list" :key="post.url" class="post">
            <p class="meta small mono"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span>{{ post.minutes }} min read</span></p>
            <div class="post-words">
              <h2 class="h2"><a :href="post.url">{{ post.title }}</a></h2>
              <p class="body">{{ post.description }}</p>
              <ul v-if="post.tags.length" class="tags" aria-label="Topics"><li v-for="tag in post.tags" :key="tag"><Pill>{{ tag }}</Pill></li></ul>
            </div>
          </article>
        </div>
        </template>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); }
.empty { margin-top: var(--s6); }
.filters { list-style: none; margin: var(--s5) 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--s2); }
.filters button { min-height: 36px; padding: 0 var(--s4); border: 1px solid var(--line-strong); border-radius: 999px; background: none; color: var(--fg-2); font: 500 var(--t-small)/1 var(--text); cursor: pointer; transition: background var(--d1) var(--ease), color var(--d1) var(--ease); }
.filters button:hover { color: var(--fg); }
.filters button.on { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.filters button:focus-visible { outline: 2px solid var(--accent-text); outline-offset: 2px; }
.feature { display: grid; gap: var(--s3); justify-items: start; margin-top: var(--s6); padding: var(--s6); border: 1px solid var(--line-strong); border-radius: var(--r1); background: var(--bg-1); }
.feature h2 a:hover { text-decoration: underline; text-underline-offset: 6px; text-decoration-color: var(--fg-3); }
.posts { margin-top: var(--s4); }
.post { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: var(--s6); padding: var(--s6) 0; border-bottom: 1px solid var(--line); }
.meta { display: grid; gap: var(--s1); padding-top: 6px; }
.post-words { display: grid; gap: var(--s3); justify-items: start; min-width: 0; }
.post-words h2 a:hover { text-decoration: underline; text-underline-offset: 6px; text-decoration-color: var(--fg-3); }
.tags { list-style: none; margin: var(--s1) 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--s2); }
@media (max-width: 760px) { .post { grid-template-columns: minmax(0, 1fr); gap: var(--s3); } .meta { display: flex; gap: var(--s4); padding: 0; } }
</style>
