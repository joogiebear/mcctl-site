<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Figure from '../components/Figure.vue'
import SectionHead from '../components/SectionHead.vue'

// Three statements with a real crop each. Hairline tops, no cards, no numbers.
const points = [
  { title: 'The console stays in front of you.', body: 'Start, stop and read the server in one place. Filter to warnings, search the log, send a command without losing your place. When it crashes, the cause is named in plain language.', link: ['The panel', '#tour'], img: 'console', alt: 'The console with level filters and a command field.', crop: 'c1' },
  { title: 'Backups that prove they restore.', body: 'Snapshots on a schedule, read back and checked after they are written. Restore a world, the plugins or a single config to a point you choose. One is taken before every update.', link: ['How backups work', '/guide/backups'], img: 'backups', alt: 'The backups list with verified snapshots.', crop: 'c2' },
  { title: 'Plugins without the hunt.', body: 'Modrinth and Hangar searched in the same field, filtered to what your server can load. Update checks across everything installed, with a snapshot first.', link: ['Plugins and mods', '/guide/plugins'], img: 'plugins', alt: 'Plugin search results from Modrinth and Hangar.', crop: 'c3' },
]
</script>

<template>
  <section class="section" id="why">
    <div class="wrap">
      <SectionHead eyebrow="Local by design" title="Your world lives on your disk. The app just looks after it.">
        <template #aside><p class="lede aside">Nothing is uploaded, no account is created, and nothing opens your machine to the internet unless you decide to.</p></template>
      </SectionHead>
      <div class="three">
        <article v-for="point in points" :key="point.img" v-reveal>
          <h3 class="h3">{{ point.title }}</h3>
          <p class="body">{{ point.body }}</p>
          <ArrowLink :href="point.link[1]">{{ point.link[0] }}</ArrowLink>
          <Figure>
            <div class="crop" :class="point.crop">
              <picture>
                <source type="image/avif" :srcset="`/img/tabs/${point.img}-1280.avif`" />
                <img :src="`/img/tabs/${point.img}-1280.webp`" :alt="point.alt" width="1280" height="697" loading="lazy" decoding="async" />
              </picture>
            </div>
          </Figure>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aside { max-width: 26em; font-size: var(--t-body); }
.three { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s7) var(--s6); margin-top: var(--s7); }
.three article { display: grid; gap: var(--s4); align-content: start; padding-top: var(--s5); border-top: 1px solid var(--line-strong); }
.three .h3 { font-size: var(--t-h3); }
.three .figure { margin-top: var(--s2); }
.crop { aspect-ratio: 16 / 9; overflow: hidden; }
.crop img { display: block; width: 160%; max-width: none; height: auto; }
.crop.c2 img { transform: translate(-30%, -8%); }
.crop.c3 img { transform: translate(-38%, -55%); }
@media (max-width: 900px) { .three { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
</style>
