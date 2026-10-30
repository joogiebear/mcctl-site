<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Pill from '../components/Pill.vue'
import SectionHead from '../components/SectionHead.vue'
import { data as posts } from '../blog.data'
import { formatDate } from '../posts'
// The index: a head and a plain list of posts, newest first. Posts themselves read in the docs shell.
</script>

<template>
  <main class="blog-page">
    <section class="section top">
      <div class="wrap">
        <SectionHead level="h1" eyebrow="Blog" title="How SpawnLoft is made." lede="Notes on building a Minecraft server app in the open: how it works, how it looks, and the decisions behind both.">
          <template #aside><ArrowLink href="/blog/feed.xml">RSS feed</ArrowLink></template>
        </SectionHead>
        <p v-if="!posts.length" class="body empty">The first post is on its way.</p>
        <div v-else class="posts">
          <article v-for="post in posts" :key="post.url" class="post">
            <p class="meta small mono"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span>{{ post.minutes }} min read</span></p>
            <div class="post-words">
              <h2 class="h2"><a :href="post.url">{{ post.title }}</a></h2>
              <p class="body">{{ post.description }}</p>
              <ul v-if="post.tags.length" class="tags" aria-label="Topics"><li v-for="tag in post.tags" :key="tag"><Pill>{{ tag }}</Pill></li></ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); }
.empty { margin-top: var(--s6); }
.posts { margin-top: var(--s4); }
.post { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: var(--s6); padding: var(--s6) 0; border-bottom: 1px solid var(--line); }
.meta { display: grid; gap: var(--s1); padding-top: 6px; }
.post-words { display: grid; gap: var(--s3); justify-items: start; min-width: 0; }
.post-words h2 a:hover { text-decoration: underline; text-underline-offset: 6px; text-decoration-color: var(--accent); }
.tags { list-style: none; margin: var(--s1) 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--s2); }
@media (max-width: 760px) { .post { grid-template-columns: minmax(0, 1fr); gap: var(--s3); } .meta { display: flex; gap: var(--s4); padding: 0; } }
</style>
