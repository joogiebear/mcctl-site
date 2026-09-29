---
title: Try a plugin or update without risking your world
description: How to test a plugin, a config change or a Minecraft update on a copy of your server in SpawnLoft, and how to put things back if it goes wrong.
---

# Try a plugin or update without risking your world

The rule for a server people play on is to break things somewhere else first. SpawnLoft gives you three tools for that, from lightest to heaviest.

| You are about to | Use |
| --- | --- |
| Install or update one plugin | The snapshot SpawnLoft already takes |
| Change several things, or a config you are unsure of | A clone |
| Move to a new Minecraft version | A clone, then the built-in upgrade |

## The snapshot before every install

Installing or updating a plugin from the **Plugins** tool takes a snapshot of your plugins first, and checks the download. If the new plugin misbehaves, stop the server, open **Backups**, and restore the snapshot that begins `pre-install`. Restore puts the files back and deletes nothing else, so your world and everything you added since stay where they are.

Restore is refused while the server is running, on purpose, because extracting over files a live server holds open can corrupt a world.

## A clone for anything bigger

A clone is a copy of your server's plugins and configuration, on a free port, with a fresh world. Nothing you do to it touches the original.

```sh
spawnloft clone survival scratch
spawnloft start scratch
```

Add `--with-worlds` if you need the real world in the copy, for example to test how a plugin behaves with your builds. It takes longer and uses the disk space of the world.

Then make your change on `scratch`: install the plugin, edit the config, join it, and watch the console. To look for trouble quickly, filter the console to **Warnings** and **Errors**, which is where problems that do not stop the server tend to show up. When you are happy, repeat the change on the real server. When you are not, throw the copy away:

```sh
spawnloft rm scratch --purge --yes
```

`--purge` deletes its files as well as removing it from SpawnLoft. Drop it to keep the folder.

## Updating Minecraft itself

Updating Paper, Purpur, Folia or Advanced Slime Paper within the same Minecraft version keeps the old jar as the way back. Moving to a **newer Minecraft version** is different, because worlds migrate one way: a world opened by a newer version cannot go back.

So SpawnLoft treats it as a separate, confirmed step and takes a snapshot first. To check without changing anything:

```sh
spawnloft upgrade survival --check
```

The safest order is: clone with `--with-worlds`, upgrade the clone, join it and look around, and only then upgrade the real server. **Settings → Server software** shows the running build and offers both moves.

## Before any of it

Take a backup you trust. `standard` covers plugins, worlds and config, is safe while the server runs, and `verify` reads the whole archive so you find out now whether it can be restored.

```sh
spawnloft backup survival --label before-update
spawnloft verify survival --all
```

Keep a second copy on another drive with `spawnloft config set-backup-mirror`. See [Backups](/guide/backups) for restore and retention.
