# Security

SpawnLoft is built for **one machine, and the LAN around it**. That is a design, not a limitation.

## Nothing is opened to the internet

Nothing here opens firewall ports or touches your router. Exposing a server to the internet is a
deliberate, separate decision that stays yours.

RCON binds to whatever `server-ip` says. Leave it empty for LAN, or set it to `127.0.0.1` to keep
RCON strictly local. RCON has no rate limiting or encryption and must never face the internet.

## The panel answers only this machine

The panel is an unauthenticated local HTTP server that can start processes and type into a server
console, so "local" has to mean local rather than merely reachable.

- It binds to `127.0.0.1`, and there is no flag to bind it anywhere else, on purpose. A panel
  reachable from another machine is a server console reachable from another machine. To manage a
  server from elsewhere, remote into the machine that runs it.
- Binding to loopback stops other machines. It does not stop the browser already on this one, so
  every request must also carry a loopback `Host`, which is what defeats DNS rebinding, and an
  `Origin`, when there is one, must match that `Host` exactly, port included. This machine is full
  of pages served from loopback: dynmap, BlueMap and Plan all serve web UIs on their own ports
  while rendering names and chat that players chose.
- The page never receives an RCON password. Every route that returns a server strips it first, so
  it cannot end up in a browser cache, a screenshot, or a pasted bug report.

## Downloads and optional sharing

SpawnLoft makes network requests for app updates, server software, plugin searches/downloads,
and managed database engines when those features are used. Optional configured Discord
webhooks also send lifecycle alerts. The app is local, but these features need network access.

- **Feedback** opens GitHub in your browser with a report drafted. Nothing is sent by SpawnLoft.
- **Console → Export → Upload to mclo.gs** posts the console log to [mclo.gs](https://mclo.gs),
  the log-sharing service plugin developers ask for, after a dialog that says what is in it. SpawnLoft
  replaces your account name in file paths first; mclo.gs removes IP addresses on its side, best
  effort by its own policy, and deletes the log 90 days after it was last opened. Everything else,
  player names and plugin output included, goes as is. The delete token is kept locally.

Worlds and backups remain in the folders you choose. SpawnLoft downloads checksum-verified
MySQL binaries into its engine store. [Database credentials](/guide/databases) are provided for
manual plugin setup; SpawnLoft does not write them into plugin configs.

## Online mode is on by default

Offline mode gives players name-derived UUIDs rather than Mojang ones, so any plugin keying data by
UUID behaves differently: some bugs will not reproduce, and some appear that do not exist on a
real server. Paper also prints an `OFFLINE/INSECURE` banner near the top of every log, and plugin
authors routinely refuse a bug report carrying it.

Offline is still one toggle away, for multi-account testing or working without internet:
`mcctl new <name> --offline`, `mcctl props <name> online-mode=false`, or the panel's Settings.
The panel badges any server running that way.

## Scheduled tasks are an allowlist

Scheduled tasks are code that runs on a timer, so what a task may be is an allowlist rather than a
command string: back up, send a console command, restart, stop, start. Windows holds only a trigger
calling `mcctl task run <id>`; what that id means lives in SpawnLoft's own file, and a value it does
not recognise is refused rather than executed. Tasks run as the signed-in user, with no stored
password and no elevation.

## What is on disk

The registry stores RCON passwords in plaintext, in your data folder. Servers, worlds, backups and
jars are ordinary folders there too, and stay there.

Database connection credentials are also stored locally. Protect the data folder and avoid
sharing credential output. Structured status output omits configured credentials, but diagnostic
console excerpts can contain plugin output; review them before sharing.
