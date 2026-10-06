import { createContentLoader } from 'vitepress'
import { isPost, newestFirst, toPost, type Post } from './posts'

declare const data: Post[]
export { data }

// Runs at build time. The post source is read here to count words and is not sent to the browser.
export default createContentLoader('blog/*.md', {
  includeSrc: true,
  render: false,
  excerpt: false,
  transform: raws => raws.filter(isPost).map(toPost).sort(newestFirst),
})
