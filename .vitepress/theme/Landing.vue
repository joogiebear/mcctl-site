<script setup lang="ts">
import { ref } from 'vue'
import BrandIcon from './BrandIcon.vue'
import HomeHeader from './home/HomeHeader.vue'
import FeatureCard from './home/FeatureCard.vue'
import HomeDialogs from './home/HomeDialogs.vue'
import './home/home.css'
const dialogs = ref<InstanceType<typeof HomeDialogs>>()
const features = [
  { title: 'Stay in control.', icon: 'terminal', image: 'console', alt: 'Actual SpawnLoft server status, restart and stop controls, and live console.', text: 'Server controls and a live console, together.', href: '/guide/panel', linkLabel: 'Explore the panel' },
  { title: 'Make it yours.', icon: 'plugins', image: 'plugins', alt: 'Actual SpawnLoft Plugins tool with Modrinth and Hangar search, installed plugins, and update checks.', text: 'Find plugins and modpacks for your next world.', href: '/guide/plugins', linkLabel: 'Explore plugins & mods' },
  { title: 'Keep it safe.', icon: 'backup', image: 'backups', alt: 'Actual SpawnLoft Backups tool with snapshots, scopes, and restoration controls.', text: 'Back up your worlds and restore when you need to.', href: '/guide/backups', linkLabel: 'Explore backups' },
]
const steps = [
  { title: 'Install SpawnLoft', text: 'Get the app for your computer.', href: '/guide/getting-started' },
  { title: 'Create or import a server', text: 'Start fresh or bring your existing server.', href: '/guide/getting-started#three-steps' },
  { title: 'Press Start', text: 'Run your server from one place.', href: '/guide/panel' },
]
</script>
<template>
  <div class="spawnloft-home">
    <a class="home-skip" href="#main">Skip to content</a>
    <HomeHeader @download="dialogs?.openDownloads()" />
    <main id="main">
      <section class="home-hero home-container" aria-labelledby="hero-title">
        <div class="hero-copy">
          <p class="home-eyebrow">MINECRAFT JAVA SERVER MANAGER</p>
          <h1 id="hero-title">Your world.<br>Your server.<br><span>Your rules.</span></h1>
          <p class="hero-description">Create, run, customize, and back up Minecraft servers from one desktop app. On your own computer.</p>
          <div class="hero-buttons"><a class="home-button" href="/#download" @click.prevent="dialogs?.openDownloads()"><BrandIcon name="download" :size="18" />Download SpawnLoft</a><a class="home-button home-button-secondary" href="/demo/demo.mp4" @click.prevent="dialogs?.openDemo()"><BrandIcon name="play" :size="17" />Watch the demo</a></div>
          <p class="hero-notes">Free &amp; open source <span aria-hidden="true">·</span> No account needed<br><span class="platform-note">Windows <span aria-hidden="true">·</span> macOS <span aria-hidden="true">·</span> Linux</span></p>
        </div>
        <figure class="hero-product">
          <img class="hero-art" src="/models/world-poster.webp" alt="" width="1500" height="1350" aria-hidden="true" decoding="async">
          <a class="hero-capture" href="/img/tabs/console.webp" target="_blank" rel="noopener" aria-label="Open full SpawnLoft application screenshot in a new tab"><img src="/img/home/hero.webp" alt="SpawnLoft running Weekend World, with live server status, console, plugins, worlds, and backups in one window." width="1600" height="871" fetchpriority="high" decoding="async"></a>
          <figcaption>Your server. One control room.</figcaption>
        </figure>
      </section>
      <section class="home-compat" aria-label="Supported server software and plugin sources"><div class="home-container compat-row"><p class="home-eyebrow">BUILT FOR THE WAY YOU PLAY</p><div class="compat-names"><a href="/guide/choose-software">Paper</a><a href="/guide/choose-software">Fabric</a><a href="/guide/choose-software">NeoForge</a><a href="/guide/modpack-server">Modrinth</a><a href="/guide/plugins">Hangar</a></div></div></section>
      <section id="features" class="home-features home-container" aria-labelledby="features-title"><span id="product" class="home-anchor" aria-hidden="true"></span><h2 id="features-title">Less setup. More Minecraft.</h2><p class="home-section-description">The everyday tools, all in one place.</p><div class="home-feature-grid"><FeatureCard v-for="feature in features" :key="feature.image" v-bind="feature" /></div></section>
      <section id="how-it-works" class="home-start" aria-labelledby="steps-title"><span id="inside" class="home-anchor" aria-hidden="true"></span><div class="home-container"><p class="home-eyebrow">FROM DOWNLOAD TO YOUR FIRST WORLD</p><h2 id="steps-title">Three steps. Then start building.</h2><ol class="home-steps"><li v-for="(step, index) in steps" :key="step.title"><span class="step-number" aria-hidden="true">0{{ index + 1 }}</span><div><h3><a :href="step.href">{{ step.title }}</a></h3><p>{{ step.text }}</p></div></li></ol></div></section>
      <section id="download" class="home-container home-download" aria-labelledby="cta-title"><div class="home-cta"><div><h2 id="cta-title">Give your next world a home.</h2><p>Free, open source, and yours to run.</p></div><a class="home-button home-button-dark" href="/guide/beta" @click.prevent="dialogs?.openDownloads()"><BrandIcon name="download" :size="20" />Download SpawnLoft</a><img class="cta-art" src="/models/island-poster.webp" alt="" width="1400" height="1200" loading="lazy" aria-hidden="true"></div></section>
    </main>
    <footer class="home-container home-footer"><div class="footer-main"><a class="home-brand" href="/" aria-label="SpawnLoft home"><img src="/brand/mark.svg" alt="" width="34" height="34"><span>spawnloft.</span></a><p>MIT licensed <span aria-hidden="true">·</span> Not an official Minecraft product.</p><nav aria-label="Footer navigation"><a href="/guide/">Docs</a><a href="https://github.com/joogiebear/spawnloft">GitHub</a><a href="https://github.com/joogiebear/spawnloft/discussions">Community</a><a href="/blog/">Blog</a><a href="/descent">The Descent</a></nav></div><div class="footer-meta"><span>Built by <a href="https://github.com/joogiebear">joogiebear</a> &amp; contributors.</span><nav aria-label="Project links"><a href="/changelog">Changelog</a><a href="/roadmap">Roadmap</a><a href="https://github.com/joogiebear/spawnloft/releases/latest">Releases</a></nav><span>Not approved by or associated with Mojang or Microsoft.</span></div></footer>
    <HomeDialogs ref="dialogs" />
  </div>
</template>
