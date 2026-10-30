#!/usr/bin/env node
// Fails when a theme file hard-codes what tokens.css owns: a colour, a px font size, or a
// `transition: all`. Checks the <style> blocks of the system's Vue files and the shared
// stylesheets. Legacy page components are added here as each one moves onto the system.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const theme = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.vitepress/theme')
const DIRS = ['components', 'sections', 'pages']
const FILES = ['Layout.vue', 'DocsChrome.vue', 'BackToTop.vue', 'base.css', 'docs.css']
const RULES = [
  { name: 'raw colour; use a token from tokens.css', test: /(^|[^&\w])#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i },
  { name: 'px font size; use a --t-* token', test: /font-size\s*:\s*[^;]*\d+px|\bfont\s*:\s*[^;]*\b\d+px/ },
  { name: 'transition: all; name the properties', test: /transition\s*:\s*all\b/ },
]

const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : /\.(vue|css)$/.test(entry.name) ? [path.join(dir, entry.name)] : []) : []
const targets = [...DIRS.flatMap(dir => walk(path.join(theme, dir))), ...FILES.map(file => path.join(theme, file)).filter(fs.existsSync)]

// Only CSS is checked: the <style> blocks of a .vue file, or the whole of a .css file.
function cssOf(file) {
  const source = fs.readFileSync(file, 'utf8')
  if (file.endsWith('.css')) return [{ offset: 0, text: source }]
  const blocks = []
  const re = /<style[^>]*>([\s\S]*?)<\/style>/g
  for (let match; (match = re.exec(source));) blocks.push({ offset: source.slice(0, match.index).split('\n').length - 1, text: match[1] })
  return blocks
}

const problems = []
for (const file of targets) {
  for (const block of cssOf(file)) {
    block.text.split('\n').forEach((line, index) => {
      const code = line.replace(/\/\*.*?\*\//g, '')
      for (const rule of RULES) if (rule.test.test(code)) problems.push(`${path.relative(process.cwd(), file)}:${block.offset + index + 1}: ${rule.name}\n    ${line.trim()}`)
    })
  }
}

if (problems.length) {
  console.error(`lint-theme: ${problems.length} problem${problems.length === 1 ? '' : 's'}\n`)
  for (const problem of problems) console.error(problem)
  process.exit(1)
}
console.log(`lint-theme: ${targets.length} files clean`)
