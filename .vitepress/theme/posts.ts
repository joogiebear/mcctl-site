// What a blog post is, shared by the index page (through blog.data.ts) and the RSS feed (config.mts).
export interface Post {
  url: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  minutes: number
}

interface RawPost { url: string; src?: string; frontmatter: Record<string, unknown> }

const WORDS_PER_MINUTE = 200

// blog/index.md is the listing itself, not a post.
export const isPost = (raw: RawPost) => raw.url !== '/blog/' && !raw.url.endsWith('/blog')

export function toPost(raw: RawPost): Post {
  const front = raw.frontmatter
  // Count words in the prose only: skip the frontmatter and fenced code, which people skim.
  const prose = (raw.src ?? '').replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '')
  const words = prose.split(/\s+/).filter(Boolean).length
  return {
    url: raw.url,
    title: String(front.title ?? ''),
    description: String(front.description ?? ''),
    date: String(front.date ?? ''),
    author: String(front.author ?? 'joogiebear'),
    tags: Array.isArray(front.tags) ? front.tags.map(String) : [],
    minutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}

export const newestFirst = (a: Post, b: Post) => +new Date(b.date) - +new Date(a.date)

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
