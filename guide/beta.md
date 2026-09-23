---
title: Downloads & platforms
description: Download SpawnLoft 1.2 for Windows, Apple Silicon and Intel Mac, and Linux (.deb and .rpm, x64 and arm64). Platform support, automatic updates, and beta builds.
---

# Downloads & platforms

SpawnLoft 1.2 is the current release, for Windows, Apple Silicon and Intel Mac, and Linux on x64 and arm64. Every platform ships in one release, built from one commit, and is installed and exercised on its own operating system before anything is published.

<Download fine />

## Install on Windows

Run the `.exe` installer on Windows 10 or 11, x64. Installers are signed through Microsoft Azure Artifact Signing. Windows SmartScreen may still show a reputation warning for a new publisher; see [setup](/guide/getting-started#smartscreen).

## Install on Mac

Choose Apple Silicon for an Apple M-series chip, or Intel for an Intel processor. Open the DMG and drag SpawnLoft into **Applications**. Both Mac builds are Developer ID signed, hardened, Apple-notarized and stapled. Follow the [Mac setup steps](/guide/getting-started#install-on-mac).

The app requires macOS 13+. Managed MySQL requires macOS 15+. Install Java appropriate for your Minecraft version.

## Install on Linux

Pick the package for your distribution and processor: a `.deb` for Ubuntu 22.04+ and Debian 12+, or an `.rpm` for Fedora, the RHEL family and openSUSE, each for x64 or arm64.

```sh
# Ubuntu / Debian
sudo apt install ./SpawnLoft-1.2.0-linux-amd64.deb

# Fedora / RHEL / openSUSE
sudo dnf install ./SpawnLoft-1.2.0-linux-x86_64.rpm
```

Everything installs to `/opt/SpawnLoft`. `spawnloft-desktop` opens the window and `spawnloft` is the command line; neither needs Node. Java is separate, as on every platform, and which one depends on your Minecraft version. On Ubuntu and Debian: `sudo apt install openjdk-25-jre-headless`. On Fedora: `sudo dnf install java-latest-openjdk-headless`.

Schedules and automatic backups run through systemd user timers, and **those stop when you log out** unless lingering is on for your account. Turn on *Keep running after logout* in the Backups or Scheduler tab, or run `spawnloft task linger on`. On a server you connect to over SSH, that is the difference between a nightly backup and none.

Managed MySQL runs on x64; Oracle publishes no small arm64 build, so *Create a database* is off on arm64 and says so. Managed Redis runs on both. MySQL needs a few system libraries a server usually lacks; SpawnLoft fetches your distribution's own packages and unpacks them beside the engine, without sudo and without installing anything on the system.

### No screen: the command line alone {#no-screen}

For a server with no desktop, `spawnloft-cli` is the command line on its own Node runtime, about 30 MB, with none of the desktop app's graphical dependencies. It comes as a `.deb` and an `.rpm` for x64 and arm64 on [GitHub Releases](https://github.com/joogiebear/spawnloft/releases/latest).

```sh
sudo apt install ./spawnloft-cli-1.2.0-linux-amd64.deb
spawnloft ui --no-open
```

The panel listens on this machine only. Reach it from your own computer through an SSH tunnel: `ssh -L 8770:127.0.0.1:8770 you@server`, then open `http://127.0.0.1:8770`. `spawnloft-cli` has no updater; install a newer package the same way. Install it or the desktop package, not both.

## Automatic updates and beta builds

SpawnLoft checks for new releases after startup and every six hours while it is open. New versions download in the background, and the header offers **Restart to update**. On Linux the update installs through a system password prompt and takes the package of its own kind; Linux has no code signing to check, so the package is verified against the hash in the update feed.

**Get beta builds**, in **Settings → Updates**, follows the betas between releases: new features as they are finished, several times a month. Betas pass the same automated tests on every platform as a release, and are signed on Windows and Mac the same way, but have not had a month of use, so back up a server you care about first. Turn it off whenever you like: nothing is downgraded, the betas stop, and the next release installs when it ships.

## Platform support

| Capability | Windows x64 | Mac Apple Silicon / Intel | Linux x64 / arm64 |
| --- | --- | --- | --- |
| Server controls, console, manual backup/restore | Available | Available | Available |
| Classic and SpawnLoft themes | Available | Available | Available |
| Live CPU and memory; CLI JSON/CSV | Available | Available | Available |
| Managed MySQL 8.4 LTS | Available | macOS 15+ | x64 only |
| Managed Redis-compatible service (Garnet) | Available | Available | Available |
| Scheduled tasks and automatic backups | Available | Available through launchd | systemd user timers; keep running after logout is a setting |
| Automatic app updates | Signed installer | Signed and Apple-notarized | Hash-verified package |
| Command line without the desktop app | Via the installed app | Via the installed app | `spawnloft-cli` package |

Plugin configuration remains manual. MySQL and Redis are the choices for new database services; MariaDB is no longer offered.

## Coming in 1.3 (in the betas now)

- **[AI assistants](/guide/ai-assistants).** Let Claude Desktop, Claude Code or another AI app you choose start and stop your servers, read their consoles, find out why one crashed, check TPS, take backups and update plugins and Paper. No account, no open port, nothing sent unless that app asks.
- **Installing a plugin takes a snapshot first**, as updating one already did.
- **The Backups tab shows your backups at once** on Windows, instead of waiting for Task Scheduler.
- **Setting up a database no longer freezes the app** for a few seconds on Windows.

## New in 1.2

- **An `.rpm`** beside the `.deb`, and **arm64** packages of both.
- **`spawnloft-cli`**, the [command line alone](#no-screen) for servers with no screen.
- **Get beta builds**, as a setting. It used to depend on which installer you had downloaded.
- **`spawnloft task linger on`**, and a warning when schedules would stop at logout.
- **Managed MySQL sets itself up on Fedora and the RHEL family**, as it already did on Ubuntu and Debian.

## New in 1.1

- **Linux.** The same panel and the same command line, as a `.deb` for Ubuntu and Debian.
- **RCON exposure warnings.** `spawnloft doctor` and the panel warn when RCON is reachable from the internet: Minecraft cannot bind RCON separately from the game port.
- Stopping one of two servers under a very long data folder path could stop the other; a force kill now takes whatever the server started with it.

## Included in 1.0

### Two app themes

Open **Settings → Appearance** and choose **Classic** for the original palette or **SpawnLoft**
for the look inspired by the website.

### A cleaner console

ANSI escape sequences are stripped into clean, searchable text. Warning and error indicators
remain. Long lines scroll horizontally by default; switch on **Wrap** when you want them to
fit the panel.

### Backups that stay in sync

The Backups tab refreshes every four seconds while visible and when reopened, including after
a CLI-created backup. Refreshing preserves your selected scope and unsaved schedule edits.
Snapshots appear only when the archive and manifest are complete. Concurrent backups get
separate names; failed archives do not appear as completed backups.

### Performance on every platform

The Performance tab records CPU and resident memory every ten seconds. Select a history range,
inspect the last run after stopping, or begin a fresh graph by restarting the server. CPU is
measured as a share of all machine cores; resident memory includes more than the Java heap.

### Structured CLI output and metrics export

The preferred command is `spawnloft`; `mcctl` remains compatible. Installed launchers
use the bundled runtime, with no separate Node installation needed.

```sh
spawnloft status survival --json
spawnloft plugins survival --json
spawnloft backups survival --json
spawnloft diagnostics survival --json
spawnloft metrics survival --follow --json
spawnloft metrics survival --csv --output survival-run.csv
```

See [CLI setup and JSON output](/reference/commands#preview-cli-setup) for launcher paths,
exit codes, JSON Lines streaming, and export rules.

### Managed databases

Open **Server → Settings → Create a database**. SpawnLoft downloads verified MySQL 8.4 LTS
binaries for your machine, initializes a private data directory, starts the database, and
creates scoped credentials for the server. No separate database installation is needed.
Managed start/stop, restart, and SQL backup/restore use the downloaded tools.

**Plugin configs stay manual.** Copy the connection details into each plugin's configuration
yourself. See [Databases](/guide/databases) for setup and existing connections.

## Reporting a problem

Include the version and source commit from **Settings → About**, your operating system and version, and your processor (x64 or arm64; Apple Silicon or Intel on a Mac). Describe the action, expected result and actual result. Never attach database passwords or private plugin configuration values.
