<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
import { data as posts } from './blog.data'
import { formatDate } from './posts'
</script>

<template>
  <main class="blog-page">
    <header class="blog-intro blog-wrap">
      <p class="blog-eyebrow"><BrandIcon name="arrow" :size="16" /> THE BLOG</p>
      <h1>How SpawnLoft<br> <span>is made.</span></h1>
      <div class="intro-bottom">
        <p>Notes on building a Minecraft server app in the open:<br> how it works, how it looks, and why.</p>
        <a class="blog-link" href="/blog/feed.xml">RSS feed <BrandIcon name="arrow" :size="17" /></a>
      </div>
    </header>

    <section class="blog-posts" aria-label="Posts">
      <div class="blog-wrap">
        <p v-if="!posts.length" class="blog-empty">The first post is on its way.</p>
        <article v-for="post in posts" :key="post.url" class="post-row">
          <p class="post-meta"><time :datetime="post.date">{{ formatDate(post.date) }}</time><span>{{ post.minutes }} MIN READ</span></p>
          <div class="post-body">
            <h2><a :href="post.url">{{ post.title }}</a></h2>
            <p>{{ post.description }}</p>
            <ul v-if="post.tags.length" class="post-tags" aria-label="Topics"><li v-for="tag in post.tags" :key="tag">{{ tag }}</li></ul>
          </div>
          <a class="post-open" :href="post.url" :aria-label="`Read ${post.title}`"><BrandIcon name="arrow" :size="22" /></a>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.blog-page { background: #090d0d; color: #efeee6; font-family: var(--ui); }
.blog-wrap { max-width: 1200px; margin: 0 auto; padding-left: 40px; padding-right: 40px; }
.blog-intro { padding-top: 80px; padding-bottom: 64px; }
.blog-eyebrow { display: flex; gap: 10px; align-items: center; margin: 0 0 24px; font: 11px/1.7 var(--mono); letter-spacing: .12em; color: #c4f566; }
.blog-intro h1 { margin: 0 0 40px; font: 600 clamp(48px, 8vw, 104px)/.95 var(--display); letter-spacing: -.055em; text-wrap: balance; }
.blog-intro h1 span { color: #8a9a80; }
.intro-bottom { display: flex; align-items: flex-end; justify-content: space-between; gap: 32px; }
.intro-bottom p { margin: 0; max-width: 34rem; font-size: 17px; line-height: 1.7; color: #a0ab98; }
.blog-link { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; font: 600 13px var(--display); color: #c4f566; text-decoration: none; }
.blog-link:hover { text-decoration: underline; text-underline-offset: 5px; }

.blog-posts { background: #efeee6; color: #253022; padding: 24px 0 96px; }
.blog-empty { margin: 48px 0; font-size: 17px; color: #58634f; }
.post-row { display: grid; grid-template-columns: 220px minmax(0, 1fr) 48px; gap: 40px; align-items: start; padding: 44px 0; border-bottom: 1px solid #c3ccb7; }
.post-meta { display: flex; flex-direction: column; gap: 10px; margin: 6px 0 0; font: 11px/1.4 var(--mono); letter-spacing: .1em; color: #58634f; text-transform: uppercase; }
.post-meta span { color: #707b66; }
.post-body { min-width: 0; }
.post-body h2 { margin: 0 0 14px; font: 600 clamp(28px, 3.4vw, 42px)/1.08 var(--display); letter-spacing: -.04em; text-wrap: balance; }
.post-body h2 a { color: #182113; text-decoration: none; }
.post-body h2 a:hover { text-decoration: underline; text-underline-offset: 6px; text-decoration-color: #3d641f; }
.post-body > p { margin: 0 0 20px; max-width: 40rem; font-size: 16px; line-height: 1.75; color: #4a5642; }
.post-tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.post-tags li { padding: 4px 9px; border: 1px solid #b3bea5; font: 11px/1.4 var(--mono); letter-spacing: .08em; color: #3d641f; text-transform: uppercase; }
.post-open { display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid #b3bea5; color: #253022; transition: background .15s, color .15s; }
.post-open:hover { background: #c4f566; border-color: #a4c776; color: #15220c; }
.blog-page a:focus-visible { outline: 2px solid #80a245; outline-offset: 4px; }

@media (max-width: 900px) {
  .post-row { grid-template-columns: 160px minmax(0, 1fr) 48px; gap: 28px; }
}
@media (max-width: 650px) {
  .blog-wrap { padding-left: 24px; padding-right: 24px; }
  .blog-intro { padding-top: 48px; padding-bottom: 40px; }
  .intro-bottom { display: block; }
  .intro-bottom p { margin-bottom: 22px; font-size: 15px; }
  .intro-bottom p br { display: none; }
  .post-row { grid-template-columns: minmax(0, 1fr); gap: 16px; padding: 32px 0; }
  .post-meta { flex-direction: row; flex-wrap: wrap; gap: 16px; margin: 0; }
  .post-open { display: none; }
}
@media (prefers-reduced-motion: reduce) { .post-open { transition: none; } }
</style>
