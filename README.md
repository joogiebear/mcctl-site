# SpawnLoft site

The project site for [SpawnLoft](https://github.com/joogiebear/spawnloft), served at
[spawnloft.com](https://spawnloft.com): a landing page and the docs, built with
[VitePress](https://vitepress.dev) and deployed by Vercel on every push to `main`.

The product is SpawnLoft. In the development preview, `spawnloft` is the preferred command;
`mcctl` remains a supported alias. Stable examples retain `mcctl`. The field guide explicitly
separates stable features from preview features; `guide/beta.md` tracks the reviewed preview.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # .vitepress/dist
```

- `index.md` is the landing page, rendered by `.vitepress/theme/Landing.vue`.
- `Landing.vue` owns the independent showcase layout, navigation, scroll journey, and conversion sections.
- `ProductExplorer.vue` is the keyboard-accessible four-tab product tour. `WorldScene.vue` renders and animates the custom Blender world.
- `art/spawnloft-world.blend` is the current editable world. See [art/WORLD.md](art/WORLD.md) for rebuilding and exporting it.
- `BrandIcon.vue`, `public/brand/`, and `public/favicon.svg` contain the custom visual identity.
- `guide/` and `reference/` are the docs, plain Markdown.
- `.vitepress/theme/custom.css` carries the website's brand tokens and documentation styling.
- `.vitepress/theme/Download.vue` asks GitHub for the latest release and points the button at
  the installer, so the version on the site never goes stale.
- `public/banner/` holds the banner artwork partner sites embed, as HTML plus the rendered PNGs.
