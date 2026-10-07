<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'

// Grouped by the job someone came to do, not by the order the app happens to list its tools.
// Chunking: four jobs is inside the span people hold at a glance, where a flat list of twenty
// capabilities is not. Every line here is something the shipped app does today.
const jobs = [
  {
    icon: 'world', label: '01 / RUN IT', title: 'Run the server you actually want.',
    text: 'Pick the software and the Minecraft version. SpawnLoft fetches it, checks it, and starts it. Or point it at the server you already run and nothing moves.',
    points: ['Paper, Purpur, Folia, Spigot, CraftBukkit and vanilla', 'Fabric and NeoForge for mods', 'A whole Modrinth modpack in one step', 'Import an existing server folder in place'],
    href: '/reference/servers', link: 'Every server software',
  },
  {
    icon: 'plugins', label: '02 / SHAPE IT', title: 'Make it unmistakably yours.',
    text: 'Search Modrinth and Hangar in the same window, install what fits your server, and see when something has an update waiting.',
    points: ['Modrinth and Hangar searched together', 'Only what your software can load', 'Update checks across everything installed', 'A snapshot before an update, automatically'],
    href: '/guide/plugins', link: 'Plugins and mods',
  },
  {
    icon: 'shield', label: '03 / KEEP IT', title: 'Keep the world you built.',
    text: 'Backups on a schedule that get read back to prove they restore. Scheduled restarts. And when a server falls over, a read of why before you go looking.',
    points: ['Scheduled backups, verified not just written', 'Restore a world, plugins or config', 'Crash reports summarised in plain language', 'Optional automatic restart after a crash'],
    href: '/guide/backups', link: 'How backups work',
  },
  {
    icon: 'terminal', label: '04 / WORK ON IT', title: 'Treat it like a project.',
    text: 'For the people writing the plugin rather than only running it. Clone a server into a disposable copy, drive everything from a terminal, or let an AI assistant you choose do the checking.',
    points: ['Clone to a throwaway server on its own port', 'RCON command and reply, without the blocking shell', 'Structured JSON and CSV out of the command line', 'An MCP server for Claude or any MCP app'],
    href: '/guide/ai-assistants', link: 'AI assistants and MCP',
  },
]

// The integration surface in one place, which is the thing the site did not have a page for.
// Names only where the project really supports them, with how each one is verified, because
// "we download a jar from the internet" and "we check its sha256" are not the same promise.
const integrations = [
  {
    icon: 'cube', title: 'Server software', note: 'Downloaded and checked, or built here.',
    items: ['Paper', 'Purpur', 'Folia', 'Advanced Slime Paper', 'Spigot', 'CraftBukkit', 'Vanilla', 'Fabric', 'NeoForge'],
    detail: 'Paper, ASP and NeoForge verify by sha256, Purpur by md5, vanilla by sha1. SpigotMC publishes no jars, so BuildTools compiles Spigot and CraftBukkit on your machine.',
    href: '/reference/servers', link: 'Sources and verification',
  },
  {
    icon: 'plugins', title: 'Plugins, mods and packs', note: 'Two registries, one search field.',
    items: ['Modrinth', 'Hangar', 'Modrinth modpacks', 'Local jar store', 'Saved templates'],
    detail: 'A Paper server searches Modrinth and Hangar. A Fabric or NeoForge server gets a Mods tool and searches Modrinth for its loader. Folia is offered only Folia-built plugins.',
    href: '/guide/plugins', link: 'Installing and updating',
  },
  {
    icon: 'bolt', title: 'Databases', note: 'Managed for you, running locally.',
    items: ['MySQL 8.4 LTS', 'Garnet (Redis-compatible)'],
    detail: 'Set up and supervised by SpawnLoft, on your machine. Managed MySQL needs macOS 15+ on a Mac and x64 on Linux; Garnet runs everywhere. Plugin configuration stays yours to write.',
    href: '/guide/databases', link: 'Connection details',
  },
  {
    icon: 'terminal', title: 'Tools and automation', note: 'For scripts, terminals and assistants.',
    items: ['RCON', 'Command line', 'JSON + CSV output', 'MCP', 'Task Scheduler', 'launchd', 'systemd timers'],
    detail: 'The same engine runs from a terminal as from the window. Scheduling uses whatever your operating system already has. The MCP server redacts passwords and hides player IPs before anything reaches a model.',
    href: '/reference/commands', link: 'Command reference',
  },
]

