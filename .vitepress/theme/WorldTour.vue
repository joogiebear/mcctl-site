<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue'
import IslandScene from './IslandScene.vue'
const root = ref<HTMLElement>(), progress = ref(0), active = ref(0), enhanced = ref(false)
let cleanup = () => {}, stopped = false
const steps = [
  { id:'console', number:'01', label:'Bring it online', title:'A world of your own.\nOne Start button.', text:'Pick your server, press Start, and watch it come to life. Your console, players, and server status stay together in one window.', detail:'Paper · Fabric · NeoForge · and more', link:'/guide/getting-started', action:'Create your first server' },
  { id:'plugins', number:'02', label:'Make it yours', title:'Small additions.\nEndless possibilities.', text:'Find plugins on Modrinth and Hangar, right inside SpawnLoft. Install a compatible build and make your server feel like home.', detail:'Search together. Check compatibility. Install.', link:'/guide/panel', action:'Explore the panel' },
  { id:'backups', number:'03', label:'Keep it safe', title:'Big adventures.\nA way back.', text:'Keep a snapshot of your worlds, plugins, and config. Schedule backups and verify that they can be read back, before you need them.', detail:'Your world. Your backups. Your disk.', link:'/guide/panel', action:'See how backups work' },
]
onMounted(async () => {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  if (stopped) return
  gsap.registerPlugin(ScrollTrigger)
  const mm = gsap.matchMedia()
  mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
    enhanced.value = true
    const trigger = ScrollTrigger.create({ trigger:root.value, start:'top top+=64', end:'bottom bottom', onUpdate:self => { progress.value=self.progress; active.value=Math.min(2,Math.floor(self.progress*3)) } })
    nextTick(() => { if (!stopped) trigger.refresh() })
    return () => { trigger.kill(); enhanced.value=false }
  })
  cleanup = () => mm.revert()
})
onBeforeUnmount(() => { stopped=true; cleanup() })
</script>
<template>
  <section id="tour" ref="root" class="world-tour" :class="{ enhanced }" aria-label="Explore SpawnLoft">
    <div class="tour-sticky">
      <div class="tour-top"><span>YOUR WORLD, UNDER YOUR CONTROL</span><span class="tour-count">0{{ active + 1 }} / 03</span></div>
      <div class="tour-content">
        <div class="chapters">
          <article v-for="(step,i) in steps" :key="step.id" class="chapter" :class="{ active:active===i }" :inert="enhanced && active!==i ? true : undefined">
            <span class="eyebrow">{{ step.number }} — {{ step.label }}</span>
            <h2>{{ step.title }}</h2><p>{{ step.text }}</p><div class="detail">{{ step.detail }}</div>
            <a :href="step.link">{{ step.action }} <span aria-hidden="true">↗</span></a>
            <img class="mobile-panel" :src="`/img/tabs/${step.id}.png`" :alt="`SpawnLoft ${step.id} panel`" width="2558" height="1392" loading="lazy">
          </article>
        </div>
        <div v-if="enhanced" class="visual-stage" aria-hidden="true">
          <div class="tour-island"><IslandScene compact :progress="progress" /></div>
          <div class="panel-stack">
            <div v-for="(step,i) in steps" :key="step.id" class="app-panel" :class="{ current:active===i, passed:active>i }" :style="{ '--depth':i-active }">
              <div class="panel-bar"><span class="window-dots">● ● ●</span><span>spawnloft / {{ step.id }}</span><span class="panel-live">● LOCAL</span></div>
              <img :src="`/img/tabs/${step.id}.png`" alt="" width="2558" height="1392" loading="lazy" decoding="async">
            </div>
          </div>
          <span class="capture-note">The real app. Running on your machine.</span>
        </div>
      </div>
      <div class="tour-bottom"><span>SCROLL TO EXPLORE ↓</span><div class="progress-track"><i :style="{ transform:`scaleX(${progress})` }" /></div><span>BUILT FOR YOUR NEXT ADVENTURE</span></div>
    </div>
  </section>
