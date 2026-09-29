---
description: "Every server software SpawnLoft can run, from Paper and Purpur to Fabric and NeoForge: what each loads, where it comes from and how it is verified."
---

# Server software

`new` downloads or builds the server you name, and **Add a server** in the panel offers the same list. Every option runs with a plain `-jar`, so the supervisor is indifferent to which; the differences are where the software comes from, how it is verified, and what it loads.

| Flag | Software | Loads | Source and verification |
| --- | --- | --- | --- |
| `--paper <v>` | Paper, newest stable build | Plugins | PaperMC, sha256 |
| `--purpur <v>` | Purpur, a Paper fork with more configuration | Plugins | purpurmc.org, md5 |
| `--folia <v>` | Folia, Paper with regionised multithreading | Folia-built plugins only | PaperMC |
| `--asp <v>` | Advanced Slime Paper, Paper with Slime World Manager built in | Plugins | InfernalSuite, sha256 |
| `--spigot <v>` | Spigot | Plugins | **Compiled on your machine** by BuildTools |
| `--craftbukkit <v>` | CraftBukkit | Plugins | **Compiled on your machine** by BuildTools |
| `--vanilla <v>` | Mojang's own server | Nothing | Mojang, sha1 |
| `--fabric <v>` | Fabric launcher | Mods | FabricMC |
| `--neoforge <v>` | NeoForge, through its installer | Mods | NeoForged maven, sha256 |
| `--modpack <slug>` | A whole Modrinth modpack | Its mods | Modrinth |
| `--jar <file>` | A jar from the jar store | Depends on the jar | Local |
| `--template <name>` | A saved plugin and config set | Depends on the template | Local |

`--build <n>` selects a specific build where the source numbers builds (Paper, Folia, Purpur).

## Spigot and CraftBukkit

SpigotMC publishes no jars, so BuildTools compiles them on your machine.

| Requirement | Detail |
| --- | --- |
| Java | A **JDK** (`javac`, not only a runtime) |
| git | Fetched as a portable copy; nothing to install |
| First build of a version | Five to ten minutes |
| Disk | About 1 GB of clones under `jars/buildtools/`, reused so later builds are faster |
| Progress | The panel narrates the build line by line |

## Plugins follow the software

The **Plugins** tool searches for what the server can load. Fabric and NeoForge servers get a **Mods** tool instead.

| Software | Plugin search |
| --- | --- |
| Paper | Modrinth and Hangar |
| Purpur | Modrinth, for Purpur, Paper, Spigot and Bukkit builds |
| Folia | Folia-built plugins only |
| Spigot, CraftBukkit | Spigot and Bukkit builds |
| Vanilla | Nothing to manage; the tool says so |
| Fabric, NeoForge | Modrinth mods for the loader |

## Updating server software

| Software | `upgrade` support |
| --- | --- |
| Paper, Purpur, Folia | Newest build for the current Minecraft version, or a newer Minecraft version |
| Advanced Slime Paper | Same. Builds have no number, so they are compared by date. |
| Spigot, CraftBukkit, vanilla, Fabric, NeoForge | Create a new server, or import a newer jar |

The routine path installs the newest build of the same Minecraft version and keeps the old jar as the way back. Crossing Minecraft versions is a separate, confirmed path that takes a snapshot first, because worlds migrate one way. **Settings → Server software** shows the running build and offers either move.

## Java per server

Each server picks its own Java, so a 1.20.4 server on Java 17 can run beside a 26.x server on Java 25.

| Minecraft version | Java |
| --- | --- |
| 1.18 to 1.20.4 | 17 |
| 1.20.5 to 1.21.x | 21 |
| 26.x | 25 |

SpawnLoft finds what is installed, picks the newest Java that fits when a server is created, and refuses a version nothing installed can run before the download starts, with a link to the Java it needs. `--force` on `new` and `start` proceeds anyway. Point a server at a specific Java with `spawnloft set <name> java=<path>`.
