---
title: Update your server to a new Minecraft version
description: Move a SpawnLoft server to a newer Minecraft version without losing your world. Check first, test on a copy, then upgrade, with a snapshot taken before anything changes.
---

# Update your server to a new Minecraft version

Updating Minecraft is the one change you cannot undo just by putting the old jar back: worlds migrate one way, and a world opened by a newer version cannot go back to an older one. So SpawnLoft treats it as its own confirmed step and takes a snapshot first. This page is the safe order to do it in.

## Two kinds of update

- **A newer build of the same Minecraft version** (for Paper, Purpur, Folia and Advanced Slime Paper). The old jar is kept as the way back.
- **A newer Minecraft version.** This is the one that needs care.

**Settings → Server software** shows the running build and offers both, for Paper, Purpur, Folia and Advanced Slime Paper. For other software, change versions by creating a new server or importing a newer jar, as [Paper, Fabric or NeoForge](/guide/choose-software#changing-your-mind) explains.

## The safe order

### 1. Check what would change

```sh
spawnloft upgrade survival --check
```

This reports without changing anything.

### 2. Back up and verify

```sh
spawnloft backup survival --label before-update
spawnloft verify survival --all
```

`standard` backups cover plugins, worlds and config and are safe on a running server. `verify` reads the whole archive so you find out now whether it can be restored.

### 3. Rehearse on a clone

```sh
spawnloft clone survival scratch --with-worlds
```

Upgrade `scratch` (`spawnloft upgrade scratch --version <v> --yes`), start it, join it, and look around. Filter the console to **Warnings** and **Errors**. Check that the plugins you rely on have a build for the new version, because a plugin that has not been updated is the most common reason an upgrade goes badly. When you are done, `spawnloft rm scratch --purge --yes` removes the copy.

### 4. Check Java

Java is chosen when a server is created, so a server moved to a newer Minecraft version keeps its old Java. Minecraft 1.18 to 1.20.4 needs Java 17, 1.20.5 to 1.21.x needs Java 21, and 26.x needs Java 25. Install the one you need and point the server at it in **Settings → Java and memory**, or with `spawnloft set survival java=<path>`. See [Getting started](/guide/getting-started#what-you-need).

### 5. Upgrade the real server

Upgrade from **Settings → Server software**. SpawnLoft asks you to confirm and takes a snapshot first. Start the server and watch the console.

### 6. Update your players

Everyone needs to join with a game of the new version, or a version the server accepts. On a modded server, the mods must match as well.

## If it goes wrong

Stop the server, open **Backups**, and restore the snapshot from before the upgrade, using **Clear first** so the world ends up exactly as it was. A world that has already been opened by the newer version cannot go back, which is why the snapshot matters, and the server must also be running the older version's jar again before you start it, so check **Settings → Server software** before pressing Start. [Recover a damaged world](/guide/recover-a-damaged-world) walks through the restore.

More on testing safely in [Try a plugin or update without risking your world](/guide/try-it-safely).
