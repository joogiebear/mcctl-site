---
title: Seven things to check before your friends join
description: A short pre-flight checklist for a home Minecraft server. Online mode, whitelist, backups, memory, a restart schedule, plugin safety and your router, each with where to find it in SpawnLoft.
date: 2026-11-28
author: joogiebear
tags: [Guide, Servers]
lastUpdated: false
sidebar: false
aside: false
---

# Seven things to check before your friends join

You have a server running and it feels like the hard part is over. It is, mostly. Spend ten minutes on this list before you send out the address, and the first session is much less likely to end in a lost world or a stranger in your spawn.

## 1. Keep online mode on

`online-mode=true` is the default for servers SpawnLoft creates, and it should stay that way. It means every player is checked against a real Minecraft account. With it off, anyone can join under any name, including yours. It is under **Settings → Server** as **Who can join**.

If you ever change it on a world that already has players, SpawnLoft warns you first and says how many players would be affected, because their saved inventories and permissions are keyed to an identity that changes with the setting.

## 2. Turn on the whitelist

With the whitelist on, only names you add can join. Switch it on under **Settings**, then add each friend from the console:

```text
whitelist add FriendName
```

It is the most effective single protection for a small private server, and it makes sharing the address less worrying.

## 3. Take a backup, and schedule more

Take one now, from the **Backups** tab. Then open **Schedule** and add a nightly backup, keeping the last week or two. A running server is flushed before the snapshot, so it is complete. If you have a spare drive or a synced folder, set a second place for copies. [Backups](/guide/backups) explains the scopes, locking and verifying.

The first time something goes wrong, you will be glad this was done before it did.

## 4. Check the memory

The default of 4 GB suits a few friends on a plain Paper server. A modpack usually wants more, and the pack's page says how much. Watch the **Stats** tab once people are on, and raise memory in **Settings → Java and memory** if the console shows out-of-memory errors. More is not always better: [fixing a laggy server](/guide/fix-a-laggy-server) explains why.

## 5. Set up a restart that warns players

A server that runs for days can get sluggish. In **Schedule**, add a morning restart with a warning, so the countdown is announced in chat, and a backup just before it. If you want crashes to recover on their own, turn on `auto-restart` with `spawnloft set <name> auto-restart=on`. It gives up after three crashes in ten minutes, so a broken plugin cannot loop all night.

## 6. Try plugins somewhere safe

Before you add a plugin that touches the world, [test it on a copy](/guide/try-it-safely). SpawnLoft takes a snapshot of your plugins before every install, and a clone gives you a disposable server with fresh worlds on its own port. It is a lot easier to break a throwaway server than your real one.

## 7. Decide how people reach you

On your home network, a friend can use your PC's local address and the server's port, and nothing needs to change on your router. [Play with friends on your home network](/guide/play-on-your-network) walks through it.

For friends elsewhere, you choose between forwarding a port, which makes your home address public, and a tunnel service, which hides it. Either way, forward only the game port. RCON, the remote console, has no encryption or rate limiting and must never face the internet, and the panel can never be forwarded at all. [Sharing your server](/guide/sharing) has the detail.

## Then send the address

That is it. If something fails along the way, [the troubleshooting guide](/guide/troubleshooting) covers the failures SpawnLoft recognises, and `spawnloft doctor` checks the machine itself.
