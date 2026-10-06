// Draws a 1200x630 social card for every docs page into public/social/.
//
//   node tools/social-cards/build.mjs           # every page
//   node tools/social-cards/build.mjs guide-faq # just one, by card name
//
// The cards are committed, not built on deploy, because drawing them needs a Chromium and Vercel's
// build machine has none. Re-run this when a page's title or description changes, or the design does.
// The site config points each page's og:image at its card when the file exists, and at the shared
// card in public/brand/ when it does not. The home page always uses the shared card.
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { cardSlug } from './slug.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = path.join(ROOT, 'public', 'social')
const BROWSER = process.env.CARD_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p))
if (!BROWSER) throw new Error('No Chromium found. Set CARD_BROWSER.')

const escapeHtml = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function readPage(relativePath) {
  const source = fs.readFileSync(path.join(ROOT, relativePath), 'utf8').replace(/\r\n/g, '\n')
  const front = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? ''
  const field = name => new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(front)?.[1].trim().replace(/^['"]|['"]$/g, '')
  const heading = /^# (.+)$/m.exec(source)?.[1].trim()
  const section = relativePath.startsWith('guide/') ? 'FIELD GUIDE' : relativePath.startsWith('reference/') ? 'REFERENCE' : relativePath.startsWith('blog/') ? 'BLOG' : relativePath.replace(/\.md$/, '').toUpperCase()
  return { relativePath, slug: cardSlug(relativePath), title: field('title') || heading, description: field('description') || '', section }
}

const files = ['changelog.md', 'roadmap.md',
  ...fs.readdirSync(path.join(ROOT, 'guide')).filter(f => f.endsWith('.md')).map(f => `guide/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'reference')).filter(f => f.endsWith('.md')).map(f => `reference/${f}`),
  ...fs.readdirSync(path.join(ROOT, 'blog')).filter(f => f.endsWith('.md')).map(f => `blog/${f}`)]
const only = process.argv[2]
const pages = files.map(readPage).filter(p => p.title && (!only || p.slug === only))
if (!pages.length) throw new Error(only ? `No page has the card name ${only}.` : 'No pages found.')

// Shorter titles get bigger type. The right-hand third belongs to the artwork, so text stays left of it.
const titleSize = t => t.length <= 16 ? 96 : t.length <= 26 ? 82 : t.length <= 40 ? 68 : 56
const trim = (text, max) => text.length <= max ? text : text.slice(0, text.lastIndexOf(' ', max - 1)).replace(/[,.;:]$/, '') + '…'

const card = page => `<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=JetBrains+Mono:wght@500&display=swap">
<style>
  * { box-sizing: border-box; margin: 0 }
  html, body { width: 1200px; height: 630px; overflow: hidden; background: #090c0d }
  body { position: relative; font-family: 'Bricolage Grotesque', Arial, sans-serif; color: #f0eee7 }
  svg.art { position: absolute; inset: 0 }
  .brand { position: absolute; left: 70px; top: 56px; display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 700; letter-spacing: -1.2px }
  .brand svg { width: 46px; height: 46px }
  .label { position: absolute; left: 74px; top: 156px; font: 500 20px 'JetBrains Mono', monospace; letter-spacing: .16em; color: #c4f566 }
  .text { position: absolute; left: 70px; top: 196px; width: 660px }
  h1 { font-weight: 600; line-height: .98; letter-spacing: -.045em; font-size: ${titleSize(page.title)}px }
  p { margin: 34px 0 0 4px; width: 640px; font-size: 25px; line-height: 1.4; color: #b5b8ae; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden }
  .foot { position: absolute; left: 70px; right: 70px; bottom: 0; height: 89px; border-top: 1px solid #30372c }
  .foot span { position: absolute; left: 4px; top: 30px; font: 500 17px 'JetBrains Mono', monospace; letter-spacing: .18em }
</style>
<svg class="art" width="1200" height="630" viewBox="0 0 1200 630" fill="none" aria-hidden="true">
  <path d="M790 152 990 42l200 110v225L990 489 790 377Z" stroke="#c4f566" stroke-width="2"/>
  <path d="m790 152 200 113 200-113M990 265v224" stroke="#c4f566" stroke-width="2"/>
  <path d="m830 240 160 90 160-90v80l-160 90-160-90Z" fill="#c4f566"/>
  <path d="m875 337 115 65 115-65v80l-115 65-115-65Z" fill="#627c35"/>
</svg>
<div class="brand"><svg viewBox="0 0 64 64" fill="none"><path d="M20 8H56V20H24V26H44L56 38V56H8V44H40V38H20L8 26V20Z" fill="#c4f566"/></svg>SpawnLoft</div>
<div class="label">${escapeHtml(page.section)}</div>
<div class="text"><h1>${escapeHtml(page.title)}</h1>
<p>${escapeHtml(trim(page.description, 150))}</p></div>
<div class="foot"><span>SPAWNLOFT.COM</span></div>`

fs.mkdirSync(OUT, { recursive: true })
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'spawnloft-cards-'))
let made = 0
for (const page of pages) {
  const html = path.join(scratch, `${page.slug || 'home'}.html`)
  const png = path.join(OUT, `${page.slug}.png`)
  fs.writeFileSync(html, card(page))
  const run = spawnSync(BROWSER, [
    '--headless=new', `--user-data-dir=${path.join(scratch, 'profile')}`, '--no-first-run', '--disable-extensions', '--disable-sync',
    '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=8000',
    `--screenshot=${png}`, pathToFileURL(html).href,
  ], { stdio: 'ignore', timeout: 60000 })
  if (!fs.existsSync(png)) throw new Error(`No card drawn for ${page.slug} (exit ${run.status}).`)
  console.log(`${page.slug.padEnd(28)} ${(fs.statSync(png).size / 1024).toFixed(0)} KB  ${page.title}`)
  made++
}
try { fs.rmSync(scratch, { recursive: true, force: true }) } catch { /* scratch */ }
console.log(`Drew ${made} card${made === 1 ? '' : 's'} into public/social/.`)
