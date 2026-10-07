<script setup lang="ts">
import BrandIcon from './BrandIcon.vue'
import Download from './Download.vue'

// Goal-gradient: three steps, stated once, in the order they actually happen. The docs carry
// the detail — this page only has to get someone from the download to a running server.
const steps = [
  {
    icon: 'download', title: 'Install SpawnLoft.',
    text: 'Run the installer for your system. On first launch it looks for Java and tells you plainly if the version you have will not run the Minecraft you want.',
    aside: 'Takes a minute or two. No account, nothing to sign up for.',
  },
  {
    icon: 'world', title: 'Add a server.',
    text: 'Choose Add a server, pick the software and Minecraft version, and the jar downloads with real progress. Already run a server? Point SpawnLoft at its folder instead — nothing is moved or rewritten, and its ports and RCON password are read from its own server.properties.',
    aside: 'Paper, Purpur, Fabric, NeoForge, vanilla, or a whole Modrinth modpack.',
  },
  {
    icon: 'play', title: 'Press Start.',
    text: 'Watch the console until it prints Done. Type list to see who is on. Open Plugins and install something. Take a backup while you are there, so the next experiment has a way back.',
    aside: 'Your world is now live on your own machine.',
  },
]

// Per-platform install, with the awkward parts named rather than buried. The SmartScreen warning
// in particular: people hit it, and a page that has not warned them loses their trust at the
// exact moment it needed it.
const platforms = [
  {
    id: 'windows', icon: 'windows', title: 'Windows', detail: '10 or 11 · x64',
    lines: ['Run the .exe installer. It installs per user, so there is no administrator prompt.', 'Installers are signed through Microsoft Azure Artifact Signing.'],
    heads: 'Heads up', warn: 'SmartScreen judges by reputation, not signature, and a new publisher earns reputation slowly. If Windows says “Windows protected your PC”, choose More info, then Run anyway.',
    href: '/guide/getting-started#smartscreen', link: 'Why that warning appears',
  },
  {
    id: 'mac', icon: 'cube', title: 'macOS', detail: '13 or later',
    lines: ['Check Apple menu → About This Mac, then take the Apple Silicon DMG for an M-series chip or the Intel one otherwise.', 'Open the DMG and drag SpawnLoft into Applications. Both builds are Developer ID signed, hardened, Apple-notarized and stapled.'],
    heads: 'Worth knowing', warn: 'The app runs on macOS 13 and later. Managed MySQL is the one feature that needs macOS 15 or later.',
    href: '/guide/getting-started#install-on-mac', link: 'Mac setup steps',
  },
  {
    id: 'linux', icon: 'terminal', title: 'Linux', detail: '.deb or .rpm · x64 or arm64',
    lines: ['sudo apt install ./SpawnLoft-<version>-linux-amd64.deb on Ubuntu 22.04+ and Debian 12+.', 'sudo dnf install ./SpawnLoft-<version>-linux-x86_64.rpm on Fedora, the RHEL family and openSUSE.', 'Open SpawnLoft from the applications menu, or run spawnloft-desktop. spawnloft is the command line.'],
    heads: 'Read this one', warn: 'Schedules and automatic backups run on systemd user timers, and they stop when you log out unless lingering is on for your account. Turn on Keep running after logout, or run spawnloft task linger on. On a machine you reach over SSH, that is the difference between a nightly backup and none.',
    href: '/guide/beta#install-on-linux', link: 'Linux notes in full',
  },
]

// Recognition over recall: nobody remembers which Java their Minecraft wants.
const java = [
  { mc: '1.18 – 1.20.4', jre: 'Java 17' },
  { mc: '1.20.5 – 1.21.x', jre: 'Java 21' },
  { mc: '26.x', jre: 'Java 25' },
]

const next = [
  { icon: 'world', title: 'Let friends in', text: 'How people actually connect, and what to switch on first.', href: '/guide/sharing' },
  { icon: 'plugins', title: 'Install plugins', text: 'Search Modrinth and Hangar, install, and keep things updated.', href: '/guide/plugins' },
  { icon: 'backup', title: 'Set up backups', text: 'Schedule them, verify them, and know how to restore one.', href: '/guide/backups' },
  { icon: 'spark', title: 'Try things safely', text: 'Clone your server into a copy and break that one instead.', href: '/guide/try-it-safely' },
]

// A native <details> rather than a scripted tab strip, as the FAQ on the landing page already
// does. It discloses without JavaScript, so the steps are still readable before hydration and
// in a browser that never runs it, and the open/closed state is announced for free.
</script>