// Real captures from the app, already in the repo. No mockups.
const screens = [
  { image: 'console', title: 'The console, not a log file.', text: 'Follow what the server is saying, search it, and send a command without losing your place.' },
  { image: 'backups', title: 'Backups you can trust.', text: 'Scheduled, verified, and restorable to a point you choose.' },
]

// Honesty block. The brand voice already says the project should name where another tool
// is the better choice; a features page that only says yes is the one people stop believing.
const limits = [
  { title: 'It does not open your network.', text: 'Friends on your own network connect to your local address. Anyone further away needs a port forward or a tunnel that you decide to set up. SpawnLoft never exposes your machine on its own.', href: '/guide/security', link: 'What stays local' },
  { title: 'It does not supply Java.', text: 'Minecraft servers are Java programs. SpawnLoft finds the Java you have, tells you when it is missing or too old, and links the version your Minecraft needs — but it cannot ship it for you.', href: '/guide/getting-started#what-you-need', link: 'Which Java you need' },
  { title: 'It needs your computer on.', text: 'This is a server on your own machine. Asleep or shut down means offline. If you want a world that is up while you are not, a host is the honest answer and the comparison says so.', href: '/guide/compare', link: 'Where other tools fit' },
]
</script>

<template>
  <main class="features">
    <section class="feat-intro">
      <div>
        <span class="feat-label">SPAWNLOFT / WHAT YOU CAN DO</span>
        <h1>Everything a server needs.<br><span>Nothing it doesn’t.</span></h1>
        <p>SpawnLoft is a desktop app for running Minecraft Java Edition servers on your own Windows PC, Mac or Linux machine. Worlds, plugins, console, databases and backups in one window — for the people who want to play with friends, and the people writing the plugin.</p>
        <div class="feat-actions">
          <a class="feat-primary" href="/get-started">Get SpawnLoft <BrandIcon name="arrow" :size="19" /></a>
          <a class="feat-secondary" href="/guide/">Read the field guide <BrandIcon name="arrow" :size="15" /></a>
        </div>
        <span class="feat-fine">FREE · OPEN SOURCE · MIT LICENCE · NO ACCOUNT</span>
      </div>
      <nav class="feat-jump" aria-label="On this page">
        <span class="feat-label">WHAT ARE YOU AFTER?</span>
        <a v-for="(job, i) in jobs" :key="job.title" :href="`#job-${i}`"><span>0{{ i + 1 }}</span>{{ job.title }}<BrandIcon name="arrow" :size="18" /></a>
        <a href="#integrations"><span>05</span>What it works with.<BrandIcon name="arrow" :size="18" /></a>
      </nav>
    </section>

    <section class="feat-jobs" aria-labelledby="jobs-title">
      <div class="jobs-heading">
        <span class="feat-label">FOUR THINGS PEOPLE COME HERE FOR</span>
        <h2 id="jobs-title">Pick the job. Not the feature list.</h2>
        <span>Capabilities in the shipped app</span>
      </div>
      <div class="jobs-grid">
        <article v-for="(job, i) in jobs" :id="`job-${i}`" :key="job.title">
          <BrandIcon :name="job.icon" :size="36" />
          <span class="feat-label">{{ job.label }}</span>
          <h3>{{ job.title }}</h3>
          <p>{{ job.text }}</p>
          <ul><li v-for="point in job.points" :key="point"><BrandIcon name="check" :size="15" />{{ point }}</li></ul>
          <a :href="job.href">{{ job.link }} <BrandIcon name="arrow" :size="16" /></a>
        </article>
      </div>
    </section>

    <section id="integrations" class="feat-integrations" aria-labelledby="integrations-title">
      <div class="int-heading">
        <span class="feat-label">THE INTEGRATION SURFACE</span>
        <h2 id="integrations-title">What it works with.</h2>
        <p>The software it can run, the registries it can search, the services it can manage, and the ways you can drive it from somewhere other than the window.</p>
      </div>
      <div class="int-grid">
        <article v-for="group in integrations" :key="group.title">
          <header><BrandIcon :name="group.icon" :size="27" /><div><h3>{{ group.title }}</h3><span>{{ group.note }}</span></div></header>
          <ul><li v-for="item in group.items" :key="item">{{ item }}</li></ul>
          <p>{{ group.detail }}</p>
          <a :href="group.href">{{ group.link }} <BrandIcon name="arrow" :size="15" /></a>
        </article>
      </div>
    </section>

    <section class="feat-screens" aria-labelledby="screens-title">
      <div class="screens-heading">
        <span class="feat-label">ACTUAL SCREENS, NOT MOCKUPS</span>
        <h2 id="screens-title">This is the app.</h2>
        <a href="/guide/panel">Take a tour of the panel <BrandIcon name="arrow" :size="17" /></a>
      </div>
      <div class="screens-grid">
        <figure v-for="screen in screens" :key="screen.image">
          <img :src="`/img/tabs/${screen.image}.webp`" :alt="`The SpawnLoft ${screen.image} panel, captured from the running app.`" width="2558" height="1392" loading="lazy" decoding="async">
          <figcaption><strong>{{ screen.title }}</strong><span>{{ screen.text }}</span></figcaption>
        </figure>
      </div>
    </section>

    <section class="feat-platforms" aria-labelledby="platforms-title">
      <div class="plat-heading"><span class="feat-label">ONE RELEASE, THREE PLATFORMS</span><h2 id="platforms-title">Built and tested on each.</h2></div>
      <div class="plat-grid">
        <article><BrandIcon name="windows" :size="30" /><h3>Windows</h3><span>10 or 11 · x64</span><ul><li><BrandIcon name="check" :size="14" />Signed installer, per user</li><li><BrandIcon name="check" :size="14" />Managed MySQL and Garnet</li><li><BrandIcon name="check" :size="14" />Schedules via Task Scheduler</li></ul></article>
        <article><BrandIcon name="cube" :size="30" /><h3>macOS</h3><span>13+ · Apple Silicon or Intel</span><ul><li><BrandIcon name="check" :size="14" />Signed, notarized and stapled</li><li><BrandIcon name="check" :size="14" />Managed MySQL needs macOS 15+</li><li><BrandIcon name="check" :size="14" />Schedules via launchd</li></ul></article>
        <article><BrandIcon name="terminal" :size="30" /><h3>Linux</h3><span>.deb and .rpm · x64 or arm64</span><ul><li><BrandIcon name="check" :size="14" />Hash-verified packages</li><li><BrandIcon name="check" :size="14" />Managed MySQL on x64 only</li><li><BrandIcon name="check" :size="14" />A command-line-only build for servers</li></ul></article>
      </div>
      <a class="plat-link" href="/guide/beta">The full platform matrix <BrandIcon name="arrow" :size="16" /></a>
    </section>

    <section class="feat-limits" aria-labelledby="limits-title">
      <div class="limits-heading"><BrandIcon name="shield" :size="38" /><span class="feat-label">WORTH KNOWING BEFORE YOU DOWNLOAD</span><h2 id="limits-title">And three things it doesn’t do.</h2></div>
      <div class="limits-grid">
        <article v-for="limit in limits" :key="limit.title"><h3>{{ limit.title }}</h3><p>{{ limit.text }}</p><a :href="limit.href">{{ limit.link }} <BrandIcon name="arrow" :size="14" /></a></article>
      </div>
    </section>

    <section class="feat-cta">
      <BrandIcon name="mark" :size="44" />
      <h2>Sounds like your kind of server?</h2>
      <p>Free, open source, and running on your machine in about ten minutes.</p>
      <div class="cta-actions"><a class="feat-primary" href="/get-started">Get started <BrandIcon name="arrow" :size="19" /></a><a class="feat-secondary" href="https://github.com/joogiebear/spawnloft">Read the source <BrandIcon name="external" :size="15" /></a></div>
    </section>
  </main>
