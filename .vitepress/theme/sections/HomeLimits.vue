<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import SectionHead from '../components/SectionHead.vue'

// On paper, not a lime band. A page that only says yes is one people stop believing.
const limits = [
  { title: 'It does not open your network.', body: 'Friends on your own network connect to your local address. Anyone further away needs a port forward or a tunnel that you choose to set up.', link: ['What stays local', '/guide/security'] },
  { title: 'It does not supply Java.', body: 'Minecraft servers are Java programs. SpawnLoft finds the Java you have, tells you when it is missing or too old, and links the version you need.', link: ['Which Java you need', '/download#java'] },
  { title: 'It needs your computer on.', body: 'Asleep or shut down means offline. If you want a world that is up while you are not, a host is the right answer, and the comparison says so.', link: ['Where other tools fit', '/guide/compare'] },
]
</script>

<template>
  <section class="section paper" id="limits">
    <div class="wrap">
      <SectionHead eyebrow="Worth knowing before you download" title="Three things it does not do.">
        <template #aside><p class="lede aside">A page that only says yes is one people stop believing.</p></template>
      </SectionHead>
      <div class="limits">
        <article v-for="limit in limits" :key="limit.title" v-reveal>
          <h3 class="h3">{{ limit.title }}</h3>
          <p class="body">{{ limit.body }}</p>
          <ArrowLink :href="limit.link[1]">{{ limit.link[0] }}</ArrowLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aside { max-width: 24em; font-size: var(--t-body); }
.limits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s7) var(--s6); margin-top: var(--s7); }
.limits article { display: grid; gap: var(--s3); align-content: start; padding-top: var(--s5); border-top: 1px solid var(--line-strong); }
@media (max-width: 900px) { .limits { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
</style>
