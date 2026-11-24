---
title: Downloads & platforms
description: SpawnLoft for Windows, Apple Silicon Mac, and Linux (.deb and .rpm, x64 and arm64). Platform support, signed automatic updates, beta builds, and what changes in 2.0.
---

# Downloads & platforms

SpawnLoft ships for Windows, Apple Silicon Mac, and Linux on x64 and arm64. Every platform is built from one commit and installed and exercised on its own operating system before a release is published.

::: warning SpawnLoft 2.0 is not published yet
This page describes 2.0, which is finished on the development branch but has not been released. The installers the site's download button points at are the stable 1.5.0. The package names, platforms and update behaviour below are what 2.0 builds, so check the release page for what a given version includes. Intel Macs, the old Node and Electron runtime, and the Node-based command line are 1.x; they are covered in [what changes in 2.0](#what-changes-in-2-0).
:::

<PlatformPicker />

| Platform | Package | Requirement |
| --- | --- | --- |
| Windows | `SpawnLoft-Setup-<version>.exe` | Windows 10 or 11, x64 |
| Mac, Apple Silicon | `SpawnLoft-<version>-mac-arm64.dmg` | macOS 13 or later |
| Linux, Debian and Ubuntu | `SpawnLoft-<version>-linux-amd64.deb`, `-linux-arm64.deb` | Ubuntu 22.04+, Debian 12+ |
| Linux, Fedora, RHEL family, openSUSE | `SpawnLoft-<version>-linux-x86_64.rpm`, `-linux-aarch64.rpm` | |
| Linux, no desktop | `spawnloft-cli-<version>-linux-<arch>.deb` or `.rpm` | See [No screen](#no-screen) |

Intel Macs are not supported by 2.0. 1.4 is the last version built for them: [SpawnLoft-1.4.0-mac-x64.dmg](https://github.com/joogiebear/spawnloft/releases/download/v1.4.0/SpawnLoft-1.4.0-mac-x64.dmg). An Intel Mac is not offered a later version.

Java is separate on every platform, and which version depends on your Minecraft version. See [Getting started](/guide/getting-started#what-you-need).

## Install on Windows

Run the `.exe` installer. It installs per user, so no administrator prompt appears, and adds `spawnloft` to your user `PATH`: open a new terminal afterwards and `spawnloft list` works. If the WebView2 runtime the window needs is missing, the installer fetches it. Installers are signed through Microsoft Azure Artifact Signing. Windows SmartScreen may still show a reputation warning for a new publisher; see [setup](/guide/getting-started#smartscreen).

## Install on Mac

Open the DMG and drag SpawnLoft into **Applications**. The build is for Apple Silicon and is Developer ID signed, hardened, Apple-notarized and stapled. Follow the [Mac setup steps](/guide/getting-started#install-on-mac).

Managed MySQL requires macOS 15 or later; the app itself runs on macOS 13 or later.

## Install on Linux

```sh
# Ubuntu and Debian
sudo apt install ./SpawnLoft-<version>-linux-amd64.deb

# Fedora, RHEL family, openSUSE
sudo dnf install ./SpawnLoft-<version>-linux-x86_64.rpm
```

The app installs to `/opt/SpawnLoft`, and `/usr/bin/spawnloft` is the command line. `spawnloft-desktop` opens the window. The desktop package needs the system's WebKitGTK and GTK 3 libraries, which `apt` and `dnf` pull in; no Node is involved.

| Distribution | Java |
| --- | --- |
| Ubuntu, Debian | `sudo apt install openjdk-25-jre-headless` |
| Fedora | `sudo dnf install java-latest-openjdk-headless` |

Schedules and automatic backups run through systemd user timers, and **they stop when you log out** unless lingering is on for your account. Turn on **Keep running after logout** in the **Backups** or **Schedule** tool, or run `spawnloft task linger on`. On a server you reach over SSH, that is the difference between a nightly backup and none.

Managed MySQL runs on x64 only, because Oracle publishes no small arm64 build; Redis runs on both. MySQL needs `libaio`, `libnuma` and `ncurses`, which a stock server lacks. SpawnLoft fetches the distribution's own packages (`apt-get download` on Debian and Ubuntu, `dnf download` on Fedora and the RHEL family) and unpacks them beside the engine, without `sudo` and without installing anything on the system. Where that cannot work, it prints the command to run instead.

The game launcher does not run on Linux arm64, because Mojang ships no arm64 Linux build of the game or of Java. Servers do.

Under WSL, a window showing only a taskbar icon titled "WARN: Copy Mode" is WSLg, not SpawnLoft: run `wsl --shutdown` from a non-Administrator terminal.

### Removing it on Linux {#uninstall-linux}

There is no SpawnLoft uninstaller on Linux. The package manager removes the program, and its scripts run as root, so they cannot reach your servers or your account's timers. Run this first, as yourself:

```sh
spawnloft uninstall --yes            # stops every server, removes every scheduled task
spawnloft uninstall --yes --data     # the same, and deletes what SpawnLoft created
sudo apt remove spawnloft            # or: sudo dnf remove spawnloft
```

For the command-line package the name is `spawnloft-cli`. Removed the other way round, running servers keep going until they stop and the timers keep firing at a program that is gone; reinstall, run `spawnloft uninstall`, and remove again.

### No screen: the command line alone {#no-screen}

`spawnloft-cli` is the command line on its own: the same native `spawnloft-core` program as the desktop app, with none of its graphical dependencies, and no Node. It is a `.deb` and an `.rpm` for x64 and arm64 on [GitHub Releases](https://github.com/joogiebear/spawnloft/releases/latest). It conflicts with the desktop package, which already contains it: install one, not both.

```sh
sudo apt install ./spawnloft-cli-<version>-linux-amd64.deb
spawnloft new survival --paper 1.21.4 --accept-eula && spawnloft start survival
spawnloft ui --no-open
```

The panel listens on this machine only, and it needs a sign-in. `spawnloft ui --no-open` prints a one-use link; reach the panel from your own computer through an SSH tunnel, without opening a port:

```sh
ssh -L 8770:127.0.0.1:8770 you@server     # on your computer
spawnloft ui --no-open                    # on the server, in that SSH session
```

Open the printed link in your own browser. If the link has expired, or you want a second browser, run `spawnloft ui --link` on the server. `spawnloft-cli` has no updater; install a newer package the same way.

## Platform support

| Capability | Windows x64 | Mac Apple Silicon | Linux x64 and arm64 |
| --- | --- | --- | --- |
| Server controls, console, backup and restore | Yes | Yes | Yes |
| **SpawnLoft** and **Classic** themes | Yes | Yes | Yes |
| Live CPU and memory, CLI JSON and CSV | Yes | Yes | Yes |
| Managed MySQL 8.4 LTS | Yes | macOS 15+ | x64 only |
| Managed Redis-compatible service (Garnet) | Yes | Yes | Yes |
| Game launcher | Yes | Yes | x64 only |
| Scheduled tasks and automatic backups | Task Scheduler | launchd | systemd user timers; lingering is a setting |
| App updates | Signed, in the background | Signed and Apple-notarized, in the background | Verified package; the command is shown |
| Command line without the desktop app | Installed app | Installed app | `spawnloft-cli` |

Plugin configuration for databases stays manual. MySQL and Redis are the choices for new database services; MariaDB is no longer offered.

## Automatic updates and beta builds {#automatic-updates-and-beta-builds}

SpawnLoft checks for new releases 20 seconds after startup and every six hours while open. A new version downloads in the background, and the header offers **Restart to update**. Running servers survive the restart; only the window restarts. Every update is checked against SpawnLoft's own signing key before it is installed, on top of the Windows and Apple signatures.

On Linux the package manager installs updates. SpawnLoft downloads and verifies the package, then shows the `apt` or `dnf` command that installs it; `spawnloft update apply` prints the same command.

**Preferences → Updates → Get beta builds** follows the betas between releases: new features as they are finished, several times a month. Betas pass the same automated tests on every platform as a release and are signed on Windows and Mac the same way, but have had less use, so back up a server you care about first. Turn it off at any time: nothing is downgraded, betas stop, and the next release installs when it ships.

**Preferences → Updates → Reinstall a previous version** lists earlier 2.x releases and installs the one you pick, except a version that cannot read your servers' data. Updates are then paused until you resume them there. From a terminal, `spawnloft update` does the same: `check`, `status`, `apply`, `list`, `rollback <version>`, `hold`, `channel [stable|beta]` and `log`. The update log is `update.log` in the SpawnLoft settings folder.

## What needs Node {#what-needs-node}

Nothing in SpawnLoft 2.0 needs Node.js: the command line, the panel, the game launcher, the per-server supervisors and the MCP server are all one native program, `spawnloft-core`. The one exception is [test players for plugins](https://github.com/joogiebear/spawnloft/blob/v2/BOTS.md) (`spawnloft bot`), which run on a Node.js 22 or later that you install yourself.

## What changes in 2.0 {#what-changes-in-2-0}

| | 1.x | 2.0 |
| --- | --- | --- |
| Program | Electron window around a Node engine | A native core written in Rust and a Tauri 2 window that uses the system's web view, so the download is smaller |
| Node.js | Bundled | None. Only test players use one you install |
| Panel | Open to any program on the computer | Needs a sign-in; the app signs itself in, `spawnloft ui` signs your browser in. See [Security](/guide/security) |
| Updates | Installer updater | Signed update feed, background download, and a way back to an earlier 2.x release |
| Command line | `spawnloft` inside the install folder | On your `PATH` on Windows after install; the same on Linux and from `Contents/Resources/bin` on a Mac |
| Look | Panel with a dock of tools | A new interface: **SpawnLoft** theme (charcoal, warm white and lime) or **Classic**, a navigation of Overview, Play and your servers, tool tabs under each server, searchable pickers |
| Intel Mac | 1.4 and earlier | Not supported |
| Linux arm64 | `.deb` and `.rpm` | `.deb` and `.rpm`, desktop and `spawnloft-cli` |

Updating from 1.x to 2.0 replaces the whole program. On Windows the installer stops every running server (a normal `stop`, with a save, never a kill), installs 2.0 and starts them again, so players are disconnected for a minute or two; if a server will not stop within five minutes, the update is called off and everything starts again under 1.x. On macOS and Linux nothing is stopped: servers that were running keep running under 1.x until you restart them, and the panel shows a banner with a **Restart** button for each. Servers, worlds, backups, scheduled tasks, settings and Microsoft sign-ins are kept, and scheduled tasks and assistant configurations written by 1.x keep working. From 2.0 on, updates leave running servers alone.

To go back to 1.5.0, stop every server first, run the 1.5.0 installer from the [releases page](https://github.com/joogiebear/spawnloft/releases/tag/v1.5.0), and open SpawnLoft once: it rewrites its scheduled tasks and launchers on first start. Your servers, worlds and backups are the same files in both versions.

## What changed before 2.0

Each release's notes are in the [changelog](/changelog). Recent highlights:

| Version | Highlights |
| --- | --- |
| 1.5 | **Files** in the panel, an **Activity** history per server, scheduled tasks of several steps, named backups you can keep, Java arguments of your own, the console in its own window, interface size, test players for plugins, servers and their tools in a sidebar |
| 1.4 | Redesigned panel with the console beside a tool dock, a per-server overview, settings as one form, database backups, AI assistants that edit plugin configuration, update checks for Purpur, Folia and Advanced Slime Paper |
| 1.3 | [AI assistants](/guide/ai-assistants), plugin installs snapshot first, faster **Backups** on Windows, database setup no longer freezes the app |
| 1.2 | `.rpm` packages, arm64 packages, `spawnloft-cli`, **Get beta builds** as a setting, `spawnloft task linger on` |
| 1.1 | Linux, RCON exposure warnings |
| 1.0 | Mac support, two themes, cleaner console, MySQL and Redis, structured CLI output and metrics export |

## Reporting a problem

Include the version and source commit from **Preferences → About**, your operating system and version, and your processor (x64 or arm64). Describe the action, the expected result and the actual result. Never attach database passwords or private plugin configuration values. **Feedback → Something broke** fills most of this in; after an update from 1.x, also attach `update.log` and, from the data folder, `run/handover.json` and `run/handover.log`.
