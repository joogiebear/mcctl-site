<script setup lang="ts">
import BrandIcon from '../BrandIcon.vue'
import AppFrame from '../components/AppFrame.vue'
import ArrowLink from '../components/ArrowLink.vue'
import Button from '../components/Button.vue'
import Card from '../components/Card.vue'
import DemoPlayer from '../components/DemoPlayer.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Figure from '../components/Figure.vue'
import Pill from '../components/Pill.vue'
import SectionHead from '../components/SectionHead.vue'
import HomeLimits from '../sections/HomeLimits.vue'

// What SpawnLoft does, grouped by the job someone came to do rather than by the order the app
// lists its tools. Every line is something the shipped app does today; the launcher section says
// which channel it ships in.
const jumps = [
  ['Four jobs', '#jobs'], ['See it run', '#demo'], ['The app itself', '#screens'], ['What it works with', '#integrations'], ['The game launcher', '#launcher'], ['Platforms', '#platforms'],
]
const jobs = [
  {
    label: 'Run it', title: 'Run the server you actually want.',
    text: 'Pick the software and the Minecraft version. SpawnLoft fetches it, checks it and starts it. Or point it at the server you already run, and nothing moves.',
    points: ['Paper, Purpur, Folia, Spigot, CraftBukkit and vanilla', 'Fabric and NeoForge for mods', 'A whole Modrinth modpack in one step', 'Import an existing server folder in place'],
    link: ['Every server software', '/reference/servers'],
  },
  {
    label: 'Shape it', title: 'Make it unmistakably yours.',
    text: 'Search Modrinth and Hangar in the same window, install what fits your server, and see when something has an update waiting.',
    points: ['Modrinth and Hangar searched together', 'Only what your software can load', 'Update checks across everything installed', 'A snapshot before an update, automatically'],
    link: ['Plugins and mods', '/guide/plugins'],
  },
  {
    label: 'Keep it', title: 'Keep the world you built.',
    text: 'Backups on a schedule that are read back to prove they restore. Scheduled restarts. And when a server falls over, a read of why before you go looking.',
    points: ['Scheduled backups, verified not just written', 'Restore a world, the plugins or one config', 'Crash reports summarised in plain language', 'Optional automatic restart after a crash'],
    link: ['How backups work', '/guide/backups'],
  },
  {
    label: 'Work on it', title: 'Treat it like a project.',
    text: 'For the people writing the plugin rather than only running it. Clone a server into a disposable copy, drive everything from a terminal, or let an AI assistant you choose do the checking.',
    points: ['Clone to a throwaway server on its own port', 'RCON command and reply, without the blocking shell', 'Structured JSON and CSV out of the command line', 'An MCP server for Claude or any MCP app'],
    link: ['AI assistants and MCP', '/guide/ai-assistants'],
  },
]
const screens = [
  { id: 'console', label: 'Console', caption: 'Follow what the server is saying, search it, and send a command without losing your place.' },
  { id: 'backups', label: 'Backups', caption: 'Scheduled, verified, and restorable to a point you choose.' },
]
// The integration surface in one place. Names only where the project really supports them,
// with how each is verified: downloading a jar and checking its hash are not the same promise.
const integrations = [
  { title: 'Server software', eyebrow: 'Downloaded and checked, or built here', items: ['Paper', 'Purpur', 'Folia', 'Advanced Slime Paper', 'Spigot', 'CraftBukkit', 'Vanilla', 'Fabric', 'NeoForge'], detail: 'Paper, ASP and NeoForge verify by sha256, Purpur by md5, vanilla by sha1. SpigotMC publishes no jars, so BuildTools compiles Spigot and CraftBukkit on your machine.', link: ['Sources and verification', '/reference/servers'] },
  { title: 'Plugins, mods and packs', eyebrow: 'Two registries, one search field', items: ['Modrinth', 'Hangar', 'Modrinth modpacks', 'Local jar store', 'Saved templates'], detail: 'A Paper server searches Modrinth and Hangar. A Fabric or NeoForge server gets a Mods tool and searches Modrinth for its loader. Folia is offered only Folia-built plugins.', link: ['Installing and updating', '/guide/plugins'] },
  { title: 'Databases', eyebrow: 'Managed for you, running locally', items: ['MySQL 8.4 LTS', 'Garnet (Redis-compatible)'], detail: 'Set up and supervised by SpawnLoft, on your machine. Managed MySQL needs macOS 15 or later on a Mac and x64 on Linux; Garnet runs everywhere. Plugin configuration stays yours to write.', link: ['Connection details', '/guide/databases'] },
  { title: 'Tools and automation', eyebrow: 'For scripts, terminals and assistants', items: ['RCON', 'Command line', 'JSON and CSV output', 'MCP', 'Task Scheduler', 'launchd', 'systemd timers'], detail: 'The same engine runs from a terminal as from the window. Scheduling uses whatever your operating system already has. The MCP server redacts passwords and hides player IPs before anything reaches a model.', link: ['Command reference', '/reference/commands'] },
]
const launcher = [
  'Setups by Minecraft version, Vanilla or Fabric, with the memory you choose',
  'Any version in Mojang’s list; the game client gets Mojang’s own Java when none on the machine fits',
  'Windows x64, Apple Silicon and Linux x64; Linux arm64 cannot run the client',
  'Microsoft sign-in on Microsoft’s own page, or an offline name for a test server',
  'Press Play on a stopped server and it is started first, then joined',
]
const platforms = [
  { name: 'Windows', detail: '10 or 11 · x64', points: ['Signed installer, per user', 'Managed MySQL and Garnet', 'Schedules via Task Scheduler'] },
  { name: 'macOS', detail: '13 or later · Apple Silicon', points: ['Signed, notarized and stapled', 'Managed MySQL needs macOS 15 or later', 'Schedules via launchd', 'Intel Macs stay on 1.4'] },
  { name: 'Linux', detail: '.deb and .rpm · x64 or arm64', points: ['Hash-verified packages', 'Managed MySQL on x64 only', 'A command-line-only build for servers'] },
]

