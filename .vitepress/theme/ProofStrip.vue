<script setup lang="ts">
import { computed } from 'vue'
import { data } from './proof.data'
import BrandIcon from './BrandIcon.vue'

// Only figures the repository can back up. Popularity numbers stay out until they say something:
// stars and downloads take the fourth cell once they clear a floor, and until then it states what
// the app costs instead of showing a small number.
const STAR_FLOOR = 25, DOWNLOAD_FLOOR = 1000
const commits = computed(() => `${Math.floor(data.commits / 50) * 50}+`)
// Spelled out rather than toLocaleDateString: the build machine and the browser can disagree on "Sep" and "Sept".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const shipped = computed(() => { const day = new Date(data.latestDate); return `${day.getUTCDate()} ${MONTHS[day.getUTCMonth()]}` })
const fourth = computed(() =>
  data.stars >= STAR_FLOOR ? { value: String(data.stars), label: 'GitHub stars', note: 'Watch the project grow, or join it.' }
  : data.downloads >= DOWNLOAD_FLOOR ? { value: `${Math.floor(data.downloads / 100) * 100}+`, label: 'installs and counting', note: 'Counted from the release downloads on GitHub.' }
  : { value: '$0', label: 'free, no account', note: 'MIT licensed. Nothing to sign up for.' })
</script>

<template>
  <section class="proof" aria-labelledby="proof-title">
    <div class="proof-head"><span class="proof-eyebrow">BUILT IN THE OPEN</span><h2 id="proof-title">Not a weekend project.</h2></div>
    <dl class="proof-grid">
      <div><dt>Commits in the open</dt><dd class="num">{{ commits }}</dd><dd class="note">Every line of SpawnLoft is on GitHub for anyone to read.</dd></div>
      <div><dt>Releases shipped</dt><dd class="num">{{ data.releases }}</dd><dd class="note">The latest, {{ data.latest }}, went out on {{ shipped }}. <a href="/changelog">Read the changelog</a></dd></div>
      <div><dt>Platforms</dt><dd class="num">3</dd><dd class="note">Windows, macOS and Linux. Each release is built and smoke-tested on all of them before it ships.</dd></div>
      <div><dt>{{ fourth.label }}</dt><dd class="num">{{ fourth.value }}</dd><dd class="note">{{ fourth.note }}</dd></div>
    </dl>
    <a class="proof-link" href="https://github.com/joogiebear/spawnloft"><BrandIcon name="github" :size="16" /> See it on GitHub <BrandIcon name="arrow" :size="14" /></a>
  </section>
</template>

<style scoped>
.proof { background:#0e150d; border-top:1px solid #c4f56622; padding:70px 5vw 60px; color:#efeee6; }
.proof-eyebrow { font:11px var(--mono); letter-spacing:.14em; color:#91a380; }
.proof-head h2 { font:600 clamp(34px,4.2vw,58px)/1.02 var(--display); letter-spacing:-.05em; margin:18px 0 0; }
.proof-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:0; margin:48px 0 32px; }
.proof-grid>div { padding:0 32px 0 0; margin-right:32px; border-right:1px solid #9bb38524; }
.proof-grid>div:last-child { border:0; margin:0; padding:0; }
.proof-grid dt { font:11px var(--mono); letter-spacing:.1em; color:#93a085; text-transform:uppercase; order:1; }
.proof-grid>div { display:flex; flex-direction:column; }
.proof-grid .num { margin:12px 0 10px; font:600 clamp(46px,5.2vw,78px)/1 var(--display); letter-spacing:-.05em; color:var(--sl-lime,#c4f566); order:2; }
.proof-grid .note { margin:0; font-size:13px; line-height:1.7; color:#a9b59d; max-width:270px; order:3; }
.proof-grid .note a { color:#efeee6; border-bottom:1px solid #8ea07e; white-space:nowrap; }
.proof-grid .note a:hover { color:var(--sl-lime,#c4f566); }
.proof-link { display:inline-flex; align-items:center; gap:12px; font-size:12px; color:var(--sl-lime,#c4f566); border-bottom:1px solid #6f8a3f; padding-bottom:5px; }
@media(max-width:850px) { .proof-grid { grid-template-columns:1fr 1fr; gap:38px 0; } .proof-grid>div:nth-child(2) { border:0; margin:0; padding:0; } .proof-grid>div:nth-child(odd) { padding-right:24px; } }
@media(max-width:560px) { .proof { padding:50px 22px 44px; } .proof-grid { grid-template-columns:1fr; gap:0; margin:32px 0 26px; } .proof-grid>div,.proof-grid>div:nth-child(odd) { padding:0 0 26px; margin:0 0 26px; border:0; border-bottom:1px solid #9bb38524; } .proof-grid>div:last-child { border:0; padding:0; margin:0; } .proof-grid .note { margin:0; max-width:none; } }
</style>
