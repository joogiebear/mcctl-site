<script setup lang="ts">
import Download from './Download.vue'
import IslandScene from './IslandScene.vue'
import WorldTour from './WorldTour.vue'
</script>
<template>
  <main class="landing">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-orbit" aria-hidden="true"></div>
      <div class="hero-art"><IslandScene /></div>
      <div class="hero-copy">
        <div class="eyebrow"><i></i> A LITTLE SPACE. A WORLD OF POSSIBILITIES.</div>
        <div class="wordmark">SpawnLoft</div>
        <h1 id="hero-title">Your world.<br>Your rules.<br><em>Your own PC.</em></h1>
        <p>Minecraft servers, without the terminal.<br>Build a place for your people. We’ll handle the server.</p>
        <div class="hero-actions"><Download size="lg" /><a class="text-link" href="#tour">Take a look <span aria-hidden="true">↗</span></a></div>
        <span class="requirements">Free & open source · Windows 10/11 · Requires Java</span>
      </div>
      <div class="world-label" aria-hidden="true"><span class="live-dot"></span> YOUR NEXT ADVENTURE STARTS HERE <span>001 / OVERWORLD</span></div>
      <div class="hero-footer"><a href="#tour">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a><span>NO CLOUD. NO ACCOUNTS. JUST YOUR WORLD.</span></div>
    </section>
    <div class="compatibility"><span>FEELS LIKE HOME.<br>WORKS WITH YOUR FAVORITES.</span><div>Paper <i>/</i> Fabric <i>/</i> NeoForge <i>/</i> Modrinth <i>/</i> Hangar</div></div>
    <WorldTour />
    <section class="ownership">
      <div class="ownership-intro"><span class="eyebrow">STAYS CLOSE TO HOME</span><h2>Yours, all the<br>way down.</h2><p>For friends, family, and the server you’ve always wanted to make.</p><a class="text-link" href="/guide/how-it-works">How SpawnLoft works <span aria-hidden="true">↗</span></a></div>
      <div class="principles">
        <article><span>01</span><div><h3>Your machine. Your files.</h3><p>Worlds and backups live in folders on your disk. No account to create. No hosting subscription.</p></div></article>
        <article><span>02</span><div><h3>A little less babysitting.</h3><p>Schedule backups and restarts. Bring a crashed server back automatically, with a limit to stop crash loops.</p></div></article>
        <article><span>03</span><div><h3>Open from the start.</h3><p>Free, MIT licensed, and built in the open. Read the code, report a bug, or help shape what comes next.</p><a href="https://github.com/joogiebear/spawnloft">Find us on GitHub ↗</a></div></article>
      </div>
    </section>
    <section class="start-section" id="start"><span class="eyebrow">GOOD THINGS START SMALL</span><h2>Make room for<br>your next adventure<span>.</span></h2><p>Install SpawnLoft. Add a server. Press Start.</p><Download size="lg" fine /><a class="guide-link" href="/guide/getting-started">Need a hand? Read the getting started guide ↗</a></section>
  </main>
