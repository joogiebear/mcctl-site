// What the site knows about SpawnLoft's downloads. One place for the file names, the platform
// words and the release check, used by PlatformPicker on every page that offers a download.

export const REPO = 'joogiebear/spawnloft'
export const RELEASES_URL = `https://github.com/${REPO}/releases`
export const LATEST_API = `https://api.github.com/repos/${REPO}/releases/latest`

// The version the links point at until GitHub answers. Bump it as part of each stable release.
export const FALLBACK_VERSION = 'v1.5.0'

export type Os = 'windows' | 'mac' | 'linux'

export interface Download {
  id: string
  os: Os
  title: string
  detail: string
  file: string
  match: RegExp
  /** One of the three the site always offers; a release missing one is still uploading. */
  main?: boolean
  size?: number
}

export const DOWNLOADS: Download[] = [
  { id: 'windows', os: 'windows', title: 'Windows', detail: '10 or 11 · x64 · signed installer', file: 'SpawnLoft-Setup-1.5.0.exe', match: /^SpawnLoft-Setup-[\d.]+\.exe$/, main: true },
  { id: 'mac-arm64', os: 'mac', title: 'macOS', detail: 'Apple Silicon · macOS 13 or later', file: 'SpawnLoft-1.5.0-mac-arm64.dmg', match: /^SpawnLoft-[\d.]+-mac-arm64\.dmg$/, main: true },
  { id: 'deb-x64', os: 'linux', title: 'Linux', detail: 'Ubuntu, Debian · x64 · .deb', file: 'SpawnLoft-1.5.0-linux-amd64.deb', match: /^SpawnLoft-[\d.]+-linux-amd64\.deb$/, main: true },
  { id: 'deb-arm64', os: 'linux', title: 'Ubuntu, Debian', detail: 'arm64 · .deb', file: 'SpawnLoft-1.5.0-linux-arm64.deb', match: /^SpawnLoft-[\d.]+-linux-arm64\.deb$/ },
  { id: 'rpm-x64', os: 'linux', title: 'Fedora, RHEL', detail: 'x64 · .rpm', file: 'SpawnLoft-1.5.0-linux-x86_64.rpm', match: /^SpawnLoft-[\d.]+-linux-x86_64\.rpm$/ },
  { id: 'rpm-arm64', os: 'linux', title: 'Fedora, RHEL', detail: 'arm64 · .rpm', file: 'SpawnLoft-1.5.0-linux-aarch64.rpm', match: /^SpawnLoft-[\d.]+-linux-aarch64\.rpm$/ },
]

// The last build for Intel Macs. 1.5 and later are Apple Silicon only.
export const INTEL_MAC_URL = `https://github.com/${REPO}/releases/download/v1.4.0/SpawnLoft-1.4.0-mac-x64.dmg`

export const OS_NAMES: Record<Os, string> = { windows: 'Windows', mac: 'macOS', linux: 'Linux' }

export const downloadUrl = (version: string, file: string) => `https://github.com/${REPO}/releases/download/${version}/${file}`

export function formatSize(bytes?: number) {
  if (!bytes) return ''
  return `${Math.round(bytes / 1048576)} MB`
}

/** The desktop OS the visitor is on, or undefined on a phone or anything else without a build. */
export function detectOs(): Os | undefined {
  if (typeof navigator === 'undefined') return undefined
  const data = (navigator as Navigator & { userAgentData?: { platform?: string; mobile?: boolean } }).userAgentData
  if (data?.mobile) return undefined
  const platform = (data?.platform || navigator.platform || '').toLowerCase()
  const agent = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|android/.test(agent)) return undefined
  if (platform.startsWith('win') || agent.includes('windows')) return 'windows'
  if (platform.startsWith('mac') || agent.includes('mac os')) return 'mac'
  if (platform.includes('linux') || platform.includes('x11') || /linux|cros/.test(agent)) return 'linux'
  return undefined
}

export interface Release { version: string; downloads: Download[]; url: string }

/**
 * The latest stable release, with the file names GitHub actually has. Throws when the answer is
 * not a complete stable release, and the caller keeps the fallback. The three main downloads must
 * all be present; the other packages are offered only when they exist, so a release that drops
 * one (as 1.5 dropped the Intel Mac build) is never refused outright.
 */
export async function fetchLatest(signal?: AbortSignal): Promise<Release> {
  const response = await fetch(LATEST_API, { headers: { accept: 'application/vnd.github+json' }, signal })
  if (!response.ok) throw new Error(`GitHub answered ${response.status}`)
  const latest = await response.json()
  if (latest.draft || latest.prerelease || !/^v\d+\.\d+\.\d+$/.test(latest.tag_name)) throw new Error('Not a stable release')
  const assets: { name: string; size: number }[] = Array.isArray(latest.assets) ? latest.assets : []
  const found = DOWNLOADS.map(item => ({ item, asset: assets.find(asset => item.match.test(asset.name)) }))
  if (found.some(({ item, asset }) => item.main && !asset)) throw new Error('Release still uploading')
  const downloads = found.flatMap(({ item, asset }) => asset ? [{ ...item, file: asset.name, size: asset.size }] : [])
  return { version: latest.tag_name, downloads, url: latest.html_url || `${RELEASES_URL}/tag/${latest.tag_name}` }
}
