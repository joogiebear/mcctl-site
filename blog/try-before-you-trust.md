---
title: "Try before you trust: testing a plugin safely"
description: "How to try a plugin, a config change or a version update on a disposable copy of your server first, using SpawnLoft's snapshots and clones."
date: 2026-11-28
author: joogiebear
tags: [Guide, Plugins]
lastUpdated: false
sidebar: false
aside: false
---

# Try before you trust: testing a plugin safely

The most common way a server world gets damaged is not a crash. It is an evening where someone adds three plugins at once, restarts, and finds out something does not like something else. The fix is a habit: break things somewhere else first.

## Level one: the snapshot you did not ask for

Every plugin install or update from the **Plugins** tool takes a plugins snapshot first and checks the download. If the plugin misbehaves, stop the server, open **Backups** and restore the snapshot that begins `pre-install`. Restore puts the files back and deletes nothing else, so your world stays as it is. Because a restore does not remove files, also disable or delete the new plugin in **Plugins**.

That covers one plugin. For more, use a clone.

## Level two: a clone

```sh
spawnloft clone survival scratch
spawnloft start scratch
```

A clone is a copy of the server's plugins and configuration, on its own free port, with a fresh world. Nothing you do to it touches the original. Install the plugin, edit the config, join the clone and watch the console. Filter it to **Warnings** and **Errors**, which is where problems that do not stop the server tend to show up.

When you are happy, repeat the change on the real server. When you are not:

```sh
spawnloft rm scratch --purge --yes
```

Add `--with-worlds` when the test needs your real world, for example to see how a plugin behaves with your builds. It takes longer and uses the world's disk space.

## Level three: a version update

Worlds migrate one way, so a Minecraft version update deserves a rehearsal: clone with `--with-worlds`, upgrade the clone, look around, and only then upgrade the real server. [Update your server to a new Minecraft version](/guide/update-minecraft-version) has the steps.

## One more habit

Add plugins one at a time and restart between them. When something breaks, you know which one did it.

The full version of this is in [Try a plugin or update without risking your world](/guide/try-it-safely).
