---
description: "A tour of the SpawnLoft panel: the console, plugins, worlds, backups, players, stats, schedule and server settings."
---

# The panel

The panel is what the desktop app shows. It is a local web page served by SpawnLoft itself, so it works offline and runs equally well in a browser tab:

```bash
spawnloft ui [--port 8770] [--no-open]     # http://127.0.0.1:8770
```

The panel answers only you. The desktop window signs itself in; `spawnloft ui` opens your browser already signed in and also prints a one-use link (`spawnloft ui --link` makes a new one for a lost tab or a second browser). A bookmark to `http://127.0.0.1:8770/` shows "Open SpawnLoft from the app, or run `spawnloft ui`". A browser stays signed in until the panel stops or its tab has been closed for 15 minutes. See [Security](/guide/security).

![The SpawnLoft console with server controls and live logs.](/img/tabs/console.webp)

## Navigation

The sidebar lists **Overview**, **Play** (the [game launcher](/guide/launcher)) and then every server and database, with the **+** beside **Servers** to add one. On a narrow window it folds to a rail of icons. A server opens with its header, its status and vitals, and a row of tabs: **Console**, **Plugins** (**Mods** on Fabric and NeoForge), **Files**, **Worlds**, **Backups**, **Activity**, **Players**, **Stats**, **Schedule** and **Settings**. Each tool opens in the console's place, and on a wide window (1600 px and up) the console keeps a column of its own beside it. The console keeps streaming while a tool is open, and each server remembers which tool you left open. Pickers for versions, Java and similar lists can be typed into to narrow them.

A database has the tabs that make sense for it: **Backups**, **Activity**, **Stats** and **Settings**. In the header a **Java** pill appears when Java is missing or too old, and **Preferences** (the gear) holds the app's own settings.

| Action | Behavior |
| --- | --- |
| **Add a server** | Four choices: **Create a new one**, which downloads the server and reports real progress; **From a modpack**; **Add one I already have**, which points SpawnLoft at a folder (nothing is moved; ports and the RCON password are read from its `server.properties`); and **A database**. |
| Rename, reset, delete | Require typing the server's name. A dialog that only says "are you sure" gets answered reflexively. Deleting offers to keep the files or delete them too, and takes a backup first. |
| Server card | Status lamp, port, memory and a live uptime. |

## Overview

**Overview** shows every server and database: state, players, TPS, memory and last backup, with **Start** or **Stop** on each card, and how much of the machine's memory the servers may use between them, followed by **Recent activity**. A **Needs attention** row collects what wants doing, each with the one button that resolves it:

- a server that crashed, or was restarted by crash guard, today
- plugin updates found by the last check
- a server never backed up, or not backed up in a week
- a Java too old to start a server

## Console

| Feature | Behavior |
| --- | --- |
| Search and filter | Search, filter to warnings or errors, pause, copy, wrap, line numbers, bounded scrollback |
| Log level | A coloured rail in the gutter, not recoloured text, so `ERROR` stands out without becoming harder to read |
| Stack traces | Inherit the level of the line above, so filtering to errors shows the whole failure |
| Text | ANSI escapes are stripped into clean, searchable text. Long lines scroll horizontally; turn on **Wrap** to fit them. |
| **Export** | Saves a `.log` beside the server's snapshots, or uploads to [mclo.gs](https://mclo.gs) after a dialog that says what is in it. See [Security](/guide/security). |

## Plugins and Mods

Search and install from **Modrinth and Hangar** together, each result naming its source, filtered or checked against this server's version, with checksum-verified downloads, an update check, and one-click updates behind a plugins snapshot. Hangar projects that host downloads elsewhere are linked, not installed. Fabric and NeoForge servers get **Mods** in its place.

The tool manages **only what SpawnLoft installed**; it records provenance beside the jars. A custom or premium plugin dropped in by hand is never offered a meaningless update and never has its hash sent to anyone. `spawnloft plugins <name>` lists the full inventory with a source column. Enable and disable rename the jar in place, so a disabled plugin keeps its spot and its config.

