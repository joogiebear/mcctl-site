import { defineConfig } from 'vitepress'

// The project site: a landing page plus the docs, both in the app's own palette.
const reference = [
  { text: 'Commands', link: '/reference/commands' },
  { text: 'Server software', link: '/reference/servers' },
]
const guide = [
  { text: 'Getting started', link: '/guide/getting-started' },
  { text: 'The panel', link: '/guide/panel' },
  { text: 'The desktop app', link: '/guide/desktop' },
  { text: 'How it works', link: '/guide/how-it-works' },
  { text: 'Security', link: '/guide/security' },
  { text: 'Troubleshooting', link: '/guide/troubleshooting' },
  { text: 'Questions', link: '/guide/faq' },
]

// The canonical address. spawnloft.app and spawnloft.dev redirect here. Change it here only.
const SITE = 'https://spawnloft.com'

export default defineConfig({
  title: 'SpawnLoft',
  description: 'Minecraft servers on your own PC, without the terminal. Free, open source, Windows.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md', 'art/**'],
  appearance: 'force-dark',
  sitemap: { hostname: SITE },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'SpawnLoft — Minecraft servers on your own PC' }],
    ['meta', { property: 'og:site_name', content: 'SpawnLoft' }],
    ['meta', { property: 'og:url', content: SITE }],
    ['meta', { property: 'og:description', content: 'Start a Paper, Fabric or NeoForge server on your machine, keep its console in front of you, install plugins, take backups that verify. No cloud, no accounts.' }],
    ['meta', { property: 'og:image', content: `${SITE}/brand/social-card.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'SpawnLoft — Minecraft servers on your own PC' }],
    ['meta', { name: 'twitter:image', content: `${SITE}/brand/social-card.png` }],
    ['meta', { name: 'theme-color', content: '#090d0d' }],
  ],
  themeConfig: {
    logo: '/brand/mark.svg',
    siteTitle: 'SpawnLoft',
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
      { text: 'Commands', link: '/reference/commands', activeMatch: '^/reference/' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Discussions', link: 'https://github.com/joogiebear/spawnloft/discussions' },
    ],
    sidebar: {
      '/guide/': [{ text: 'Guide', items: guide }, { text: 'Reference', items: reference }],
      '/reference/': [{ text: 'Reference', items: reference }, { text: 'Guide', items: guide }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joogiebear/spawnloft' }],
    editLink: { pattern: 'https://github.com/joogiebear/mcctl-site/edit/main/:path', text: 'Edit this page' },
    search: { provider: 'local' },
    footer: {
      message: 'MIT licensed. Built by <a href="https://github.com/joogiebear">joogiebear</a> and <a href="https://github.com/joogiebear/spawnloft/graphs/contributors">contributors</a>.',
      copyright: '<a href="https://github.com/joogiebear/spawnloft/releases">Releases</a> · <a href="https://github.com/joogiebear/spawnloft/issues">Issues</a> · <a href="https://github.com/sponsors/joogiebear">Sponsor</a>',
    },
  },
})
