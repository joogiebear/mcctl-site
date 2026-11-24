---
description: "Install SpawnLoft, create or import a Minecraft server, and bring your world online on your own PC in three steps."
---

# Getting started

Install SpawnLoft, create or import a Minecraft server, and bring your world online. Everything runs on your own PC.

::: warning SpawnLoft 2.0 is not published yet
These docs describe SpawnLoft 2.0. Until it is released, the download on this site is the stable 1.5.0, which is built on Electron with a bundled Node runtime and differs in the details: its look, its installer and updater, and how the command line is installed. See [Downloads & platforms](/guide/beta) for what 2.0 changes.
:::

<PlatformPicker />

## Three steps

1. **Install SpawnLoft.** Download the installer for your system, run it, and let the first-run check look for Java.
2. **Add a server.** Choose **Add a server**, pick the software and Minecraft version, and the jar downloads with real progress. To use a server you already run, choose **Add one I already have** and point SpawnLoft at its folder instead: nothing is moved or rewritten, and its ports and RCON password are read from its own `server.properties`.
3. **Press Start.** Watch the console until it prints `Done (…s)!`. Type `list` in the console. Open **Plugins** and install something. Take a backup.

To let friends join, see [Sharing your server](/guide/sharing).

## What you need {#what-you-need}

| Requirement | Detail |
| --- | --- |
| Java | Not bundled. Minecraft servers are Java programs. |
| Operating system | Windows 10 or 11 (x64), macOS 13 or later on Apple Silicon, or Linux (Ubuntu 22.04+, Debian 12+, Fedora, the RHEL family and openSUSE; x64 or arm64) |
| Node.js | Not needed. SpawnLoft 2.0 is one native program with no Node inside it. Only [test players for plugins](/guide/beta#what-needs-node) use a Node.js (22 or later) you install yourself. |

| Minecraft version | Java |
| --- | --- |
| 1.18 to 1.20.4 | 17 |
| 1.20.5 to 1.21.x | 21 |
| 26.x | 25 |

[Temurin 25](https://adoptium.net/temurin/releases/?version=25) is a good default. Use a **JDK** rather than a JRE if you want Spigot or CraftBukkit built on your machine.

The app checks for Java on first run, before it downloads anything, and a **Java** pill in the header marks a missing or outdated Java until it is fixed. `spawnloft doctor` reports the same from a terminal. SpawnLoft searches `PATH` and the usual install folders (Program Files, the per-user Programs folder, `JAVA_HOME`), so a Java the installer did not add to `PATH`, or one installed after SpawnLoft started, is still found. When a server is created, SpawnLoft picks the newest installed Java that fits its Minecraft version, and refuses a version nothing installed can run before downloading anything, with a link to the Java it needs. Point one server at a specific Java with its **Settings** tab or `spawnloft set <name> java=<path>`.

## Install on Windows

Run the installer. It installs per user with no administrator prompt, and puts `spawnloft` on your `PATH` so a new terminal can run it. If the Microsoft Edge WebView2 runtime is missing, the installer fetches it.

### SmartScreen {#smartscreen}

The installer is signed, but Windows SmartScreen judges by reputation rather than signature, and a new publisher earns reputation through real installs. Until then Windows may show "Windows protected your PC". Click **More info**, then **Run anyway**.

## Install on Mac {#install-on-mac}

Open the DMG, drag SpawnLoft into **Applications**, launch it, and follow the Java check. The app is for Apple Silicon Macs on macOS 13 or later, and is Developer ID signed and Apple-notarized. Intel Macs are not supported by 2.0; 1.4 is the last version built for them. Your application data lives outside the app bundle, and the app updates itself after installation.

## Install on Linux

```sh
sudo apt install ./SpawnLoft-<version>-linux-amd64.deb       # Ubuntu, Debian
sudo dnf install ./SpawnLoft-<version>-linux-x86_64.rpm      # Fedora, RHEL family, openSUSE
sudo apt install openjdk-25-jre-headless                      # Java, Ubuntu and Debian
```

Open **SpawnLoft** from the applications menu, or run `spawnloft-desktop`. `spawnloft` is the command line. Schedules after logout and servers with no screen are covered in [Downloads & platforms](/guide/beta#install-on-linux).

## From the command line

The same program runs from a terminal. Installed packages provide `spawnloft` and `mcctl` (see [CLI setup](/reference/commands#preview-cli-setup)).

```sh
spawnloft new survival --paper 1.21.4 --accept-eula    # create; downloads Paper
spawnloft start survival                               # blocks until ready
spawnloft cmd survival "tps"                           # RCON command, reply printed
spawnloft backup survival
spawnloft ui                                           # the panel, http://127.0.0.1:8770
```

Register a folder you already have, in place:

```sh
spawnloft adopt survival "D:\Servers\Survival" --memory 6G
```

Create a disposable copy of a server's plugins and config, with fresh worlds on its own port, to reproduce a bug without touching the real server:

```sh
spawnloft clone survival ecotest && spawnloft start ecotest
```

`mcctl` accepts the same commands, so existing scripts keep working. The full list is in the [command reference](/reference/commands).

## Next steps

| Goal | Guide |
| --- | --- |
| Learn the tools | [The panel](/guide/panel) |
| Add plugins | [Plugins](/guide/plugins) |
| Protect your world | [Backups](/guide/backups) |
| Have friends join | [Sharing your server](/guide/sharing) |
| Play on your own server | [The game launcher](/guide/launcher) |
| Something failed | [Troubleshooting](/guide/troubleshooting) |

## Where next

- [Host a server for your friends](/guide/host-for-friends), from the first start to a server that looks after itself.
- [Paper, Fabric or NeoForge](/guide/choose-software), if you are not sure which to pick.
- [Try a plugin or update without risking your world](/guide/try-it-safely).
