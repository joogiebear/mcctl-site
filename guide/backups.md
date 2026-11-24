---
title: Backups
description: Take, schedule, verify and restore SpawnLoft snapshots, and what each scope contains.
---

# Backups

A backup is a snapshot: a tar archive plus a manifest in `backups/<name>/`. Take one from the **Backups** tool, from a schedule, or from the command line.

```sh
spawnloft backup survival --scope standard --label before-update --keep 10
```

## Choose a scope

| Scope | Contents |
| --- | --- |
| `plugins` | `plugins/` and `mods/` |
| `worlds` | The active world set |
| `config` | Root configuration files (`server.properties`, `bukkit.yml`, `spigot.yml`, `paper*.yml`, `permissions.yml` and similar) and `config/` |
| `standard` (default) | Plugins, active worlds and config |
| `full` | Everything except `cache/`, `libraries/`, `versions/` and `logs/` |

Only the active world is ever included. An inactive world is not backed up until you switch to it.

## Back up a running server

A running server is flushed first: `save-off` and `save-all flush` over RCON, and `save-on` afterwards, so the snapshot is coherent rather than a torn copy of a world mid-write. This happens for every snapshot from any path: the panel, a schedule, the command line, an AI assistant, plugin installs, and the snapshot taken before a Minecraft version upgrade. If the flush cannot be done, the snapshot is still taken and its manifest says so.

`tar` may report a warning for a file the running server holds locked. That is expected on hot snapshots and is not treated as failure.

## Schedule backups

In **Schedule**, or with `spawnloft task add`:

```sh
spawnloft task add survival --do backup --daily 03:00
spawnloft task add survival --do verify --weekly SUN --at 04:00
```

| Trigger | Flag |
| --- | --- |
| Daily | `--daily 03:00` |
| Weekly | `--weekly SUN --at 03:00` |
| Every n hours | `--hourly <n>` |
| Every n minutes | `--minutes <n>` |
| At sign-in | `--on-logon` |

Retention (`keep`, 1 to 365) removes only snapshots the same schedule produced, never one taken by hand or before a reset. Tasks run while you are signed in whether or not SpawnLoft is open; on Linux, turn on lingering for them to survive logout (`spawnloft task linger on`). See [How it works](/guide/how-it-works#scheduled-work).

## Lock, annotate, download and leave out

In the **Backups** tool a snapshot can be **locked**, so neither **Delete** nor a schedule's retention removes it; given a **note** ("before the 1.21 upgrade"); and **downloaded** as a `.tar.gz`. Each server has a leave-out list, paths with `*` wildcards one per line, that every backup of it skips, and the manifest records what was left out. Small safety copies kept before changes (a file edit in **Files**, an assistant's configuration change) are listed separately and can be removed after a number of days.

## Keep a second copy

```sh
spawnloft config set-backup-mirror /mnt/other-drive/spawnloft-backups
```

Every new snapshot is copied to the mirror as it is taken, and retention deletions follow. Servers and backups on one drive fail together; a mirror on another drive is the cheapest protection against that. `spawnloft config set-backup-mirror off` stops mirroring.

## Verify

```sh
spawnloft verify survival --all
```

`verify` reads each archive end to end, so every gzip block is decompressed and checked, and compares the entries with the manifest. A snapshot missing a world is caught the week it was taken rather than the day it is needed. It exits non-zero on any failure, and a scheduled `verify` action reports failures to the server's Discord webhook.

## Restore

1. Stop the server. Restore is refused while it runs, because extracting over files a live server holds open corrupts a world.
2. In **Backups**, choose the snapshot and **Restore**, or run `spawnloft restore survival [ref] --yes`. The default reference is `latest`.

Restore extracts over the server in place and deletes nothing, so a file added after the snapshot was taken survives. In the panel, **Clear first, so it ends up exactly as the backup was** removes what the snapshot holds before putting it back, after copying it aside as a `pre-restore` snapshot. From the command line, remove the members the snapshot lists yourself first.

## Databases

`standard` and `full` snapshots of a server with an attached database include a `databases/` dump. Restore imports it back into the database it came from, which has to be running. MySQL databases also have their own **Backups** tool with downloadable SQL dumps. See [Databases](/guide/databases#back-up-and-verify).

## Single-file backups

When an AI assistant changes a configuration file, that file is snapshotted alone as `before-edit_config_…`. Restoring it puts back that one file and touches nothing else.

## Where snapshots live

`backups/` under the data folder. **Where backups are kept** in the **Backups** tool, or **Preferences**, can point it at another drive; that changes where new snapshots go and never moves existing ones.
