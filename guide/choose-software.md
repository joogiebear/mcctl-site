---
title: Paper, Fabric or NeoForge
description: Which Minecraft server software to choose in SpawnLoft, and what each one loads. Paper, Purpur, Folia, Fabric, NeoForge, vanilla and modpacks compared by what you want to do.
---

# Paper, Fabric or NeoForge

The first choice in **Add a server** is the software, and it decides what your server can load. The short version: **plugins** run on Paper and its relatives, **mods** run on Fabric and NeoForge, and you cannot mix the two on one server.

## Start here

| You want | Choose |
| --- | --- |
| A server for you and friends, with plugins, and no fuss | **Paper** |
| The same, with more settings to tune | **Purpur** |
| Nothing added, exactly as Mojang ships it | **Vanilla** |
| Mods that change the game | **Fabric** |
| Mods built for NeoForge | **NeoForge** |
| A ready-made modded world | **A modpack** ([how](/guide/modpack-server)) |
| A big server with lots of players spread across a large world | **Folia** (with care) |
| Slime world formats, built in | **Advanced Slime Paper** |

If you are unsure, take Paper. It is SpawnLoft's default, it downloads and verifies itself, and it is where most plugins live.

## Plugins or mods

| | Plugins | Mods |
| --- | --- | --- |
| **What they do** | Add features and rules to the server | Change the game itself |
| **Do players install anything?** | No, they join with normal Minecraft | Usually yes, the same mods on their side |
| **Runs on** | Paper, Purpur, Folia, Spigot, CraftBukkit, Advanced Slime Paper | Fabric, NeoForge |
| **In SpawnLoft** | The **Plugins** tool | The **Mods** tool |

That second row is the deciding one for a server of friends. With plugins, everyone joins with plain Minecraft. With mods, everyone needs to match.

## The software, one by one

**Paper** is the sensible default. It runs Bukkit and Spigot plugins, SpawnLoft searches Modrinth and Hangar for it, and it downloads from PaperMC with a checksum.

**Purpur** is a Paper fork with more configuration. It loads the same plugins. Pick it when you find yourself wanting a setting Paper does not have.

**Folia** is Paper with the world split into regions that run on separate threads. It is aimed at very large servers, and **it only loads plugins built for it**. Most plugins are not, so check before you commit.

**Advanced Slime Paper** is Paper with Slime World Manager built in, for servers that store worlds in the Slime format.

**Spigot and CraftBukkit** are compiled on your machine by BuildTools, because SpigotMC publishes no jars. That needs a JDK, takes five to ten minutes the first time, and uses about 1 GB of disk. Paper does the same job with none of that, so choose these only when you need them.

**Vanilla** is Mojang's own server. It loads nothing, and the **Plugins** tool says so.

**Fabric** is a mod loader. SpawnLoft installs the launcher and searches Modrinth for mods for it.

**NeoForge** is a mod loader too, and the two are not interchangeable: a mod is built for one or the other. SpawnLoft runs NeoForge's installer and searches Modrinth for mods for it.

**A modpack** builds a whole server from a Modrinth pack in one step. See [running a modpack server](/guide/modpack-server).

## Java takes care of itself

Each server picks its own Java. A Minecraft 1.20.4 server uses Java 17, 1.21 uses 21, and 26.x uses 25. SpawnLoft picks the newest installed Java that fits when the server is created, and refuses a version nothing installed can run before it downloads anything, with a link to the one it needs.

## Changing your mind

You can update within the same software, and move to a newer Minecraft version, from **Settings → Server software**. Moving *between* kinds of software is a new server: create it, and bring your world across. Paper, Purpur, Folia and Advanced Slime Paper can upgrade in place; the others change version by creating a new server or importing a newer jar.

The full list, with sources and how each is verified, is in [server software](/reference/servers).
