---
title: Run a Fabric or NeoForge server with mods
description: Create a Fabric or NeoForge server in SpawnLoft, add mods from Modrinth with a snapshot first, and what your friends need on their side to join.
---

# Run a Fabric or NeoForge server with mods

Fabric and NeoForge are mod loaders. They change the game itself, so setting one up is a little different from a plugin server. SpawnLoft handles the loader, the Minecraft version and Java, and leaves the choices that matter to you.

If you are not sure you want mods rather than plugins, read [Plugins or mods?](/blog/plugins-or-mods) first.

## Pick the loader

A mod is built for one loader or the other, so look at the mods you want and pick the loader they support. SpawnLoft installs Fabric's launcher, or runs NeoForge's installer, and searches Modrinth for mods for whichever you choose.

## Create the server

1. Choose **Add a server**, then **Create a new one**.
2. Pick **Fabric** or **NeoForge** and a Minecraft version.
3. Give it enough memory. Modded servers are hungrier than plain ones, so start at 4 GB or the figure your mods recommend. See [how much RAM](/guide/how-much-ram).
4. Create it, then **Start** and wait for `Done (…s)!`.

Each server picks its own Java: 1.20.4 uses Java 17, 1.21 uses 21 and 26.x uses 25.

## Add mods

A modded server has a **Mods** tool where **Plugins** would be. Search, choose **Install**, and restart. SpawnLoft takes a snapshot first and checks the download against its checksum.

On a modded server, search shows the loader's whole ecosystem, and a mismatched build installs with the author's version claim stated, so read what it says. Add mods a few at a time and restart between them, so you know which one broke the server.

## What your friends need

Mods change the game on both sides. Your friends usually need **the same mods at the same version** in their own launcher (a few mods are server-only), and the error when they do not match often names a mod. It is the most common reason a friend cannot join a modded server.

SpawnLoft's own [launcher](/guide/launcher) can start the game pointed at your server, mainly as a developer's tool for testing.

## Update and rehearse

Take a [backup](/guide/backups) before changing the mod list, and try anything bigger on a [clone](/guide/try-it-safely) first. For a ready-made modded world, [run a modpack](/guide/modpack-server) instead of picking mods by hand.
