---
title: Host a server for your friends
description: Set up a Minecraft server on your own PC for friends, from the first start to a whitelist, nightly backups and restarts that warn players first.
---

# Host a server for your friends

A world on your own PC, a few friends, and nobody else. This is the whole path from install to a server that looks after itself, in the order that matters.

Two things to know first, because they decide whether this is the right setup for you:

- **The PC has to be on** whenever anyone wants to play. If you want a server that is up while your computer is off, that is hosting, and [the comparison](/guide/compare) says where to look.
- **Friends outside your home network need a way in that you set up.** SpawnLoft never opens your router for you. Step 4 covers the options.

## 1. Create the server

Open SpawnLoft, choose **Add a server**, and pick **Create a new one**. Paper is the default and is what most friend servers want: it runs plugins and is fast. Leave **Who can join** on **Require a Minecraft account**, which matches a real server and is the safe default.

If you are not sure between Paper, Fabric and NeoForge, read [choosing your server software](/guide/choose-software).

Give it 4 GB to begin with, press **Create server**, then **Start**. The console prints `Done (…s)!` when it is ready.

## 2. Play on it yourself

In Minecraft, choose **Add Server** and use `localhost`. If the port on the server's card is not `25565`, add it after a colon, for example `localhost:25566`.

## 3. Let friends on your network in

Anyone on your home network can join with your PC's local address and the same port. Find the address in your operating system's network settings; it usually starts with `192.168.` or `10.`. If someone cannot connect, your firewall is probably blocking Java, and `spawnloft doctor` will say so.

## 4. Let friends anywhere in

This is the part you choose, and the [sharing guide](/guide/sharing) has the detail. In short:

| Route | Trade-off |
| --- | --- |
| Forward the port on your router | Your home address becomes public |
| A tunnel service such as playit.gg | Hides your home address, but depends on the service |

Before anyone outside joins, do these three things:

1. **Keep `online-mode=true`.** It is the default. Offline mode lets anyone join under any name, including yours.
2. **Turn the whitelist on.** In **Settings**, then run `whitelist add <name>` in the console for each friend.
3. **Check that only the game port is forwarded.** RCON, the remote console, has no encryption or rate limiting and must never face the internet. The panel itself only answers your own machine and can never be forwarded.

## 5. Make it look after itself

Open **Schedule** and add two tasks:

- **A nightly backup.** A running server is flushed first, so the snapshot is complete. Keep the last week or two.
- **A morning restart that warns players first.** With a warning set, the countdown is announced in chat.

Then turn on crash recovery. With `auto-restart` on, a crash relaunches the server by itself, and it gives up after three crashes in ten minutes so a broken plugin cannot loop all night. A Discord webhook tells you when that happens.

```sh
spawnloft set survival auto-restart=on
spawnloft set survival webhook=<your Discord webhook URL>
```

Tasks run while you are signed in to your PC, screen locked or not, whether or not SpawnLoft is open. They do not run after you sign out.

## 6. Add a plugin, safely

Open **Plugins**, search Modrinth and Hangar, and install. SpawnLoft takes a snapshot of your plugins first and checks the download. New plugins load on the next restart. When a plugin might break things, [try it on a copy](/guide/try-it-safely) first.

## When something goes wrong

The [troubleshooting guide](/guide/troubleshooting) covers the failures SpawnLoft recognises and names them in the panel. If a world is damaged, stop the server and restore the last snapshot from **Backups**.
