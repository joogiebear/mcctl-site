<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Download from './Download.vue'
import BrandIcon from './BrandIcon.vue'
import WorldScene from './WorldScene.vue'
import PortalScene from './PortalScene.vue'
import ProductExplorer from './ProductExplorer.vue'
const hero = ref<HTMLElement>(), inside = ref<HTMLElement>()
const heroProgress = ref(0), insideProgress = ref(0), menu = ref(false), reduced = ref(false)
const layer = computed(()=>insideProgress.value<.30 ? 0 : insideProgress.value<.67 ? 1 : 2)
const layers = [
  { icon:'world', title:'Create your corner.', text:'A fresh world, a favorite modpack, or the server you already have. Give it a home.', caption:'WORLD LAYER / YOUR NEXT ADVENTURE' },
  { icon:'plugins', title:'Make it unmistakably yours.', text:'Add the plugins and mods that make your world feel different. Keep everything in reach.', caption:'CUSTOMIZATION / BUILT AROUND YOUR IDEAS' },
  { icon:'shield', title:'Keep the story going.', text:'Backups, scheduled restarts, and crash recovery. The quiet work behind a world that lasts.', caption:'SERVER CORE / LOOKING AFTER THE DETAILS' },
]
const questions = [
  { q:'What exactly is SpawnLoft?', a:'A desktop app for running Minecraft Java Edition servers on your own Windows PC or Mac. It brings server controls, plugins, worlds, backups, and more into one place.' },
  { q:'Can I bring my existing server?', a:'Yes. Point SpawnLoft at the server folder you already use. It adds the server in place without moving your world or rewriting its files.' },
  { q:'Can my friends join?', a:'Friends on your home network can use your local address. Friends elsewhere need a port forward or a tunnel you choose to set up. SpawnLoft does not automatically open your machine to the internet.', link:'/guide/security', label:'Read the connection and security guide' },
  { q:'What do I need to get started?', a:'Windows 10 or 11, or macOS 13+, Java, and enough memory for the server you want to run. The app checks for Java and helps you find the right version. Current Minecraft needs Java 25.', link:'/guide/getting-started', label:'See the setup guide' },
  { q:'What about Mac and Linux?', a:'SpawnLoft 1.0 is available for Windows, Apple Silicon and Intel Mac, with signed installers and automatic updates. Linux is coming soon.', link:'/guide/getting-started', label:'Choose your download' },
  { q:'Is the desktop app free?', a:'The current desktop app is a free download and open source under the MIT license. You can get started without creating an account.' },
]
let stop = ()=>{}
let stopPortalTrip = ()=>{}
function enterPortal(event: MouseEvent) {
  if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button!==0) return
  const product=document.getElementById('product')
  if(!hero.value || !product) return
  event.preventDefault()
  event.stopPropagation()
  stopPortalTrip()
  const headerHeight=innerWidth<=600 ? 64 : 72
  const productTop=product.getBoundingClientRect().top+scrollY-headerHeight
  const arrive=()=>{
    if(location.hash!=='#product') history.pushState(history.state,'','#product')
    product.setAttribute('tabindex','-1')
    product.focus({preventScroll:true})
  }
  if(reduced.value) {
    window.scrollTo({top:productTop,behavior:'instant'})
    arrive()
    return
  }
  const start=scrollY
  const portalEnd=hero.value.getBoundingClientRect().bottom+scrollY-innerHeight
  const through=Math.max(start,portalEnd)
  const passageDuration=through>start ? Math.max(500,1450*(1-heroProgress.value)) : 0
  const departureDuration=650
  const started=performance.now()
  let frame=0
  const cancel=()=>{
    cancelAnimationFrame(frame)
    for(const type of ['wheel','touchstart','pointerdown','keydown','resize']) window.removeEventListener(type,cancel)
    document.removeEventListener('visibilitychange',cancel)
    stopPortalTrip=()=>{}
  }
  // Real page scrolling drives the existing camera. Finish the passage while
  // the hero is pinned, then carry the visitor into the app section.
  const ease=(t:number)=>t*t*(3-2*t)
  const tick=(now:number)=>{
    const elapsed=now-started
    const passing=elapsed<passageDuration
    const fraction=Math.min(1,passing ? elapsed/passageDuration : (elapsed-passageDuration)/departureDuration)
    const from=passing ? start : through
    const to=passing ? through : productTop
    window.scrollTo({top:from+(to-from)*ease(fraction),behavior:'instant'})
    if(!passing && fraction===1) { cancel(); arrive() }
    else frame=requestAnimationFrame(tick)
  }
  for(const type of ['wheel','touchstart','pointerdown','keydown','resize']) window.addEventListener(type,cancel,{passive:true})
  document.addEventListener('visibilitychange',cancel)
  stopPortalTrip=cancel
  frame=requestAnimationFrame(tick)
}
function focusLayer(index:number) {
  if(window.innerWidth<851 || reduced.value) { insideProgress.value=index/2; return }
  const el=inside.value!; const top=el.getBoundingClientRect().top+window.scrollY-72
  const distance=el.offsetHeight-(window.innerHeight-72)
  window.scrollTo({top:top+distance*(index===0 ? .05 : index===1 ? .47 : .92),behavior:'smooth'})
}
onMounted(()=>{
  const media=window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced.value=media.matches
  let frame=0
  const clamp=(v:number)=>Math.max(0,Math.min(1,v))
  const update=()=>{
    frame=0
    const headerHeight=innerWidth<=600 ? 64 : 72
    if(hero.value) { const r=hero.value.getBoundingClientRect(); heroProgress.value=media.matches ? 0 : clamp((headerHeight-r.top)/Math.max(1,r.height-(innerHeight-headerHeight))) }
    if(inside.value && innerWidth>850 && !media.matches) { const r=inside.value.getBoundingClientRect(); insideProgress.value=clamp((72-r.top)/Math.max(1,r.height-(innerHeight-72))) }
  }
  const scroll=()=>{ if(!frame) frame=requestAnimationFrame(update) }
  const change=()=>{ stopPortalTrip(); reduced.value=media.matches; update() }
  const key=(event:KeyboardEvent)=>{ if(event.key==='Escape') menu.value=false }
  window.addEventListener('scroll',scroll,{passive:true}); window.addEventListener('resize',scroll); window.addEventListener('keydown',key); media.addEventListener('change',change)
  const observer=new IntersectionObserver(entries=>{for(const e of entries) if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}},{threshold:.12})
  document.querySelectorAll('.sl-reveal').forEach(el=>observer.observe(el))
  update()
  stop=()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);window.removeEventListener('keydown',key);media.removeEventListener('change',change);observer.disconnect()}
})
onBeforeUnmount(()=>{ stopPortalTrip(); stop() })
</script>
<template>
  <div class="showcase-site">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a href="/" class="site-logo" aria-label="SpawnLoft home"><BrandIcon name="mark" :size="31" /><span>spawnloft<span class="logo-period">.</span></span></a>
      <nav class="desktop-nav" aria-label="Main navigation"><a href="#product">The app</a><a href="#inside">The possibilities</a><a href="/guide/">Docs <BrandIcon name="arrow" :size="12" /></a></nav>
      <div class="header-actions"><a class="github-link" href="https://github.com/joogiebear/spawnloft" aria-label="SpawnLoft on GitHub"><BrandIcon name="github" :size="21" /></a><a class="header-download" href="#download">Get SpawnLoft <BrandIcon name="arrow" :size="15" /></a><button class="menu-toggle" @click="menu=!menu" :aria-expanded="menu" aria-controls="mobile-navigation" :aria-label="menu ? 'Close navigation' : 'Open navigation'"><BrandIcon :name="menu ? 'close' : 'menu'" /></button></div>
      <nav v-if="menu" id="mobile-navigation" class="mobile-nav" aria-label="Mobile navigation" @click="menu=false"><a href="#product">Explore the app</a><a href="#inside">The possibilities</a><a href="/guide/">Documentation</a><a href="#download">Get SpawnLoft</a></nav>
    </header>
    <main id="main">
      <section ref="hero" class="hero-journey" :style="{'--journey':heroProgress}">
        <div class="hero-screen">
          <div class="hero-topline"><span><i class="status-dot"></i> MINECRAFT SERVERS. PERSONALLY YOURS.</span><span>BUILT FOR WINDOWS / MADE FOR WORLDS</span></div>
          <h1 class="hero-wordmark">spawnloft<span aria-hidden="true">✳</span></h1>
          <div class="hero-halo" aria-hidden="true"></div>
          <div class="hero-world"><PortalScene :progress="heroProgress" /></div>
          <div class="world-coordinate" aria-hidden="true"><span>THE SPAWN GATE</span><span>A WAY INTO WHAT’S NEXT</span></div>
          <a href="#product" class="world-turn" @click="enterPortal"><BrandIcon name="arrow" :size="17" /> {{heroProgress < .7 ? 'STEP INSIDE' : 'EXPLORE THE APP'}}</a>
          <div class="hero-arrival" :class="{'is-visible':heroProgress>.72}" aria-hidden="true"><span class="eyebrow">WELCOME TO YOUR CONTROL ROOM</span><p>Your world.<br><span>Within reach.</span></p></div>
          <div class="hero-bottom">
            <div class="hero-promise"><span class="eyebrow">YOUR NEXT GREAT WORLD</span><h2 v-if="heroProgress<.55">Starts here.<br> Runs on your PC.</h2><h2 v-else>More playing.<br> Less maintaining.</h2></div>
            <div class="hero-convert"><p>Your Minecraft server. One control room.<br> Bring your people. Build something worth coming back to.</p><div class="hero-cta"><Download size="lg" /><a href="#product" class="round-link" aria-label="Explore the app"><BrandIcon name="arrow" :size="24" /></a></div><span class="download-note">FREE DESKTOP APP · NO ACCOUNT NEEDED</span></div>
          </div>
          <div class="hero-scroll"><span>SCROLL INTO YOUR NEXT ADVENTURE</span><span class="scroll-line"><i /></span><BrandIcon name="chevron" :size="14" /></div>
        </div>
      </section>
      <div class="compat-strip"><span>HOWEVER YOU PLAY.</span><div><span><BrandIcon name="cube" :size="18" /> Paper</span><span>Fabric</span><span>NeoForge</span><span>Modrinth</span><span>Hangar</span><a href="/reference/servers">And more <BrandIcon name="arrow" :size="14" /></a></div></div>
      <ProductExplorer />
      <section ref="inside" id="inside" class="inside-journey">
        <div class="inside-screen">
          <div class="inside-top"><span class="eyebrow">A WORLD OF POSSIBILITIES</span><span class="eyebrow">0{{layer+1}} / 03</span></div>
          <div class="inside-copy"><h2>Dream it.<br> Build it. <br> <span>Keep it yours.</span></h2><div class="layer-buttons"><button v-for="(item,i) in layers" :key="item.title" @click="focusLayer(i)" :aria-pressed="layer===i"><span class="layer-number">0{{i+1}}</span><BrandIcon :name="item.icon" :size="25" /><span class="layer-text"><strong>{{item.title}}</strong><span v-show="layer===i">{{item.text}}</span></span><BrandIcon name="arrow" :size="16" /></button></div></div>
          <div class="inside-world"><WorldScene mode="explore" :progress="insideProgress" /></div>
          <div class="inside-caption"><span class="status-dot"></span>{{layers[layer].caption}}</div>
          <div class="inside-progress"><i :style="{transform:`scaleX(${Math.max(.03,insideProgress)})`}" /></div>
        </div>
      </section>
      <section class="manifesto">
        <div class="manifesto-top sl-reveal"><BrandIcon name="mark" :size="55" /><span class="eyebrow">LESS IN THE WAY. MORE POSSIBLE.</span><h2>For the builders.<br> The tinkerers.<br> <span>The “one more block” people.</span></h2><p>You’ve already got the ideas. And the hardware.<br> We’re here to make the server part easier.</p></div>
        <div class="benefit-row">
          <article class="sl-reveal"><BrandIcon name="shield" :size="44" /><h3>Your world stays yours.</h3><p>Worlds, plugins, and backups live on your disk. Your machine, your files, your decisions.</p><a href="/guide/security">Local by design <BrandIcon name="arrow" :size="14" /></a></article>
          <article class="sl-reveal"><BrandIcon name="bolt" :size="44" /><h3>More uptime. Less upkeep.</h3><p>Scheduled backups. Planned restarts. Automatic recovery when things go sideways.</p><a href="/guide/panel">Meet the tools <BrandIcon name="arrow" :size="14" /></a></article>
          <article class="sl-reveal"><BrandIcon name="plugins" :size="44" /><h3>Room for your weird ideas.</h3><p>Try a new plugin. Import a map. Clone a server into a test world and see what happens.</p><a href="/reference/commands">Explore what’s possible <BrandIcon name="arrow" :size="14" /></a></article>
        </div>
      </section>
      <section class="launch-guide">
        <div class="launch-title sl-reveal"><span class="eyebrow">FROM “WHAT IF” TO WORLD</span><h2>Three steps.<br> <span>Then it’s your story.</span></h2><a href="/guide/getting-started">The getting started guide <BrandIcon name="arrow" :size="17" /></a></div>
        <ol><li class="sl-reveal"><span class="step-number">01</span><div><BrandIcon name="windows" :size="30" /><h3>Make yourself at home.</h3><p>Install SpawnLoft. It checks for Java and helps you get set up.</p></div></li><li class="sl-reveal"><span class="step-number">02</span><div><BrandIcon name="world" :size="30" /><h3>Pick your playground.</h3><p>Create a server, load a modpack, or bring the server you already run.</p></div></li><li class="sl-reveal"><span class="step-number">03</span><div><BrandIcon name="play" :size="30" /><h3>Press Start. Get building.</h3><p>Your world comes online. Keep the controls close and let the adventure happen.</p></div></li></ol>
      </section>
      <section class="faq-section"><div><span class="eyebrow">BEFORE YOU JUMP IN</span><h2>A few good<br> questions.</h2><a href="/guide/faq">All the answers <BrandIcon name="arrow" :size="15" /></a></div><div class="questions"><details v-for="question in questions" :key="question.q"><summary>{{question.q}}<BrandIcon name="chevron" :size="18" /></summary><p>{{question.a}}<a v-if="question.link" :href="question.link">{{question.label}} ↗</a></p></details></div></section>
      <section id="download" class="final-cta"><div class="cta-rings" aria-hidden="true"><span></span><span></span><span></span></div><BrandIcon name="mark" :size="48" /><span class="eyebrow">THE NEXT CHAPTER IS YOURS</span><h2>Let’s make<br> <span>something</span> great.</h2><p>Your world is waiting. Give it a place to start.</p><Download size="lg" fine /><a class="release-link" href="/changelog">See what’s new <BrandIcon name="arrow" :size="14" /></a></section>
    </main>
    <footer class="site-footer"><div class="footer-top"><a href="/" class="site-logo"><BrandIcon name="mark" :size="33" /><span>spawnloft.</span></a><p>A little control.<br> A whole world of possibilities.</p><nav aria-label="Footer navigation"><a href="/guide/">Documentation</a><a href="/changelog">Changelog</a><a href="https://github.com/joogiebear/spawnloft">GitHub ↗</a><a href="https://github.com/joogiebear/spawnloft/discussions">Community ↗</a></nav></div><div class="footer-bottom"><span>BUILT BY JOOGIEBEAR & CONTRIBUTORS · MIT LICENSED</span><span>NOT AN OFFICIAL MINECRAFT PRODUCT.</span><a href="#main">BACK TO TOP ↑</a></div></footer>
  </div>
