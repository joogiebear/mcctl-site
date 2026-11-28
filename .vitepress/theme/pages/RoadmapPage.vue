<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Button from '../components/Button.vue'
import Disclosure from '../components/Disclosure.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Notice from '../components/Notice.vue'
import SectionHead from '../components/SectionHead.vue'

// What has shipped, what is next, what is further out, and what keeps the project
// focused. The living document is ROADMAP.md in the app repository; this page is its reading copy.
const ROADMAP_URL = 'https://github.com/joogiebear/spawnloft/blob/v2/ROADMAP.md'
const jumps = [['Already here', '#done'], ['Next', '#next'], ['Further out', '#reach'], ['What keeps it focused', '#focus']]
const shipped = [
  { name: 'Reliability', summary: 'A little less looking over your shoulder.', detail: 'Optional crash auto-restart with a crash-loop stop. Scheduled restarts warn players first, and Discord webhooks report the events nobody is watching for. Snapshot verification reads archives back and checks their coverage.' },
  { name: 'Plugin manager', summary: 'Find the right addition. Keep it up to date.', detail: 'Search Modrinth and Hangar together, with compatibility filtering or version checks, hash-based update checks, and one-click updates that take a snapshot first. Enable and disable plugins in place. SpawnLoft manages what it installed; hand-dropped custom and premium plugins are left alone.' },
  { name: 'Server updates', summary: 'Move forward with a way back.', detail: 'Move to the newest Paper build in one click, keeping the old jar. Crossing Minecraft versions follows a separate, confirmed, snapshot-first path, because worlds migrate one way.' },
  { name: 'Modded servers', summary: 'For worlds with their own rules.', detail: 'Fabric and NeoForge are first-class loaders with a Mods tool. Install whole modpacks from Modrinth. Pack updates may only touch files the old pack owned, so your other additions survive.' },
  { name: 'Worlds', summary: 'Bring a map. Make it home.', detail: 'See every world with the active one named. Import a downloaded map from a zip or folder, export one, switch which world runs, and delete with its scope made clear. Snapshots include the active world set, and a backup mirror copies every snapshot to a second location as it is taken.' },
  { name: 'Log intelligence', summary: 'Less searching. A clearer next step.', detail: 'Common failure shapes are recognised and a suggested fix is shown where the failure surfaces: ports already taken, EULA acceptance, wrong Java, insufficient memory or disk, missing dependencies, duplicate plugins, corrupt worlds, ticking crashes, watchdog stalls and missing jars.' },
  { name: 'Linux', summary: 'The same control room on one more kind of machine.', detail: 'The same panel and command line on Linux, as a .deb and an .rpm for x64 and arm64. Schedules and automatic backups through systemd, live performance from /proc, managed MySQL on x64 and Redis on both, and automatic updates. For a server with no screen, spawnloft-cli is the command line alone on its own runtime.' },
  { name: 'AI assistants', summary: 'Ask in plain words. Approve each change.', detail: 'Let Claude Desktop, Claude Code or another MCP app you choose check status, read the console, explain a crash, take backups, and update plugins and Paper. No account, no open port, nothing sent unless that app asks. Passwords never leave, player IPs are hidden, and anything that cannot be undone is off unless you allow it.' },
  { name: 'Console export', summary: 'Get the right details to the right person.', detail: 'Export the console to a file, or upload it to mclo.gs after confirmation. Your account name is removed from file paths first. This was the first feature contributed from outside the project.' },
  { name: 'Databases', summary: 'A database for the plugin that wants one.', detail: 'Create MySQL or a Redis-compatible service (Garnet) for a server in one click, with its own database and user, listening on your machine only. SpawnLoft shows the connection details and never writes them into a plugin. Server snapshots include a dump, and MySQL has its own backups.' },
  { name: 'Java that picks itself', summary: 'The right Java, per server.', detail: 'Each server uses the newest installed Java that fits its Minecraft version (17, 21 or 25). A version nothing installed can run is refused before anything is downloaded.' },
  { name: 'The game launcher', summary: 'Press Play on your own server.', detail: 'Make a setup with a Minecraft version, an optional mod loader and some memory, press Play, and the game Mojang ships starts and joins your server. Sign in with Microsoft, or play offline on a test server. Windows, Apple Silicon Macs and Linux x64.' },
  { name: 'SpawnLoft 2.0', summary: 'A new foundation, and updates that leave your servers alone.', detail: 'One native program with no Node.js inside it, so installers are around 7 to 9 MB. A small supervisor looks after each server, so they keep running while the app updates or restarts. Every update is checked against SpawnLoft’s own signing key. The panel now needs a sign-in, so other programs on the machine cannot use it.' },
  { name: 'A redesigned panel', summary: 'The console stays where you can see it.', detail: 'Servers are tabs, and a server’s tools open from a dock beside its console instead of replacing it. An overview shows every server’s state, players, TPS, memory and last backup, with a Needs attention row for crashes, plugin updates, missing backups and an outdated Java. AI assistants can read and change plugin configuration files, snapshotting each one first.' },
]
const share = [
  { label: 'Local', title: 'Around the house.', text: 'Your LAN address, plainly shown for people on your home network.' },
  { label: 'Direct', title: 'A door you open.', text: 'A DNS record on your own domain pointing to your home IP. UPnP would be an explicit opt-in.' },
  { label: 'Tunnel', title: 'Another way through.', text: 'A connection through playit.gg or a VPS relay, with no router ports opened and your home IP hidden.' },
]
const reach = [
  { title: 'Easier to find, easier to install.', text: 'A winget manifest to bring installation to the Windows package manager. It is not an available installation method yet.' },
  { title: 'Linux, in more shapes.', text: 'A .deb and an .rpm for x64 and arm64 ship today, and a command-line package for servers with no screen. An AppImage is still to come; it needs its own answers to libfuse2, Ubuntu’s AppArmor sandbox, and a path that changes every launch.', link: ['Platform support', '/guide/beta'] },
  { title: 'More languages.', text: 'Localisation is a future direction. Language support and timing have not been announced.' },
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
  <main class="roadmap-page">
    <section class="section top">
      <div class="wrap">
        <SectionHead level="h1" eyebrow="Roadmap" title="A bigger world. The same purpose." lede="Better tools for the server on your own PC, built around the people who make it theirs. What has shipped, what is next, and what is deliberately not on the list.">
          <template #aside><ArrowLink :href="ROADMAP_URL" external>The living roadmap</ArrowLink></template>
        </SectionHead>
        <nav class="jumps" aria-label="Roadmap sections"><a v-for="[text, href] in jumps" :key="href" :href="href" @click.prevent="jumpTo(href)">{{ text }}</a></nav>
      </div>
    </section>

    <section class="section paper" id="done">
      <div class="wrap two">
        <div class="side">
          <SectionHead eyebrow="Shipped" title="Good ideas. Real tools." lede="Already part of SpawnLoft. Open one for the details." :rule="false" />
          <ArrowLink href="/changelog">Read the release notes</ArrowLink>
        </div>
        <div class="list">
          <Disclosure v-for="item in shipped" :key="item.name" :summary="item.name" :note="item.summary"><p>{{ item.detail }}</p></Disclosure>
        </div>
      </div>
    </section>

    <section class="section" id="next">
      <div class="wrap">
        <SectionHead eyebrow="Next · on the roadmap" title="A share screen: your people, a considered way in." lede="A clearer answer to the question every host asks first. Sharing should be an informed choice, with the level of access made plain." />
        <div class="grid grid-3 share">
          <article v-for="option in share" :key="option.label" v-reveal>
            <Eyebrow>{{ option.label }}</Eyebrow>
            <h3 class="h3">{{ option.title }}</h3>
            <p class="body">{{ option.text }}</p>
          </article>
        </div>
        <Notice class="note" title="Not available yet"><p>The planned screen would prompt you to use a whitelist and online mode when going public. No release date is set.</p></Notice>
      </div>
    </section>

    <section class="section hairline" id="reach">
      <div class="wrap two">
        <div class="side">
          <SectionHead eyebrow="Further out" title="More ways to make it yours." lede="Directions worth exploring, without promising a delivery date." :rule="false" />
        </div>
        <div class="reach">
          <article v-for="item in reach" :key="item.title" v-reveal>
            <h3 class="h3">{{ item.title }}</h3>
            <p class="body">{{ item.text }}</p>
            <ArrowLink v-if="item.link" :href="item.link[1]">{{ item.link[0] }}</ArrowLink>
          </article>
        </div>
      </div>
    </section>

    <section class="section band" id="focus">
      <div class="wrap two">
        <div class="side">
          <SectionHead eyebrow="What keeps it focused" title="Built for your PC, and your kind of server." :rule="false" />
        </div>
        <div class="focus">
          <p class="body">SpawnLoft is for one person’s machine: servers for friends, family or plugin testing. It needs no account, no cloud service and no Docker, and network access stays a deliberate decision.</p>
          <Disclosure summary="What is not on this roadmap"><p>Multi-node hosting and a remotely accessible control panel. Exposing a server control panel to another machine also exposes its console. To manage SpawnLoft from elsewhere, remote into the machine that runs it.</p></Disclosure>
          <ArrowLink href="/guide/security">Read about local control</ArrowLink>
        </div>
      </div>
    </section>

    <section class="section hairline">
      <div class="wrap">
        <SectionHead eyebrow="Got something in mind?" title="Help shape what is next." lede="Tell us about the world you are building and the tools you wish you had." :rule="false">
          <template #aside><Button href="https://github.com/joogiebear/spawnloft/discussions/categories/ideas" external>Share an idea</Button></template>
        </SectionHead>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); padding-bottom: var(--s7); }
