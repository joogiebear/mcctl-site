import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h, defineComponent } from 'vue'
import { useData } from 'vitepress'
import BackToTop from './BackToTop.vue'
import Landing from './Landing.vue'
import Download from './Download.vue'
import DocsChrome from './DocsChrome.vue'
import './custom.css'
import './docs.css'

export default {
  extends: DefaultTheme,
  Layout: defineComponent({ setup() {
    const { frontmatter } = useData()
    return () => frontmatter.value.layout === 'showcase'
      ? h(Landing)
      : h('div', { class: ['secondary-site', frontmatter.value.layout === 'page' ? 'editorial-site' : 'docs-site'] }, [h(DefaultTheme.Layout, null, {
        'layout-bottom': () => h(BackToTop),
        'doc-before': () => h(DocsChrome, { placement: 'before' }),
        'doc-after': () => h(DocsChrome, { placement: 'after' }),
        'sidebar-nav-before': () => h(DocsChrome, { placement: 'sidebar' }),
        'nav-bar-content-after': () => h('a', { href: '/#download', class: 'docs-download' }, 'Get SpawnLoft ↗'),
      })])
  } }),
  enhanceApp({ app }) {
    app.component('Landing', Landing)
    app.component('Download', Download)
    // v-reveal: the element fades up the first time it scrolls into view. One observer, no
    // library, and nothing happens at all when the person has asked for reduced motion.
    app.directive('reveal', {
      mounted(el: HTMLElement) {
        if (typeof window === 'undefined') return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        el.classList.add('reveal')
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) if (e.isIntersecting) { el.classList.add('in'); io.disconnect() }
        }, { threshold: 0.12 })
        io.observe(el)
      },
    })
  },
} satisfies Theme
