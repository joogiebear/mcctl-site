---
title: Play with friends on your home network
description: Let friends on the same Wi-Fi or router join your SpawnLoft server. Find the address, open the firewall for Java, and fix the usual "can't connect" causes, with no router changes.
---

# Play with friends on your home network

If everyone is in the same house, or on the same Wi-Fi, this is the easy case. Nothing on your router changes, nothing is exposed to the internet, and the server only needs your PC to be on. For friends who live somewhere else, see [Sharing your server](/guide/sharing) after this.

## 1. Start the server

Open the server in SpawnLoft and press **Start**. Wait for the console to print `Done (…s)!`. Look at the server's card for its **port**. Servers SpawnLoft creates normally use `25565`, and the next ones take the next free port, so a second server is often `25566`.

## 2. Find this PC's local address

You are looking for the IPv4 address your PC has on your home network. It usually starts with `192.168.` or `10.`.

::: code-group

```powershell [Windows]
ipconfig
# Under your Wi-Fi or Ethernet adapter, read "IPv4 Address"
```

```sh [macOS]
ipconfig getifaddr en0
# en0 is usually Wi-Fi. If it prints nothing, try en1,
# or read it under System Settings → Network.
```

```sh [Linux]
hostname -I
# The first address that starts with 192.168. or 10.
```

:::

An address that starts with `127.` is the PC talking to itself, and one that starts with `169.254.` means the PC never got an address from the router. Neither works for friends.

## 3. Join from Minecraft

On a friend's computer, choose **Multiplayer**, then **Add Server**, and enter the address and, if it is not `25565`, the port after a colon:

```text
192.168.1.20
192.168.1.20:25566
```

On the PC that runs the server, use `localhost` instead.

Everyone joins with a normal Java Edition game of the **same Minecraft version as the server**. With a Paper server and a few plugins, nobody needs to install anything. With a modded server, friends need the same mods, as [running a modpack](/guide/modpack-server) explains.

## 4. Stop the address from changing

Most routers hand out addresses that can change after a reboot, which turns yesterday's `192.168.1.20` into a wrong answer. The fix lives in your router: look for **DHCP reservation**, **address reservation** or **static lease**, and pin this PC to its current address. Every router words it differently, so search for your router's model with those terms.

## If a friend cannot connect

Work through these in order. The first two cause most failures.

1. **The firewall is blocking Java.** The first time a server listens, Windows (and macOS, if its firewall is on) asks whether to allow it, and **Cancel** on Windows or **Deny** on macOS means friends are turned away while you can still join yourself. Allow Java on private networks. On Windows that is **Windows Security → Firewall & network protection → Allow an app through firewall**. `spawnloft doctor` reports port collisions and other machine problems.
2. **The address or port is wrong.** Check that the server card shows the port you typed, and that the address came from the PC running the server, not from the friend's.
3. **Different Minecraft version.** The error says the server or the client is outdated. Match the server's version, or, on Paper, Purpur, Folia or Advanced Slime Paper, upgrade the server in **Settings → Server software** (take a [backup](/guide/backups) first). Otherwise have players pick the server's version in their launcher.
4. **A guest network.** Many routers keep guest Wi-Fi apart from the main network on purpose, so a friend on "Guest" cannot see your PC. Put them on the main Wi-Fi.
5. **The network is a public one.** Windows treats a network marked **Public** more strictly than a **Private** one. Mark your home network **Private** in its Wi-Fi or Ethernet properties.
6. **Online mode and accounts.** With `online-mode=true`, the default, every player needs a real Minecraft account, even on your own network. That is the safe setting, and the [Security guide](/guide/security#online-mode-is-on-by-default) says why you should keep it on.
7. **Something else is on the port.** If the server would not start at all, the console says the port is taken. See [the port is already taken](/guide/troubleshooting#the-port-is-already-taken).

## Keep the world safe while people play

Turn on the whitelist in **Settings** even at home, take a backup before a big session, and schedule a nightly one in **Schedule**. The [friends guide](/guide/host-for-friends) walks through all of it in order.