// A jump link scrolls to its section and moves focus there, so a keyboard user lands where the
// page went instead of tabbing on from the top.
function jumpTo(href: string) {
  const target = document.getElementById(href.slice(1))
  if (!target) return
  history.replaceState(null, '', href)
  target.setAttribute('tabindex', '-1')
  target.scrollIntoView({ block: 'start' })
  target.focus({ preventScroll: true })
}
</script>

<template>
  <main class="product-page">
    <section class="section top">
      <div class="wrap intro">
        <div class="words">
          <Eyebrow accent>Product</Eyebrow>
          <h1 class="h1">Everything a server needs. Nothing it does not.</h1>
          <p class="lede">SpawnLoft is a desktop app for running Minecraft Java Edition servers on your own Windows PC, Mac or Linux machine. Worlds, plugins, console, databases and backups in one window, for the people who want to play with friends and the people writing the plugin.</p>
          <div class="cta-row">
            <Button href="/download" size="lg"><template #icon><BrandIcon name="download" :size="16" /></template>Get SpawnLoft</Button>
            <Button href="/guide/" variant="quiet" size="lg">Read the docs<template #trailing><BrandIcon name="arrow" :size="16" /></template></Button>
          </div>
          <p class="small mono">Free · Open source · MIT licence · No account</p>
        </div>
        <nav class="jump" aria-label="On this page">
          <Eyebrow>On this page</Eyebrow>
          <a v-for="[text, href] in jumps" :key="href" :href="href" @click.prevent="jumpTo(href)"><span>{{ text }}</span><BrandIcon name="arrow" :size="16" /></a>
        </nav>
      </div>
    </section>

    <section class="section hairline" id="jobs">
      <div class="wrap">
        <SectionHead eyebrow="Four things people come here for" title="Pick the job, not the feature list.">
          <template #aside><p class="lede aside">Capabilities in the shipped app, grouped by what you came to do.</p></template>
        </SectionHead>
        <div class="jobs">
          <article v-for="job in jobs" :key="job.label" v-reveal>
            <Eyebrow>{{ job.label }}</Eyebrow>
            <h3 class="h3">{{ job.title }}</h3>
            <p class="body">{{ job.text }}</p>
            <ul><li v-for="point in job.points" :key="point">{{ point }}</li></ul>
            <ArrowLink :href="job.link[1]">{{ job.link[0] }}</ArrowLink>
          </article>
        </div>
      </div>
    </section>

    <section class="section band" id="demo">
      <div class="wrap">
        <SectionHead eyebrow="See it run" title="From nothing to a running server.">
          <template #aside><p class="lede aside">The real app on a fresh install. The waiting has been sped up, and nothing else has been changed.</p></template>
        </SectionHead>
        <DemoPlayer class="player" />
      </div>
    </section>

    <section class="section paper" id="screens">
      <div class="wrap-wide">
        <SectionHead eyebrow="Actual screens, not mockups" title="This is the app.">
          <template #aside><ArrowLink href="/guide/panel">A tour of the panel</ArrowLink></template>
        </SectionHead>
        <div class="grid grid-2 screens">
          <Figure v-for="screen in screens" :key="screen.id" :src="`/img/tabs/${screen.id}`" :widths="[800, 1280, 2558]" sizes="(min-width: 1400px) 660px, (min-width: 640px) 50vw, 100vw" :alt="`The SpawnLoft ${screen.label.toLowerCase()} panel, captured from the running app.`" :width="2558" :height="1392" :label="screen.label" :caption="screen.caption" detail="2558 × 1392" v-reveal />
        </div>
      </div>
    </section>

    <section class="section" id="integrations">
      <div class="wrap">
        <SectionHead eyebrow="The integration surface" title="What it works with." lede="The software it can run, the registries it can search, the services it can manage, and the ways you can drive it from somewhere other than the window." />
        <div class="grid grid-2 cards">
          <Card v-for="group in integrations" :key="group.title" :eyebrow="group.eyebrow" :title="group.title" v-reveal>
            <ul class="chips" :aria-label="group.title"><li v-for="item in group.items" :key="item"><Pill>{{ item }}</Pill></li></ul>
            <p>{{ group.detail }}</p>
            <ArrowLink :href="group.link[1]">{{ group.link[0] }}</ArrowLink>
          </Card>
        </div>
      </div>
    </section>

    <section class="section hairline" id="launcher">
      <div class="wrap two">
        <div class="words">
          <div class="eyebrow-row"><Eyebrow accent>The game launcher</Eyebrow><Pill tone="warn">1.6 beta</Pill></div>
          <h2 class="h2">Press Play on your own server.</h2>
          <p class="body">A window for the real Minecraft client, already pointed at one of your SpawnLoft servers. It is a developer's tool that goes with the app: make a setup, press Play, test the plugin you are writing as a player. Nothing is drawn or patched by SpawnLoft; it downloads the client Mojang ships and runs it.</p>
          <ul class="ticks"><li v-for="point in launcher" :key="point">{{ point }}</li></ul>
          <p class="body">It is not a mods launcher, a news feed or a store, and it has no account system of its own. It ships in the 1.6 betas; 1.5 does not have it, and the sign-in inside the packaged desktop app is still being verified.</p>
          <div class="links"><ArrowLink href="/guide/launcher">How the launcher works</ArrowLink><ArrowLink href="/guide/beta#automatic-updates-and-beta-builds">Get the beta builds</ArrowLink></div>
        </div>
        <div class="sketch-col" v-reveal>
          <AppFrame title="Game launcher" class="sketch">
            <div class="sk">
              <div class="sk-top"><span class="sk-brand"><BrandIcon name="mark" :size="18" /></span><span class="sk-chip"><i></i>Alex</span></div>
              <div class="sk-main">
                <div class="sk-play"><span class="sk-play-big"><BrandIcon name="play" :size="18" />Play</span><span class="sk-play-small">1.21.11 · Vanilla<BrandIcon name="chevron" :size="12" /></span></div>
                <p class="sk-line">Opens Minecraft 1.21.11 and joins <b>survival</b> as Alex.</p>
                <div class="sk-join"><span class="sk-label">Join</span><span class="sk-field"><i class="sk-dot"></i>survival<span class="sk-note">running · 1.21.11</span></span></div>
              </div>
            </div>
          </AppFrame>
          <p class="small caption">A sketch of the launcher's one screen, drawn in HTML to the same layout. Not a capture.</p>
        </div>
      </div>
    </section>

    <section class="section hairline" id="platforms">
      <div class="wrap">
        <SectionHead eyebrow="One release, three platforms" title="Built and tested on each.">
          <template #aside><ArrowLink href="/download#platforms">Installing, platform by platform</ArrowLink></template>
        </SectionHead>
        <div class="plats">
          <article v-for="platform in platforms" :key="platform.name" v-reveal>
            <h3 class="h3">{{ platform.name }}</h3>
            <p class="small mono">{{ platform.detail }}</p>
            <ul class="ticks"><li v-for="point in platform.points" :key="point">{{ point }}</li></ul>
          </article>
        </div>
      </div>
    </section>

    <HomeLimits />

    <section class="section cta">
      <div class="wrap">
        <Eyebrow accent>Sounds like your kind of server?</Eyebrow>
        <h2 class="h1">Running on your machine in about ten minutes.</h2>
        <div class="cta-row">
          <Button href="/download" size="lg"><template #icon><BrandIcon name="download" :size="16" /></template>Get SpawnLoft</Button>
          <Button href="https://github.com/joogiebear/spawnloft" variant="secondary" size="lg" external>Read the source<template #trailing><BrandIcon name="external" :size="16" /></template></Button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); }
