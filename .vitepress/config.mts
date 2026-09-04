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

// Until a domain is attached, the Vercel address is the canonical one. Change it here only.
const SITE = 'https://mcctl-site.vercel.app'

export default defineConfig({
  title: 'mcctl',
  description: 'Minecraft servers on your own PC, without the terminal. Free, open source, Windows.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  srcExclude: ['README.md'],
  appearance: 'force-dark',
  sitemap: { hostname: SITE },
  head: [
    ['link', { rel: 'icon', href: '/img/icon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'mcctl — Minecraft servers on your own PC' }],
    ['meta', { property: 'og:description', content: 'Start a Paper, Fabric or NeoForge server on your machine, keep its console in front of you, install plugins, take backups that verify. No cloud, no accounts.' }],
    ['meta', { property: 'og:image', content: `${SITE}/img/console.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'theme-color', content: '#0c0e14' }],
  ],
  themeConfig: {
    logo: '/img/icon.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
      { text: 'Commands', link: '/reference/commands', activeMatch: '^/reference/' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Discussions', link: 'https://github.com/joogiebear/mcctl/discussions' },
    ],
    sidebar: {
      '/guide/': [{ text: 'Guide', items: guide }, { text: 'Reference', items: reference }],
      '/reference/': [{ text: 'Reference', items: reference }, { text: 'Guide', items: guide }],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/joogiebear/mcctl' }],
    editLink: { pattern: 'https://github.com/joogiebear/mcctl-site/edit/main/:path', text: 'Edit this page' },
    search: { provider: 'local' },
    footer: {
      message: 'MIT licensed. Built by <a href="https://github.com/joogiebear">joogiebear</a> and <a href="https://github.com/joogiebear/mcctl/graphs/contributors">contributors</a>.',
      copyright: '<a href="https://github.com/joogiebear/mcctl/releases">Releases</a> · <a href="https://github.com/joogiebear/mcctl/issues">Issues</a> · <a href="https://github.com/sponsors/joogiebear">Sponsor</a>',
    },
  },
})
