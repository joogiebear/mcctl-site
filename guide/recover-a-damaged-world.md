---
title: Recover a damaged world from a backup
description: Restore a SpawnLoft server to an earlier snapshot after a crash, a bad plugin or a griefer. What restore does, how to clear first, and how to check a backup before you need it.
---

# Recover a damaged world from a backup

Something went wrong and you want the world back as it was. A backup makes that routine, as long as you act in the right order.

## 1. Stop the server

Restore is refused while the server runs, on purpose. Extracting over files a live server holds open can corrupt a world instead of replacing it.

## 2. Pick the snapshot

Open the **Backups** tab. Every snapshot is listed with its size, age and coverage. Look for the last one from before the problem. Snapshots you labelled or annotated are easy to spot, and the ones SpawnLoft takes before risky steps carry names such as `pre-install` (before a plugin install) or `pre-restore`.

If you are not sure what a snapshot covers, the scope tells you: `plugins`, `worlds`, `config`, `standard` (plugins, worlds and config) or `full`.

## 3. Restore it

Choose the snapshot and **Restore**, or from a terminal:

```sh
spawnloft restore survival [ref] --yes
```

The default reference is `latest`.

By default, restore extracts over the server and deletes nothing, so a file added after the snapshot was taken survives. That is what you want when you only need to put some files back. To undo a bad plugin, restore the `pre-install` snapshot and then disable or delete the new plugin in **Plugins**, because the snapshot predates it and a restore does not remove files. When you want the server to end up *exactly* as the snapshot was, choose **Clear first, so it ends up exactly as the backup was**. SpawnLoft copies what it clears aside as a `pre-restore` snapshot first, so even that can be undone.

## 4. Start and check

Start the server and watch the console. Join and look at the thing that was broken.

## If you only need one file

Changes made through the panel, such as a file edit in **Files** or an assistant's configuration change, keep a single-file safety copy. Restoring that puts back that one file and touches nothing else.

## Do this now, before you need it

- **Verify.** `spawnloft verify survival --all` reads each archive end to end and checks it against its manifest. A scheduled `verify` reports failures to the server's Discord webhook.
- **Keep a second copy.** `spawnloft config set-backup-mirror /path/on/another/drive` copies each new snapshot as it is taken. Servers and backups on one drive fail together.
- **Lock the ones that matter.** A locked snapshot is never removed by Delete or by a schedule's retention.

The full list of options is in [Backups](/guide/backups), and a nightly schedule is in [Schedule restarts and backups](/guide/schedule-restarts-and-backups).