<template>
  <main class="start">
    <section class="start-hero">
      <span class="start-label">SPAWNLOFT / GET STARTED</span>
      <h1>From download<br>to <span>running server.</span></h1>
      <p>SpawnLoft runs Minecraft Java Edition servers on your own computer. Pick your platform, install it, and start a world. Most people are playing inside ten minutes.</p>
      <div class="start-download"><Download fine /></div>
    </section>

    <section class="start-steps" aria-labelledby="steps-title">
      <div class="steps-heading">
        <span class="start-label">THE WHOLE PROCESS</span>
        <h2 id="steps-title">Three steps. That’s it.</h2>
        <a href="/guide/getting-started">The detailed setup guide <BrandIcon name="arrow" :size="17" /></a>
      </div>
      <ol>
        <li v-for="(step, i) in steps" :key="step.title">
          <span class="step-number">0{{ i + 1 }}</span>
          <div class="step-body">
            <BrandIcon :name="step.icon" :size="30" />
            <h3>{{ step.title }}</h3>
            <p>{{ step.text }}</p>
          </div>
          <span class="step-aside">{{ step.aside }}</span>
        </li>
      </ol>
    </section>

    <section class="start-needs" aria-labelledby="needs-title">
      <div class="needs-copy">
        <span class="start-label">BEFORE YOU START</span>
        <h2 id="needs-title">One thing we can’t install for you.</h2>
        <p>Minecraft servers <em>are</em> Java programs, so Java is separate on every platform. SpawnLoft checks for it on first run, searches your PATH and the usual install folders, and picks the newest installed Java that fits each server. It refuses a version nothing on your machine can run <em>before</em> downloading anything, and links the one you need.</p>
        <a class="needs-link" href="https://adoptium.net/temurin/releases/?version=25">Temurin 25 is a good default <BrandIcon name="external" :size="15" /></a>
      </div>
      <div class="needs-table">
        <table>
          <caption class="start-label">WHICH JAVA YOUR MINECRAFT WANTS</caption>
          <thead><tr><th scope="col">Minecraft</th><th scope="col">Needs</th></tr></thead>
          <tbody><tr v-for="row in java" :key="row.mc"><td>{{ row.mc }}</td><td>{{ row.jre }}</td></tr></tbody>
        </table>
        <p class="needs-note">Use a <strong>JDK</strong> rather than a JRE if you want Spigot or CraftBukkit built on your machine. <a href="/guide/getting-started#what-you-need">Full requirements →</a></p>
      </div>
    </section>

    <section class="start-platforms" aria-labelledby="platforms-title">
      <div class="plat-heading">
        <span class="start-label">PICK YOUR SYSTEM</span>
        <h2 id="platforms-title">Installing, platform by platform.</h2>
        <p>Open the one that’s yours. Each includes the part people trip over.</p>
      </div>
      <div class="plat-list">
        <details v-for="platform in platforms" :key="platform.id">
          <summary>
            <BrandIcon :name="platform.icon" :size="26" />
            <span class="plat-name">{{ platform.title }}</span>
            <span class="plat-detail">{{ platform.detail }}</span>
            <BrandIcon name="chevron" :size="18" />
          </summary>
          <div class="plat-body">
            <ol><li v-for="line in platform.lines" :key="line">{{ line }}</li></ol>
            <aside><strong>{{ platform.heads }}</strong><p>{{ platform.warn }}</p><a :href="platform.href">{{ platform.link }} <BrandIcon name="arrow" :size="14" /></a></aside>
          </div>
        </details>
      </div>
      <p class="plat-foot">Running a server with no screen? There’s a command-line-only Linux package, about 30&nbsp;MB, with its own runtime. <a href="/guide/beta#no-screen">Set that up instead →</a></p>
    </section>

    <section class="start-honest">
      <BrandIcon name="shield" :size="38" />
      <div>
        <span class="start-label">SO THERE ARE NO SURPRISES</span>
        <h2>Your machine stays your machine.</h2>
        <p>SpawnLoft does not open a port, create an account, or put your server on the internet by itself. Friends on your own network connect to your local address. Anyone further away needs a port forward or a tunnel that <em>you</em> choose to set up — and because the server runs here, your world is offline when your computer is.</p>
        <nav aria-label="Honesty links"><a href="/guide/security">What stays local <BrandIcon name="arrow" :size="15" /></a><a href="/guide/sharing">How friends join <BrandIcon name="arrow" :size="15" /></a><a href="/guide/compare">When a host is the better call <BrandIcon name="arrow" :size="15" /></a></nav>
      </div>
    </section>

    <section class="start-next" aria-labelledby="next-title">
      <div class="next-heading"><span class="start-label">ONCE IT’S RUNNING</span><h2 id="next-title">Good next moves.</h2></div>
      <div class="next-grid">
        <a v-for="item in next" :key="item.href" :href="item.href"><BrandIcon :name="item.icon" :size="30" /><strong>{{ item.title }}</strong><span>{{ item.text }}</span><BrandIcon name="arrow" :size="17" /></a>
      </div>
    </section>

    <section class="start-stuck">
      <div><span class="start-label">IF IT DOESN’T GO SMOOTHLY</span><h2>Something not working?</h2><p>Most first-run problems are Java, a port already in use, or SmartScreen. All three have a page.</p></div>
      <nav aria-label="Help links"><a href="/guide/troubleshooting">Troubleshooting <BrandIcon name="arrow" :size="16" /></a><a href="/guide/faq">Common questions <BrandIcon name="arrow" :size="16" /></a><a href="https://github.com/joogiebear/spawnloft/discussions">Ask the community <BrandIcon name="external" :size="16" /></a></nav>
    </section>
  </main>
