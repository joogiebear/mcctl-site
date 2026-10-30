<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { VPNavBarSearch } from 'vitepress/theme-without-fonts'
import BrandIcon from '../BrandIcon.vue'
import Button from './Button.vue'

// The one header. Sticky on marketing pages; fixed on docs pages, where VitePress's own bar is
// hidden and the sidebar and local nav are laid out against --vp-nav-height instead.
// `search` renders VitePress's search button (the docs). `skip` is the skip link; docs pages keep
// VitePress's own instead.
const props = withDefaults(defineProps<{ fixed?: boolean; search?: boolean; skip?: boolean; skipTo?: string }>(), { fixed: false, search: false, skip: true, skipTo: '#main' })

const links = [
  { text: 'Product', href: '/features', match: /^\/(features|product)(\/|$)/ },
  { text: 'Download', href: '/download', match: /^\/download(\/|$)/ },
  { text: 'Docs', href: '/guide/', match: /^\/(guide|reference)\// },
  { text: 'Blog', href: '/blog/', match: /^\/blog(\/|$)/ },
]
const extra = [
  { text: 'Changelog', href: '/changelog' },
  { text: 'Roadmap', href: '/roadmap' },
  { text: 'GitHub', href: 'https://github.com/joogiebear/spawnloft' },
]
const route = useRoute()
const open = ref(false)
const menuBtn = ref<HTMLButtonElement>()
const menu = ref<HTMLElement>()
const active = (match: RegExp) => match.test(route.path)

// The router only scrolls a `#` link, so the skip link moves focus itself.
const skipToContent = () => {
  const target = document.querySelector<HTMLElement>(props.skipTo)
  if (!target) return
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
  target.focus({ preventScroll: true })
  target.scrollIntoView()
}
const toggleMenu = () => {
  open.value = !open.value
  nextTick(() => (open.value ? menu.value?.querySelector('a')?.focus() : menuBtn.value?.focus()))
}

watch(() => route.path, () => { open.value = false })
watch(open, value => { if (typeof document !== 'undefined') document.documentElement.style.overflow = value ? 'hidden' : '' })
const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') open.value = false }
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => { window.removeEventListener('keydown', onKey); if (open.value) document.documentElement.style.overflow = '' })
</script>

<template>
  <header class="site-header" :class="{ fixed, open }">
    <a v-if="skip" class="skip" :href="skipTo" @click.prevent="skipToContent">Skip to content</a>
    <div class="bar">
      <a class="brand" href="/" aria-label="SpawnLoft home"><BrandIcon name="mark" :size="24" /><span>spawnloft</span></a>
      <nav class="links" aria-label="Main">
        <a v-for="link in links" :key="link.href" :href="link.href" :class="{ on: active(link.match) }" :aria-current="active(link.match) ? 'page' : undefined">{{ link.text }}</a>
      </nav>
      <div class="actions">
        <VPNavBarSearch v-if="search" class="search" />
        <a class="icon-link" href="https://github.com/joogiebear/spawnloft" aria-label="SpawnLoft on GitHub"><BrandIcon name="github" :size="20" /></a>
        <Button class="cta" href="/download" size="sm">Download</Button>
        <button ref="menuBtn" class="menu-btn" type="button" :aria-expanded="open" :aria-controls="open ? 'site-menu' : undefined" @click="toggleMenu"><BrandIcon :name="open ? 'close' : 'menu'" :size="22" /><span class="sr-only">{{ open ? 'Close menu' : 'Menu' }}</span></button>
      </div>
    </div>
    <nav v-if="open" id="site-menu" ref="menu" class="menu" aria-label="Main">
      <a v-for="link in links" :key="link.href" :href="link.href" class="menu-link" :class="{ on: active(link.match) }">{{ link.text }}</a>
      <span class="rule" aria-hidden="true"></span>
      <a v-for="link in extra" :key="link.href" :href="link.href" class="menu-link minor">{{ link.text }}</a>
      <Button href="/download" size="lg" class="menu-cta"><template #icon><BrandIcon name="download" :size="16" /></template>Download SpawnLoft</Button>
    </nav>
  </header>
</template>

<style scoped>
.site-header { position: sticky; top: 0; z-index: var(--z-header); background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); color: var(--fg); font-family: var(--text); }
.site-header.fixed { position: fixed; inset: 0 0 auto; }
/* No blur while the menu is open: a backdrop-filter makes the header the containing block of its
   fixed menu, which then could not reach the bottom of the screen. */
