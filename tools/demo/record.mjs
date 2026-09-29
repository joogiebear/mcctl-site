// Records the landing-page demo: a scripted run through the real SpawnLoft panel.
//
//   node tools/demo/record.mjs            # records into $DEMO_OUT (default ./demo-out)
//   node tools/demo/encode.mjs            # turns the recording into demo.mp4 / demo.webm / poster
//
// The panel is started against a throwaway data root, so it never touches real servers or the real
// settings file. See tools/demo/README.md. This script drives an installed Chromium through the
// DevTools protocol (Node 22 has WebSocket built in, so nothing is installed) and keeps every frame
// the compositor produces, with timestamps. Editing happens later, in encode.mjs.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const OUT = path.resolve(process.env.DEMO_OUT || 'demo-out')
const PANEL = process.env.DEMO_PANEL || 'http://127.0.0.1:8790/'
// Chrome first: Edge signs the throwaway profile in and opens onboarding tabs for extensions.
const BROWSER = process.env.DEMO_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p))
const W = 1280, H = 800, DPR = 1.25, PORT = 9333
if (!BROWSER) throw new Error('No Chromium found. Set DEMO_BROWSER.')

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true })

const sleep = ms => new Promise(r => setTimeout(r, ms))
const profile = path.join(OUT, 'profile')
const browser = spawn(BROWSER, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-sync', '--hide-scrollbars', `--window-size=${W},${H}`, 'about:blank',
], { stdio: 'ignore' })

let target
for (let i = 0; i < 60 && !target; i++) {
  await sleep(250)
  try { target = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json() } catch { /* still starting */ }
}
if (!target) throw new Error('The browser did not start.')

const ws = new WebSocket(target.webSocketDebuggerUrl)
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej })
let nextId = 1
const pending = new Map(), listeners = []
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data)
  if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result) }
  else if (m.method) for (const l of listeners) l(m)
}
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = nextId++
  const timer = setTimeout(() => { pending.delete(id); rej(new Error(`${method} did not answer in 15s`)) }, 15000)
  pending.set(id, { res: v => { clearTimeout(timer); res(v) }, rej: e => { clearTimeout(timer); rej(e) } })
  ws.send(JSON.stringify({ id, method, params }))
})
const evaluate = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result.value

// ---- Frames and events, on one clock -------------------------------------------------------------
let t0 = 0
const now = () => performance.now() - t0
const frames = [], events = []
let frameNo = 0
listeners.push(m => {
  if (m.method !== 'Page.screencastFrame') return
  const name = `${String(frameNo++).padStart(5, '0')}.jpg`
  fs.writeFileSync(path.join(OUT, 'frames', name), Buffer.from(m.params.data, 'base64'))
  frames.push({ t: Math.round(now()), f: name })
  send('Page.screencastFrameAck', { sessionId: m.params.sessionId }).catch(() => {})
})

// ---- Input, with a visible cursor path (the encoder draws the cursor from these events) -------------
let cx = W * 0.62, cy = H * 0.7
const ease = k => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
async function move(x, y, ms = 650) {
  const x0 = cx, y0 = cy, steps = Math.max(2, Math.round(ms / 16))
  for (let i = 1; i <= steps; i++) {
    const k = ease(i / steps)
    cx = x0 + (x - x0) * k; cy = y0 + (y - y0) * k
    events.push({ t: Math.round(now()), k: 'm', x: Math.round(cx), y: Math.round(cy) })
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: cx, y: cy })
    await sleep(16)
  }
}
async function click() {
  events.push({ t: Math.round(now()), k: 'c', x: Math.round(cx), y: Math.round(cy) })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1 })
  await sleep(70)
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: cx, y: cy, button: 'left', clickCount: 1 })
}
const center = async sel => {
  const r = await evaluate(`(() => { const e = ${sel}; if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 } })()`)
  if (!r) throw new Error(`Not found: ${sel}`)
  return r
}
const byText = (text, tag = 'button') => `[...document.querySelectorAll('${tag}')].find(e => e.offsetParent && e.innerText.trim() === ${JSON.stringify(text)})`
const byId = id => `document.getElementById(${JSON.stringify(id)})`
async function clickOn(sel, ms = 650, jitter = 0) {
  console.log(`  click ${sel.slice(0, 70)}`)
  const p = await center(sel)
  await move(p.x + jitter, p.y, ms)
  await sleep(160)
  await click()
}
async function type(text, gap = 85) {
  for (const ch of text) { await send('Input.dispatchKeyEvent', { type: 'char', text: ch }); await sleep(gap + Math.random() * 40) }
}
async function waitFor(expr, what, timeout = 90000) {
  const end = Date.now() + timeout
  while (Date.now() < end) { if (await evaluate(`Boolean(${expr})`)) return; await sleep(200) }
  throw new Error(`Timed out waiting for ${what} (${(now() / 1000).toFixed(1)}s in)`)
}
const label = (n, text) => { console.log(`[${(now() / 1000).toFixed(1)}s] ${n}. ${text}`); events.push({ t: Math.round(now()), k: 'label', n, text }) }
const speed = n => events.push({ t: Math.round(now()), k: 'speed', n })

