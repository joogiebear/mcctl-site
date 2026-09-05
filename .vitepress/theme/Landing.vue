<script setup lang="ts">
import Download from './Download.vue'
import BootConsole from './BootConsole.vue'
import Showcase from './Showcase.vue'
</script>

<template>
  <main class="landing">
    <div class="wrap hero">
      <div class="copy">
        <span class="kicker">Free and open source · Windows</span>
        <h1>Minecraft servers on your own PC, <span>without the terminal.</span></h1>
        <p class="lede">
          SpawnLoft starts a Paper, Fabric or NeoForge server on your machine, keeps its console in front of
          you, installs plugins from Modrinth and Hangar, takes backups that verify, and brings a crashed
          server back on its own. No cloud, no Docker, no accounts.
        </p>
        <div class="cta">
          <Download size="lg" fine />
          <a class="btn lg" href="https://github.com/joogiebear/spawnloft">View on GitHub</a>
        </div>
      </div>
      <div class="demo"><BootConsole /></div>
    </div>

    <section id="features">
      <div class="wrap">
        <h2 v-reveal>Everything a server needs, in one window</h2>
        <p class="sub">Each server gets a card, a status lamp, a console and eight tabs. The command line is there too, for anyone who wants it.</p>
        <div class="grid" v-reveal>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M2 3h12v10H2z"/><path d="M5 7l2 1.5L5 10"/><path d="M8.5 10.5H11"/></svg></div>
            <h3>A console you can read</h3>
            <p>Search, filter to warnings or errors, pause, copy. Stack traces stay with the error that caused them. Send commands over RCON and get the reply back.</p>
          </div>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M5 2v3.5M11 2v3.5"/><path d="M3.5 5.5h9V9a4.5 4.5 0 0 1-9 0z"/><path d="M8 13.5V15"/></svg></div>
            <h3>Plugins from Modrinth and Hangar</h3>
            <p>Search both at once, install builds that match your version, check for updates and apply them with a snapshot taken first. Plugins you dropped in by hand are left alone.</p>
          </div>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M2 3h12v3H2z"/><path d="M3 6v7h10V6"/><path d="M6.5 9h3"/></svg></div>
            <h3>Backups that verify</h3>
            <p>Snapshots of plugins, worlds and config, taken hot with the world flushed first. Every one can be read back end to end, on a schedule, so you find out the week it broke.</p>
          </div>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.8-3.85"/><path d="M13 2v3h-3"/></svg></div>
            <h3>Comes back after a crash</h3>
            <p>A crashed server restarts on its own, with a limit so a broken plugin cannot grind all night. A Discord webhook tells you what happened. The likely cause is named from the log.</p>
          </div>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/><path d="M8 5.5V8h2.5"/></svg></div>
            <h3>Scheduled, even when the window is closed</h3>
            <p>Nightly backups, a restart at 5am that warns the players first, a command on the hour. Runs through Windows Task Scheduler, so it happens whether or not SpawnLoft is open.</p>
          </div>
          <div class="card">
            <div class="mark"><svg viewBox="0 0 16 16"><path d="M2 3h12v4H2zM2 9h12v4H2z"/><path d="M4.5 5h.5M4.5 11h.5"/></svg></div>
            <h3>Every kind of server</h3>
            <p>Paper, Purpur, Folia, Advanced Slime Paper, vanilla, Spigot, CraftBukkit, Fabric and NeoForge, or a whole modpack from Modrinth. Worlds you download drop straight in.</p>
          </div>
        </div>
        <div class="chips">
          <span class="chip">Paper</span><span class="chip">Purpur</span><span class="chip">Folia</span><span class="chip">ASP</span><span class="chip">Vanilla</span><span class="chip">Spigot</span><span class="chip">CraftBukkit</span><span class="chip">Fabric</span><span class="chip">NeoForge</span><span class="chip">Modrinth modpacks</span>
        </div>
      </div>
    </section>

    <section id="tour">
      <div class="wrap">
        <h2 v-reveal>Have a look around</h2>
        <p class="sub" v-reveal>Real captures of the panel, not mockups. Scroll, and the panel follows.</p>
        <Showcase />
      </div>
    </section>

    <section id="compare">
      <div class="wrap">
        <h2 v-reveal>How it compares</h2>
        <p class="sub">Three ways to run a server for your friends. Only one of them is free, private and does not need a terminal.</p>
        <div class="cmp" v-reveal>
          <table>
            <thead>
              <tr><th></th><th>SpawnLoft</th><th>A paid host</th><th>By hand</th></tr>
            </thead>
            <tbody>
              <tr><td>Cost</td><td class="y">Free, MIT licensed</td><td>Monthly, per server, for RAM you already own</td><td class="y">Free</td></tr>
              <tr><td>Where your world lives</td><td class="y">Folders on your disk</td><td>Their machine, on their terms</td><td class="y">Your disk</td></tr>
              <tr><td>Console, plugins, backups</td><td class="y">One window, eight tabs</td><td class="y">A web panel</td><td>A terminal, a browser and a zip tool</td></tr>
              <tr><td>Plugins from Modrinth and Hangar</td><td class="y">Searched together, checked against your version</td><td>Sometimes, from one source</td><td>Download the jar, guess the build</td></tr>
              <tr><td>Backups that are proven to restore</td><td class="y">Every snapshot verified, on a schedule</td><td>A backup button, rarely tested</td><td>Whatever you remembered to copy</td></tr>
              <tr><td>Comes back after a crash</td><td class="y">Restarts itself, with a limit, and tells you why</td><td class="y">Usually</td><td>When you notice</td></tr>
              <tr><td>Accounts and cloud</td><td class="y">None</td><td>An account, a card, their uptime</td><td class="y">None</td></tr>
              <tr><td>Friends outside your network</td><td>Your decision, not made for you</td><td class="y">Built in</td><td>Your router's settings page</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="testing">
      <div class="wrap two">
        <div>
          <h2 v-reveal>Made for testing plugins</h2>
          <p class="sub">SpawnLoft began as the fastest way to reproduce a plugin bug: a clean server, on the right version, with only the plugin in question, in under a minute.</p>
          <ul class="checks">
            <li><b>Clone a server</b> into a disposable copy on its own port, with fresh worlds, so you can try something without touching the real one.</li>
            <li><b>Online mode on by default</b>, so players get real UUIDs and the log has no <code>OFFLINE/INSECURE</code> banner for an author to refuse a bug report over.</li>
            <li><b>Each server picks its Java.</b> 1.20.4 on 17 beside 26.x on 25. SpawnLoft finds what is installed and warns before a download that the version cannot run.</li>
            <li><b>Log intelligence.</b> Port taken, wrong Java, missing dependency, out of memory, corrupt world: named in words under the vitals, with the fix.</li>
            <li><b>Share the log.</b> Export the console to a file, or upload it to mclo.gs with your account name already taken out of the paths.</li>
          </ul>
        </div>
        <div class="shot"><img src="/img/plugins.png" alt="The Plugins tab: search Modrinth and Hangar together, install and update" width="2558" height="1392"></div>
      </div>
    </section>

    <section id="local">
      <div class="wrap">
        <h2 v-reveal>Stays on your machine</h2>
        <p class="sub">SpawnLoft is a tool for one person's PC, running servers for friends, family or plugin testing. That is a design, not a limitation.</p>
        <div class="grid" v-reveal>
          <div class="card"><h3>No accounts, no cloud</h3><p>Nothing to sign up for. Your servers, worlds and backups are folders on your disk, and stay there.</p></div>
          <div class="card"><h3>Nothing opened to the internet</h3><p>The panel answers only this machine. Nothing touches your router. Exposing a server is a decision you make, not one made for you.</p></div>
          <div class="card"><h3>Two things leave, both on a click</h3><p>A bug report opens GitHub in your browser with the facts drafted. A log goes to mclo.gs only after a dialog says what is in it.</p></div>
          <div class="card"><h3>Zero dependencies</h3><p>Plain Node and the tar Windows already ships. No framework, no build step, no package that rots. Read the source: it is one folder.</p></div>
        </div>
      </div>
    </section>

    <section id="start">
      <div class="wrap">
        <h2 v-reveal>Up in three steps</h2>
        <p class="sub">The installer is a normal Windows setup. Servers you already have can be added in place; nothing is moved or rewritten.</p>
        <div class="steps" v-reveal>
          <div class="step"><h3>Install SpawnLoft</h3><p>Download the setup, run it, and let it check for Java. If Java is missing it says so and links the download.</p></div>
          <div class="step"><h3>Add a server</h3><p>Create one: pick the software and the Minecraft version, and the jar downloads. Or point SpawnLoft at a server folder you already run.</p></div>
          <div class="step"><h3>Press Start</h3><p>Watch it come up in the console. Send <code>list</code>. Open the Plugins tab and install something. Take a backup.</p></div>
        </div>
        <div class="cta" style="margin-top:28px">
          <Download size="lg" />
          <a class="btn lg" href="/guide/getting-started">Read the guide</a>
          <a class="btn lg" href="/changelog">What's new</a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.landing { color: var(--ink); font: 16px/1.55 var(--ui); -webkit-font-smoothing: antialiased; }
