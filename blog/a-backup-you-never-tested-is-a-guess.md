---
title: "A backup you have never tested is a guess"
description: "Why SpawnLoft backups can be verified, locked and mirrored, and a five-minute routine that turns a hopeful backup into one you can rely on."
date: 2026-11-28
author: joogiebear
tags: [Guide, Backups]
lastUpdated: false
sidebar: false
aside: false
---

# A backup you have never tested is a guess

Most people find out whether their backups work on the worst day. The archive is truncated, the world was never in it, or the drive that held the backup died with the drive that held the server. None of that is visible until you try to restore.

You can find out earlier, and it takes a few minutes.

## What a good backup does

A backup of a *running* server has to be coherent. SpawnLoft flushes the server first (`save-off` and `save-all flush`, then `save-on`), so the snapshot is a consistent copy of the world rather than a torn one caught mid-write. That happens for every snapshot, whether it came from the panel, a schedule, the command line, an assistant or the snapshot taken before a plugin install or a Minecraft version upgrade.

## The routine

1. **Schedule a nightly backup.** In **Schedule**, or `spawnloft task add survival --do backup --daily 03:00`. Set a retention so old ones are pruned. Retention only removes what its own schedule produced, never a snapshot you took by hand.
2. **Verify it weekly.** `spawnloft task add survival --do verify --weekly SUN --at 04:00`. Verify reads each archive end to end, decompresses every block and compares the entries with the manifest, so a backup that is missing a world is caught the week it was taken. A failing scheduled verify reports to the server's Discord webhook.
3. **Keep a second copy elsewhere.** `spawnloft config set-backup-mirror /path/on/another/drive`. A server and its backups on one drive fail together, and a mirror on another drive is the cheapest protection against that.
4. **Lock the important ones.** A locked snapshot, such as the one from before a big upgrade, cannot be removed by Delete or by retention. Add a note so you remember why.
5. **Download one and look inside.** In **Backups**, download a snapshot as a `.tar.gz` and open it to see that your world is really in it. Ten minutes on a quiet evening saves the worst day. When you do restore for real, stop the server first, because restore is refused while it runs.

## What a backup does not cover

Only the **active** world is included in snapshots, so a world you have switched away from is not backed up until you switch to it. The default `standard` scope covers plugins, worlds and configuration. Databases attached to a server are included in `standard` and `full` snapshots as a dump, and restore imports them back into the database they came from, which has to be running. If you leave a path out on purpose, the manifest records it. A backup of a world you have excluded is not a backup of that world.

## When something does go wrong

Stop the server and restore. [Recover a damaged world](/guide/recover-a-damaged-world) is the step-by-step, and [Backups](/guide/backups) has every option.
