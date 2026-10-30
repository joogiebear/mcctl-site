<script setup lang="ts">
import ArrowLink from '../components/ArrowLink.vue'
import Card from '../components/Card.vue'
import CodeBlock from '../components/CodeBlock.vue'
import Disclosure from '../components/Disclosure.vue'
import Eyebrow from '../components/Eyebrow.vue'
import Notice from '../components/Notice.vue'
import PlatformPicker from '../components/PlatformPicker.vue'
import Prose from '../components/Prose.vue'
import SectionHead from '../components/SectionHead.vue'
import Step from '../components/Step.vue'
import Steps from '../components/Steps.vue'
import { INTEL_MAC_URL, RELEASES_URL } from '../release'

// The canonical download page. The picker first, then what happens on first run, the Java table,
// the per-platform notes with the awkward parts named rather than buried, and where to go next.
const steps = [
  { title: 'Install SpawnLoft.', body: 'Run the installer for your system. On first launch it looks for Java and says plainly if the version you have will not run the Minecraft you want. No account, nothing to sign up for.' },
  { title: 'Add a server.', body: 'Choose Add a server, pick the software and Minecraft version, and the jar downloads with real progress. Already run a server? Point SpawnLoft at its folder instead: nothing is moved or rewritten, and its ports and RCON password are read from its own server.properties.' },
  { title: 'Press Start.', body: 'Watch the console until it prints Done. Type list to see who is on. Open Plugins and install something. Take a backup while you are there, so the next experiment has a way back.' },
]
const java = [['1.18 to 1.20.4', 'Java 17', 'Paper and Fabric'], ['1.20.5 to 1.21.x', 'Java 21', 'Current for most servers'], ['26.x', 'Java 25', 'The newest Minecraft']]
const next = [
  { title: 'Let friends in', body: 'How people actually connect, and what to switch on first.', href: '/guide/sharing' },
  { title: 'Install plugins', body: 'Search Modrinth and Hangar, install, and keep things updated.', href: '/guide/plugins' },
  { title: 'Set up backups', body: 'Schedule them, verify them, and know how to restore one.', href: '/guide/backups' },
  { title: 'Try things safely', body: 'Clone your server into a copy and break that one instead.', href: '/guide/try-it-safely' },
]
</script>