.intro { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); gap: var(--s9); align-items: start; }
.words { display: grid; gap: var(--s5); align-content: start; }
.cta-row { display: flex; flex-wrap: wrap; gap: var(--s3) var(--s4); align-items: center; }
.aside { max-width: 24em; font-size: var(--t-body); }
section:focus { outline: 0; }
.jump { display: grid; align-content: start; padding-top: var(--s2); }
.jump .eyebrow { margin-bottom: var(--s3); }
.jump a { display: flex; justify-content: space-between; align-items: center; gap: var(--s4); padding: var(--s3) 0; border-top: 1px solid var(--line); font: 500 var(--t-ui)/1.3 var(--display); color: var(--fg-2); }
.jump a:last-child { border-bottom: 1px solid var(--line); }
.jump a svg { color: var(--accent-text); transition: transform var(--d1) var(--ease); }
.jump a:hover { color: var(--fg); }
.jump a:hover svg { transform: translateX(3px); }

.jobs { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s7) var(--s8); margin-top: var(--s7); }
.jobs article { display: grid; gap: var(--s3); align-content: start; padding-top: var(--s5); border-top: 1px solid var(--line-strong); }
.jobs .body { margin-bottom: var(--s1); }
.jobs ul, .ticks { list-style: none; padding: 0; margin: 0 0 var(--s2); display: grid; gap: var(--s2); }
.jobs li, .ticks li { display: flex; gap: var(--s3); align-items: baseline; color: var(--fg-2); font-size: var(--t-ui); line-height: 1.5; }
.jobs li::before, .ticks li::before { content: ""; width: 10px; height: 1px; background: var(--accent); flex: none; transform: translateY(-4px); }

