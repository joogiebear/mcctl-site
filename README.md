# SpawnLoft site

The project site for [SpawnLoft](https://github.com/joogiebear/spawnloft), served at
[spawnloft.com](https://www.spawnloft.com): a landing page and the docs, built with
[VitePress](https://vitepress.dev) and deployed by Vercel on every push to `main`.

The product is SpawnLoft. In the development preview, `spawnloft` is the preferred command;
`mcctl` remains a supported alias. Stable examples retain `mcctl`. The field guide explicitly
separates stable features from preview features; `guide/beta.md` tracks the reviewed preview.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # .vitepress/dist
```

- `index.md` is the home page, composed from `.vitepress/theme/sections/` by `pages/Home.vue`; `download.md` is `/download`. The design system, its components and the lint are described in [.vitepress/theme/README.md](.vitepress/theme/README.md).
- `art/spawnloft-world.blend` is the current editable world. See [art/WORLD.md](art/WORLD.md) for rebuilding and exporting it.
- `proof.data.ts` reads the release count and latest version from GitHub at build time (a snapshot is used if the API is unreachable; `GITHUB_TOKEN` is optional); the footer shows them. The numbers refresh on each deploy.
- `public/img/tabs/*.webp` are the four panel screenshots in the home page tour, taken from the real panel by `tools/screenshots/`; see its README to retake them when the panel changes, then run `npm run images` for the responsive variants.
- `DemoVideo.vue` plays the recording in `public/demo/`, with its steps from `demo.json`. `tools/demo/` records and encodes it from the real app; see its README.
- `public/social/` holds one 1200x630 social card per docs page, drawn by `tools/social-cards/build.mjs` from each page's title and description and committed (Vercel's build has no Chromium). Re-run `node tools/social-cards/build.mjs` when a title or description changes; a page with no card falls back to `public/brand/social-card.png`.
- `BrandIcon.vue`, `public/brand/`, and `public/favicon.svg` contain the custom visual identity.
- `guide/` and `reference/` are the docs, plain Markdown.
- `blog/` holds the posts, plain Markdown. A post needs `title`, `description` and `date` (YYYY-MM-DD) in its frontmatter, with optional `author` and `tags`, plus `sidebar: false`, `aside: false` and `lastUpdated: false` for the single-column layout. Quote any value that contains a colon, or the YAML will not parse. Posts join the listing (`BlogIndex.vue`, through `blog.data.ts`) and the RSS feed at `/blog/feed.xml`, which `buildEnd` in the config writes on every build. Put images in `public/img/blog/` and wrap figures in `<figure class="post-figure">`. After adding a post, draw its share card with `node tools/social-cards/build.mjs blog-<slug>`.
- `.vitepress/theme/tokens.css` carries the design tokens and `docs.css` the documentation styling.
- `.vitepress/theme/components/PlatformPicker.vue` (with `release.ts`) asks GitHub for the latest release and
  points every download link at the installer, so the version on the site never goes stale.
- `public/banner/` holds the banner artwork partner sites embed, as HTML plus the rendered PNGs.