<template>
  <main class="download-page">
    <section class="section top">
      <div class="wrap dl">
        <div class="words">
          <Eyebrow accent>Download</Eyebrow>
          <h1 class="h1">Get SpawnLoft.</h1>
          <p class="lede">Free and open source, for Windows, macOS and Linux. Install it, add a server, press Start. Java is the one thing it cannot install for you, and it says which one you need before it downloads anything.</p>
          <p class="small">Signed Windows and Mac installers · macOS 13 or later on Apple Silicon · Ubuntu 22.04+, Debian 12+, Fedora, RHEL 9, x64 and arm64 · MIT licence</p>
        </div>
        <PlatformPicker />
      </div>
    </section>

    <section class="section hairline" id="first-run">
      <div class="wrap">
        <SectionHead eyebrow="What happens next" title="Running in about ten minutes.">
          <template #aside><ArrowLink href="/guide/getting-started">The detailed setup guide</ArrowLink></template>
        </SectionHead>
        <Steps class="steps"><Step v-for="step in steps" :key="step.title" :title="step.title"><p>{{ step.body }}</p></Step></Steps>
      </div>
    </section>

    <section class="section hairline" id="java">
      <div class="wrap two">
        <div class="words">
          <SectionHead eyebrow="Before you start" title="One thing it cannot install for you." :rule="false" />
          <p class="body">Minecraft servers are Java programs, so Java is separate on every platform. SpawnLoft checks for it on first run, searches your PATH and the usual install folders, and picks the newest installed Java that fits each server. It refuses a version nothing on your machine can run before downloading anything, and links the one you need.</p>
          <p class="body">Use a JDK rather than a JRE if you want Spigot or CraftBukkit built on your machine.</p>
          <ArrowLink href="https://adoptium.net/temurin/releases/?version=25" external>Temurin 25 is a good default</ArrowLink>
        </div>
        <Prose class="table">
          <table>
            <caption class="eyebrow">Which Java your Minecraft wants</caption>
            <thead><tr><th scope="col">Minecraft</th><th scope="col">Needs</th><th scope="col">Notes</th></tr></thead>
            <tbody><tr v-for="row in java" :key="row[0]"><td>{{ row[0] }}</td><td>{{ row[1] }}</td><td>{{ row[2] }}</td></tr></tbody>
          </table>
        </Prose>
      </div>
    </section>

    <section class="section hairline" id="platforms">
      <div class="wrap">
        <SectionHead eyebrow="Platform notes" title="Installing, platform by platform." lede="Open the one that is yours. Each includes the part people trip over." />
        <div class="notes">
          <Disclosure id="windows" summary="Windows 10 or 11, x64" open>
            <p>Run the <code>.exe</code> installer. It installs per user, so there is no administrator prompt. Installers are signed through Microsoft Azure Artifact Signing.</p>
            <Notice title="Heads up" tone="warn"><p>SmartScreen judges by reputation, not signature, and a new publisher earns reputation slowly. If Windows says "Windows protected your PC", choose <b>More info</b>, then <b>Run anyway</b>. <a href="/guide/getting-started#smartscreen">Why that warning appears</a></p></Notice>
          </Disclosure>
          <Disclosure id="mac" summary="macOS 13 or later, Apple Silicon">
            <p>Open the DMG and drag SpawnLoft into Applications. The build is Developer ID signed, hardened, Apple-notarized and stapled. Launch it from Applications and follow the Java check.</p>
            <Notice title="Worth knowing"><p>Managed MySQL is the one feature that needs macOS 15 or later. Intel Macs stay on <a :href="INTEL_MAC_URL">1.4</a>, the last version built for them; an Intel Mac is not offered 1.5 or later, and its update check says so. <a href="/guide/getting-started#install-on-mac">Mac setup steps</a></p></Notice>
          </Disclosure>
          <Disclosure id="linux" summary="Linux, .deb or .rpm, x64 or arm64">
            <CodeBlock code="# Ubuntu 22.04+, Debian 12+&#10;$ sudo apt install ./SpawnLoft-1.5.0-linux-amd64.deb&#10;# Fedora, the RHEL family, openSUSE&#10;$ sudo dnf install ./SpawnLoft-1.5.0-linux-x86_64.rpm" />
            <p>Everything installs to <code>/opt/SpawnLoft</code>. Open SpawnLoft from the applications menu, or run <code>spawnloft-desktop</code>; <code>spawnloft</code> is the command line. Neither needs Node.</p>
            <Notice title="Read this one" tone="warn"><p>Schedules and automatic backups run on systemd user timers, and they stop when you log out unless lingering is on for your account. Turn on <b>Keep running after logout</b> in the Backups or Schedule tool, or run <code>spawnloft task linger on</code>. On a machine you reach over SSH, that is the difference between a nightly backup and none. <a href="/guide/beta#install-on-linux">Linux notes in full</a></p></Notice>
            <p>Managed MySQL runs on x64 only. Running a server with no screen? There is a command-line-only package, about 30 MB, with its own runtime. <a href="/guide/beta#no-screen">Set that up instead</a>.</p>
          </Disclosure>
        </div>
        <p class="small verify">Every file of a release, with its size, is listed on <a :href="RELEASES_URL">GitHub Releases</a>. The Windows and Mac installers are code-signed, and the app's own updater verifies each package it downloads by hash.</p>
      </div>
    </section>

    <section class="section hairline" id="next">
      <div class="wrap">
        <SectionHead eyebrow="Once it is running" title="Good next moves.">
          <template #aside><ArrowLink href="/guide/troubleshooting">Something not working?</ArrowLink></template>
        </SectionHead>
        <div class="grid grid-4 cards">
          <Card v-for="item in next" :key="item.href" :title="item.title" :href="item.href" level="h3"><p>{{ item.body }}</p></Card>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.top { padding-top: var(--s8); }
.dl { display: grid; grid-template-columns: 1.1fr 1fr; gap: var(--s8); align-items: start; }
.words { display: grid; gap: var(--s5); align-content: start; }
.steps { margin-top: var(--s6); }
.two { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: var(--s8); align-items: start; }
.two .words { gap: var(--s4); }
.two :deep(.sec-head) { margin-bottom: var(--s2); }
.table { max-width: none; }
.table caption { text-align: left; padding-bottom: var(--s3); caption-side: top; }
.notes { margin-top: var(--s6); }
.notes :deep(.disc-body) { display: grid; gap: var(--s4); max-width: 46em; }
.notes :deep(.disc-body p) { margin: 0; }
.notes :deep(.disc-body code) { font-family: var(--mono); font-size: .88em; background: var(--bg-2); padding: 1px 5px; border-radius: 3px; }
.verify { margin-top: var(--s6); max-width: 46em; }
.verify a { color: var(--fg-2); text-decoration: underline; text-underline-offset: 3px; }
.cards { margin-top: var(--s6); }
@media (max-width: 900px) { .dl, .two { grid-template-columns: minmax(0, 1fr); gap: var(--s7); } }
</style>
