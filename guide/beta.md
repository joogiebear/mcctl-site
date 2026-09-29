---
title: Downloads & platforms
description: Download SpawnLoft for Windows, Apple Silicon and Intel Mac, and Linux (.deb and .rpm, x64 and arm64). Platform support, automatic updates, and beta builds.
---

# Downloads & platforms

SpawnLoft ships for Windows, Apple Silicon and Intel Mac, and Linux on x64 and arm64. Every platform is built from one commit and installed and exercised on its own operating system before a release is published.

<Download fine />

| Platform | Package | Requirement |
| --- | --- | --- |
| Windows | `SpawnLoft-Setup-<version>.exe` | Windows 10 or 11, x64 |
| Mac, Apple Silicon | `SpawnLoft-<version>-mac-arm64.dmg` | macOS 13 or later |
| Mac, Intel | `SpawnLoft-<version>-mac-x64.dmg` | macOS 13 or later |
| Linux, Debian and Ubuntu | `SpawnLoft-<version>-linux-amd64.deb`, `-linux-arm64.deb` | Ubuntu 22.04+, Debian 12+ |
| Linux, Fedora, RHEL family, openSUSE | `SpawnLoft-<version>-linux-x86_64.rpm`, `-linux-aarch64.rpm` | |
| Linux, no desktop | `spawnloft-cli-<version>-linux-<arch>.deb` or `.rpm` | See [No screen](#no-screen) |

Java is separate on every platform, and which version depends on your Minecraft version. See [Getting started](/guide/getting-started#what-you-need).

## Install on Windows

Run the `.exe` installer. It installs per user, so no administrator prompt appears. Installers are signed through Microsoft Azure Artifact Signing. Windows SmartScreen may still show a reputation warning for a new publisher; see [setup](/guide/getting-started#smartscreen).

## Install on Mac

Choose Apple Silicon for an M-series chip or Intel for an Intel processor (**Apple menu → About This Mac**). Open the DMG and drag SpawnLoft into **Applications**. Both builds are Developer ID signed, hardened, Apple-notarized and stapled. Follow the [Mac setup steps](/guide/getting-started#install-on-mac).

Managed MySQL requires macOS 15 or later; the app itself runs on macOS 13 or later.

## Install on Linux

```sh
# Ubuntu and Debian
sudo apt install ./SpawnLoft-<version>-linux-amd64.deb

# Fedora, RHEL family, openSUSE
sudo dnf install ./SpawnLoft-<version>-linux-x86_64.rpm
```

Everything installs to `/opt/SpawnLoft`. `spawnloft-desktop` opens the window and `spawnloft` is the command line; neither needs Node.

| Distribution | Java |
| --- | --- |
| Ubuntu, Debian | `sudo apt install openjdk-25-jre-headless` |
| Fedora | `sudo dnf install java-latest-openjdk-headless` |

Schedules and automatic backups run through systemd user timers, and **they stop when you log out** unless lingering is on for your account. Turn on **Keep running after logout** in the **Backups** or **Schedule** tool, or run `spawnloft task linger on`. On a server you reach over SSH, that is the difference between a nightly backup and none.

Managed MySQL runs on x64 only, because Oracle publishes no small arm64 build; Redis runs on both. MySQL needs `libaio`, `libnuma` and `ncurses`, which a stock server lacks. SpawnLoft fetches the distribution's own packages (`apt-get download` on Debian and Ubuntu, `dnf download` on Fedora and the RHEL family) and unpacks them beside the engine, without `sudo` and without installing anything on the system. Where that cannot work, it prints the command to run instead.

Under WSL, a window showing only a taskbar icon titled "WARN: Copy Mode" is WSLg, not SpawnLoft: run `wsl --shutdown` from a non-Administrator terminal.

### No screen: the command line alone {#no-screen}

`spawnloft-cli` is the command line on its own Node runtime, about 30 MB, with none of the desktop app's graphical dependencies. It is a `.deb` and an `.rpm` for x64 and arm64 on [GitHub Releases](https://github.com/joogiebear/spawnloft/releases/latest). It conflicts with the desktop package, which already contains it: install one, not both.

```sh
sudo apt install ./spawnloft-cli-<version>-linux-amd64.deb
spawnloft new survival --paper 1.21.4 --accept-eula && spawnloft start survival
spawnloft ui --no-open
```

The panel listens on this machine only. Reach it from your own computer through an SSH tunnel, without opening a port:

```sh
ssh -L 8770:127.0.0.1:8770 you@server
```

Then open `http://127.0.0.1:8770`. `spawnloft-cli` has no updater; install a newer package the same way.

## Platform support

| Capability | Windows x64 | Mac Apple Silicon and Intel | Linux x64 and arm64 |
| --- | --- | --- | --- |
| Server controls, console, backup and restore | Yes | Yes | Yes |
| **Classic** and **SpawnLoft** themes | Yes | Yes | Yes |
| Live CPU and memory, CLI JSON and CSV | Yes | Yes | Yes |
| Managed MySQL 8.4 LTS | Yes | macOS 15+ | x64 only |
| Managed Redis-compatible service (Garnet) | Yes | Yes | Yes |
| Scheduled tasks and automatic backups | Task Scheduler | launchd | systemd user timers; lingering is a setting |
| App updates | Signed installer | Signed and Apple-notarized | Hash-verified package |
| Command line without the desktop app | Installed app | Installed app | `spawnloft-cli` |

Plugin configuration for databases stays manual. MySQL and Redis are the choices for new database services; MariaDB is no longer offered.

## Automatic updates and beta builds

SpawnLoft checks for new releases 20 seconds after startup and every six hours while open. New versions download in the background as changed blocks, and the header offers **Restart to update**. Running servers survive the restart; only the window restarts. On Linux the update installs through a system password prompt and takes the package of its own kind.

**Settings → Updates → Get beta builds** follows the betas between releases: new features as they are finished, several times a month. Betas pass the same automated tests on every platform as a release and are signed on Windows and Mac the same way, but have had less use, so back up a server you care about first. Turn it off at any time: nothing is downgraded, betas stop, and the next release installs when it ships.

## What changed

Each release's notes are in the [changelog](/changelog). Recent highlights:

| Version | Highlights |
| --- | --- |
| 1.4 | Redesigned panel with the console beside a tool dock, a per-server overview, settings as one form, database backups, AI assistants that edit plugin configuration, update checks for Purpur, Folia and Advanced Slime Paper |
| 1.3 | [AI assistants](/guide/ai-assistants), plugin installs snapshot first, faster **Backups** on Windows, database setup no longer freezes the app |
| 1.2 | `.rpm` packages, arm64 packages, `spawnloft-cli`, **Get beta builds** as a setting, `spawnloft task linger on` |
| 1.1 | Linux, RCON exposure warnings |
| 1.0 | Mac support, two themes, cleaner console, MySQL and Redis, structured CLI output and metrics export |

## Reporting a problem

Include the version and source commit from **Settings → About**, your operating system and version, and your processor (x64 or arm64; Apple Silicon or Intel on a Mac). Describe the action, the expected result and the actual result. Never attach database passwords or private plugin configuration values. **Feedback → Something broke** fills most of this in.
