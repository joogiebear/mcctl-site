---
title: Run a Minecraft server on Windows, Mac or Linux
description: What you need to run a Minecraft server on your own PC with SpawnLoft on Windows, Apple Silicon Macs or Linux, and the few differences between them.
---

# Run a Minecraft server on Windows, Mac or Linux

SpawnLoft runs on all three, and a server works the same way on each. The differences are in installing, in what happens when you sign out, and in a few extras.

## What you need on every system

- **Java.** Not bundled, because a Minecraft server is a Java program. SpawnLoft checks on first run and links the download if it is missing. Temurin 25 is a good default.
- **Room to spare.** A server for friends fits comfortably on a modern PC. See [how much RAM](/guide/how-much-ram).

Nothing else. SpawnLoft 2.0 is one native program with no Node.js inside it.

## Windows

Windows 10 or 11 (x64). The installer installs per user, needs no administrator prompt, and puts `spawnloft` on your `PATH`. If the Microsoft Edge WebView2 runtime is missing, the installer fetches it.

Windows SmartScreen may say "Windows protected your PC", because it judges by reputation as well as signature. Choose **More info**, then **Run anyway**. Scheduled tasks run while you are signed in and not after you sign out.

## Mac

macOS 13 or later on Apple Silicon. Open the DMG, drag SpawnLoft into **Applications** and launch it. The app is Developer ID signed and Apple-notarized. Intel Macs are not supported by 2.0, and 1.4 is the last version built for them.

## Linux

Ubuntu 22.04+, Debian 12+, Fedora, the RHEL family and openSUSE, on x64 or arm64.

```sh
sudo apt install ./SpawnLoft-<version>-linux-amd64.deb       # Ubuntu, Debian
sudo dnf install ./SpawnLoft-<version>-linux-x86_64.rpm      # Fedora, RHEL family
sudo zypper install ./SpawnLoft-<version>-linux-x86_64.rpm   # openSUSE
```

For a server with no screen there is `spawnloft-cli`, the command line on its own. Run `spawnloft task linger on` to keep scheduled tasks going after you log out. The desktop package's updates come through your package manager (`spawnloft update apply` prints the command). `spawnloft-cli` has no updater: install the newer package the same way.

## The same afterwards

Whatever the system, the path is the same: [Getting started](/guide/getting-started) takes you from install to a running server, [Host a server for your friends](/guide/host-for-friends) makes it look after itself, and [Downloads & platforms](/guide/beta) has the details of each package.
