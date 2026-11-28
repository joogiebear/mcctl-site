---
title: "Four mistakes people make with modpack servers"
description: "A modpack server fails in predictable ways. Too little memory, mismatched versions, updating without a backup, and adding mods on top. How to avoid each one."
date: 2026-11-28
author: joogiebear
tags: [Guide, Modpacks]
lastUpdated: false
sidebar: false
aside: false
---

# Four mistakes people make with modpack servers

Setting up a server for a modpack by hand means matching the loader, the Minecraft version and every mod. SpawnLoft builds all of that from a Modrinth pack in one step, which removes a lot of ways to go wrong. These are the ones that remain.

## 1. Starting with too little memory

Modpacks are hungrier than a plain server. SpawnLoft's 4 GB default is a starting point, and many larger packs want more. Read what the pack's page recommends, set it when you create the server and watch **Stats** once people are on. You can change it later in **Settings**, or with `spawnloft set packworld memory=6G`. [How much RAM](/guide/how-much-ram) has the signs to look for.

## 2. Friends joining with the wrong pack

Mods change the game on both sides, so your friends usually need the same pack at the same version installed in their own launcher. The pack's Modrinth page has the exact list and instructions. A mismatch is the most common reason someone cannot join, and the error names a mod. If asking friends to install anything is a dealbreaker, a plugin server is the better choice. [Plugins or mods?](/blog/plugins-or-mods) covers the trade-off.

## 3. Updating the pack without a backup

```sh
spawnloft pack packworld
spawnloft pack packworld update --yes
```

The first shows the pack and checks for a newer version. The second updates the server. Updating a pack can add and remove mods, and worlds do not always cope with mods disappearing. Take a backup first, and read the pack's changelog:

```sh
spawnloft backup packworld --label before-pack-update
```

## 4. Adding mods on top

Modded servers get a **Mods** tool in place of **Plugins**, which searches Modrinth for your loader and installs with a snapshot beforehand. Adding to a pack is a good way to break it, so [try it on a copy](/guide/try-it-safely) first.

## If it will not start

Read the console with the filter on **Errors**. The usual causes are too little memory, a Java that does not match the Minecraft version (SpawnLoft picks the right one when it creates the server) and a mod that does not match the loader. Backups from before an update are the way back.

The setup itself is in [Run a modpack server](/guide/modpack-server).