.band { background: var(--bg-1); }
.player { margin-top: var(--s7); }

.screens { margin-top: var(--s7); gap: var(--s6); }
.cards { margin-top: var(--s7); }
.cards :deep(.card-body) { display: grid; gap: var(--s4); }
.cards :deep(.card-body p) { margin: 0; }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--s2); }

.two { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: var(--s8); align-items: center; }
.two .words { gap: var(--s4); }
.eyebrow-row { display: flex; align-items: center; gap: var(--s3); flex-wrap: wrap; }
.links { display: flex; flex-wrap: wrap; gap: var(--s3) var(--s6); margin-top: var(--s2); }
.sketch-col { display: grid; gap: var(--s3); }
.sk { display: grid; gap: var(--s6); padding: var(--s5); background: var(--bg); }
.sk-top { display: flex; justify-content: space-between; align-items: center; }
.sk-brand { color: var(--accent); display: inline-flex; }
.sk-chip { display: inline-flex; align-items: center; gap: var(--s2); padding: var(--s1) var(--s3) var(--s1) var(--s2); border: 1px solid var(--line-strong); border-radius: 999px; font: 500 var(--t-caption)/1.4 var(--mono); color: var(--fg-2); }
.sk-chip i { width: 16px; height: 16px; border-radius: var(--r1); background: var(--bg-3); }
.sk-main { display: grid; gap: var(--s4); justify-items: start; }
.sk-play { display: inline-flex; border-radius: var(--r1); overflow: hidden; }
.sk-play-big { display: inline-flex; align-items: center; gap: var(--s3); min-height: 52px; padding: 0 var(--s6) 0 var(--s5); background: var(--accent); color: var(--accent-fg); font: 600 var(--t-lede)/1 var(--display); }
.sk-play-small { display: inline-flex; align-items: center; gap: var(--s2); padding: 0 var(--s4); border-left: 1px solid var(--accent-fg); background: var(--accent); color: var(--accent-fg); font: 500 var(--t-caption)/1 var(--mono); opacity: .9; }
.sk-line { margin: 0; font-size: var(--t-small); color: var(--fg-3); }
.sk-line b { color: var(--fg-2); font-weight: 500; }
.sk-join { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: var(--s3); align-items: center; width: 100%; max-width: 26em; }
.sk-label { font: 500 var(--t-caption)/1.4 var(--mono); letter-spacing: .12em; text-transform: uppercase; color: var(--fg-3); }
.sk-field { display: flex; align-items: center; gap: var(--s2); min-height: 40px; padding: 0 var(--s3); border: 1px solid var(--line-strong); border-radius: var(--r1); background: var(--bg-1); font: 500 var(--t-small)/1 var(--mono); color: var(--fg); }
.sk-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); flex: none; }
.sk-note { margin-left: auto; font-weight: 400; color: var(--fg-3); }
.caption { max-width: 36em; }

.plats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s7) var(--s6); margin-top: var(--s7); }
.plats article { display: grid; gap: var(--s3); align-content: start; padding-top: var(--s5); border-top: 1px solid var(--line-strong); }

.cta { text-align: center; }
.cta .wrap { display: grid; gap: var(--s5); justify-items: center; }
.cta .h1 { max-width: 16em; }
.cta .cta-row { justify-content: center; }

@media (max-width: 980px) {
  .intro { grid-template-columns: minmax(0, 1fr); gap: var(--s7); }
  .two { grid-template-columns: minmax(0, 1fr); gap: var(--s7); align-items: start; }
  .plats { grid-template-columns: minmax(0, 1fr); gap: var(--s6); }
}
@media (max-width: 760px) { .jobs { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } }
@media (max-width: 420px) { .sk-note { display: none; } }
</style>