</template>
<style scoped>
.showcase-site { --sl-ink:#090d0d; --sl-paper:#efeee6; --sl-lime:#c4f566; --sl-muted:#a0aba2; --display:'Bricolage Grotesque',sans-serif; --ui:'Bricolage Grotesque',system-ui,sans-serif; color:var(--sl-paper); background:var(--sl-ink); font:15px/1.55 var(--ui); overflow:clip; }
.showcase-site a { text-decoration:none; }.showcase-site button { font-family:inherit; }.showcase-site :deep(a:focus-visible),.showcase-site button:focus-visible,.showcase-site summary:focus-visible { outline:2px solid #8cac4c; outline-offset:6px; }
.skip-link { position:fixed; top:-60px; left:20px; z-index:100; background:var(--sl-lime); color:var(--sl-ink); padding:12px; }.skip-link:focus { top:10px; }
.site-header { height:72px; padding:0 4vw; display:flex; align-items:center; justify-content:space-between; position:fixed; top:0; width:100%; z-index:50; background:#090d0def; backdrop-filter:blur(16px); border-bottom:1px solid #d2e2c215; }
.site-logo { display:flex; align-items:center; gap:11px; color:var(--sl-paper); font:700 26px var(--display); letter-spacing:-.05em; }.site-logo svg { color:var(--sl-lime); }.logo-period { color:var(--sl-lime); }
.desktop-nav { display:flex; gap:32px; }.desktop-nav a { color:#d0d6cc; font-size:12px; display:flex; align-items:center; gap:7px; }.desktop-nav a:hover { color:var(--sl-lime); }
.header-actions { display:flex; align-items:center; gap:25px; }.github-link { color:#c3cdbb; }.header-download { background:var(--sl-lime); color:var(--sl-ink); display:flex; align-items:center; gap:24px; font-size:12px; font-weight:600; padding:11px 17px; }.header-download:hover { background:#d7ff92; }.menu-toggle { display:none; }.mobile-nav { display:none; }
main { padding-top:72px; }.eyebrow { font:9px/1.6 var(--mono); letter-spacing:.13em; }.status-dot { display:inline-block; width:5px; height:5px; border-radius:50%; background:var(--sl-lime); box-shadow:0 0 14px #c4f56666; }
.hero-journey { height:175svh; position:relative; }.hero-screen { position:sticky; top:72px; height:calc(100svh - 72px); min-height:560px; isolation:isolate; overflow:hidden; background:radial-gradient(ellipse at 56% 50%,#273c282c,transparent 58%); }
.hero-topline { position:absolute; top:22px; left:4vw; right:4vw; display:flex; justify-content:space-between; color:#a6b29e; font:8px var(--mono); letter-spacing:.12em; }.hero-topline i { margin-right:9px; }
.hero-wordmark { position:absolute; z-index:-1; top:35px; left:3.4vw; margin:0; font:700 18vw/.9 var(--display); letter-spacing:-.075em; color:var(--sl-paper); transform:translateY(calc(var(--journey)*-80px)); opacity:clamp(0,calc(1 - var(--journey)*2.5),1); }.hero-wordmark span { display:inline-block; font:13px var(--mono); vertical-align:top; margin:2vw 0 0 1vw; }
.hero-world { position:absolute; inset:0; width:100%; height:100%; z-index:1; opacity:clamp(0,calc((1 - var(--journey))*8),1); }
.hero-screen::after { content:""; position:absolute; inset:62% 0 0; z-index:2; background:linear-gradient(transparent,#090d0de8 76%); pointer-events:none; }
.hero-arrival { position:absolute; top:28%; left:4vw; right:4vw; z-index:2; text-align:center; pointer-events:none; opacity:0; transform:translateY(20px); transition:opacity .25s,transform .25s; }.hero-arrival.is-visible { opacity:1; transform:none; }.hero-arrival .eyebrow { color:#a4b590; }.hero-arrival p { font:600 clamp(48px,6.8vw,98px)/.98 var(--display); letter-spacing:-.055em; margin:18px 0; }.hero-arrival p span { color:var(--sl-lime); }
.hero-halo { position:absolute; width:48vw; height:48vw; left:33%; top:15%; border:1px solid #c4f56610; border-radius:50%; transform:rotateX(55deg); }.hero-halo::after { content:''; position:absolute; inset:35px; border:1px solid #c4f5660a; border-radius:50%; }
.world-coordinate { position:absolute; top:52%; left:4vw; display:grid; gap:12px; color:#89947e; font:8px var(--mono); letter-spacing:.1em; }.world-coordinate span:first-child { color:var(--sl-lime); }
.world-turn { position:absolute; top:53%; right:4vw; z-index:3; display:flex; gap:10px; align-items:center; border:1px solid #9aa68a30; padding:11px 13px; color:#ccd7bd; background:#0c120bc0; font:8px var(--mono)!important; letter-spacing:.1em; cursor:pointer; transition:background .18s; }.world-turn:hover { background:#314325; }.world-turn>span { font-size:20px; color:var(--sl-lime); }
.hero-bottom { position:absolute; left:4vw; right:4vw; bottom:59px; display:flex; justify-content:space-between; align-items:flex-end; z-index:3; pointer-events:none; }.hero-bottom a { pointer-events:auto; }
.hero-promise .eyebrow { color:var(--sl-lime); }.hero-promise h2 { font:500 clamp(27px,3.2vw,47px)/1.04 var(--display); letter-spacing:-.045em; margin:12px 0 0; max-width:400px; }
.hero-convert { max-width:420px; }.hero-convert p { font-size:12px; color:#c1cbb7; line-height:1.7; margin:0 0 15px; }.hero-cta { display:flex; gap:12px; }.round-link { border:1px solid #92a37c6b; width:46px; display:grid; place-items:center; color:var(--sl-lime); }.round-link:hover { background:#25331c; }.download-note { display:block; font:8px var(--mono); letter-spacing:.1em; margin-top:12px; color:#879579; }
.showcase-site :deep(.dl .btn) { border:1px solid var(--sl-lime); border-radius:0; background:var(--sl-lime); color:var(--sl-ink); box-shadow:none; font:600 13px var(--ui); padding:13px 20px; transition:background .18s,transform .18s; }.showcase-site :deep(.dl .btn:hover) { transform:translateY(-2px); background:#d8ff98; filter:none; }.showcase-site :deep(.dl .fine) { color:#8c9a80; font:9px/1.7 var(--mono); }.showcase-site :deep(.dl .fine b) { color:#bdcaa9; }
.hero-scroll { position:absolute; z-index:3; bottom:0; left:4vw; right:4vw; border-top:1px solid #d0e6b922; height:35px; display:flex; gap:20px; align-items:center; font:7px var(--mono); letter-spacing:.16em; color:#9fae90; }.hero-scroll>svg { transform:rotate(90deg); }.scroll-line { width:80px; height:1px; background:#506045; overflow:hidden; }.scroll-line i { display:block; width:30px; height:1px; background:var(--sl-lime); animation:scroll-signal 1.5s infinite; }@keyframes scroll-signal { from { transform:translateX(-30px); } to { transform:translateX(100px); } }
.compat-strip { padding:27px 4vw; display:flex; justify-content:space-between; align-items:center; gap:25px; border-top:1px solid #c4f56625; background:#131a12; }.compat-strip>span { font:8px var(--mono); letter-spacing:.12em; color:#93a085; }.compat-strip>div { display:flex; gap:clamp(20px,4vw,65px); align-items:center; color:#c0ccb4; font-weight:600; font-size:18px; }.compat-strip>div>span,.compat-strip a { display:flex; align-items:center; gap:10px; }.compat-strip a { color:#a8b599; font-size:10px; }
.inside-journey { height:190svh; position:relative; scroll-margin-top:72px; }.inside-screen { position:sticky; top:72px; height:calc(100svh - 72px); min-height:600px; overflow:hidden; background:radial-gradient(ellipse at 78% 52%,#2f4d272e,transparent 65%); }.inside-top { display:flex; justify-content:space-between; position:absolute; top:35px; left:5vw; right:5vw; color:#91a380; }.inside-copy { position:absolute; left:5vw; top:14%; z-index:2; width:37%; }.inside-copy h2 { font:600 clamp(38px,4.7vw,70px)/.97 var(--display); letter-spacing:-.05em; margin:0 0 25px; }.inside-copy h2>span { color:var(--sl-lime); }.layer-buttons { max-width:420px; }.layer-buttons button { display:flex; width:100%; gap:13px; align-items:center; text-align:left; border-top:1px solid #aabd962b; padding:17px 0; color:#819076; cursor:pointer; transition:color .16s; }.layer-buttons button[aria-pressed=true] { color:var(--sl-lime); }.layer-number { font:8px var(--mono); }.layer-text { display:grid; flex:1; gap:7px; }.layer-text strong { font-size:14px; font-weight:500; }.layer-text>span { font-size:11px; line-height:1.6; color:#a1ad98; max-width:290px; }.inside-world { position:absolute; width:66%; height:91%; right:-3%; top:2%; }.inside-caption { position:absolute; right:6vw; bottom:9%; display:flex; gap:10px; align-items:center; font:8px var(--mono); letter-spacing:.1em; color:#a7b69a; }.inside-progress { position:absolute; bottom:30px; left:5vw; right:5vw; height:1px; background:#adc99123; }.inside-progress i { display:block; height:100%; background:var(--sl-lime); transform-origin:left; }
.manifesto { background:var(--sl-lime); color:var(--sl-ink); padding:85px 5vw 70px; }.manifesto-top { position:relative; }.manifesto-top>.brand-icon { position:absolute; right:0; top:0; }.manifesto h2 { font:600 clamp(42px,5.5vw,82px)/1 var(--display); letter-spacing:-.055em; margin:27px 0; max-width:1100px; }.manifesto h2 span { color:#55772d; }.manifesto-top>p { font-size:15px; color:#3f5829; line-height:1.7; margin-top:25px; }.benefit-row { display:grid; grid-template-columns:repeat(3,1fr); gap:60px; margin-top:55px; padding-top:32px; border-top:1px solid #22381744; }.benefit-row h3 { font:600 24px var(--display); letter-spacing:-.04em; margin:25px 0 10px; }.benefit-row p { font-size:13px; line-height:1.75; color:#3a502b; max-width:325px; }.benefit-row a { display:inline-flex; gap:14px; align-items:center; font-size:11px; color:var(--sl-ink); margin-top:17px; border-bottom:1px solid #587237; padding-bottom:5px; }
.launch-guide { padding:100px 5vw; display:grid; grid-template-columns:1fr 1fr; gap:10vw; }.launch-title .eyebrow { color:#91a380; }.launch-title h2 { font:500 clamp(36px,4.5vw,64px)/1.05 var(--display); letter-spacing:-.05em; margin:24px 0 35px; }.launch-title h2 span { color:#7c8a71; }.launch-title a { display:inline-flex; align-items:center; gap:20px; font-size:12px; color:var(--sl-lime); }.launch-guide ol { list-style:none; padding:0; margin:0; }.launch-guide li { display:flex; gap:30px; border-top:1px solid #9bb38532; padding:25px 0; }.step-number { font:12px var(--mono); color:#637257; }.launch-guide li svg { color:var(--sl-lime); }.launch-guide h3 { font:500 24px var(--display); letter-spacing:-.04em; margin:14px 0 9px; }.launch-guide p { color:#95a08c; font-size:13px; max-width:300px; }
.faq-section { padding:75px 5vw 95px; border-top:1px solid #d0e6b91c; display:grid; grid-template-columns:1fr 1.25fr; gap:10vw; }.faq-section .eyebrow { color:#8c9c7e; }.faq-section h2 { font:500 clamp(34px,4vw,56px)/1.05 var(--display); letter-spacing:-.05em; margin:20px 0; }.faq-section>div>a { color:var(--sl-lime); font-size:11px; display:inline-flex; gap:15px; align-items:center; }.questions details { border-bottom:1px solid #d0e6b928; }.questions summary { list-style:none; display:flex; align-items:center; justify-content:space-between; gap:20px; padding:23px 0; cursor:pointer; font-size:15px; }.questions summary::-webkit-details-marker { display:none; }.questions summary svg { color:var(--sl-lime); transform:rotate(90deg); transition:transform .2s; }.questions details[open] summary svg { transform:rotate(-90deg); }.questions p { color:#99a78d; font-size:13px; line-height:1.8; margin:0 25px 24px 0; }.questions p a { display:block; color:var(--sl-lime); margin-top:12px; }
.final-cta { padding:80px 24px 90px; text-align:center; position:relative; isolation:isolate; overflow:hidden; background:#151e11; scroll-margin-top:72px; }.final-cta>.eyebrow { display:block; margin-top:20px; color:#a9bb97; }.final-cta>svg { color:var(--sl-lime); }.final-cta h2 { font:600 clamp(46px,7.5vw,110px)/.97 var(--display); letter-spacing:-.06em; margin:28px 0; }.final-cta h2>span { color:var(--sl-lime); }.final-cta p { color:#a2b192; margin:25px 0; }.final-cta :deep(.dl) { flex-direction:column; }.release-link { display:flex; align-items:center; justify-content:center; gap:12px; color:#afbf9d; font-size:11px; margin-top:24px; }.cta-rings { position:absolute; inset:0; z-index:-1; pointer-events:none; }.cta-rings span { position:absolute; border:1px solid #c4f5660c; border-radius:50%; width:70vw; height:70vw; top:10%; left:15%; }.cta-rings span:nth-child(2) { inset:20% auto auto 25%; width:50vw; height:50vw; }.cta-rings span:nth-child(3) { inset:30% auto auto 35%; width:30vw; height:30vw; }
.site-footer { padding:40px 5vw 20px; }.footer-top { display:grid; grid-template-columns:1fr 1fr 1fr; align-items:start; gap:25px; }.footer-top p { color:#8a987d; font-size:12px; margin:0; }.footer-top nav { display:grid; grid-template-columns:1fr 1fr; gap:12px 25px; }.footer-top nav a { font-size:11px; color:#b8c5ab; }.footer-bottom { margin-top:45px; padding-top:20px; border-top:1px solid #d0e6b91a; display:flex; gap:25px; justify-content:space-between; color:#718064; font:7px/1.7 var(--mono); letter-spacing:.05em; }.footer-bottom a { color:#c1cfb3; }
.sl-reveal { transition:transform .5s cubic-bezier(.2,.7,.2,1); }.sl-reveal.revealed { animation:rise .55s both; }@keyframes rise { from { transform:translateY(24px); } to { transform:none; } }
@media(max-width:1100px) { .hero-wordmark { font-size:18vw; }.hero-convert { max-width:355px; }.hero-convert p { font-size:11px; }.world-turn { top:47%; }.inside-copy { width:43%; }.inside-copy h2 { font-size:48px; }.inside-world { width:65%; right:-8%; }.benefit-row { gap:30px; }.compat-strip>div { gap:25px; font-size:15px; } }
@media(min-width:851px) and (max-height:760px) { .hero-screen { min-height:0; }.hero-wordmark { top:30px; font-size:15vw; left:10vw; }.hero-bottom { bottom:47px; }.hero-promise h2 { font-size:31px; }.hero-convert p { font-size:10px; }.hero-topline { top:15px; }.world-coordinate { top:43%; }.world-turn { top:42%; }.inside-screen { min-height:0; }.inside-copy { top:13%; }.inside-copy h2 { font-size:39px; margin-bottom:12px; }.layer-buttons button { padding:12px 0; }.layer-text>span { font-size:10px; }.inside-caption { bottom:9%; } }
@media(max-width:850px) { .desktop-nav { gap:20px; }.world-coordinate { display:none; }.hero-bottom { bottom:60px; gap:25px; }.hero-promise h2 { font-size:29px; }.hero-convert { max-width:330px; }.world-turn { top:45%; right:4vw; font-size:7px!important; }.inside-journey { height:auto; }.inside-screen { height:auto; min-height:0; display:flex; flex-direction:column; padding:34px 5vw 55px; }.inside-top { position:static; }.inside-copy { position:relative; left:auto; top:auto; width:100%; margin-top:25px; }.inside-copy h2 { font-size:52px; }.inside-copy h2 br { display:none; }.inside-copy h2 { max-width:590px; }.layer-buttons { max-width:none; }.inside-world { position:relative; width:100%; right:auto; top:auto; height:430px; order:2; }.inside-caption { position:static; order:3; justify-content:center; font-size:7px; }.inside-progress { display:none; }.layer-buttons button { padding:13px 0; }.layer-text>span { max-width:500px; }.manifesto h2 { font-size:55px; }.launch-guide { gap:6vw; }.footer-top { grid-template-columns:1fr 1fr; }.footer-top p { display:none; } }
@media(max-width:600px) {
  .site-header { height:64px; padding:0 20px; }.site-logo { font-size:24px; gap:9px; }.site-logo svg { width:25px; }.desktop-nav,.github-link,.header-download { display:none; }.menu-toggle { display:block; color:var(--sl-lime); cursor:pointer; padding:10px; }.header-actions { gap:0; }.mobile-nav { position:absolute; display:grid; top:64px; left:0; right:0; padding:20px; background:#111a0f; border-bottom:1px solid #81976655; gap:0; }.mobile-nav a { color:var(--sl-paper); padding:16px 5px; border-bottom:1px solid #a8bb9222; font-size:16px; }
  main { padding-top:64px; }.hero-journey { height:155svh; }.hero-screen { top:64px; height:calc(100svh - 64px); min-height:0; }.hero-topline { top:17px; left:22px; right:22px; font-size:6px; letter-spacing:.1em; }.hero-topline>span:last-child { display:none; }.hero-wordmark { top:44px; font-size:18.5vw; left:3.2vw; }.hero-wordmark>span { font-size:7px; margin-top:8px; margin-left:4px; }.hero-arrival { top:27%; }.hero-arrival p { font-size:52px; }.hero-arrival .eyebrow { font-size:6px; }.world-turn { top:50%; right:22px; font-size:6px!important; min-height:40px; padding:8px 10px; gap:7px; }.world-turn svg { width:14px; }.world-turn>span { font-size:16px; }.hero-bottom { left:22px; right:22px; bottom:42px; display:block; }.hero-promise h2 { font-size:34px; margin-top:8px; }.hero-promise h2 br { display:none; }.hero-promise { max-width:320px; }.hero-promise .eyebrow { font-size:7px; }.hero-convert { margin-top:12px; max-width:none; }.hero-convert p { font-size:10px; line-height:1.6; margin-bottom:13px; max-width:320px; }.hero-convert p br { display:none; }.hero-cta { gap:8px; }.showcase-site :deep(.dl .btn) { font-size:11px; padding:12px 14px; }.round-link { width:40px; }.download-note { font-size:6px; margin-top:10px; }.hero-scroll { left:22px; right:22px; height:27px; font-size:6px; }.hero-scroll .scroll-line { width:50px; }.hero-halo { width:90vw; height:90vw; left:5%; top:15%; }
  .compat-strip { padding:22px; display:block; }.compat-strip>span { font-size:7px; }.compat-strip>div { margin-top:16px; gap:19px; flex-wrap:wrap; font-size:14px; }.compat-strip a { font-size:9px; }.compat-strip>div>span { gap:6px; }
  .inside-screen { padding:30px 22px 40px; }.inside-copy h2 { font-size:44px; }.inside-world { height:350px; width:120%; left:-10%; }.inside-top { font-size:8px; }.layer-text strong { font-size:13px; }.layer-text>span { font-size:11px; }.layer-number { display:none; }.inside-caption { font-size:6px; }
  .manifesto { padding:55px 22px; }.manifesto h2 { font-size:42px; }.manifesto-top>.brand-icon { display:none; }.manifesto-top>p { font-size:13px; }.benefit-row { grid-template-columns:1fr; gap:30px; margin-top:32px; }.benefit-row article { padding-bottom:28px; border-bottom:1px solid #22381733; }.benefit-row article:last-child { border:0; padding:0; }.benefit-row h3 { margin-top:15px; font-size:25px; }.benefit-row p { max-width:none; }.benefit-row a { margin-top:10px; }
  .launch-guide { padding:60px 22px; grid-template-columns:1fr; gap:35px; }.launch-title h2 { font-size:43px; margin:20px 0; }.launch-guide li { gap:22px; }.launch-guide h3 { font-size:24px; }.launch-guide li p { max-width:none; }.faq-section { padding:50px 22px; grid-template-columns:1fr; gap:25px; }.faq-section h2 { font-size:40px; }.faq-section h2 br { display:none; }.questions summary { font-size:14px; padding:20px 0; }.questions p { font-size:12px; }.final-cta { padding:55px 22px 65px; }.final-cta h2 { font-size:49px; }.final-cta p { font-size:13px; }.final-cta :deep(.dl .fine) { font-size:11px; }.site-footer { padding:32px 22px 20px; }.footer-top { grid-template-columns:1fr; gap:25px; }.footer-top nav { gap:14px; }.footer-bottom { margin-top:28px; flex-direction:column; gap:12px; font-size:6px; }
}
@media(prefers-reduced-motion:reduce) { .hero-journey { height:auto; }.hero-screen { position:relative; top:0; }.hero-world,.hero-wordmark { transform:none; }.hero-arrival { display:none; }.inside-journey { height:auto; }.inside-screen { position:relative; top:0; }.sl-reveal,.sl-reveal.revealed,.scroll-line i { animation:none; transition:none; }.showcase-site :deep(.dl .btn) { transition:none; }.showcase-site :deep(.dl .btn:hover) { transform:none; } }
</style>
