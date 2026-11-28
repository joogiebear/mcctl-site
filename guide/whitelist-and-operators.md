---
title: Whitelist, operators and bans
description: Control who can join your Minecraft server and who can run commands. Turn on the whitelist, add friends, make an operator, and ban a player, from the SpawnLoft panel or the console.
---

# Whitelist, operators and bans

Three lists decide who gets in and what they can do. Set them up before you share the address.

| List | What it does |
| --- | --- |
| **Whitelist** | Only the names on it, and operators, can join. |
| **Operators** | Players who can run server commands. |
| **Bans** | Players who cannot join. |

## The whitelist

Turn it on in the server's **Settings**, then add each friend from the **Console**:

```text
whitelist add FriendName
whitelist list
whitelist remove FriendName
```

On a server with `online-mode=true`, the default for servers SpawnLoft creates, names are checked against real Minecraft accounts, so a name on the whitelist means that account and nobody pretending to be it. See [Security](/guide/security#online-mode-is-on-by-default). The whitelist is the simplest way to keep a private server private.

If you ever change **Who can join** on a world that already has players, SpawnLoft warns you first and says how many would be affected. Their saved inventories and permissions are keyed to an identity that changes with that setting.

## Operators

Operators can run powerful commands, so keep the list short.

```text
op FriendName
deop FriendName
```

Give operator rights to people you trust with the whole server, and use a permissions plugin for anyone who only needs part of it. Search for one in the **Plugins** tool.

## Bans

```text
ban PlayerName reason here
pardon PlayerName
```

## From the panel

The **Players** tab gathers everyone the server knows from operators, bans, the whitelist, the name cache and the world folder, because none of them is a complete list alone. You can search, filter to operators or the banned, and op, ban or delete a player's world data. Connected players are marked and sorted first. When the server is running, the changes go through the console; when it is stopped, they go straight into its files.

The **Activity** tab records who did what: you, a scheduled task, an assistant, or SpawnLoft itself.

## Before friends outside your network join

Keep online mode on, turn the whitelist on, and forward only the game port. [Sharing your server](/guide/sharing) covers the rest.
