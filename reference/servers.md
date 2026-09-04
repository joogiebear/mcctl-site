# Server software

`new` fetches whichever server you name, and the panel's **Add a server** offers the same list.
Every one runs with a plain `-jar`, so the supervisor does not care which; what differs is where it
comes from and what it loads.

| Flag | What you get | Loads | From |
| --- | --- | --- | --- |
| `--paper <v>` | Paper, newest stable build | plugins | PaperMC, sha256-verified |
| `--purpur <v>` | Purpur, a Paper fork with more configuration | plugins | purpurmc.org, md5-verified |
| `--folia <v>` | Folia, Paper with regionised multithreading | Folia-built plugins only | PaperMC |
| `--asp <v>` | Advanced Slime Paper, Paper with Slime World Manager built in | plugins | InfernalSuite, sha256-verified |
| `--spigot <v>` | Spigot | plugins | **compiled on your machine** by BuildTools |
| `--craftbukkit <v>` | CraftBukkit | plugins | **compiled on your machine** by BuildTools |
| `--vanilla <v>` | Mojang's own server | nothing | Mojang, sha1-verified |
| `--fabric <v>` | Fabric launcher | mods | FabricMC |
| `--neoforge <v>` | NeoForge, via its installer | mods | NeoForged maven, sha256-verified |
| `--modpack <slug>` | A whole Modrinth modpack | its mods | Modrinth |

`--build <n>` picks a specific build where the source numbers them (Paper, Folia, Purpur).

## Spigot and CraftBukkit

SpigotMC publishes no jars, so these are built on your machine by BuildTools. It needs a **JDK**
(javac, not just a runtime), fetches a portable git for itself, takes five to ten minutes the first
time for a version, and keeps about a gigabyte of clones under the jar store so later builds are
faster. The panel narrates the build line by line.

## Plugins follow the software

The Plugins tab searches for what the server can load: Purpur searches Modrinth for Purpur, Paper,
Spigot and Bukkit builds; Folia only for Folia-built plugins; Spigot for Spigot and Bukkit;
vanilla has nothing to manage and says so.

`upgrade` knows Paper only. Other servers move versions by creating a new server or importing a
newer jar.

## Java per server

Each server picks its Java. 1.20.4 on Java 17 can sit beside 26.x on Java 25. SpawnLoft finds what is
installed, picks the newest that fits when a server is created, and refuses a version nothing
installed can run before the download, with the link. `--force` goes ahead anyway.
