---
title: Make a server restart itself after a crash
description: Turn on SpawnLoft's crash recovery so a crashed Minecraft server relaunches by itself, how the crash-loop limit protects your PC, and how to get a Discord message when it happens.
---

# Make a server restart itself after a crash

A server that crashes at 3 a.m. should not stay down until you notice. SpawnLoft can bring it back by itself, and stop trying when trying is the wrong thing to do.

## Turn it on

```sh
spawnloft set survival auto-restart=on
```

With it on, a crash relaunches the server in place after 10 seconds.

## What it will not do

- **It never overrides you.** A stop you asked for always sticks, including `stop` typed into the console.
- **It gives up after a loop.** Three crashes within ten minutes and the server stays down and records why, so a broken plugin cannot grind your machine all night.

## Get told

```sh
spawnloft set survival webhook=<your Discord webhook URL>
```

The webhook receives crashed, recovered, gave-up and failed scheduled-task events. Routine starts and stops stay quiet.

## Find out why it crashed

Open the console and filter to **Errors**, which keeps stack traces together with the line that started them. The strip under the server's vitals names failures SpawnLoft recognises, such as a missing plugin dependency, two plugins claiming the same name or a server out of memory. The [troubleshooting guide](/guide/troubleshooting) covers each one. The **Activity** tab (where crash recovery appears as crash guard) shows when the server crashed and when crash recovery restarted it.

If the same crash repeats, the fix is almost always the plugin or mod that caused it, or more memory ([how much RAM](/guide/how-much-ram)). [Try plugin changes on a copy](/guide/try-it-safely) first.

## Pair it with a schedule

Crash recovery handles surprises. A [scheduled restart and backup](/guide/schedule-restarts-and-backups) handles routine.