// ---- The run ------------------------------------------------------------------------------------
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: DPR, mobile: false })
await send('Page.navigate', { url: PANEL })
await waitFor(byId('dNew'), 'the first-run screen')
await sleep(600)
t0 = performance.now()
await send('Page.startScreencast', { format: 'jpeg', quality: 82, maxWidth: Math.round(W * DPR), maxHeight: Math.round(H * DPR), everyNthFrame: 1 })
await sleep(1600)

// 1. Create a server.
label(1, 'Create a server')
await clickOn(byId('dNew'))
await waitFor(byId('nName'), 'the create form')
await sleep(500)
await clickOn(byId('nName'), 500)
await type('Weekend World')
await sleep(700)
await clickOn(byId('bCreate'), 700)
speed(3)
await waitFor(byId('bStart'), 'the server page', 120000)
speed(1)
await sleep(1200)

// 2. Start it.
label(2, 'Press Start')
await clickOn(byId('bStart'), 800)
speed(4)
await waitFor(`document.body.innerText.includes('Done (') && /Running/.test(document.body.innerText)`, 'the server to finish starting', 120000)
speed(1)
await sleep(2200)

// 3. Add a plugin.
label(3, 'Add a plugin')
await clickOn(byId('tabPlugins'), 800)
await waitFor(`[...document.querySelectorAll('input')].find(e => e.offsetParent && /Modrinth or Hangar/.test(e.placeholder))`, 'the plugin search')
await sleep(500)
await clickOn(`[...document.querySelectorAll('input')].find(e => e.offsetParent && /Modrinth or Hangar/.test(e.placeholder))`, 600)
await type('worldedit')
await sleep(400)
await clickOn(byText('Search'), 500)
await waitFor(`[...document.querySelectorAll('button')].some(e => e.offsetParent && e.innerText.trim() === 'Install')`, 'search results', 30000)
await sleep(1600)
await clickOn(`[...document.querySelectorAll('button')].filter(e => e.offsetParent && e.innerText.trim() === 'Install')[0]`, 700)
speed(2)
await waitFor(`/INSTALLED \\(1\\)/.test(document.body.innerText)`, 'the plugin to install', 60000)
speed(1)
await sleep(2200)

// 4. Back it up.
label(4, 'Back it up')
await clickOn(byId('tabBackups'), 800)
await waitFor(byText('Back up now'), 'the backups tool')
await sleep(1000)
await clickOn(byText('Back up now'), 700)
await waitFor(`/HISTORY \\(2\\)/.test(document.body.innerText)`, 'the snapshot', 60000)
await sleep(2800)

await send('Page.stopScreencast')
const end = Math.round(now())
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify({ w: Math.round(W * DPR), h: Math.round(H * DPR), cssW: W, cssH: H, end, frames, events }))
console.log(`Recorded ${frames.length} frames over ${(end / 1000).toFixed(1)}s into ${OUT}`)
ws.close()
browser.kill()
