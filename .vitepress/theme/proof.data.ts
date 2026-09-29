import { defineLoader } from 'vitepress'

// Numbers for the proof strip, read from GitHub when the site is built. The strip only ever states
// what the repository says, and the snapshot below is used when the API cannot be reached (rate
// limits on shared build machines are the usual cause), so a build never fails or invents a figure.
// Set GITHUB_TOKEN in the build environment for a higher rate limit; it is optional.
export interface Proof { releases: number; commits: number; stars: number; downloads: number; latest: string; latestDate: string; live: boolean }

const REPO = 'https://api.github.com/repos/joogiebear/spawnloft'
const SNAPSHOT: Proof = { releases: 40, commits: 408, stars: 3, downloads: 94, latest: 'v1.4.0', latestDate: '2026-09-28T14:15:58Z', live: false }
const INSTALLER = /\.(exe|dmg|deb|rpm|AppImage)$/

declare const data: Proof
export { data }

export default defineLoader({
  async load(): Promise<Proof> {
    const headers: Record<string, string> = { accept: 'application/vnd.github+json' }
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    try {
      const get = async (path: string) => {
        const response = await fetch(REPO + path, { headers, signal: AbortSignal.timeout(10000) })
        if (!response.ok) throw new Error(`${path}: ${response.status}`)
        return response
      }
      const [repo, releases, commits] = await Promise.all([get(''), get('/releases?per_page=100'), get('/commits?per_page=1')])
      const info = await repo.json() as { stargazers_count: number }
      const all = await releases.json() as { tag_name: string; published_at: string; assets: { name: string; download_count: number }[] }[]
      const stable = all.filter(release => /^v\d+\.\d+\.\d+$/.test(release.tag_name))
      // With one commit per page, the last page number is the commit count.
      const last = /[?&]page=(\d+)>; rel="last"/.exec(commits.headers.get('link') ?? '')
      if (!stable.length || !last) throw new Error('unexpected response')
      return {
        releases: stable.length,
        commits: Number(last[1]),
        stars: info.stargazers_count,
        downloads: stable.flatMap(release => release.assets).filter(asset => INSTALLER.test(asset.name)).reduce((sum, asset) => sum + asset.download_count, 0),
        latest: stable[0].tag_name,
        latestDate: stable[0].published_at,
        live: true,
      }
    } catch (error) {
      console.warn(`[proof] using the snapshot: ${(error as Error).message}`)
      return SNAPSHOT
    }
  },
})
