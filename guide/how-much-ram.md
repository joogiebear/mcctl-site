---
title: How much RAM does a Minecraft server need?
description: Pick a sensible memory setting for a Minecraft server on your own PC. Starting points for plain Paper servers, plugins and modpacks, how to see if it is enough, and how to change it in SpawnLoft.
---

# How much RAM does a Minecraft server need?

There is no single right number, but there is a sensible place to start and a clear way to tell when it is wrong. SpawnLoft starts servers with 4 GB, and that is the right size for a lot of them.

## Starting points

| Server | Start at |
| --- | --- |
| Paper for you and a few friends, a handful of plugins | 4 GB |
| A bigger group, or a long plugin list | 6 to 8 GB |
| A modpack | What the pack's page recommends, often more than 4 GB |

Treat these as starting points, not promises. What a server needs depends on how many players are on, how far they spread out, how many plugins or mods run, and what they build.

## What your PC has to spare

The server shares your computer with everything else, including Minecraft itself if you play on the same machine. Leave the rest of the PC room to breathe. The **Overview** page shows how much of the machine's memory your servers may use between them, which matters most when you run more than one at once.

## How to tell if it is enough

Open the server's **Stats** tab once people are on. It charts memory and CPU for the last minute up to four hours. Memory there is the server process's resident memory, not only the Java heap, and SpawnLoft's default Java flags reserve the heap up front, so expect it to sit at or above the setting from the start. It will not tell you how much of the heap is really used; a profiler such as the spark plugin does.

| What you see | What it means |
| --- | --- |
| Console shows `OutOfMemoryError`, or the server stops | Too little. Raise it. [Troubleshooting](/guide/troubleshooting) covers this failure. |
| Regular freezes of a second or two | Possibly too little. Raise it a step and see whether they stop. |
| Low tick rate with plenty of memory spare | Not a memory problem. See [fixing a laggy server](/guide/fix-a-laggy-server). |

More memory is not automatically faster. Beyond what the server needs, extra memory takes from your PC and the game without making the server run better.

## Change it

Open **Settings → Java and memory** and set the memory, then save and restart. From a terminal:

```sh
spawnloft set survival memory=6G
```

You can also choose it when you create the server. Leave **Java arguments** alone unless you know why you want to change them: SpawnLoft uses Aikar's well-known flags by default, and the full launch line is shown in **Settings** either way. `-Xms`, `-Xmx` and `-jar` are refused there, because memory has its own setting.

## Modpacks

Modpacks are hungrier than a plain server. Start from the pack's recommended figure, watch **Stats**, and change it from there. [Running a modpack server](/guide/modpack-server) has the rest of the setup.
