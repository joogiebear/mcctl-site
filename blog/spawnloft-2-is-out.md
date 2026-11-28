---
title: SpawnLoft 2.0 is out
description: A smaller download, servers that keep running while the app updates, signed updates and a panel that only answers you. What changed in 2.0, and what stays exactly the same.
date: 2026-11-28
author: joogiebear
tags: [Release, "2.0"]
lastUpdated: false
sidebar: false
aside: false
---

# SpawnLoft 2.0 is out

SpawnLoft 2.0 is the stable release now, and it is a rebuild of the program underneath rather than a pile of new buttons. Your servers, worlds, backups, scheduled tasks and Microsoft sign-ins carry over untouched. This post is the short version of what is different and why it matters if you are running a server for friends.

## A smaller app

SpawnLoft 1 shipped its own copy of a web browser and a JavaScript runtime. SpawnLoft 2.0 is one native program written in Rust, and the window uses the web view your system already has: WebView2 on Windows (the installer fetches it if it is missing), the system web view on macOS and Linux. The installers are now around 7 to 9 MB.

It also means there is no Node.js inside it. You still need Java, because Minecraft servers are Java programs, and the first-run screen checks it for you.

## Servers keep running while the app updates

This was the thing that bothered me most in 1.x. An app update meant stopping what you had running. In 2.0 every server is looked after by a small supervisor that keeps going while the app updates or restarts, so people stay connected through an update.

The one exception is the update *to* 2.0. It replaces the whole program, so on Windows the installer stops your servers with a normal stop and a save, installs 2.0 and starts them again. Players are disconnected for a minute or two, once. On macOS and Linux nothing is stopped: servers that were running keep running under SpawnLoft 1 until you restart them, and the panel shows a **Restart** button for each.

## Updates are signed

Every update is checked against SpawnLoft's own signing key before it is installed, on top of the Windows and Apple signatures. If you ever want to step back, **Preferences → Updates → Reinstall a previous version** lists earlier 2.x releases and installs the one you pick.

## The panel only answers you

In 1.x, the local panel would answer any program on the same computer. 2.0's panel needs a sign-in. The app's window signs itself in, so nothing changes for you there. Without the app, `spawnloft ui` opens your browser already signed in and prints a one-use link, and `spawnloft ui --link` makes a new one. The details are in [Security](/guide/security).

## And a few small things

- `spawnloft` is on your `PATH` on Windows, so a new terminal can run `spawnloft list`. `mcctl` still works too, so existing scripts do not break.
- Linux packages are built natively for arm64 and x64, and `spawnloft-cli` packages cover servers with no screen.
- Linux updates go through your package manager: `spawnloft update apply` downloads and checks the package and prints the `apt` or `dnf` command to install it.
- Intel Macs are not supported. 1.4 is the last version built for them.

## Getting it

If you already run SpawnLoft 1.5, you do not need to download anything: it updates when you next quit the app (on Linux, install the new package). Everyone else can [download it here](/download), and [Getting started](/guide/getting-started) takes you from the installer to a running server.

If you would rather stay on 1.5.0 for now, the [release notes](https://github.com/joogiebear/spawnloft/releases/tag/v2.0.0) have the way back, and your servers and worlds are the same files in both versions. The full list of changes is in the [changelog](/changelog).
