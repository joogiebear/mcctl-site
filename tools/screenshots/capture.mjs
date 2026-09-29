// Captures the four panel screenshots on the landing page (public/img/tabs/*.webp) from the real
// SpawnLoft panel, at the size the page expects: 2558x1392 (a 1279x696 window at 2x).
//
//   node tools/screenshots/capture.mjs prepare   # installs the plugins through the panel
//   node tools/screenshots/capture.mjs shoot     # console, plugins, backups, performance
//
// Run the panel against a throwaway data root first (see tools/screenshots/README.md), so it
// cannot touch real servers or the real settings file. This drives an installed Chromium through
// the DevTools protocol; Node 22 has WebSocket built in, so nothing is installed.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const MODE = process.argv[2]
if (!['prepare', 'shoot'].includes(MODE)) throw new Error('Usage: capture.mjs prepare|shoot')
const OUT = path.resolve(process.env.SHOTS_OUT || 'shots-out')
const PANEL = process.env.SHOTS_PANEL || 'http://127.0.0.1:8790/'
const SERVER_TAB = process.env.SHOTS_SERVER || 'Weekend World'
const PLUGINS = (process.env.SHOTS_PLUGINS || 'WorldEdit,LuckPerms,Chunky,PlaceholderAPI').split(',')
const BROWSER = process.env.SHOTS_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p))
if (!BROWSER) throw new Error('No Chromium found. Set SHOTS_BROWSER.')
const W = 1279, H = 696, DPR = 2, PORT = 9334

fs.mkdirSync(OUT, { recursive: true })
const sleep = ms => new Promise(r => setTimeout(r, ms))
const profile = path.join(OUT, 'profile')
const browser = spawn(BROWSER, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync', '--hide-scrollbars', `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' })

let target
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250)
  try { target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json() } catch { /* starting */ }
}
if (!target) throw new Error('The browser did not start.')
const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let nextId = 1
const pending = new Map()
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data)
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) }
}
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = nextId++
  const timer = setTimeout(() => { pending.delete(id); rej(new Error(`${method} did not answer in 20s`)) }, 20000)
  pending.set(id, { res: v => { clearTimeout(timer); res(v) }, rej: e => { clearTimeout(timer); rej(e) } })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value

// ---- helpers, the same shape as tools/demo/record.mjs ---------------------------------------------
let cx = 400, cy = 300
async function moveTo(x, y) {
  for (let i = 1; i <= 12; i++) { cx += (x - cx) / (13 - i); cy += (y - cy) / (13 - i); await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy }); await sleep(12) }
}
const center = async sel => {
  const r = await evaluate(`(() => { const e = ${sel}; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 } })()`)
  if (!r) throw new Error(`Not found: ${sel}`)
  return r
}
const byText = (text, tag = 'button') => `[...document.querySelectorAll('${tag}')].find(e => e.offsetParent && e.innerText.trim() === ${JSON.stringify(text)})`
const byId = id => `document.getElementById(${JSON.stringify(id)})`
async function clickOn(sel) {
  const p = await center(sel)
  await moveTo(p.x, p.y)
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 })
  await sleep(60)
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 })
}
async function type(text) { for (const ch of text) { await send('Input.dispatchKeyEvent', { type: 'char', text: ch }); await sleep(35) } }
async function waitFor(expr, what, timeout = 90000) {
  const end = Date.now() + timeout
  while (Date.now() < end) { if (await evaluate(`Boolean(${expr})`)) return; await sleep(250) }
  throw new Error(`Timed out waiting for ${what}`)
}
async function shot(name) {
  await evaluate(`document.activeElement && document.activeElement.blur()`)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: W - 4, y: H - 4 })  // park the pointer off any control
  await sleep(700)
  const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 90 })
  fs.writeFileSync(path.join(OUT, `${name}.webp`), Buffer.from(data, 'base64'))
  console.log(`shot ${name}`)
}
async function openServer() {
  await waitFor(`[...document.querySelectorAll('button')].some(b => b.innerText.includes(${JSON.stringify(SERVER_TAB)}))`, 'the server tab')
  await evaluate(`[...document.querySelectorAll('button')].find(b => b.innerText.includes(${JSON.stringify(SERVER_TAB)})).click()`)
  await waitFor(byId('tabPlugins'), 'the server page')
}
// The panel remembers which tool is open, and clicking an open tool's tab closes it. Click only if needed.
async function openTool(tabId, readyExpr, what) {
  if (!(await evaluate(`Boolean(${readyExpr})`))) await clickOn(byId(tabId))
  await waitFor(readyExpr, what)
}
async function closeTool() { await evaluate(`(() => { const b = document.getElementById('toolClose'); if (b) b.click() })()`); await sleep(500) }

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: false })
await send('Page.navigate', { url: PANEL })
await waitFor(`document.getElementById('bNew')`, 'the panel')
await sleep(800)
await openServer()

