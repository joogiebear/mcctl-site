---
title: Free up disk space for your Minecraft servers
description: What to do when the drive is full. Check where space is going, thin old snapshots, put servers on a bigger drive, or move the whole SpawnLoft data folder, with the commands for each.
---

# Free up disk space for your Minecraft servers

A full drive shows up as failed saves and a console full of write errors. SpawnLoft recognises it and says so; the fix is room, either by deleting what you do not need or by moving things to a drive that has some.

## Find out where it is going

`spawnloft doctor` checks disk use along with Java, each server's folder, port collisions and more:

```sh
spawnloft doctor
```

The usual large things are snapshots, worlds, and any database you have created. Backups are the easiest to thin.

## Thin old snapshots

Keep the newest few and delete the rest:

```sh
spawnloft prune survival --keep 10
```

`--keep` is the number to keep, and 10 is the default. Snapshots you have locked in the **Backups** tab are protected from **Delete** and from a schedule's retention, so lock the ones you want to keep, and check what `prune` is about to remove before you rely on it. A schedule's own retention setting does the same thing automatically for the snapshots that schedule takes; see [Schedule restarts and backups](/guide/schedule-restarts-and-backups).

## Put servers on a different drive

If the drive is small but another is large, tell SpawnLoft to create servers on the other one:

```sh
spawnloft config set-instances D:\Minecraft
```

This is for new servers. Moving a location never moves existing data. To go back to creating servers under the data folder, run `spawnloft config same-drive`.

## Move the whole data folder

To move everything SpawnLoft stores to another place or drive, use `data move`. It leaves a link where the folder was, so nothing that refers to the old path needs changing:

```sh
spawnloft data move D:\SpawnLoft
```

Run without `--yes`, it shows the plan and stops. Read it, then add `--yes`. It refuses while a server or database is running, and wants the app closed. Three related commands:

| Command | Does |
| --- | --- |
| `spawnloft data status` | Shows where a move stands |
| `spawnloft data finish` | Deletes the parked original once you are happy with the new location |
| `spawnloft data rollback` | Puts an interrupted move back |

In the app, the same option is in **Preferences**.

## Keep backups off the drive that matters

A backup on the same drive as the server is lost together with it. A mirror on a second drive copies each new snapshot as it is taken: see [Back up to a second drive](/guide/back-up-to-a-second-drive).
