---
title: Back up a Minecraft server to a second drive
description: Keep a second copy of every snapshot on another drive, so one failed disk does not take the server and its backups together. Set the mirror, lock the snapshots that matter, download one, and verify.
---

# Back up a Minecraft server to a second drive

Servers and their backups on one drive fail together. If that drive dies, is wiped or fills up, you lose both at once. A second copy on a different drive is the cheapest protection against it.

## Turn on the mirror

```sh
spawnloft config set-backup-mirror /mnt/other-drive/spawnloft-backups
```

Use a folder on a different physical drive: an external disk, a second internal drive or a network share you trust. From then on every new snapshot is copied to the mirror as it is taken, and when retention deletes an old snapshot, the mirror's copy goes too. To stop mirroring:

```sh
spawnloft config set-backup-mirror off
```

## Check that it works

Take a snapshot and look in the mirror folder. `spawnloft backup` reports warnings, skipped database dumps, mirror errors and pruning results, so a mirror that could not be reached is reported rather than silently missed. A scheduled backup that reports a problem can tell you through [Discord alerts](/guide/discord-alerts).

## Keep the ones that matter

In the **Backups** tab you can lock a snapshot, so neither **Delete** nor a schedule's retention removes it, and give it a note such as "before the 1.21 upgrade". A snapshot can also be downloaded as a `.tar.gz`, which is a way to take a copy off the machine altogether.

## Verify, so the copy is real

```sh
spawnloft verify survival --all
```

`verify` reads each archive end to end and compares what is in it with the manifest, so a snapshot that is missing a world is caught the week it was taken. A scheduled `verify` action can report failures to a Discord webhook. Why this matters more than it sounds: [A backup you never tested is a guess](/blog/a-backup-you-never-tested-is-a-guess).

## A reasonable routine

1. A daily scheduled backup, with retention that keeps a couple of weeks.
2. A mirror on another drive.
3. A weekly scheduled verify.
4. A locked snapshot before every big change, such as a Minecraft version upgrade.

[Backups](/guide/backups) has the full detail on scopes, schedules and restore.
