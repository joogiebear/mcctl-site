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
]

export default defineConfig({
  title: 'mcctl',
  description: 'Minecraft servers on your own PC, without the terminal. Free, open source, Windows.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'force-dark',
  head: [
    ['link', { rel: 'icon', href: '/img/icon.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:title', content: 'mcctl — Minecraft servers on your own PC' }],
    ['meta', { property: 'og:description', content: 'Start a Paper, Fabric or NeoForge server on your machine, keep its console in front of you, install plugins, take backups that verify. No cloud, no accounts.' }],
    ['meta', { property: 'og:image', content: '/img/console.png' }],
    ['meta', { name: 'theme-color', content: '#0c0e14' }],
  ],
  themeConfig: {
    logo: '/img/icon.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started', activeMatch: '^/guide/' },
      { text: 'Commands', link: '/reference/commands', activeMatch: '^/reference/' },
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
