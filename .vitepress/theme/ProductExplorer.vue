<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import BrandIcon from './BrandIcon.vue'
const active = ref(0)
const zoomed = ref(false)
const tabs = [
  { name:'Command', icon:'terminal', image:'console', kicker:'01 / THE CONTROL ROOM', title:'Less terminal.\nMore control.', text:'Start, stop, and understand your server from one place. Follow the console, find the errors that matter, and send commands without losing the conversation.', tags:['Live console','Search & filters','Server status'] },
  { name:'Customize', icon:'plugins', image:'plugins', kicker:'02 / MAKE IT YOURS', title:'Your server.\nYour kind of different.', text:'Search Modrinth and Hangar together. Find compatible plugins, install them, and check for updates—all from the same window.', tags:['Modrinth + Hangar','Version checks','Snapshots before updates'] },
  { name:'Protect', icon:'backup', image:'backups', kicker:'03 / KEEP THE GOOD STUFF', title:'Go a little wild.\nKeep a way back.', text:'Snapshot your worlds, plugins, and config. Schedule backups and verify they can be read back. Experiment with a little more confidence.', tags:['Scheduled backups','Integrity checks','Restore snapshots'] },
  { name:'Understand', icon:'bolt', image:'performance', kicker:'04 / KNOW YOUR WORLD', title:'See the signal.\nSkip the guesswork.', text:'Follow CPU and memory over time. When a server crashes, SpawnLoft can recognize common causes and point you toward a fix.', tags:['Performance history','Crash diagnosis','Optional auto-restart'] },
]
function select(index: number) { active.value = index; zoomed.value = false }
function keys(event: KeyboardEvent) {
  let next = active.value
  if(event.key==='ArrowRight') next=(next+1)%tabs.length
  else if(event.key==='ArrowLeft') next=(next+tabs.length-1)%tabs.length
  else if(event.key==='Home') next=0
  else if(event.key==='End') next=tabs.length-1
  else return
  event.preventDefault(); select(next)
  document.getElementById(`product-tab-${next}`)?.focus()
}
function escape(event: KeyboardEvent) { if(event.key==='Escape') zoomed.value=false }
onMounted(()=>window.addEventListener('keydown',escape))
onBeforeUnmount(()=>window.removeEventListener('keydown',escape))
</script>
<template>
  <section id="product" class="product-explorer">
    <div class="section-heading"><span class="eyebrow">MEET YOUR NEW CONTROL ROOM</span><h2>Big world.<br> <span>Small learning curve.</span></h2><p>The tools behind a great server,<br> finally in the same place.</p></div>
    <div class="product-tabs" role="tablist" aria-label="Explore SpawnLoft features" @keydown="keys">
      <button v-for="(tab,i) in tabs" :id="`product-tab-${i}`" :key="tab.image" role="tab" :aria-selected="active===i" :aria-controls="`product-panel-${i}`" :tabindex="active===i ? 0 : -1" @click="select(i)"><BrandIcon :name="tab.icon" :size="21" /><span>{{ tab.name }}</span><small>0{{i+1}}</small></button>
    </div>
    <div v-for="(tab,i) in tabs" v-show="active===i" :id="`product-panel-${i}`" :key="tab.image" role="tabpanel" tabindex="0" :aria-labelledby="`product-tab-${i}`" class="product-panel" :class="{ zoomed }">
      <div class="product-copy"><span class="eyebrow">{{tab.kicker}}</span><h3>{{tab.title}}</h3><p>{{tab.text}}</p><ul><li v-for="tag in tab.tags" :key="tag"><BrandIcon name="check" :size="15" />{{tag}}</li></ul><a href="/guide/panel">Meet the whole panel <BrandIcon name="arrow" :size="16" /></a></div>
      <div class="app-display">
        <div class="app-chrome"><span><i></i><i></i><i></i></span><span>SPAWNLOFT / {{tab.image.toUpperCase()}}</span><button @click="zoomed=!zoomed" :aria-pressed="zoomed" :aria-label="zoomed ? 'Show full screenshot' : 'Zoom into screenshot'">{{zoomed ? '−' : '+'}} <span>{{zoomed ? 'RESET' : 'CLOSER LOOK'}}</span></button></div>
        <div class="capture-crop"><img :src="`/img/tabs/${tab.image}.webp`" :alt="`Actual SpawnLoft ${tab.image} panel screenshot`" width="2558" height="1392" loading="lazy" decoding="async"></div>
        <div class="capture-caption"><a :href="`/img/tabs/${tab.image}.webp`" target="_blank" rel="noopener">OPEN FULL CAPTURE ↗</a><span><i></i> RUNS ON YOUR PC</span></div>
      </div>
    </div>
  </section>
