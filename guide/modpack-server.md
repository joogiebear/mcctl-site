---
title: Run a modpack server
description: Build a Minecraft server from a Modrinth modpack in one step with SpawnLoft, keep it updated, and what your players need to join.
---

# Run a modpack server

A modpack is a pile of mods that were chosen to work together. Setting up a server for one by hand means matching the loader, the Minecraft version and every mod. SpawnLoft does that from a Modrinth pack in one step.

## Create it

1. Choose **Add a server**, then **From a modpack**.
2. Search Modrinth for the pack. The search shows server-ready Fabric and NeoForge packs.
3. Pick one, give the server a name and some memory, and create it.

SpawnLoft builds the whole server from the pack: the loader, the Minecraft version and the mods. Press **Start** and watch the console.

From a terminal it is one flag:

```sh
spawnloft new packworld --modpack <slug>
```

## Give it enough memory

Modpacks are hungrier than a plain server. The default of 4 GB is a starting point, and many larger packs want more. Look at what the pack's page recommends, set it when you create the server, and watch **Stats** once people are on. You can change it later under **Settings**, or with `spawnloft set packworld memory=6G`.

## What your players need

Mods change the game on both sides, so your friends usually need **the same pack, at the same version**, installed in their own launcher. The pack's Modrinth page has the exact list and the launcher instructions. A mismatch is the most common reason a friend cannot join a modded server, and the error names a mod.

This is the main difference from a plugin server, where everyone joins with plain Minecraft. If you would rather not ask friends to install anything, [choose plugins instead](/guide/choose-software).

## Keep the pack updated

```sh
spawnloft pack packworld
spawnloft pack packworld update --yes
```

The first shows the pack and checks whether a newer version exists. The second updates the server to it. Take a backup first, and read the pack's changelog: updating a pack can add and remove mods, and worlds do not always cope with mods disappearing.

```sh
spawnloft backup packworld --label before-pack-update
```

## Adding mods on top

Modded servers get a **Mods** tool in place of **Plugins**. It searches Modrinth for mods for your loader and installs them with a snapshot beforehand, the same way plugins work. Adding to a pack is a good way to break it, so [try it on a copy](/guide/try-it-safely) first.

## If it will not start

Read the console with the filter on **Errors**, and check the [troubleshooting guide](/guide/troubleshooting). The usual causes are too little memory, the wrong Java for the Minecraft version (SpawnLoft picks the right one when it creates the server), and a mod that does not match the loader. Backups from before an update are the way back.
