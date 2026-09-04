---
title: Roadmap
---

# Roadmap

What SpawnLoft is for shapes what goes on this list: one person's Windows machine, running servers for
friends, family or plugin testing, with no accounts, no cloud, no Docker, and nothing exposed to a
network without a deliberate decision. Features that serve that person go on the list. Features
that turn this into a smaller Pterodactyl, with multiple nodes, user accounts and a remote web
panel, stay off it on purpose.

The living version is [ROADMAP.md](https://github.com/joogiebear/mcctl/blob/main/ROADMAP.md) in
the repository. Ideas go in [Discussions](https://github.com/joogiebear/mcctl/discussions/categories/ideas).

## Done

- **Reliability.** Crash auto-restart with a crash-loop stop, scheduled restarts that warn the
  players first, Discord webhook notifications for the events nobody is watching for, and
  `verify` to prove snapshots actually restore.
- **Plugin manager.** Modrinth and Hangar searched together, filtered to compatible builds,
  hash-based update checks, one-click updates with a snapshot first, enable and disable in place.
  Manages only what it installed; hand-dropped plugins are left alone.
- **Server updates.** A routine one-click move to the newest Paper build, with the old jar kept
  as the way back, and a deliberately harder, confirmed, snapshot-first path for crossing
  Minecraft versions, because worlds migrate one way.
- **Modded servers.** Fabric and NeoForge as first-class loaders with a Mods tab, whole modpacks
  from Modrinth, and pack updates that may only touch what the old pack owned.
- **Worlds.** Every world listed with the active one named, import a downloaded map from a zip
  or folder, export one, switch which runs, delete with the truth stated. A backup mirror copies
  every snapshot to a second location as it is taken.
- **Log intelligence.** The known failure shapes recognised and the fix said wherever the
  failure surfaces: port taken, EULA, wrong Java, out of memory or disk, missing dependencies,
  duplicate plugins, corrupt worlds, ticking crashes, watchdog stalls, missing jars.
- **Console export.** To a file, or to mclo.gs with your account name taken out of the paths
  first. The first feature contributed from outside the project.

## After 1.0

- **A Share screen.** The honest answer to "how do my friends join?", in tiers of increasing
  exposure: the LAN address plainly; a DNS record on your own domain pointed at the home IP with
  UPnP as an explicit opt-in; a tunnel through playit.gg or a VPS relay with no ports opened and
  the home IP hidden. Exposure stays a deliberate decision. This screen's whole job is making it
  an informed one, with the whitelist and online mode nudged on the moment anything goes public.

## Reach

- **Distribution.** A winget manifest, so `winget install mcctl` works.
- **Linux and macOS.** Everything except the Windows scheduler and a few paths is nearly portable
  already.
- **Localisation.**

## Not planned

- Multi-node hosting, user accounts, a remote web panel, or anything that exposes the panel to
  a network. A panel reachable from another machine is a server console reachable from another
  machine. To manage a server from elsewhere, remote into the machine that runs it.
