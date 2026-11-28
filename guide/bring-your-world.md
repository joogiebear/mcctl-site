---
title: Bring your existing world or server
description: Move a Minecraft world or a whole server into SpawnLoft without losing anything. Import a map from a zip or folder, or point SpawnLoft at a server folder you already run.
---

# Bring your existing world or server

You do not have to start again. SpawnLoft can take over a server you already run, or load a world you downloaded or copied from somewhere else. Which one to use depends on what you have.

| You have | Use | What it does |
| --- | --- | --- |
| A whole server folder, with `server.properties`, plugins and a world | **Add one I already have** | Manages the folder where it is. Nothing is moved or rewritten. |
| Just a world, as a zip or a folder | **Worlds → Import** | Copies the world into a server SpawnLoft already manages. |
| A download from a map site | **Worlds → Import** | Same: zips are unpacked, and the world is found however deeply it is nested. |

## Take over a server you already run

1. Stop the server if it is running somewhere else. Two servers cannot share a folder or a port.
2. In SpawnLoft, choose **Add a server** (the **+** beside **Servers**), then **Add one I already have**.
3. Point it at the server's folder.

SpawnLoft reads the ports and the RCON password from the folder's own `server.properties`, so the server keeps behaving as it did. Removing it from SpawnLoft later leaves the folder exactly where it was.

From a terminal the same thing is one command:

```sh
spawnloft adopt survival "D:\Servers\Survival" --memory 6G
```

Before the first start, take a [backup](/guide/backups) of the folder. That is cheap insurance, and it makes it simple to compare against what you had.

### Check the Java version

An old server may expect an older Java than the one SpawnLoft would pick, for example Java 16 for 1.17 and Java 8 for 1.16 and earlier. If SpawnLoft does not pick the right one, set it in the server's **Settings** or with `spawnloft set <name> java=<path>`. Each server uses its own Java: Minecraft 1.18 to 1.20.4 uses Java 17, 1.20.5 to 1.21.x uses Java 21, and 26.x uses Java 25. SpawnLoft picks the newest installed one that fits and says so plainly if none does. See [Getting started](/guide/getting-started#what-you-need).

## Import a world into a server

Use this for a map you downloaded or a world you copied from singleplayer.

1. Open the server and go to **Worlds**. Every world is listed, with the active one named.
2. Choose **Import**, then pick the zip or the folder.
3. SpawnLoft finds the world inside, however deeply it is nested, and never overwrites one that already exists.
4. Switch the server to the new world, then restart it.

Only the world that is active gets included in snapshots, so **switch first, then back up**. Exporting goes the other way: pick a world and export it as a zip.

### A singleplayer world

Singleplayer worlds live in the game's `saves` folder. Zip the world's folder, or point the import at the folder itself, and the steps above work the same. A singleplayer world that was last saved in a newer Minecraft version than your server cannot be loaded by an older server, so check versions first. Opening a world in an older version can damage it, and a [backup](/guide/backups) is the way out.

### Players and permissions

Players are tied to their account. If you switch **Who can join** between real accounts and any name on a world that already has players, SpawnLoft warns you first and says how many players would be affected, because their saved inventories and permissions are keyed to an identity that changes with the setting.

## If the world does not load

The console will say so, and the [troubleshooting guide](/guide/troubleshooting) covers the common causes, including a world that failed to load and one that crashed the server. Restore the snapshot you took before you started and try again.
