// Renders site pages at a desktop and a mobile viewport, for the visual check before review.
//   OUT=/tmp/shots node tools/shoot-site.mjs /features /get-started
// Uses the Chromium that Playwright already downloaded; set PW_CHROME to point elsewhere.
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE || 'http://127.0.0.1:4173'
const OUT = path.resolve(process.env.OUT || 'shots-site')
const ROUTES = process.argv.slice(2)
if (!ROUTES.length) throw new Error('Usage: shoot-site.mjs /route [/route...]')

const CHROME = process.env.PW_CHROME || '../.pw-browsers/chromium-1248/chrome-linux64/chrome'
if (!fs.existsSync(CHROME)) throw new Error(`No Chromium at ${CHROME}. Set PW_CHROME.`)
fs.mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 960, scale: 1 },
  { name: 'mobile', width: 390, height: 844, scale: 2, mobile: true },
]

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox', '--hide-scrollbars'] })
const problems = []

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.scale,
    isMobile: vp.mobile || false,
    hasTouch: vp.mobile || false,
  })
  for (const route of ROUTES) {
    const page = await context.newPage()
    const slug = route.replace(/^\//, '').replace(/\/$/, '') || 'home'
    page.on('console', m => { if (m.type() === 'error') problems.push(`[console] ${vp.name} ${route}: ${m.text()}`) })
    page.on('pageerror', e => problems.push(`[pageerror] ${vp.name} ${route}: ${e.message}`))
    const res = await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 })
    if (!res || !res.ok()) problems.push(`[http ${res && res.status()}] ${vp.name} ${route}`)

    // Native <details> are shut on load; open them so the disclosed copy is in the capture too.
    await page.evaluate(() => document.querySelectorAll('.plat-list details').forEach(d => { d.open = true }))

    // The panel captures are loading="lazy", so a capture taken straight after networkidle shows
    // empty boxes. Drop the attribute and let them all fetch, rather than scrolling a very tall
    // page at 2x, which crashes the renderer.
    await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]')
      .forEach(i => i.removeAttribute('loading')))
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    const broken = await page.evaluate(() => [...document.images]
      .filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src))
    if (broken.length) problems.push(`[images] ${vp.name} ${route}: ${broken.join(', ')}`)

    await page.screenshot({ path: path.join(OUT, `${slug}-${vp.name}.png`), fullPage: true })

    // Horizontal overflow is the failure these viewports exist to catch.
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      const wide = [...document.querySelectorAll('body *')]
        .filter(el => el.getBoundingClientRect().right > doc.clientWidth + 1)
        .map(el => `${el.tagName.toLowerCase()}.${(el.className || '').toString().split(' ')[0]}`)
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, wide: [...new Set(wide)].slice(0, 8) }
    })
    if (overflow.scrollW > overflow.clientW + 1) {
      problems.push(`[overflow] ${vp.name} ${route}: scrollWidth ${overflow.scrollW} > ${overflow.clientW} — ${overflow.wide.join(', ')}`)
    }
    await page.close()
  }
  await context.close()
}

await browser.close()
console.log(problems.length ? `PROBLEMS:\n${problems.join('\n')}` : 'No console errors, page errors or horizontal overflow.')
console.log(`Shots in ${OUT}`)