.landing a { color: var(--lapis); text-decoration: none; }
.landing a:hover { text-decoration: underline; }
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
code { font-family: var(--mono); font-size: .92em; background: var(--recess); border: 1px solid var(--line); border-radius: 4px; padding: 1px 5px; }
.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: var(--r-sm); border: 1px solid var(--edge); background: var(--raised); color: var(--ink) !important; font: 600 14px var(--ui); box-shadow: var(--lift); cursor: pointer; }
.btn:hover { border-color: var(--lapis); text-decoration: none !important; }
.btn.lg { padding: 13px 20px; font-size: 15px; }

.landing { position: relative; }
/* A faint grid and one lapis glow behind the hero: the panel's own dark, with depth. */
.landing::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 760px; pointer-events: none; z-index: -1;
  background:
    radial-gradient(600px 360px at 18% 12%, rgba(91, 132, 255, .16), transparent 70%),
    radial-gradient(500px 300px at 82% 30%, rgba(74, 222, 128, .07), transparent 70%),
    linear-gradient(var(--line) 1px, transparent 1px) 0 0 / 100% 48px,
    linear-gradient(90deg, var(--line) 1px, transparent 1px) 0 0 / 48px 100%;
  -webkit-mask-image: linear-gradient(#000 40%, transparent); mask-image: linear-gradient(#000 40%, transparent); opacity: .55; }
.hero { padding: 64px 0 56px; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 40px; align-items: center; }
.copy { display: grid; gap: 22px; }
.demo { min-width: 0; align-self: stretch; animation: settle .8s ease-out both; }
@keyframes settle { from { opacity: 0; transform: translateY(14px); } }
.hero h1 { margin: 0; font-family: var(--display); font-size: clamp(34px, 4.6vw, 56px); line-height: 1.02; letter-spacing: -.025em; font-weight: 700; }
.hero h1 span { color: var(--lapis); }
@media (max-width: 900px) { .hero { grid-template-columns: 1fr; gap: 28px; } .demo { min-height: 340px; } }
.hero p.lede { margin: 0; font-size: 18px; color: var(--ink-2); max-width: 660px; }
.cta { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.kicker { display: inline-flex; align-items: center; gap: 8px; font: 600 12px var(--ui); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); }
.kicker::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--live); box-shadow: 0 0 8px var(--live); }
.shot { border: 1px solid var(--edge); border-radius: var(--r); overflow: hidden; background: var(--surface); box-shadow: var(--lift), 0 30px 80px rgba(0, 0, 0, .55); }
.shot img { display: block; width: 100%; height: auto; }

