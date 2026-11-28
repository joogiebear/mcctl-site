---
title: Fix a laggy server
description: Find out why a Minecraft server is lagging and fix it. Read TPS and memory in SpawnLoft, give Java the right amount of RAM, lower view distance, and spot a plugin or world that is the real cause.
---

# Fix a laggy server

"Lag" covers three different problems, and the fixes do not overlap. Work out which one you have first, then change one thing at a time.

| What it feels like | What it usually is |
| --- | --- |
| Blocks reappear after you break them, mobs stutter, redstone is slow | **Server lag**: the server cannot finish a tick in 50 ms |
| Everything freezes for a second or two at regular intervals | **Memory pressure**: Java is stopping to clear memory |
| Fine for you, bad for a friend, or delays that grow with distance | **Network lag**: the connection between that player and the server |

Only the first two are the server's to fix. This guide is about those.

## 1. Measure before you change anything

Open the server's **Stats** tab. It charts CPU and memory over the last minute up to four hours, sampled every ten seconds, and the history survives a stop but resets on each start. Then ask the server for its tick rate from the **Console**:

```text
tps
```

Paper and its relatives answer with ticks per second. (`tps` is a Paper-family command: vanilla 1.20.3 and later has `tick query`, and NeoForge has `neoforge tps`.) **20.0 is perfect**, and a number that stays well under 20 while people are playing means the server cannot keep up. You can run the same command from a terminal with `spawnloft cmd survival "tps"`.

Note the number, the memory line and how many players were on. You will compare against it after each change.

## 2. Give Java the right amount of memory

Open **Settings → Java and memory**. SpawnLoft starts servers with 4 GB by default, which suits a small group on a plain server.

- **Too little** and the server spends its time clearing memory instead of running the game. That is the "freezes every few seconds" pattern, and the console may show `OutOfMemoryError`.
- **Too much** is also a problem. More than the server needs takes memory from your PC and the game without making the server faster. Set what it needs and leave the rest for your own PC and for Minecraft if you play on the same machine.

A reasonable start for a Paper server is 4 GB for a few friends and 6 to 8 GB for a bigger group or a heavy plugin list. Modpacks usually want more, and the pack's own page recommends a number. See [running a modpack](/guide/modpack-server).

Leave the **Java arguments** alone unless you know why you are changing them. SpawnLoft's defaults are Aikar's well-known flags, and the full launch line is shown in **Settings** either way.

The Overview also shows how much of your PC's memory all your servers may use between them. If you run several at once, that total matters more than any one.

## 3. Lower view distance

In **Settings → Server**, **View distance** controls how many chunks around each player the server sends and keeps loaded. The default is 10. Dropping it to 8, or to 6 for a crowded server, is the cheapest big win, and most players notice little.

`server.properties` also has `simulation-distance` (default 10; use **Whole file**), which controls how far around a player the server actually runs mobs, crops and redstone. Lowering it to 6 or 8 reduces work without shrinking the world players can see.

## 4. Look for a plugin or a place that is the cause

If tick rate is low even with few players, something specific is expensive.

- **A plugin.** Disable your most recent additions in **Plugins**, restart, and check `tps` again. [Try a plugin without risking your world](/guide/try-it-safely) shows how to test on a copy. A profiler such as the spark plugin names the culprit, and you can search for it in the Plugins tool.
- **A huge farm or a redstone clock.** One contraption can cost more than fifty players. If lag appears when someone stands in one place, that is where to look.
- **Too many animals or items.** Hundreds of mobs in a pen, or thousands of dropped items, slow every tick.
- **New terrain.** Generating terrain as players explore is the heaviest thing a server does, so a fresh world feels worse than a settled one. Pregenerating with a plugin such as Chunky moves that work to a quiet time.

## 5. Restart on a schedule

Servers that run for days accumulate junk. In **Schedule**, add a morning restart that warns players first, with a countdown announced in chat, and a backup just before it. [The friends guide](/guide/host-for-friends#_5-make-it-look-after-itself) sets that up step by step.

## 6. Check your PC itself

The server is a program on your computer, and it competes with everything else you run, including the game. A server and a Minecraft client on the same machine compete for the same CPU and memory. Stats charts the server's own process, so high CPU while nobody is on points at a plugin or world generation. To see what else is using the PC, use Task Manager, Activity Monitor or `top`, and close what you do not need, or play from a different PC on your network.

## When it is still slow

Take the `tps` reading, the Stats chart and the console log with the filter on **Warnings**, and [ask for help](/guide/troubleshooting#still-stuck). **Feedback → Something broke** in the panel opens an issue with the version, Java and status already filled in.