## Files

The server's folder: browse it, open any text file in an editor that colours YAML, JSON and properties files, upload by dropping files onto the list, download a file or a folder (zipped), rename, move, zip, unzip, make files and folders, and find by name. This is where plugin configuration is edited. Every edit, replaced file and delete snapshots what it changes first, so **Backups** can put back exactly that. A save is refused if the file changed since it was opened (the server rewrote it, or something else did), and a tab holding broken YAML or JSON asks before saving. While the server runs, what it holds open (the active world, its jar, the plugins it loaded) can be read and edited but not moved, replaced or deleted. The ports and RCON settings SpawnLoft writes into `server.properties` are refused here as everywhere else.

## Worlds

Every world is listed with the active one named. Import a downloaded map from a zip or folder (found however deeply nested, never overwriting), export a world as a zip, switch which world runs, or delete one. Only the active world is included in snapshots.

## Backups

Take a snapshot at a chosen scope (`plugins`, `worlds`, `config`, `standard`, `full`), see every snapshot with size, age and coverage, and restore, verify or delete any of them. Restoring is refused while the server runs, because extracting over files a live server holds open corrupts a world rather than replacing it.

Automatic backups run on a schedule with a retention limit, and the limit only removes snapshots its own schedule produced, never one taken by hand or before a reset. A snapshot can be **locked** (neither Delete nor a schedule's retention removes it), given a **note**, and **downloaded**; each server has a leave-out list of paths (`*` wildcards, one per line) that every backup of it skips; and **Restore** can **clear first**, so the server ends up exactly as the snapshot was, with what it cleared kept as a `pre-restore` snapshot. The tool also holds **Where backups are kept** and **Copy backups to a second place**. History refreshes every four seconds while visible, including backups made with the CLI. An archive appears only after it and its manifest are complete. See [How it works](/guide/how-it-works#backups).

## Activity

What was done to the server, when, and by whom: you in the app or a terminal, a scheduled task by name, an AI assistant by the name its app gives, or SpawnLoft itself (crash guard). Starts, stops and crashes, console commands, backups and restores, file and configuration edits, plugin changes, settings, worlds, players and schedules are all there, filterable by who. A change that kept an exact copy of what it changed (an edit, a replaced file, a delete, an assistant's configuration change) has **Undo**, allowed while the server runs on the same terms as an edit. The history rolls over at 2 MB.

## Players

Everyone the server knows, gathered from operators, bans, the whitelist, the name cache and the world folder, since none of them is a complete list alone. Search, filter to operators or the banned, and op, ban or delete a player's world data. Connected players are marked and sorted first; that has to be asked of the server, because a player's file is not written until they log out. Changes go through the console while the server runs and into its files when it does not.

## Stats

CPU and memory over the last minute, five minutes, half hour, hour or four hours, sampled every ten seconds. Both scales follow the data, because a fixed 0 to 100% axis draws every ordinary server as a flat line. CPU is a share of all cores; memory is resident process memory, not only the Java heap. History survives a stop and resets on each start. Windows, macOS and Linux collect it; [export readings as JSON or CSV](/reference/commands#performance-and-export-preview) to compare runs.

## Schedule

Nightly backups, a 5 a.m. restart that warns players first, a command on the hour. A task can also be several steps in order (tell the players, count down, back up, verify, stop, start), with ready-made chains for a restart with a countdown and a backup first. A step waits for the one before it, one that fails stops the rest unless the task says to keep going, and waits are capped at two hours in total and a chain at twelve steps. Tasks run through Windows Task Scheduler, macOS launchd or Linux systemd timers, so they happen whether or not SpawnLoft is open, while you are signed in. See [Scheduled work](/reference/commands#scheduled-work).

## Settings

Settings is one form: sections down the side with a dot on any holding an unsaved change, each setting reading **Default** until the file has it and **Changed** until saved, and a bottom bar that saves, discards, or saves and restarts.

| Section | Contents |
| --- | --- |
| Server | The `server.properties` fields below |
| **Server software** | The running build, with the newest build or a newer Minecraft version offered (Paper, Purpur, Folia, Advanced Slime Paper) |
| **Databases** | Connection details and **Create a database**. See [Databases](/guide/databases). |
| Java and memory | Memory, the Java to use, and **Java arguments** of your own that replace SpawnLoft's recommended (Aikar's) flags. `-Xms`, `-Xmx` and `-jar` are refused there, and the full launch line is shown either way. |
| World and load | The MOTD with a preview as the multiplayer list shows it (icon, name, colours), swatches that insert `§` colour codes, and **Change icon**, which turns any image into the 64 by 64 `server-icon.png` |
| Whole file | `server.properties` edited as text: the RCON password stays hidden, managed ports cannot be changed, and the file is snapshotted first |

| Key | Setting | Type | Range or values | Default |
| --- | --- | --- | --- | --- |
| `online-mode` | Who can join | Toggle | Mojang accounts or any name | `true` |
| `motd` | Message of the day | Text | | `A Minecraft Server` |
| `difficulty` | Difficulty | Choice | `peaceful`, `easy`, `normal`, `hard` | `easy` |
| `gamemode` | Default game mode | Choice | `survival`, `creative`, `adventure`, `spectator` | `survival` |
| `max-players` | Max players | Integer | 1 to 1000 | `20` |
| `pvp` | PvP | Toggle | | `true` |
| `white-list` | Whitelist | Toggle | | `false` |
| `view-distance` | View distance | Integer | 2 to 32 | `10` |
| `spawn-protection` | Spawn protection | Integer | 0 to 256 | `16` |

Servers SpawnLoft creates start with `online-mode=true`, `max-players=10` and `spawn-protection=0`. Writes never disturb another key or a comment.

**Changing who can join** on a world that already has players warns first. Minecraft derives an offline UUID from the player's name and uses the Mojang UUID otherwise, so flipping the setting gives everybody a different identity and orphans permissions, homes and inventories keyed by UUID. The panel reads the world's player data, tells the two kinds of UUID apart by version, and says how many players are affected before you decide.

## Databases

**Settings → Create a database** creates a managed MySQL 8.4 LTS or Redis-compatible Garnet database and provides scoped credentials. Databases sit beside servers in the panel with a lamp, a console, start, stop and restart. Plugin configuration is always manual. See [Databases](/guide/databases).

## Preferences

The gear opens **Preferences**.

| Item | Behavior |
| --- | --- |
| **Appearance** | **SpawnLoft** (charcoal, warm white and lime, the default) or **Classic**, the original blue palette |
| **Interface size** | Desktop app only: **Auto** or 80% to 200% |
| **Where SpawnLoft keeps things** | Where servers, the jar store and backups live. Only affects servers created from now on. |
| **Updates** | **Check now**, **Get beta builds**, **Reinstall a previous version** and the update log. See [Downloads & platforms](/guide/beta#automatic-updates-and-beta-builds). |
| **AI assistants** | The exact MCP configuration for this install. See [AI assistants](/guide/ai-assistants). |
| **About** | The version and the exact build it came from |
| **Copy diagnostics** | Version, Java, locations, every server's status, the panel log and the last console lines of the selected server. Never includes an RCON password or webhook URL. |
| **Feedback** | **Something broke** opens a GitHub bug report with version, Java, server status and panel log filled in and puts full diagnostics on the clipboard. **A question** opens [Q&A](https://github.com/joogiebear/spawnloft/discussions/categories/q-a) and **An idea** opens [Ideas](https://github.com/joogiebear/spawnloft/discussions/categories/ideas). Nothing is sent by SpawnLoft; the browser hop is the consent. |