</template>
<style scoped>
.product-explorer { background:var(--sl-paper); color:var(--sl-ink); padding:100px 5vw 90px; scroll-margin-top:72px; }
.section-heading { display:grid; grid-template-columns:1fr 1fr; align-items:end; gap:20px; margin-bottom:50px; }
.section-heading .eyebrow { grid-column:1/-1; }.eyebrow { font:10px var(--mono); letter-spacing:.12em; }
h2 { font:600 clamp(40px,5.3vw,80px)/.98 var(--display); letter-spacing:-.06em; margin:0; }h2 span { color:#6f746c; }
.section-heading p { justify-self:end; font-size:17px; line-height:1.6; margin:0 20px 3px 0; color:#64685f; }
.product-tabs { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); border-top:1px solid #c4c8bc; border-bottom:1px solid #c4c8bc; }
.product-tabs button { display:flex; align-items:center; gap:15px; padding:23px 20px; font:600 15px var(--ui); border:0; border-right:1px solid #c4c8bc; cursor:pointer; position:relative; transition:background .18s; }
.product-tabs button:last-child { border-right:0; }.product-tabs button[aria-selected=true] { background:var(--sl-ink); color:var(--sl-lime); }.product-tabs button:hover:not([aria-selected=true]) { background:#dce1d4; }
.product-tabs small { margin-left:auto; font:9px var(--mono); opacity:.6; }
.product-panel { display:grid; grid-template-columns:.8fr 1.7fr; gap:55px; padding-top:46px; align-items:center; animation:panel-arrive .3s cubic-bezier(.2,.7,.2,1); }
@keyframes panel-arrive { from { opacity:.25; transform:translateY(16px); } to { opacity:1; transform:none; } }
.product-copy h3 { white-space:pre-line; font:600 clamp(26px,2.5vw,38px)/1.04 var(--display); letter-spacing:-.045em; margin:24px 0; }
.product-copy p { font-size:14px; line-height:1.8; color:#5a6056; max-width:335px; margin:0; }
.product-copy ul { padding:0; list-style:none; margin:26px 0; }.product-copy li { display:flex; gap:10px; align-items:center; font-size:12px; margin:12px 0; }
.product-copy a { display:inline-flex; align-items:center; gap:16px; font-size:12px; color:var(--sl-ink); border-bottom:1px solid #89917b; padding-bottom:6px; }
.app-display { min-width:0; background:#121620; border:1px solid #46513e; box-shadow:0 25px 50px #111a1120; transform:perspective(1600px) rotateY(-5deg) rotateX(3deg); transition:transform .25s; }
.app-display:hover,.zoomed .app-display { transform:none; }.app-chrome { height:36px; display:flex; justify-content:space-between; align-items:center; padding:0 12px; color:#adb5a6; font:8px var(--mono); border-bottom:1px solid #2b323a; }
.app-chrome>span:first-child { display:flex; gap:5px; }.app-chrome i { display:block; width:5px; height:5px; border-radius:50%; background:#626d61; }
.app-chrome button { display:flex; align-items:center; gap:7px; padding:4px; min-width:40px; min-height:32px; color:var(--sl-lime); font-size:17px; cursor:pointer; }.app-chrome button span { font:8px var(--mono); }
.capture-crop { overflow:hidden; aspect-ratio:2558/1392; }.capture-crop img { display:block; width:100%; height:100%; object-fit:cover; transition:transform .3s cubic-bezier(.2,.7,.2,1); transform-origin:65% 50%; }.zoomed .capture-crop img { transform:scale(1.6); }
.capture-caption { display:flex; justify-content:space-between; padding:11px 12px; color:#94a08b; font:8px var(--mono); }.capture-caption i { display:inline-block; width:4px; height:4px; background:var(--sl-lime); border-radius:50%; margin-right:5px; }
@media(max-width:850px) { .product-panel { grid-template-columns:1fr; gap:30px; }.product-copy { display:grid; grid-template-columns:1fr 1fr; gap:0 30px; }.product-copy>.eyebrow,.product-copy>a { grid-column:1/-1; }.product-copy h3 { margin:20px 0; }.product-copy p { margin-top:20px; }.product-copy ul { grid-column:1/-1; display:flex; gap:25px; flex-wrap:wrap; margin:8px 0 20px; }.app-display { transform:none; } }
@media(max-width:600px) { .product-explorer { padding:60px 22px; }.section-heading { grid-template-columns:1fr; margin-bottom:30px; }.section-heading p { justify-self:start; font-size:14px; }.section-heading p br { display:none; }.product-tabs button { padding:12px 4px; gap:5px; flex-direction:column; justify-content:center; font-size:10px; }.product-tabs small { display:none; }.product-tabs svg { width:17px; }.product-copy { display:block; }.product-copy ul { display:block; }.product-copy p { max-width:none; }.app-chrome>span:nth-child(2) { font-size:7px; }.app-chrome button span { display:none; } }
@media(prefers-reduced-motion:reduce) { .product-panel { animation:none; }.app-display,.capture-crop img { transition:none; transform:none; } }
</style>