</template>
<style scoped>
.world-tour { position:relative; border-top:1px solid var(--line); background:#0c1017; }
.tour-sticky { max-width:1440px; padding:42px 6vw; margin:auto; }
.tour-top,.tour-bottom { display:flex; justify-content:space-between; align-items:center; gap:24px; font:10px var(--mono); letter-spacing:.12em; color:var(--ink-2); }
.tour-count { color:var(--lapis); }.tour-content { position:relative; }.chapter { padding:50px 0; }
.eyebrow { color:#91abff; text-transform:uppercase; font:11px var(--mono); letter-spacing:.13em; }
.chapter h2 { white-space:pre-line; font:600 clamp(34px,3.3vw,49px)/1.09 var(--display); letter-spacing:-.04em; margin:22px 0; }
.chapter p { max-width:370px; color:var(--ink-2); font-size:16px; line-height:1.8; }
.detail { border-left:2px solid #6689ef; padding-left:14px; color:#bdc8df; font:11px/1.7 var(--mono); margin:28px 0; }
.chapter a { font-size:13px; color:var(--ink); text-decoration:none; border-bottom:1px solid #4c5a78; padding-bottom:7px; }
.chapter a span { margin-left:16px; color:var(--lapis); }.chapter a:hover { color:#a9bfff; }
.mobile-panel { margin-top:32px; border:1px solid var(--edge); border-radius:8px; width:100%; }
.visual-stage,.tour-bottom { display:none; }.enhanced { height:330vh; }
.enhanced .tour-sticky { height:calc(100svh - 64px); position:sticky; top:64px; display:flex; flex-direction:column; }
.enhanced .tour-content { flex:1; display:grid; grid-template-columns:.85fr 1.3fr; gap:45px; align-items:center; }
.enhanced .chapters { position:relative; height:360px; }
.enhanced .chapter { position:absolute; inset:0; padding:0; opacity:0; transform:translateY(24px); transition:opacity .45s,transform .65s; pointer-events:none; }
.enhanced .chapter.active { opacity:1; transform:none; pointer-events:auto; }.enhanced .mobile-panel { display:none; }
.enhanced .visual-stage { display:block; position:relative; height:100%; min-height:0; perspective:1400px; }
.tour-island { position:absolute; top:-32px; right:0; width:70%; height:48%; opacity:.95; }
.panel-stack { position:absolute; width:min(100%,calc((100svh - 290px)*1.4)); right:0; top:35%; transform-style:preserve-3d; }
.app-panel { position:absolute; inset:0 0 auto; background:#151a27; border:1px solid #45516c; border-radius:9px; overflow:hidden; box-shadow:0 35px 65px #0007; transform:translate3d(calc(var(--depth)*18px),calc(var(--depth)*-30px),calc(var(--depth)*-65px)) rotateY(-10deg) rotateX(7deg); opacity:.30; transition:transform .85s cubic-bezier(.2,.7,.2,1),opacity .55s; }
.app-panel.current { transform:translateZ(40px) rotateY(-4deg) rotateX(2deg); opacity:1; z-index:3; }
.app-panel.passed { transform:translate3d(-30px,-85px,-160px) rotateY(-15deg); opacity:0; pointer-events:none; }
.app-panel img { display:block; width:100%; height:auto; }
.panel-bar { height:30px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; font:9px var(--mono); color:#9ba7bd; background:#181e2b; border-bottom:1px solid #2b354a; }
.window-dots { font-size:8px; letter-spacing:3px; color:#596579; }.panel-live { color:#9abbac; font-size:8px; }
.capture-note { position:absolute; bottom:0; right:0; font:10px var(--mono); color:#78859e; }
.enhanced .tour-bottom { display:flex; margin-top:24px; font-size:9px; }.progress-track { height:1px; background:#2b3446; flex:1; }
.progress-track i { display:block; width:100%; height:1px; background:#8aabff; transform-origin:left; }
@media(max-width:600px) { .tour-sticky { padding:30px 24px; }.tour-top { font-size:9px; }.chapter h2 { font-size:36px; } }
</style>
