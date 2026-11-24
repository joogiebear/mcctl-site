---
description: "What stays on your machine, what SpawnLoft never does, and how the panel, RCON, scheduled tasks and AI assistants are locked down."
---

# Security

SpawnLoft is built for **one machine, and the LAN around it**. That is a design, not a limitation.

| Area | Behavior |
| --- | --- |
| Network | Nothing opens firewall ports or touches your router. Exposing a server to the internet is a deliberate, separate decision that stays yours. |
| RCON | Binds to `server-ip`: empty for LAN, `127.0.0.1` to keep it strictly local. RCON has no rate limiting or encryption and must never face the internet. `spawnloft doctor` and the panel warn when the machine has a public address and no active firewall; Minecraft cannot bind RCON separately from the game port. |
| Panel binding | `127.0.0.1` only, with no flag to change it. A panel reachable from another machine is a server console reachable from another machine. To manage a server from elsewhere, remote into the machine that runs it. |
| Panel sign-in | The panel is a local web server that can start processes and type into a server console, and `127.0.0.1` is shared with every program and account on the computer, so every request must prove it comes from you. The desktop window and a browser signed in with `spawnloft ui` carry a session cookie; a program carries a short token it signs with this install's key, `panel.key` in the SpawnLoft settings folder, readable by you alone. Without one the panel answers `401` and a page says "Open SpawnLoft from the app, or run `spawnloft ui`". The key never leaves the file: not in a request, a URL, a cookie, a log or the diagnostics bundle. No `GET` changes your servers, settings or accounts. |
| Panel requests | Every request needs a loopback `Host` header, which defeats DNS rebinding. An `Origin`, when present, must match that `Host` exactly, port included, because dynmap, BlueMap and Plan serve web pages on other loopback ports while rendering names and chat that players chose. |
| RCON password | The page never receives it. Every route that returns a server strips it first, so it cannot reach a browser cache, a screenshot or a pasted bug report. |
| Scheduled tasks | An allowlist (`backup`, `verify`, `command`, `restart`, `stop`, `start`), not command strings. The operating system holds only a trigger calling `spawnloft task run <id>`; an unrecognised value is refused. Tasks run as the signed-in user, with no stored password and no elevation. |
| AI assistants | Passwords, webhook URLs and player IP addresses are withheld from every result, and destructive tools are off unless you enable them. See [AI assistants](/guide/ai-assistants#what-the-ai-provider-sees). |

## Downloads and optional sharing

SpawnLoft makes network requests for app updates, server software, plugin search and download, and database engines, only when those features are used. Configured Discord webhooks send lifecycle alerts.

| Feature | What leaves the machine |
| --- | --- |
| **Feedback** | Nothing from SpawnLoft. GitHub opens in your browser with a report drafted. |
| **Console → Export → Upload to mclo.gs** | The console log, after a dialog that says what is in it. SpawnLoft replaces your account name in file paths first. mclo.gs removes IP addresses on its side (best effort, by its own policy) and deletes the log 90 days after it was last opened. Player names and plugin output go as is. The delete token is kept locally in `run/mclogs.json`. |
| Plugin update checks | Hashes only of plugins SpawnLoft installed. Hand-added plugins are never hashed to anyone. |

### Signing in from a browser

`spawnloft ui` signs your browser in through a small page it writes in the settings folder (readable by you alone), never by putting a link on a command line where other accounts could read it. The printed link works once, within five minutes. A browser stays signed in until the panel stops, or until its tab has been closed for 15 minutes; there is no "remember this browser", and `spawnloft ui --link` makes a new link. A browser installed as a Snap or Flatpak (Ubuntu's Firefox, for one) cannot read the settings folder; use the printed link instead.

Browsers scope cookies to the host, not the port, so a browser signed in with `spawnloft ui` also sends its session cookie to any other web server on `127.0.0.1` it visits while the panel runs. If other people have accounts on the computer, use the desktop app, whose window only ever visits the panel, or close the panel's tab when you are done.

### Scripts

The panel's HTTP API is what its pages use, not a stable interface; the command line (`--json` on most commands) and the [MCP server](/guide/ai-assistants) are. A script that calls it anyway signs each request with `panel.key`, as described under [Panel access](https://github.com/joogiebear/spawnloft/blob/v2/README.md#panel-access) in the repository README.

Worlds and backups stay in the folders you choose. Database engines are checksum-verified downloads. [Database credentials](/guide/databases) are provided for manual plugin setup; SpawnLoft does not write them into plugin configs.

## Online mode is on by default

Servers SpawnLoft creates start with `online-mode=true`. Offline mode gives players name-derived UUIDs rather than Mojang ones, so any plugin keying data by UUID behaves differently: some bugs will not reproduce, and some appear that do not exist on a real server. Paper also prints an `OFFLINE/INSECURE` banner near the top of every log, and plugin authors routinely refuse a bug report carrying it.

Offline stays one toggle away for multi-account testing or working without internet: `spawnloft new <name> --offline`, `spawnloft props <name> online-mode=false`, or the panel's **Settings**. The panel badges any server running that way.

## What is on disk

`instances.json` stores RCON passwords in plaintext in your data folder. Database connection credentials are stored locally too. Protect the data folder and keep credential output out of shared logs. Structured `--json` status omits configured credentials, webhook URLs and JVM arguments, but diagnostic console excerpts can contain plugin output; review them before sharing.