</template>
<style scoped>
.landing { color:var(--ink); font:16px/1.6 var(--ui); overflow:clip; }
.hero { min-height:560px; height:calc(100svh - 64px); max-height:1050px; position:relative; isolation:isolate; background:radial-gradient(ellipse at 74% 45%,#172635 0%,#101722 34%,#0c0e14 68%); }
.hero-copy { position:relative; z-index:2; width:56%; padding:clamp(38px,6vh,75px) 0 90px 7vw; pointer-events:none; }
.hero-copy a { pointer-events:auto; }
.eyebrow { font:10px/1.5 var(--mono); letter-spacing:.13em; color:#9cabc5; display:flex; align-items:center; gap:10px; }
.eyebrow i,.live-dot { width:5px; height:5px; border-radius:50%; background:#9ad2ac; box-shadow:0 0 9px #77bc9860; display:inline-block; }
.wordmark { font:650 clamp(40px,4.5vw,68px)/1 var(--display); letter-spacing:-.05em; margin:30px 0 18px; }
h1 { font:500 clamp(38px,4.2vw,62px)/1.02 var(--display); letter-spacing:-.045em; margin:0; }
h1 em { color:#91aeff; font-style:normal; }
.hero-copy p { color:#a8b4cb; font-size:15px; line-height:1.8; margin:25px 0; }
.hero-actions { display:flex; align-items:center; gap:25px; }
.text-link { color:#d9e2f2; text-decoration:none; font-size:13px; white-space:nowrap; }
.text-link span { color:#91aeff; margin-left:10px; display:inline-block; transition:transform .25s; }
.text-link:hover span { transform:translate(3px,-3px); }
.requirements { display:block; color:#8c9ab3; font:10px/1.6 var(--mono); margin-top:18px; }
.hero-art { position:absolute; z-index:1; top:1%; right:-4%; width:64%; height:90%; animation:arrive 1.1s ease-out both; }
.hero-orbit { position:absolute; width:48vw; height:48vw; border:1px solid #819dc412; border-radius:50%; top:50%; left:72%; transform:translate(-50%,-50%) rotateX(55deg); }
.hero-orbit::after { content:''; position:absolute; inset:35px; border:1px solid #819dc40a; border-radius:50%; }
.world-label { position:absolute; right:8%; bottom:16%; display:flex; align-items:center; gap:9px; color:#99aac4; font:8px var(--mono); letter-spacing:.09em; }
.world-label>span:last-child { margin-left:15px; color:#64738d; }
.hero-footer { position:absolute; bottom:0; left:7%; right:7%; height:66px; border-top:1px solid #8aa4d021; display:flex; justify-content:space-between; align-items:center; color:#8190a9; font:9px var(--mono); letter-spacing:.13em; }
.hero-footer a { text-decoration:none; color:#d7e1f0; }.hero-footer a span { padding-left:25px; }
.compatibility { padding:31px 7vw; display:flex; align-items:center; justify-content:space-between; gap:30px; border-top:1px solid var(--line); background:#10131b; }
.compatibility>span { font:9px/1.7 var(--mono); letter-spacing:.1em; color:#8290a7; }
.compatibility>div { font:500 clamp(14px,1.5vw,20px) var(--display); color:#b2bdd0; display:flex; gap:30px; align-items:center; }
.compatibility i { font:12px var(--mono); color:#3f4b61; }
.ownership { max-width:1440px; margin:auto; padding:110px 7vw; display:grid; grid-template-columns:1fr 1fr; gap:80px; }
.ownership h2 { font:500 clamp(40px,4vw,58px)/1.08 var(--display); letter-spacing:-.04em; margin:22px 0; }
.ownership-intro p { color:var(--ink-2); max-width:300px; margin-bottom:30px; }
.principles article { display:flex; gap:25px; padding:24px 0; border-top:1px solid var(--line); }
.principles article>span { font:10px var(--mono); color:#8195ba; padding-top:6px; }
.principles h3 { font:500 21px var(--display); margin:0 0 10px; }.principles p { color:var(--ink-2); font-size:14px; line-height:1.8; margin:0; }
.principles a { color:#a6bbf4; font-size:12px; display:inline-block; margin-top:15px; }
.start-section { padding:90px 24px 100px; text-align:center; border-top:1px solid var(--line); background:radial-gradient(ellipse at 50% 110%,#22365a50,transparent 70%); }
.start-section .eyebrow { justify-content:center; }.start-section h2 { font:500 clamp(40px,5.5vw,76px)/1.05 var(--display); letter-spacing:-.05em; margin:26px 0; }
.start-section h2 span { color:var(--lapis); }.start-section p { color:var(--ink-2); margin-bottom:30px; }.start-section :deep(.dl) { flex-direction:column; }
.guide-link { display:block; color:#aebdda; font-size:12px; margin-top:24px; }:deep(a:focus-visible) { outline:2px solid #a6bcff; outline-offset:6px; }
@keyframes arrive { from { opacity:0; transform:translateY(25px); } to { opacity:1; transform:none; } }
@media(min-width:1600px) { .hero-copy { padding-left:max(7vw,calc((100vw - 1440px)/2)); } }
@media(max-width:1050px) { .hero-actions { gap:15px; flex-wrap:wrap; }.hero-copy { width:59%; }.compatibility>div { gap:18px; }.world-label>span:last-child { display:none; } }
@media(max-width:700px) {
  .hero { height:auto; min-height:0; padding-bottom:55px; display:flex; flex-direction:column; }.hero-copy { padding:28px 24px 0; width:100%; order:0; }.eyebrow { font-size:8px; }
  .wordmark { font-size:44px; margin:19px 0 12px; } h1 { font-size:38px; }.hero-copy p { font-size:13px; margin:17px 0; }.hero-actions { gap:18px; }
  .hero-copy :deep(.btn.lg) { font-size:12px; padding:12px 13px; }.requirements { font-size:8px; }
  .hero-art { position:relative; width:100%; right:auto; height:260px; margin:-5px 0 -5px; order:1; }.world-label { display:none; }
  .hero-footer { left:24px; right:24px; height:55px; font-size:8px; }.hero-footer>span { display:none; }
  .compatibility { padding:25px 24px; flex-direction:column; align-items:flex-start; gap:17px; }.compatibility>span br { display:none; }
  .compatibility>div { gap:12px; font-size:14px; flex-wrap:wrap; }.ownership { padding:65px 24px; grid-template-columns:1fr; gap:40px; }.start-section { padding:65px 24px; }
}
@media(prefers-reduced-motion:reduce) { .hero-art { animation:none; }.text-link span { transition:none; } }
@media(min-width:701px) and (max-height:740px) { .hero-copy { padding-top:25px; }.wordmark { margin:20px 0 12px; font-size:46px; } h1 { font-size:44px; }.hero-copy p { margin:19px 0; font-size:14px; }.hero-footer { height:48px; }.world-label { bottom:13%; } }
</style>
