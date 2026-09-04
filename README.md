# mcctl-site

The project site for [mcctl](https://github.com/joogiebear/mcctl): a landing page and the docs,
built with [VitePress](https://vitepress.dev) and deployed by Vercel on every push to `main`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # .vitepress/dist
```

- `index.md` is the landing page, rendered by `.vitepress/theme/Landing.vue`.
- `guide/` and `reference/` are the docs, plain Markdown.
- `.vitepress/theme/custom.css` carries the app's colour tokens. Change them in the app's
  `src/ui.html` first; this file follows.
- `.vitepress/theme/Download.vue` asks GitHub for the latest release and points the button at
  the installer, so the version on the site never goes stale.
- `public/banner/` holds the banner artwork partner sites embed, as HTML plus the rendered PNGs.