</template>

<style scoped>
.features { background:#090d0d; color:#efeee6; }
.features a { text-decoration:none; }
.features a:focus-visible { outline:2px solid #83a945; outline-offset:6px; }
.feat-label { display:block; font:11px/1.7 var(--mono); letter-spacing:.12em; }
.feat-primary { display:inline-flex; align-items:center; gap:28px; background:#c4f566; color:#090d0d; padding:15px 19px; font:600 13px var(--ui); transition:background .16s; }
.feat-primary:hover { background:#d7ff96; }
.feat-secondary { display:inline-flex; align-items:center; gap:14px; color:#c4f566; font-size:12px; border-bottom:1px solid #6f8a3f; padding-bottom:5px; }

/* Intro: the claim on the left, the scent of the page on the right. */
.feat-intro { max-width:1320px; margin:auto; padding:85px 5vw 90px; display:grid; grid-template-columns:1.4fr 1fr; gap:7vw; align-items:center; }
.feat-intro .feat-label { color:#a0b28b; }
h1 { font:600 clamp(44px,5.4vw,78px)/1.02 var(--display); letter-spacing:-.06em; margin:27px 0; }
h1 span { color:#c4f566; }
.feat-intro p { color:#abb5a3; font-size:15px; line-height:1.8; max-width:560px; }
.feat-actions { display:flex; align-items:center; gap:28px; flex-wrap:wrap; margin-top:30px; }
.feat-fine { display:block; font:11px var(--mono); letter-spacing:.1em; color:#849679; margin-top:22px; }
.feat-jump>.feat-label { color:#a0b28b; margin-bottom:23px; }
.feat-jump>a { display:flex; align-items:center; gap:18px; border-top:1px solid #a6ba9233; padding:21px 0; font:500 19px var(--display); letter-spacing:-.025em; color:#efeee6; }
.feat-jump>a>span { font:11px var(--mono); color:#91a17e; }
.feat-jump>a>svg { margin-left:auto; color:#c4f566; transition:transform .16s; }
.feat-jump>a:hover>svg { transform:translateX(5px); }

/* Jobs: the light editorial surface the site already uses for its substance. */
.feat-jobs { background:#efeee6; color:#172016; padding:65px max(5vw,calc((100vw - 1188px)/2)) 80px; }
.jobs-heading { display:flex; flex-wrap:wrap; align-items:baseline; gap:15px; padding-bottom:32px; border-bottom:1px solid #bbc4b1; }
.jobs-heading>.feat-label { width:100%; color:#5b6d4a; }
.jobs-heading h2 { font:600 clamp(28px,3vw,42px)/1.1 var(--display); letter-spacing:-.045em; margin:0; }
/* #5b6a4d rather than the lighter grey-green used elsewhere on this surface: at 11px the
   lighter value lands at 4.1:1 on bone, under the 4.5:1 AA floor. This clears it at 5.0:1. */
.jobs-heading>span:last-child { margin-left:auto; font-size:11px; color:#5b6a4d; }
.jobs-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0 60px; }
/* Flex column so the closing doc link lands on a shared baseline across the row, instead of
   wherever each card's prose happens to stop. */
.jobs-grid article { padding:40px 0 38px; border-bottom:1px solid #c5ccbd; scroll-margin-top:90px; display:flex; flex-direction:column; }
.jobs-grid>article>svg:first-child { align-self:flex-start; }
.jobs-grid article:nth-last-child(-n+2) { border-bottom:0; padding-bottom:4px; }
.jobs-grid>article>svg { color:#406722; margin-bottom:22px; }
.jobs-grid .feat-label { color:#5b6a4d; }
.jobs-grid h3 { font:600 clamp(25px,2.2vw,31px)/1.15 var(--display); letter-spacing:-.04em; margin:11px 0 16px; }
.jobs-grid p { font-size:14px; line-height:1.8; color:#525c4c; margin:0; max-width:430px; }
.jobs-grid ul { list-style:none; padding:0; margin:22px 0 24px; width:100%; }
.jobs-grid li { display:flex; gap:11px; align-items:flex-start; font-size:13px; line-height:1.6; margin:11px 0; color:#2e3a2a; }
.jobs-grid li svg { color:#496c2b; flex:none; margin-top:2px; }
.jobs-grid article>a { display:inline-flex; align-items:center; gap:16px; font-size:12px; color:#172016; border-bottom:1px solid #89917b; padding-bottom:6px; margin-top:auto; align-self:flex-start; }

/* Integrations: four common regions, each one a self-contained promise. */
.feat-integrations { max-width:1320px; margin:auto; padding:85px 5vw 90px; scroll-margin-top:90px; }
.int-heading { max-width:720px; }
.int-heading .feat-label { color:#a0b28b; }
.int-heading h2 { font:600 clamp(34px,4.2vw,58px)/1.03 var(--display); letter-spacing:-.05em; margin:22px 0 20px; }
.int-heading p { color:#a0ae94; font-size:15px; line-height:1.8; margin:0; }
.int-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; margin-top:52px; }
.int-grid article { border:1px solid #2d3a26; background:#0e150d; padding:30px 28px 28px; display:flex; flex-direction:column; }
.int-grid header { display:flex; gap:16px; align-items:flex-start; padding-bottom:22px; border-bottom:1px solid #2d3a26; }
.int-grid header svg { color:#c4f566; flex:none; margin-top:3px; }
.int-grid h3 { font:600 23px var(--display); letter-spacing:-.035em; margin:0 0 6px; }
.int-grid header span { font-size:12px; color:#8e9d81; }
.int-grid ul { list-style:none; display:flex; flex-wrap:wrap; gap:8px; padding:0; margin:22px 0; }
.int-grid li { border:1px solid #3c4d31; padding:6px 11px; font:12px var(--mono); color:#cfdcc0; }
.int-grid article>p { font-size:13px; line-height:1.75; color:#97a58b; margin:0 0 22px; }
.int-grid article>a { display:inline-flex; align-items:center; gap:13px; font-size:12px; color:#c4f566; margin-top:auto; }

/* Screens: the strongest trust signal the repo has, so it gets real room. */
.feat-screens { background:#efeee6; color:#172016; padding:65px max(5vw,calc((100vw - 1188px)/2)) 75px; }
.screens-heading { display:flex; flex-wrap:wrap; align-items:baseline; gap:15px; padding-bottom:30px; border-bottom:1px solid #bbc4b1; }
.screens-heading>.feat-label { width:100%; color:#5b6d4a; }
.screens-heading h2 { font:600 clamp(28px,3vw,42px)/1.1 var(--display); letter-spacing:-.045em; margin:0; }
.screens-heading>a { margin-left:auto; display:inline-flex; align-items:center; gap:16px; font-size:12px; color:#172016; border-bottom:1px solid #89917b; padding-bottom:5px; }
.screens-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:38px; margin-top:42px; }
.screens-grid figure { margin:0; }
.screens-grid img { display:block; width:100%; height:auto; border:1px solid #b6bfac; }
.screens-grid figcaption { margin-top:18px; }
.screens-grid strong { display:block; font:600 19px var(--display); letter-spacing:-.03em; margin-bottom:8px; }
.screens-grid figcaption span { font-size:13px; line-height:1.7; color:#5d6757; }

/* Platforms: honest about where a capability narrows, in the same breath as the yes. */
.feat-platforms { max-width:1320px; margin:auto; padding:85px 5vw 90px; }
.plat-heading .feat-label { color:#a0b28b; }
.plat-heading h2 { font:600 clamp(32px,3.9vw,52px)/1.05 var(--display); letter-spacing:-.05em; margin:20px 0 0; }
.plat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0; margin:50px 0 38px; }
.plat-grid article { padding:0 34px 0 0; margin-right:34px; border-right:1px solid #9bb38524; }
.plat-grid article:last-child { border:0; margin:0; padding:0; }
.plat-grid article>svg { color:#c4f566; }
.plat-grid h3 { font:600 27px var(--display); letter-spacing:-.04em; margin:20px 0 7px; }
.plat-grid article>span { font:11px var(--mono); letter-spacing:.08em; color:#8e9d81; }
.plat-grid ul { list-style:none; padding:0; margin:24px 0 0; }
.plat-grid li { display:flex; gap:10px; align-items:flex-start; font-size:13px; line-height:1.6; margin:13px 0; color:#b9c4ad; }
.plat-grid li svg { color:#c4f566; flex:none; margin-top:3px; }
.plat-link { display:inline-flex; align-items:center; gap:15px; font-size:12px; color:#c4f566; border-bottom:1px solid #6f8a3f; padding-bottom:5px; }

/* Limits: lime, because the honesty should be the thing people remember. */
.feat-limits { background:#c4f566; color:#16220d; padding:70px max(5vw,calc((100vw - 1188px)/2)) 72px; }
.limits-heading { position:relative; padding-bottom:34px; border-bottom:1px solid #22381744; }
.limits-heading>svg { position:absolute; right:0; top:0; }
.limits-heading .feat-label { color:#45602d; }
.limits-heading h2 { font:600 clamp(32px,4vw,54px)/1.04 var(--display); letter-spacing:-.05em; margin:18px 0 0; max-width:720px; }
.limits-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:46px; margin-top:42px; }
.limits-grid h3 { font:600 21px var(--display); letter-spacing:-.035em; margin:0 0 12px; }
.limits-grid p { font-size:13px; line-height:1.8; color:#3a502b; margin:0 0 16px; }
.limits-grid a { display:inline-flex; align-items:center; gap:13px; font-size:11px; color:#16220d; border-bottom:1px solid #587237; padding-bottom:5px; }

.feat-cta { text-align:center; padding:80px 24px 90px; background:#151e11; }
.feat-cta>svg { color:#c4f566; }
.feat-cta h2 { font:600 clamp(34px,4.6vw,62px)/1.03 var(--display); letter-spacing:-.055em; margin:26px 0 18px; }
.feat-cta p { color:#a2b192; font-size:15px; margin:0 0 32px; }
.cta-actions { display:flex; align-items:center; justify-content:center; gap:30px; flex-wrap:wrap; }

@media(max-width:1000px) {
  .feat-intro { grid-template-columns:1fr; gap:45px; }
  .feat-intro p { max-width:none; }
  .jobs-grid { gap:0 40px; }
  .int-grid { grid-template-columns:1fr; }
  .plat-grid { grid-template-columns:1fr; gap:34px; }
  .plat-grid article,.plat-grid article:last-child { padding:0 0 30px; margin:0; border-right:0; border-bottom:1px solid #9bb38524; }
  .plat-grid article:last-child { border-bottom:0; padding-bottom:0; }
  .limits-grid { grid-template-columns:1fr; gap:34px; }
  .limits-grid article { padding-bottom:30px; border-bottom:1px solid #22381733; }
  .limits-grid article:last-child { border:0; padding:0; }
}
@media(max-width:820px) {
  .jobs-grid { grid-template-columns:1fr; gap:0; }
  .jobs-grid article,.jobs-grid article:nth-last-child(-n+2) { padding:34px 0 32px; border-bottom:1px solid #c5ccbd; }
  .jobs-grid article:last-child { border-bottom:0; padding-bottom:4px; }
  .screens-grid { grid-template-columns:1fr; gap:34px; }
}
@media(max-width:650px) {
  .feat-intro { padding:48px 22px; }
  h1 { font-size:42px; }
  .feat-intro p { font-size:14px; }
  .feat-actions { gap:20px; }
  .feat-jump>a { font-size:18px; gap:12px; }
  .feat-jobs { padding:43px 22px; }
  .jobs-heading h2 { font-size:30px; }
  .jobs-heading>span:last-child { margin:0; }
  .jobs-grid>article>svg { float:right; margin:0; }
  .jobs-grid h3 { font-size:26px; }
  .jobs-grid p { max-width:none; }
  .feat-integrations { padding:50px 22px; }
  .int-heading h2 { font-size:34px; }
  .int-grid { margin-top:34px; gap:18px; }
  .int-grid article { padding:24px 20px; }
  .feat-screens { padding:43px 22px; }
  .screens-heading h2 { font-size:30px; }
  .screens-heading>a { margin:0; }
  .feat-platforms { padding:50px 22px; }
  .plat-heading h2 { font-size:33px; }
  .feat-limits { padding:48px 22px; }
  .limits-heading>svg { display:none; }
  .limits-heading h2 { font-size:33px; }
  .feat-cta { padding:55px 22px 65px; }
  .feat-cta h2 { font-size:35px; }
  .cta-actions { gap:22px; }
}
@media(prefers-reduced-motion:reduce) { .feat-jump>a>svg,.feat-primary { transition:none; } }
</style>