if (MODE === 'prepare') {
  const search = `[...document.querySelectorAll('input')].find(e => e.offsetParent && /Modrinth or Hangar/.test(e.placeholder))`
  await openTool('tabPlugins', search, 'the plugin search')
  for (const name of PLUGINS) {
    console.log(`installing ${name}`)
    const before = Number(await evaluate(`(/INSTALLED \\((\\d+)\\)/.exec(document.body.innerText) || [0, 0])[1]`))
    await clickOn(search)
    // Replace whatever the last search left in the box, then let the panel see an ordinary input event.
    await evaluate(`(() => { const e = ${search}; e.focus(); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, ${JSON.stringify(name)}); e.dispatchEvent(new Event('input', { bubbles: true })); })()`)
    await sleep(300)
    await clickOn(byText('Search'))
    // The result row whose title is exactly the plugin's name, then its Install button.
    const row = `[...document.querySelectorAll('button')].filter(e => e.offsetParent && e.innerText.trim() === 'Install')[0]`
    await waitFor(row, `results for ${name}`, 40000)
    await sleep(500)
    await clickOn(row)
    await waitFor(`/INSTALLED \\(${before + 1}\\)/.test(document.body.innerText)`, `${name} to install`, 90000)
  }
  console.log('Plugins installed. Restart the server, let it run a few minutes, then run: shoot')
} else {
  const only = (process.argv[3] || '').split(',').filter(Boolean)   // e.g. "backups,performance"
  const want = name => !only.length || only.includes(name)
  // Whether a tool is open is the state of its tab button; the header always says "Memory", so the page text cannot tell.
  const toolOpen = tabId => `document.getElementById(${JSON.stringify(tabId)}).getAttribute('aria-expanded') === 'true'`
  const openOnly = async (tabId, what) => { await openTool(tabId, toolOpen(tabId), what); await sleep(700) }
  // Toasts ("Saved ...", "Left out, locked by the running server ...") are real, and not what a still should carry.
  const clearToasts = async () => { await evaluate(`document.querySelectorAll('.toast .x').forEach(b => b.click())`); await sleep(500) }

  if (want('console')) {
    // A couple of commands so the console shows a conversation, not just start-up.
    await closeTool()
    await waitFor(byId('cmd'), 'the command box')
    for (const cmd of ['version', 'tps', 'list']) {
      await clickOn(byId('cmd'))
      await type(cmd)
      await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      await send('Input.dispatchKeyEvent', { type: 'char', text: '\r' })
      await sleep(1400)
    }
    await sleep(1200)
    await clearToasts()
    await shot('console')
  }

  if (want('plugins')) {
    await openOnly('tabPlugins', 'the plugins tool')
    await waitFor(`/INSTALLED \(\d+\)/.test(document.body.innerText)`, 'the plugin list')
    await clearToasts()
    await shot('plugins')
  }

  if (want('backups')) {
    // One hand-taken snapshot beside the ones taken before each install, scrolled so the list is in view.
    await openOnly('tabBackups', 'the backups tool')
    await clickOn(byText('Back up now'))
    await waitFor(`/manual_/.test(document.body.innerText)`, 'the snapshot', 300000)
    await sleep(1500)
    await clearToasts()
    await evaluate(`(() => { const s = [...document.querySelectorAll('#toolPanel *')].find(e => e.scrollHeight > e.clientHeight + 20 && ['auto', 'scroll'].includes(getComputedStyle(e).overflowY)); if (s) s.scrollTop = s.scrollHeight })()`)
    await shot('backups')
  }

  if (want('performance')) {
    await openOnly('tabPerformance', 'the stats tool')
    await sleep(2500)
    await clearToasts()
    await shot('performance')
  }
}

ws.close()
browser.kill()
