import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Landing from './Landing.vue'
import Download from './Download.vue'
import Changelog from './Changelog.vue'
import Tour from './Tour.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Landing', Landing)
    app.component('Download', Download)
    app.component('Changelog', Changelog)
    app.component('Tour', Tour)
  },
} satisfies Theme