section:focus { outline: 0; }
.jumps { display: flex; flex-wrap: wrap; gap: var(--s2) var(--s6); margin-top: var(--s5); }
.jumps a { font: 500 var(--t-ui)/1.3 var(--display); color: var(--fg-2); padding: var(--s2) 0; }
.jumps a:hover { color: var(--accent-text); }
.two { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: var(--s8); align-items: start; }
.side { display: grid; gap: var(--s4); position: sticky; top: calc(var(--header-h) + var(--s6)); }
.side :deep(.sec-head) { margin: 0; }
.list { min-width: 0; }
.share { margin-top: var(--s7); gap: var(--s6); }
.share article { display: grid; gap: var(--s3); align-content: start; padding-top: var(--s5); border-top: 1px solid var(--line-strong); }
.note { margin-top: var(--s6); max-width: 40em; }
.reach { display: grid; }
.reach article { display: grid; gap: var(--s3); padding: var(--s5) 0; border-top: 1px solid var(--line); }
.reach article:last-child { border-bottom: 1px solid var(--line); }
.band { background: var(--bg-1); }
.focus { display: grid; gap: var(--s5); max-width: 40em; }
@media (max-width: 900px) { .two { grid-template-columns: minmax(0, 1fr); gap: var(--s6); } .side { position: static; } }
</style>