.site-header.open { background: var(--bg); backdrop-filter: none; -webkit-backdrop-filter: none; }
.skip { position: absolute; top: -100px; left: var(--s4); z-index: 1; padding: var(--s3) var(--s4); background: var(--accent); color: var(--accent-fg); font: 600 var(--t-small)/1 var(--text); text-decoration: none; }
.skip:focus { top: var(--s3); }
.bar { display: flex; align-items: center; gap: var(--s6); height: var(--header-h); max-width: calc(var(--max-wide) + var(--gutter) + var(--gutter-r)); margin-inline: auto; padding-left: var(--gutter); padding-right: var(--gutter-r); }
.brand { display: inline-flex; align-items: center; gap: var(--s2); color: var(--fg); text-decoration: none; font: 600 var(--t-h4)/1 var(--display); letter-spacing: -.03em; }
.brand svg { color: var(--accent); }
.links { display: flex; gap: var(--s5); margin-left: var(--s2); }
.links a { color: var(--fg-2); font: 500 var(--t-ui)/1 var(--text); text-decoration: none; padding: var(--s2) 0; transition: color var(--d1) var(--ease); }
.links a:hover, .links a.on { color: var(--fg); }
.links a.on { box-shadow: inset 0 -2px 0 var(--accent); }
.actions { display: flex; align-items: center; gap: var(--s3); margin-left: auto; }
.icon-link { display: inline-flex; padding: var(--s2); color: var(--fg-2); transition: color var(--d1) var(--ease); }
.icon-link:hover { color: var(--fg); }
.menu-btn { display: none; align-items: center; justify-content: center; width: 40px; height: 40px; margin-right: calc(var(--s2) * -1); color: var(--fg); background: none; border: 0; cursor: pointer; }
.menu { position: fixed; top: var(--header-h); right: 0; left: 0; height: calc(100dvh - var(--header-h)); z-index: var(--z-menu); display: grid; align-content: start; gap: var(--s2); padding: var(--s6) var(--gutter) var(--s8); background: var(--bg); overflow-y: auto; }
.menu-link { color: var(--fg); font: 600 var(--t-h2)/1.1 var(--display); letter-spacing: -.03em; text-decoration: none; padding: var(--s2) 0; }
.menu-link.on { color: var(--accent-text); }
.menu-link.minor { font: 500 var(--t-lede)/1.3 var(--text); color: var(--fg-2); letter-spacing: 0; }
.menu .rule { border-top: 1px solid var(--line); margin: var(--s4) 0; }
.menu-cta { margin-top: var(--s5); justify-self: start; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

/* VitePress's search button, restyled onto the tokens. */
.search { flex: none; }
.search :deep(.DocSearch-Button) { margin: 0; height: 36px; padding: 0 var(--s3); border: 1px solid var(--line-strong); border-radius: var(--r1); background: var(--bg-1); color: var(--fg-2); transition: border-color var(--d1) var(--ease); }
.search :deep(.DocSearch-Button:hover) { border-color: var(--fg); box-shadow: none; background: var(--bg-1); }
.search :deep(.DocSearch-Button-Placeholder) { font: 400 var(--t-small)/1 var(--text); padding: 0 var(--s2); }
.search :deep(.DocSearch-Search-Icon) { width: 16px; height: 16px; color: var(--fg-3); }
.search :deep(.DocSearch-Button-Keys) { min-width: 0; }
.search :deep(.DocSearch-Button-Key) { background: transparent; border: 1px solid var(--line); box-shadow: none; color: var(--fg-3); font-family: var(--mono); font-size: var(--t-caption); padding: 0; height: 20px; min-width: 20px; }

@media (max-width: 1100px) { .search :deep(.DocSearch-Button-Keys), .search :deep(.DocSearch-Button-Placeholder) { display: none; } .search :deep(.DocSearch-Button) { padding: 0 var(--s2); } }
@media (max-width: 900px) {
  .links, .icon-link { display: none; }
  .menu-btn { display: inline-flex; }
}
@media (max-width: 400px) { .cta { display: none; } }
@media (prefers-reduced-motion: reduce) { .site-header { backdrop-filter: none; -webkit-backdrop-filter: none; background: var(--bg); } }
</style>
