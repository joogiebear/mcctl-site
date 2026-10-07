import fs from 'node:fs'
import path from 'node:path'
import { createContentLoader, defineConfig, type HeadConfig } from 'vitepress'
import { cardSlug } from '../tools/social-cards/slug.mjs'
import { isPost, newestFirst, toPost } from './theme/posts'

// The project site: a landing page plus the docs, both in the app's own palette.
const reference = [
  { text: 'Commands', link: '/reference/commands' },
  { text: 'Server software', link: '/reference/servers' },
]
// Task-shaped pages, for someone who has the app and a goal.
const useCases = [
  { text: 'Host for friends', link: '/guide/host-for-friends' },
  { text: 'Paper, Fabric or NeoForge', link: '/guide/choose-software' },
  { text: 'Try things safely', link: '/guide/try-it-safely' },
  { text: 'Run a modpack', link: '/guide/modpack-server' },
]
const guide = [
  { text: 'Getting started', link: '/guide/getting-started' },
  { text: 'The panel', link: '/guide/panel' },
  { text: 'Plugins and mods', link: '/guide/plugins' },
  { text: 'Backups', link: '/guide/backups' },
  { text: 'Sharing your server', link: '/guide/sharing' },
  { text: 'The desktop app', link: '/guide/desktop' },
  { text: 'Downloads & platforms', link: '/guide/beta' },
  { text: 'Databases', link: '/guide/databases' },
  { text: 'AI assistants', link: '/guide/ai-assistants' },
  { text: 'Compare', link: '/guide/compare' },
  { text: 'How it works', link: '/guide/how-it-works' },
  { text: 'Security', link: '/guide/security' },
  { text: 'Troubleshooting', link: '/guide/troubleshooting' },
  { text: 'Questions', link: '/guide/faq' },
]

// The canonical address, and the host the pages really resolve on. In Vercel, spawnloft.com,
// spawnloft.app, spawnloft.dev and their www variants all redirect (308) to www.spawnloft.com, and
// vercel.json sends mcctl-site.vercel.app there too. The .app and .dev zones are in Cloudflare, each
// with an apex and a www CNAME (DNS only) to the project's Vercel target. Change it here only, and
// change it if the redirects ever flip.
const SITE = 'https://www.spawnloft.com'

const DESCRIPTION = 'Minecraft servers on your own PC, without the terminal. Free, open source, for Windows, macOS and Linux.'
const HOME_DESCRIPTION = 'Start a Paper, Fabric or NeoForge server on your machine, keep its console in front of you, install plugins, take backups that verify. No cloud, no accounts.'

// What a search engine reads to show SpawnLoft as an app rather than as a page. No version or
// rating on purpose: both would go stale or be invented, and the releases page has the real ones.
const SOFTWARE = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SpawnLoft',
  description: DESCRIPTION,
  url: SITE,
  image: `${SITE}/brand/social-card.png`,
  applicationCategory: 'GameApplication',
  operatingSystem: 'Windows, macOS, Linux',
  license: 'https://opensource.org/licenses/MIT',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  downloadUrl: 'https://github.com/joogiebear/spawnloft/releases/latest',
  codeRepository: 'https://github.com/joogiebear/spawnloft',
  author: { '@type': 'Person', name: 'joogiebear', url: 'https://github.com/joogiebear' },
}

export default defineConfig({
  title: 'SpawnLoft',
  description: DESCRIPTION,
  lang: 'en',
  cleanUrls: true,
  scrollOffset: 120,
  lastUpdated: true,
  srcExclude: ['README.md', 'art/**', 'tools/**'],
  appearance: 'force-dark',
  // /descent is an unlisted preview of an alternative hero, so it stays out of the sitemap as well as out of search.
  sitemap: { hostname: SITE, transformItems: items => items.filter(item => !item.url.includes('descent')) },
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'SpawnLoft' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'theme-color', content: '#090d0d' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: 'SpawnLoft blog', href: '/blog/feed.xml' }],
    // Vercel Web Analytics: cookieless, no personal data. Serves nothing until it is switched on
    // for the project in the Vercel dashboard, and the site works the same without it.
    ['script', { defer: '', src: '/_vercel/insights/script.js' }],
  ],
  // Every page names itself. Before this, og:url and og:title said "the home page" on all of them.
  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = `${SITE}/${path}`
    const home = pageData.relativePath === 'index.md'
    const title = home ? 'SpawnLoft — Minecraft servers on your own PC' : `${pageData.title} | SpawnLoft`
    const description = pageData.description || (home ? HOME_DESCRIPTION : DESCRIPTION)
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
    // Each page's own card from tools/social-cards when it has one; the shared card otherwise.
    const slug = cardSlug(pageData.relativePath)
    const image = !home && fs.existsSync(`public/social/${slug}.png`) ? `${SITE}/social/${slug}.png` : `${SITE}/brand/social-card.png`
    head.push(
      ['meta', { property: 'og:image', content: image }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { property: 'og:image:alt', content: `SpawnLoft: ${home ? 'Minecraft servers on your own PC' : pageData.title}` }],
      ['meta', { name: 'twitter:image', content: image }],
    )
    if (home) head.push(['script', { type: 'application/ld+json' }, JSON.stringify(SOFTWARE)])
    // Posts are articles, with a publish date for the people and feeds that read it.
    if (pageData.relativePath.startsWith('blog/') && pageData.relativePath !== 'blog/index.md') {
      head.push(['meta', { property: 'og:type', content: 'article' }])
      if (pageData.frontmatter.date) head.push(['meta', { property: 'article:published_time', content: new Date(String(pageData.frontmatter.date)).toISOString() }])
    }
    return head
  },
  // The RSS feed: a summary and a link for every post, newest first. Written next to the built pages.
  async buildEnd(siteConfig) {
    const raws = await createContentLoader('blog/*.md', { includeSrc: true, render: false, excerpt: false }).load()
    const posts = raws.filter(isPost).map(toPost).sort(newestFirst)
    const xml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const items = posts.map(post => `    <item>
      <title>${xml(post.title)}</title>
      <link>${SITE}${post.url}</link>
      <guid isPermaLink="true">${SITE}${post.url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${xml(post.description)}</description>
    </item>`).join('\n')
    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SpawnLoft blog</title>
    <link>${SITE}/blog/</link>
    <description>Notes on building SpawnLoft in the open: how it works, how it looks, and the decisions behind both.</description>
    <language>en</language>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
    fs.mkdirSync(path.join(siteConfig.outDir, 'blog'), { recursive: true })
    fs.writeFileSync(path.join(siteConfig.outDir, 'blog', 'feed.xml'), feed)
  },
  themeConfig: {
    logo: '/brand/mark.svg',
    siteTitle: 'SpawnLoft',
    nav: [
      { text: 'Features', link: '/features' },
      { text: 'Get started', link: '/get-started' },
      { text: 'Field guide', link: '/guide/', activeMatch: '^/(guide|reference)/' },
      { text: 'Changelog', link: '/changelog' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'Blog', link: '/blog/', activeMatch: '^/blog/' },
    ],
    sidebar: {
      '/guide/': [{ text: 'Start here', items: guide.slice(0,9) }, { text: 'Do more with it', items: useCases }, { text: 'Understand & troubleshoot', items: guide.slice(9) }, { text: 'Reference', items: reference }],
      '/reference/': [{ text: 'Start here', items: guide.slice(0,9) }, { text: 'Do more with it', items: useCases }, { text: 'Understand & troubleshoot', items: guide.slice(9) }, { text: 'Reference', items: reference }],
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