</template>

<style scoped>
.start { background:#090d0d; color:#efeee6; }
.start a { text-decoration:none; }
.start a:focus-visible,.start button:focus-visible { outline:2px solid #83a945; outline-offset:6px; }
.start-label { display:block; font:11px/1.7 var(--mono); letter-spacing:.12em; color:#a0b28b; }

/* Hero: the download is the page's job, so it sits in the hero and not three screens down. */
.start-hero { max-width:1000px; margin:auto; padding:85px 5vw 70px; text-align:center; }
h1 { font:600 clamp(44px,5.6vw,80px)/1.02 var(--display); letter-spacing:-.06em; margin:26px 0; }
h1 span { color:#c4f566; }
.start-hero p { color:#abb5a3; font-size:15px; line-height:1.8; max-width:620px; margin:0 auto; }
.start-download { margin-top:42px; text-align:left; }
.start-download :deep(.dl-full) { align-items:center; }
.start-download :deep(.release-label),.start-download :deep(.setup-link),.start-download :deep(.fine),.start-download :deep(.more-linux) { text-align:center; }
.start-download :deep(.platforms) { width:100%; }
.start-download :deep(.platform) { border-color:#44582f; background:#0e150d; }
.start-download :deep(a.platform:hover) { background:#c4f566; color:#090d0d; border-color:#c4f566; }
.start-download :deep(.release-label) { color:#a0b28b; }
.start-download :deep(.fine),.start-download :deep(.more-linux) { color:#8b9a7f; }
.start-download :deep(.setup-link) { color:#c4f566; }

/* Steps: the light surface, the same one the site uses whenever it is being substantive. */
.start-steps { background:#efeee6; color:#172016; padding:65px max(5vw,calc((100vw - 1188px)/2)) 75px; }
.steps-heading { display:flex; flex-wrap:wrap; align-items:baseline; gap:15px; padding-bottom:30px; border-bottom:1px solid #bbc4b1; }
.steps-heading>.start-label { width:100%; color:#5b6d4a; }
.steps-heading h2 { font:600 clamp(28px,3vw,42px)/1.1 var(--display); letter-spacing:-.045em; margin:0; }
.steps-heading>a { margin-left:auto; display:inline-flex; align-items:center; gap:16px; font-size:12px; color:#172016; border-bottom:1px solid #89917b; padding-bottom:5px; }
.start-steps ol { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:repeat(3,1fr); gap:46px; }
.start-steps li { padding-top:40px; }
.step-number { display:block; font:12px var(--mono); color:#5e6c52; margin-bottom:22px; }
.step-body>svg { color:#406722; }
.start-steps h3 { font:600 clamp(25px,2.3vw,32px)/1.12 var(--display); letter-spacing:-.04em; margin:18px 0 14px; }
/* The paragraph owns the minimum gap; the aside's auto top margin takes up whatever slack is
   left, so all three closing lines sit on one baseline however long the prose runs. */
.start-steps p { font-size:14px; line-height:1.8; color:#525c4c; margin:0 0 22px; }
/* #5b6a4d, not the lighter grey-green: at 11px the lighter value is 4.1:1 on bone, under AA. */
.step-aside { display:block; padding-top:16px; border-top:1px solid #c5ccbd; font:11px/1.7 var(--mono); letter-spacing:.04em; color:#5b6a4d; }
/* Above the stacking breakpoint the three steps share grid rows, so the numbers, the prose and
   the closing rules each line up across the row however long any one step's copy runs. Without
   this the rules sit at three different heights, which is the first thing the eye catches. */
@media(min-width:1001px) {
  .start-steps ol { grid-template-rows:auto 1fr auto; row-gap:0; }
  .start-steps li { display:contents; }
  .start-steps .step-number { grid-row:1; padding-top:40px; }
  .start-steps .step-body { grid-row:2; }
  .start-steps .step-aside { grid-row:3; }
}

/* Java: the single honest prerequisite, given its own section instead of a footnote. */
.start-needs { max-width:1320px; margin:auto; padding:85px 5vw; display:grid; grid-template-columns:1.25fr 1fr; gap:7vw; align-items:center; }
.start-needs h2 { font:600 clamp(32px,3.9vw,52px)/1.05 var(--display); letter-spacing:-.05em; margin:20px 0; }
.start-needs .needs-copy p { color:#a0ae94; font-size:15px; line-height:1.8; margin:0; }
.start-needs em { color:#cfdcc0; font-style:italic; }
.needs-link { display:inline-flex; align-items:center; gap:14px; font-size:12px; color:#c4f566; border-bottom:1px solid #6f8a3f; padding-bottom:5px; margin-top:24px; }
.needs-table table { width:100%; border-collapse:collapse; }
/* display:table-caption, not the start-label block: a caption forced to display:block drops out
   of caption layout and renders below the header row instead of above the table. */
.needs-table caption { display:table-caption; text-align:left; padding-bottom:16px; color:#8e9d81; }
.needs-table th { text-align:left; font:11px var(--mono); letter-spacing:.1em; color:#8e9d81; text-transform:uppercase; padding:0 0 12px; border-bottom:1px solid #2d3a26; font-weight:400; }
.needs-table td { padding:16px 0; border-bottom:1px solid #1d2719; font-size:15px; }
.needs-table td:last-child { text-align:right; color:#c4f566; font:13px var(--mono); }
.needs-note { font-size:12px; line-height:1.8; color:#8b9a7f; margin:20px 0 0; }
.needs-note strong { color:#cfdcc0; }
.needs-note a { color:#c4f566; }

/* Platforms: progressive disclosure, so nobody reads two sets of steps that are not theirs. */
.start-platforms { background:#0e150d; border-top:1px solid #c4f56622; padding:70px max(5vw,calc((100vw - 1188px)/2)) 66px; }
.plat-heading { max-width:640px; }
.plat-heading h2 { font:600 clamp(30px,3.6vw,48px)/1.05 var(--display); letter-spacing:-.05em; margin:20px 0 16px; }
.plat-heading>p { color:#a0ae94; font-size:14px; line-height:1.8; margin:0; }
.plat-list { margin-top:44px; border-top:1px solid #2d3a26; }
.plat-list details { border-bottom:1px solid #2d3a26; }
.plat-list summary { display:flex; align-items:center; gap:18px; padding:26px 0; list-style:none; cursor:pointer; }
.plat-list summary::-webkit-details-marker { display:none; }
.plat-list summary>svg:first-child { color:#c4f566; flex:none; }
.plat-name { font:600 24px var(--display); letter-spacing:-.035em; }
.plat-detail { font:11px var(--mono); letter-spacing:.08em; color:#8e9d81; }
.plat-list summary>svg:last-child { margin-left:auto; color:#c4f566; transform:rotate(90deg); transition:transform .2s; }
.plat-list details[open] summary>svg:last-child { transform:rotate(-90deg); }
.plat-body { display:grid; grid-template-columns:1.3fr 1fr; gap:46px; padding:4px 0 34px; }
.plat-body ol { margin:0; padding-left:22px; }
.plat-body li { font-size:14px; line-height:1.85; color:#b1bda6; margin:0 0 12px; }
.plat-body aside { border-left:2px solid #c4f566; padding:2px 0 2px 20px; }
.plat-body aside strong { display:block; font:11px var(--mono); letter-spacing:.12em; text-transform:uppercase; color:#c4f566; margin-bottom:10px; }
.plat-body aside p { font-size:13px; line-height:1.8; color:#a0ae94; margin:0 0 14px; }
.plat-body aside a { display:inline-flex; align-items:center; gap:12px; font-size:11px; color:#c4f566; }
.plat-foot { margin:34px 0 0; font-size:13px; line-height:1.8; color:#8b9a7f; }
.plat-foot a { color:#c4f566; }

/* Honesty: lime, same as the features page, because it is the same promise. */
.start-honest { background:#c4f566; color:#16220d; padding:60px max(5vw,calc((100vw - 1188px)/2)); display:flex; gap:32px; align-items:flex-start; }
.start-honest>svg { flex:none; margin-top:4px; }
.start-honest .start-label { color:#45602d; }
.start-honest h2 { font:600 clamp(30px,3.5vw,46px)/1.06 var(--display); letter-spacing:-.05em; margin:16px 0; max-width:700px; }
.start-honest p { font-size:14px; line-height:1.85; color:#3a502b; margin:0; max-width:760px; }
.start-honest em { font-style:italic; color:#16220d; }
.start-honest nav { display:flex; flex-wrap:wrap; gap:14px 34px; margin-top:26px; }
.start-honest nav a { display:inline-flex; align-items:center; gap:12px; font-size:12px; color:#16220d; border-bottom:1px solid #587237; padding-bottom:5px; }

.start-next { max-width:1320px; margin:auto; padding:80px 5vw 70px; }
.next-heading h2 { font:600 clamp(30px,3.6vw,48px)/1.05 var(--display); letter-spacing:-.05em; margin:18px 0 0; }
.next-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:44px; }
.next-grid a { display:flex; flex-direction:column; border:1px solid #2d3a26; background:#0e150d; padding:26px 24px 24px; color:#efeee6; transition:border-color .16s,background .16s; }
.next-grid a:hover { border-color:#6f8a3f; background:#121a10; }
.next-grid svg:first-child { color:#c4f566; margin-bottom:22px; }
.next-grid strong { font:600 20px var(--display); letter-spacing:-.03em; margin-bottom:9px; }
.next-grid span { font-size:13px; line-height:1.7; color:#97a58b; margin-bottom:22px; }
.next-grid a>svg:last-child { margin-top:auto; color:#c4f566; transition:transform .16s; }
.next-grid a:hover>svg:last-child { transform:translateX(5px); }

.start-stuck { border-top:1px solid #c4f56622; background:#151e11; padding:52px max(5vw,calc((100vw - 1188px)/2)); display:flex; gap:40px; align-items:center; }
.start-stuck h2 { font:600 clamp(26px,2.9vw,36px)/1.1 var(--display); letter-spacing:-.045em; margin:16px 0 12px; }
.start-stuck p { font-size:13px; line-height:1.8; color:#a0ae94; margin:0; max-width:520px; }
.start-stuck nav { margin-left:auto; display:grid; gap:14px; }
.start-stuck nav a { display:flex; align-items:center; justify-content:space-between; gap:28px; font-size:12px; color:#c4f566; }
.start-stuck nav a:hover { text-decoration:underline; text-underline-offset:4px; }

@media(max-width:1000px) {
  .start-steps ol { grid-template-columns:1fr; gap:0; }
  .start-steps li { padding:34px 0; border-bottom:1px solid #c5ccbd; }
  .start-steps li:last-child { border-bottom:0; padding-bottom:4px; }
  .start-needs { grid-template-columns:1fr; gap:45px; }
  .plat-body { grid-template-columns:1fr; gap:28px; }
  .next-grid { grid-template-columns:repeat(2,1fr); }
  .start-honest { flex-direction:column; gap:22px; }
  .start-stuck { flex-direction:column; align-items:stretch; gap:28px; }
  .start-stuck nav { margin:0; }
}
@media(max-width:650px) {
  .start-hero { padding:48px 22px 50px; }
  h1 { font-size:42px; }
  .start-hero p { font-size:14px; }
  .start-download { margin-top:32px; }
  .start-steps { padding:43px 22px; }
  .steps-heading h2 { font-size:30px; }
  .steps-heading>a { margin:0; }
  .start-steps h3 { font-size:26px; }
  .start-needs { padding:50px 22px; }
  .start-needs h2 { font-size:33px; }
  .start-platforms { padding:48px 22px; }
  .plat-heading h2 { font-size:32px; }
  .plat-list { margin-top:32px; }
  .plat-list button { padding:22px 0; gap:14px; flex-wrap:wrap; }
  .plat-name { font-size:21px; }
  .plat-detail { width:100%; order:3; flex-basis:100%; }
  .plat-list button>svg:last-child { order:2; }
  .start-honest { padding:44px 22px; }
  .start-honest>svg { display:none; }
  .start-honest h2 { font-size:31px; }
  .start-honest nav { gap:14px; flex-direction:column; align-items:flex-start; }
  .start-next { padding:50px 22px; }
  .next-heading h2 { font-size:32px; }
  .next-grid { grid-template-columns:1fr; gap:14px; margin-top:32px; }
  .start-stuck { padding:40px 22px; }
  .start-stuck nav { gap:18px; }
}
@media(prefers-reduced-motion:reduce) { .plat-list button>svg:last-child,.next-grid a,.next-grid a>svg:last-child { transition:none; } }
</style>
