---
title: "Your first week running a server for friends"
description: "A seven-day plan for a new SpawnLoft server: install, play on your own, add friends, set up backups, add a plugin safely, and make it look after itself."
date: 2026-11-28
author: joogiebear
tags: [Guide, Beginner]
featured: true
lastUpdated: false
sidebar: false
aside: false
---

# Your first week running a server for friends

You do not need to do everything on the first night. Here is a gentle week that ends with a server friends can use and you can trust.

## Day 1: install and start

[Install SpawnLoft](/download), let the first-run check look for Java, then **Add a server → Create a new one** and keep Paper, the default. Press **Start** and wait for `Done (…s)!`. Join it from Minecraft with `localhost`. [Getting started](/guide/getting-started) covers the details.

## Day 2: look around

Open the tabs: **Console**, **Plugins**, **Worlds**, **Backups**, **Settings**. Change the MOTD and icon in **Settings**, as [Customize your server](/guide/customize-your-server) shows. Type `list` in the console. You are just learning where things are.

## Day 3: have friends over

If friends are on your network, they can join with your PC's local address. [Play with friends on your home network](/guide/play-on-your-network) walks through it, including the firewall step that causes most failures. Turn the [whitelist on](/guide/whitelist-and-operators) first.

## Day 4: backups

Take one by hand and then schedule a nightly one in **Schedule**, as in [Schedule restarts and backups](/guide/schedule-restarts-and-backups). Add a second location if you have another drive. Read [a backup you never tested is a guess](/blog/a-backup-you-never-tested-is-a-guess).

## Day 5: one plugin, safely

Open **Plugins**, search Modrinth and Hangar, and install one. SpawnLoft takes a snapshot first. Restart, and check the console for warnings. For anything bigger than one plugin, [use a clone](/guide/try-it-safely).

## Day 6: let it look after itself

Add a morning restart that warns players, and turn on [crash recovery](/guide/crash-recovery). Add a [Discord alert](/guide/discord-alerts) if you use Discord. Check [how much RAM](/guide/how-much-ram) the server has.

## Day 7: decide about friends elsewhere

If you want people outside your home to join, read [Sharing your server](/guide/sharing) and decide how, because it is a choice about exposure. Keep online mode on, keep the whitelist on, and if you forward a port, forward only the game port.

## After the first week

You have a server that is backed up, restarts itself and tells you when it does not. From here, [try a modpack](/guide/modpack-server), [add a database](/guide/add-a-database) or look at the [features that are easy to miss](/blog/features-easy-to-miss).