section { padding: 64px 0; }
section + section { border-top: 1px solid var(--line); }
h2 { margin: 0 0 8px; font-family: var(--display); font-size: 30px; letter-spacing: -.02em; font-weight: 700; }
.sub { margin: 0 0 32px; color: var(--ink-2); max-width: 640px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 18px 18px 16px; box-shadow: var(--lift); transition: transform .25s ease, border-color .25s ease; }
.card:hover { transform: translateY(-2px); border-color: var(--edge); }
@media (prefers-reduced-motion: reduce) { .card, .demo { transition: none; animation: none; } }
.card .mark { width: 34px; height: 34px; border-radius: 8px; display: grid; place-items: center; background: var(--lapis-wash); border: 1px solid rgba(91, 132, 255, .35); color: var(--lapis); margin-bottom: 12px; }
.card svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.card h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; }
.card p { margin: 0; color: var(--ink-2); font-size: 14px; }
.two { display: grid; grid-template-columns: 1.1fr 1fr; gap: 36px; align-items: center; }
.two .shot { min-width: 0; }
@media (max-width: 820px) { .two { grid-template-columns: 1fr; } }
ul.checks { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; color: var(--ink-2); }
ul.checks li { padding-left: 26px; position: relative; }
ul.checks li::before { content: ''; position: absolute; left: 2px; top: 9px; width: 10px; height: 6px; border-left: 2px solid var(--live); border-bottom: 2px solid var(--live); transform: rotate(-45deg); }
ul.checks b { color: var(--ink); font-weight: 600; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
.chip { font: 600 12px var(--mono); padding: 5px 10px; border-radius: 999px; background: var(--recess); border: 1px solid var(--line); color: var(--ink-2); }
.cmp { overflow-x: auto; border: 1px solid var(--line); border-radius: var(--r); background: var(--surface); box-shadow: var(--lift); }
.cmp table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 720px; }
.cmp th, .cmp td { text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--line); vertical-align: top; color: var(--ink-2); }
.cmp th { font: 600 12px var(--ui); letter-spacing: .08em; text-transform: uppercase; color: var(--ink-3); background: var(--recess); }
.cmp th:nth-child(2) { color: var(--lapis); }
.cmp td:first-child { color: var(--ink); font-weight: 600; width: 26%; }
.cmp td.y { color: var(--ink); }
.cmp td.y::before { content: ''; display: inline-block; width: 9px; height: 5px; margin: 0 8px 3px 0; border-left: 2px solid var(--live); border-bottom: 2px solid var(--live); transform: rotate(-45deg); }
.cmp tr:last-child td { border-bottom: 0; }
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 14px; counter-reset: step; }
.step { background: var(--recess); border: 1px solid var(--line); border-radius: var(--r); padding: 18px; }
.step::before { counter-increment: step; content: counter(step); display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: 50%; background: var(--lapis); color: #fff; font: 700 13px var(--ui); margin-bottom: 10px; }
.step h3 { margin: 0 0 6px; font-size: 15px; font-weight: 600; }
.step p { margin: 0; color: var(--ink-2); font-size: 14px; }
@media (max-width: 720px) { .hero { padding-top: 36px; } }
</style>
