#!/usr/bin/env node
// Writes the responsive variants Figure.vue expects next to each master image:
// <name>-800.webp, -1280, -2558 and the same in AVIF. A master is any image under public/img
// whose name has no width suffix. Run it after retaking captures:
//   node tools/images/build.mjs                 # every master under public/img/tabs
//   node tools/images/build.mjs public/img/x.png # one master
// The outputs are committed, because Vercel's build does not run this.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const WIDTHS = [800, 1280, 2558]
const masters = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync('public/img/tabs').filter(name => /\.(png|webp|jpe?g)$/.test(name) && !/-\d+\.\w+$/.test(name)).map(name => path.join('public/img/tabs', name))

for (const master of masters) {
  const image = sharp(master)
  const { width } = await image.metadata()
  const base = master.replace(/\.\w+$/, '')
  const widths = WIDTHS.filter(w => w <= width || w === WIDTHS[0])
  for (const w of widths) {
    const resized = image.clone().resize({ width: w, withoutEnlargement: true })
    await resized.clone().webp({ quality: 82 }).toFile(`${base}-${w}.webp`)
    await resized.clone().avif({ quality: 55, effort: 6 }).toFile(`${base}-${w}.avif`)
  }
  const sizes = widths.map(w => `${w}: ${Math.round(fs.statSync(`${base}-${w}.avif`).size / 1024)} / ${Math.round(fs.statSync(`${base}-${w}.webp`).size / 1024)} KB`).join(', ')
  console.log(`${path.basename(master)} (${width}px) → ${sizes} (avif / webp)`)
}
