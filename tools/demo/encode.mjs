// Turns a recording from record.mjs into web video.
//
//   node tools/demo/encode.mjs
//
// Serves the recording to encode.html, which replays it (speed-ups, cursor, fades) onto a canvas and
// records that with MediaRecorder in a real Chromium. The results are posted back here and written
// to $DEMO_OUT as demo.mp4, demo.webm, poster.webp and demo.json. No ffmpeg needed.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = path.resolve(process.env.DEMO_OUT || 'demo-out')
const HERE = path.dirname(fileURLToPath(import.meta.url))
const PORT = 8801
const BROWSER = process.env.DEMO_BROWSER || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p))
if (!BROWSER) throw new Error('No Chromium found. Set DEMO_BROWSER.')
if (!fs.existsSync(path.join(OUT, 'manifest.json'))) throw new Error(`No recording in ${OUT}. Run record.mjs first.`)

const query = process.argv[2] || ''
let finish
const done = new Promise(r => { finish = r })

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`)
  const body = async () => { const parts = []; for await (const c of req) parts.push(c); return Buffer.concat(parts) }
  if (req.method === 'POST') {
    const data = await body()
    if (url.pathname === '/log') console.log('  ' + data.toString())
    else if (url.pathname === '/upload') fs.writeFileSync(path.join(OUT, path.basename(url.searchParams.get('name'))), data)
    else if (url.pathname === '/done') { fs.writeFileSync(path.join(OUT, 'demo.json'), data); finish() }
    return res.end('ok')
  }
  const file = url.pathname === '/encode.html' ? path.join(HERE, 'encode.html') : path.join(OUT, path.normalize(url.pathname).replace(/^([/\\])+/, ''))
  if (!file.startsWith(url.pathname === '/encode.html' ? HERE : OUT) || !fs.existsSync(file)) { res.statusCode = 404; return res.end() }
  res.setHeader('content-type', file.endsWith('.html') ? 'text/html' : file.endsWith('.json') ? 'application/json' : 'image/jpeg')
  fs.createReadStream(file).pipe(res)
})
await new Promise(r => server.listen(PORT, '127.0.0.1', r))

const profile = path.join(OUT, 'encode-profile')
const browser = spawn(BROWSER, [
  '--headless=new', `--user-data-dir=${profile}`, '--no-first-run', '--disable-extensions', '--disable-sync',
  '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--window-size=1280,800',
  `http://127.0.0.1:${PORT}/encode.html${query}`,
], { stdio: 'ignore' })

await Promise.race([done, new Promise((_, rej) => setTimeout(() => rej(new Error('Encoding took more than 4 minutes.')), 240000))])
browser.kill(); server.close()
const result = JSON.parse(fs.readFileSync(path.join(OUT, 'demo.json'), 'utf8'))
console.log(`Encoded ${result.duration.toFixed(1)}s:`, result.formats.map(f => `${f.ext} ${(f.bytes / 1e6).toFixed(2)} MB`).join(', '))
// Chrome may still hold a file or two for a moment on Windows; the profile is scratch either way.
try { fs.rmSync(profile, { recursive: true, force: true }) } catch { /* left for the next run to clear */ }
