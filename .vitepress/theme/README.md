# The theme

The site is VitePress with its own look. Everything visual comes from a small system, and pages are
composition, not CSS.

## Files

| Path | What it is |
| --- | --- |
| `tokens.css` | Colour, type, space, radius and motion as custom properties. The only file allowed to contain a raw colour or a px font size. `.paper` redefines the same names for the light reading surface, so a component never knows which surface it is on. |
| `fonts.css` | `@font-face` for the two self-hosted faces in `public/fonts/`: Bricolage Grotesque (display and text, variable, with its optical size axis) and JetBrains Mono (captions and anything the computer said). |
| `base.css` | Reset, type roles (`.eyebrow .display .h1 .h2 .h3 .lede .body .small`), layout helpers (`.wrap` 1200px, `.wrap-wide` 1360px, `.section`, `.grid-2/3/4`) and the `v-reveal` motion, all scoped to the marketing shell `.sl`. |
| `docs.css` | VitePress's default theme pointed at the tokens: ink sidebar, paper reading column, the default nav bar hidden in favour of `SiteHeader`. |
| `Layout.vue` | One layout for every page. `page` and `showcase` pages get header, content, footer. Docs and blog posts keep VitePress's sidebar, outline and search inside the same header and footer. `descent` is the lab page with its own chrome, loaded only there. |
| `components/` | The system. Each is a Vue single-file component that uses tokens only. |
| `release.ts` | What the site knows about downloads: file names, the platform words, OS detection and the release check. Bump `FALLBACK_VERSION` and the file names with each stable release. |
| `proof.data.ts` | Build-time figures from GitHub (release count, latest version and date), with a snapshot when the API is unreachable. |

## Components

| Component | Use |
| --- | --- |
| `Button` | `variant` primary (the only lime fill on a view), secondary (hairline), quiet (text); `size` sm, md, lg; `href` makes it a link. Slots `icon` and `trailing`. |
| `ArrowLink` | A text link with the arrow. `external` swaps the icon. |
| `Eyebrow` | Twelve-pixel mono label above a heading. `accent` for lime. `as` sets the tag. |
| `Pill` | A state in a capsule. `tone` ok, warn, bad, off. |
| `SectionHead` | Eyebrow, title, optional lede, optional `aside` slot, hairline. Every section opens with one. `level` h1 to h3. |
| `Card` | Hairline frame on bg-1 with optional `eyebrow`, `title`, `href`. |
| `Stat` | A label and a tabular figure. Only figures the repository can back up. |
| `Steps` / `Step` | A numbered list for things that happen in order. Numbers appear nowhere else. |
| `Disclosure` | Native `details`, styled. |
| `Notice` | A short aside with a coloured edge. `tone` info or warn. |
| `CodeBlock` | A dark well on both surfaces. Lines starting `$ ` are prompts, `# ` comments. |
| `Figure` | A capture in a hairline frame with a caption. With `widths`, it builds a `srcset` from the files `tools/images/build.mjs` writes. |
| `AppFrame` | The frame a capture or the live console sits in. `hero` adds the site's one shadow. |
| `PlatformPicker` | The download list: detected OS first, latest stable release from GitHub, verified fallback links otherwise. Use it anywhere a download is offered; nothing else may link an installer. |
| `SiteHeader` / `SiteFooter` | The one header and footer. The nav links live in `SiteHeader.vue`. |
| `Prose` | Reading styles for HTML that arrives from elsewhere (release notes). |

In Markdown, `PlatformPicker`, `Notice`, `Steps`, `Step`, `Disclosure`, `Figure`, `CodeBlock`,
`Button`, `ArrowLink`, `Eyebrow` and `SectionHead` work without an import (`index.ts`).

## Rules the build enforces

`npm run lint` (also run before every build, locally and on Vercel) fails when a file under
`components/`, `sections/` or `pages/`, or `Layout.vue`, `base.css` or `docs.css`, contains a raw
colour, a px font size or `transition: all`. Add a token instead. The GitHub Actions workflow
`site-checks.yml` runs the lint, the build and Lighthouse with the budgets in `lighthouserc.json`
on every pull request.

## Images

Masters live under `public/img/`. `npm run images` writes the 800, 1280 and 2558px WebP and AVIF
variants next to each master in `public/img/tabs/` (pass a path for one file elsewhere). Commit
the outputs: Vercel's build does not run it. `Figure` reads them with `:widths="[800, 1280, 2558]"`.

## Pages still on the old styles

`Landing`, `Features`, `GetStarted`, `Changelog`, `Roadmap`, `BlogIndex`, `FieldGuide`,
`Download`, `DemoVideo`, `ProductExplorer`, `ProofStrip`, `WorldScene`, `PortalScene` and
`Descent` predate the system. They render inside the shared header and footer through the legacy
aliases at the bottom of `tokens.css`, and each is replaced as its page is rebuilt.
