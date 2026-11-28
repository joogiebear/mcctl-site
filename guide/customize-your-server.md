---
title: Customize your server's message, icon and rules
description: Change a Minecraft server's message of the day, icon, difficulty, game mode, player limit and PvP from the SpawnLoft panel, without hand-editing server.properties.
---

# Customize your server's message, icon and rules

Everything a player sees before joining, and the basic rules once they do, live in **Settings**. It is one form: sections down the side, a dot on any section with an unsaved change, each setting reading **Default** until the file has it and **Changed** until saved.

## The message and the icon

Under **World and load**, the **MOTD** (message of the day) shows with a preview as the multiplayer list will draw it: icon, name and colours. Swatches insert the `§` colour codes for you. **Change icon** turns any image into the 64 by 64 `server-icon.png`.

## The rules

Under **Server**:

| Setting | What it does | Range or values | Default |
| --- | --- | --- | --- |
| Difficulty | How hard the game is | `peaceful`, `easy`, `normal`, `hard` | `easy` |
| Default game mode | What new players start in | `survival`, `creative`, `adventure`, `spectator` | `survival` |
| Max players | How many can be on at once | 1 to 1000 | `20` (servers SpawnLoft creates start at 10) |
| PvP | Whether players can hurt each other | on or off | on |
| Whitelist | Only listed names can join | on or off | off |
| View distance | Chunks sent around each player | 2 to 32 | `10` |
| Spawn protection | Radius around spawn that non-operators cannot change | 0 to 256 | `16` (servers SpawnLoft creates start at 0) |
| Who can join | Real accounts only, or any name | on or off | real accounts |

Leave **Who can join** on real accounts. See [Security](/guide/security#online-mode-is-on-by-default).

Writes never disturb another key or a comment in the file.

## Anything else

**Whole file** edits `server.properties` as text. The RCON password stays hidden, managed ports cannot be changed, and the file is snapshotted first so [Backups](/guide/backups) can put it back.

## Applying changes

The bottom bar saves, discards, or saves and restarts. Most settings take effect at the next start.

## Lower view distance if it lags

View distance is also the cheapest fix for a slow server. See [Fix a laggy server](/guide/fix-a-laggy-server).
