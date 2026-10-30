import DefaultTheme from 'vitepress/theme-without-fonts'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import Download from './Download.vue'
import ArrowLink from './components/ArrowLink.vue'
import Button from './components/Button.vue'
import CodeBlock from './components/CodeBlock.vue'
import Disclosure from './components/Disclosure.vue'
import Eyebrow from './components/Eyebrow.vue'
import Figure from './components/Figure.vue'
import Notice from './components/Notice.vue'
import PlatformPicker from './components/PlatformPicker.vue'
import SectionHead from './components/SectionHead.vue'
import Step from './components/Step.vue'
import Steps from './components/Steps.vue'
import './fonts.css'
import './tokens.css'
import './base.css'
import './docs.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // Available in Markdown without an import. Pages compose these; see README.md in this folder.
    app.component('PlatformPicker', PlatformPicker)
    app.component('Notice', Notice)
    app.component('Steps', Steps)
    app.component('Step', Step)
    app.component('Disclosure', Disclosure)
    app.component('Figure', Figure)
    app.component('CodeBlock', CodeBlock)
    app.component('Button', Button)
    app.component('ArrowLink', ArrowLink)
    app.component('Eyebrow', Eyebrow)
    app.component('SectionHead', SectionHead)
    app.component('Download', Download)
    // v-reveal: one rise the first time an element scrolls into view. Nothing above the fold
    // should carry it, nothing stays hidden (a timer clears the pending state regardless), and
    // nothing happens at all when the person has asked for reduced motion.
    app.directive('reveal', {
      mounted(el: HTMLElement) {
        if (typeof window === 'undefined') return
        el.classList.add('rv')
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (el.getBoundingClientRect().top < window.innerHeight) return
        el.classList.add('rv-pending')
        const show = () => { el.classList.remove('rv-pending'); io.disconnect(); window.clearTimeout(timer) }
        const io = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) show() }, { threshold: 0.12 })
        const timer = window.setTimeout(show, 4000)
        io.observe(el)
      },
    })
  },
} satisfies Theme
