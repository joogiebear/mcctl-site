---
title: Your server and its backups should not share a drive
description: The most common way a home server loses everything is a failure that takes the server and the backups together. A short case for a second copy on another drive, and how little it takes.
date: 2026-11-28
author: joogiebear
tags: [Opinion, Backups]
lastUpdated: false
sidebar: false
aside: false
---

# Your server and its backups should not share a drive

Most people who take backups take them to the same place the server lives. It is the default, it is the easy folder to find, and it feels like safety. It protects you from some things: a plugin that corrupts a config, a bad upgrade, a griefer, your own mistake at 1 a.m. It does not protect you from the drive.

If the drive fails, is wiped by a reinstall, fills up, or is taken by a power surge, the server and every backup of it go in the same moment. The backups were only ever as safe as the thing they were backing up.

## The cheap fix

A second copy on a different physical drive covers that case. It does not need to be fancy. An external disk that stays plugged in is enough, and so is a second internal drive or a network share you trust.

In SpawnLoft it is one command:

```sh
spawnloft config set-backup-mirror /mnt/other-drive/spawnloft-backups
```

From then on every new snapshot is copied there as it is taken, and when retention clears out an old snapshot, the copy is cleared too, so the second drive does not quietly fill up either. Turn it off with the same command and `off`.

## A copy you have never opened is a guess

Mirroring tells you a file arrived. It does not tell you the archive is good. A weekly check does that: `spawnloft verify` reads each snapshot end to end and compares it with its list of contents, and it can run on a schedule and tell your Discord when something is wrong. The longer story is in [A backup you never tested is a guess](/blog/a-backup-you-never-tested-is-a-guess).

## What this does not cover

A second drive in the same room does not help with a fire or a theft. For a server that is mostly friends and a survival world, most people stop at a second drive. If the world matters more than that, download a snapshot as a `.tar.gz` from the **Backups** tab now and then and keep it somewhere that is not your house.

## Ten minutes

1. Plug in or pick a second drive.
2. Set the mirror.
3. Take a snapshot and look in the mirror folder.
4. Schedule a weekly verify.

The full steps are in [Back up to a second drive](/guide/back-up-to-a-second-drive).
