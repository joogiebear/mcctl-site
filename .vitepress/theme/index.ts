import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import BackToTop from './BackToTop.vue'
import Landing from './Landing.vue'
import Download from './Download.vue'
import Changelog from './Changelog.vue'
import BootConsole from './BootConsole.vue'
import Showcase from './Showcase.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'layout-bottom': () => h(BackToTop) }),
  enhanceApp({ app }) {
    app.component('Landing', Landing)
    app.component('Download', Download)
    app.component('Changelog', Changelog)
    app.component('BootConsole', BootConsole)
    app.component('Showcase', Showcase)
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
