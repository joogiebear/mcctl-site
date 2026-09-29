---
title: Sharing your server
description: How friends join a SpawnLoft server on your network, what to switch on first, and the decisions involved in letting people join from the internet.
---

# Sharing your server

## Friends on your network

Anyone on your home network can join immediately.

1. Start the server.
2. Find this PC's local address: its IPv4 address in your operating system's network settings, usually starting with `192.168.` or `10.`.
3. In Minecraft, choose **Add Server** and enter that address. If the server's port is not `25565`, add it after a colon, for example `192.168.1.20:25566`. The port is on the server's card and in **Settings**.

If a friend cannot connect, your operating system's firewall may be blocking incoming connections to Java. `spawnloft doctor` reports port collisions and other machine problems.

## Friends on the internet

SpawnLoft does not do this for you, on purpose. It never opens firewall ports and never touches your router. Letting the internet reach your machine is a decision about exposure, and it stays yours.

| Route | What it involves | Trade-off |
| --- | --- | --- |
| Forward the port on your router | Point your router's port for the server at this PC | Your home address becomes public |
| A tunnel service such as playit.gg, or a relay you run | The server makes an outbound connection; no router ports open | Hides your home address; depends on the service |

A **Share** screen that lays these options out, with a whitelist and online mode nudged on at the moment anything goes public, is on the [roadmap](/roadmap). It is not available yet.

### Before anyone outside joins

| Setting | Why |
| --- | --- |
| `online-mode=true` | Default for servers SpawnLoft creates. Offline mode lets anyone join under any name, including yours. |
| Whitelist on | **Settings → Whitelist**, then `whitelist add <name>` in the console |
| RCON not exposed | RCON has no rate limiting or encryption. Minecraft cannot bind it separately from the game port, so check that your router forwards only the game port. `spawnloft doctor` and the panel warn when RCON is reachable from a public address with no active firewall. |
| Recent backup | See [Backups](/guide/backups) |
| Panel not exposed | The panel listens on `127.0.0.1` only and cannot be bound elsewhere. Never forward its port. |

More in [Security](/guide/security).
