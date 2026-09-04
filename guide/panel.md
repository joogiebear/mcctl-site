# The panel

The panel is what the desktop app shows. It is one HTML page served by SpawnLoft itself, so it works
offline and runs equally well in a browser tab:

```bash
node mcctl.mjs ui        # opens http://127.0.0.1:8770 in your browser
```

## Servers

- **A card each**, with a status lamp, the port, the memory and a live uptime that ticks.
- **Adding a server** either creates one, which downloads the server jar and reports real
  progress, or points SpawnLoft at a folder you already have. Nothing is moved; existing ports and the
  RCON password are read from that folder's own `server.properties`.
- **Renaming, resetting and deleting** ask for the server's name. That friction is deliberate: a
  dialog that only says "are you sure" gets answered reflexively. The name shown can be clicked to
  fill it in.

## Console

Search, filter to warnings or errors, pause, copy, wrap, line numbers and a bounded scrollback.
Log level shows as a coloured rail in the gutter rather than by recolouring the text, so ERROR
stands out without becoming harder to read. A stack trace inherits the level of the line above it,
which is what makes "filter to errors" show the whole failure instead of its first line.

**Export** saves the console to a `.log` file beside the server's snapshots, or uploads it to
[mclo.gs](https://mclo.gs) for sharing with a plugin developer. The upload happens only after a
dialog that says what is in it; see [Security](/guide/security) for the details.

## Plugins

Search and install from **Modrinth and Hangar** together, each result naming its source, filtered
or checked against this server's version, with checksum-verified downloads, an update check, and
one-click updates with a plugins-scope snapshot taken first. Hangar projects that host their
downloads elsewhere are linked to rather than pretended at.

The page manages **only what SpawnLoft installed**. A custom or premium plugin dropped in by hand is
never listed there, never offered a meaningless update, and never has its hash sent to anyone.
`mcctl plugins <name>` lists the full inventory, manual jars included. Enable and disable rename
the jar in place, so a disabled plugin keeps its spot and its config.

## Backups

Take one at a chosen scope, see every snapshot with its size, age and coverage, and restore or
delete any of them. Restoring is refused while the server runs, because extracting over files a
live server holds open corrupts a world rather than replacing it. Automatic backups run on a
schedule with a retention limit, and the limit only ever removes snapshots its own schedule
produced, never one taken by hand or before a reset.

## Players

Everyone the server knows about, gathered from operators, bans, the whitelist, the name cache and
the world folder, since none of those is a complete list on its own. Search, filter to operators
or the banned, and op, ban or delete a player's world data. Whoever is connected is marked and
sorted first. Changes go through the console while the server runs and into its files when it
does not.

## Performance

Processor and memory over the last minute, five minutes, half hour, hour or four hours, sampled
every ten seconds. Both scales follow the data, because a fixed 0 to 100% processor axis draws
every ordinary server as a flat line on the floor.

## Scheduler

Nightly backups, a restart at 5am that warns the players first, a command on the hour. These run
through Windows Task Scheduler, so they happen whether or not SpawnLoft is open. See
[Scheduled work](/reference/commands#scheduled-work) for what a task can be.

## Settings

The part of `server.properties` people actually change: who can join, MOTD, difficulty, game mode,
max players, PvP, whitelist, view distance, spawn protection. Everything else stays in the file
for `mcctl props` or an editor, and nothing the panel writes disturbs another key or a comment.

**Changing who can join** on a world that already has players warns first. Minecraft derives an
offline UUID from the player's name and uses the real Mojang one otherwise, so flipping this hands
everybody a different identity. The panel reads the world's player data and says how many players
are affected before you decide.

## Feedback

Three doors in the header. **Something broke** opens a GitHub bug report with the version, Java,
server status and panel log already in it. **A question** opens a new post in the project's
[Q&A](https://github.com/joogiebear/mcctl/discussions/categories/q-a), and **An idea** one in
[Ideas](https://github.com/joogiebear/mcctl/discussions/categories/ideas). Nothing is sent from
SpawnLoft on its own; the browser hop is the consent.

**Settings → Copy diagnostics** puts a bug report's worth of facts on the clipboard. It never
includes an RCON password or a webhook URL.
