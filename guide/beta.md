---
title: Windows & Mac releases
description: Download SpawnLoft 1.0 for Windows, Apple Silicon and Intel Mac. Platform support, automatic updates, and release channels.
---

# Windows & Mac releases

SpawnLoft 1.0 is the stable release for Windows, Apple Silicon and Intel Mac. Separate installers ship from the same source commit after native checks pass. Linux desktop downloads are **coming soon**.

<Download fine />

## Install on Mac

Choose Apple Silicon for an Apple M-series chip, or Intel for an Intel processor. Open the DMG and drag SpawnLoft into **Applications**. Both Mac builds are Developer ID signed, hardened, Apple-notarized and stapled. Follow the [Mac setup steps](/guide/getting-started#install-on-mac).

The app requires macOS 13+. Managed MySQL requires macOS 15+. Install Java appropriate for your Minecraft version.

## Install on Windows

Run the `.exe` installer on Windows 10 or 11, x64. Production installers are signed through Microsoft Azure Artifact Signing. Windows SmartScreen may still show a reputation warning for a new publisher; see [setup](/guide/getting-started#smartscreen).

## Automatic updates and beta installs

Current Windows stable and Windows/Mac beta installations can upgrade automatically to 1.0. The app downloads the update in the background and offers **Restart to update**. After moving to 1.0, the installation follows stable releases.

Older Mac previews without the native updater need one manual replacement in Applications. Server data, settings and manual plugin configurations live outside the app bundle.

Development previews remain separate from stable releases. Check [GitHub Releases](https://github.com/joogiebear/spawnloft/releases) and the notes for the exact build before installing a future beta. Stable installations are not offered prereleases.

## Platform support

| Capability | Windows x64 | Mac Apple Silicon / Intel |
| --- | --- | --- |
| Server controls, console, manual backup/restore | Available | Available |
| Classic and SpawnLoft themes | Available | Available |
| Live CPU and memory; CLI JSON/CSV | Available | Available |
| Managed MySQL 8.4 LTS | Available | macOS 15+ |
| Managed Redis-compatible service (Garnet) | Available | Available |
| Scheduled tasks and automatic backups | Available | Available through launchd |
| Signed installer and automatic app updates | Available | Available; Apple-notarized |

Plugin configuration remains manual. MySQL and Redis are the choices for new database services; MariaDB is no longer offered.

## Included in 1.0

### Two app themes

Open **Settings → Appearance** and choose **Classic** for the original palette or **SpawnLoft**
for the look inspired by the website. Both themes are available in the Windows and Mac releases.

### A cleaner console

ANSI escape sequences are stripped into clean, searchable text. Warning and error indicators
remain. Long lines scroll horizontally by default; switch on **Wrap** when you want them to
fit the panel.

### Backups that stay in sync

The Backups tab refreshes every four seconds while visible and when reopened, including after
a CLI-created backup. Refreshing preserves your selected scope and unsaved schedule edits.
Snapshots appear only when the archive and manifest are complete. Concurrent backups get
separate names; failed archives do not appear as completed backups.

### Performance on both Mac architectures

The Performance tab records CPU and resident memory every ten seconds on Windows, Apple
Silicon, and Intel Mac. Select a history range, inspect the last run after stopping, or begin
a fresh graph by restarting the server. CPU is measured as a share of all machine cores;
resident memory includes more than the Java heap.

### Structured CLI output and metrics export

The preferred command is now `spawnloft`; `mcctl` remains compatible. Installed launchers
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

### Managed databases on Mac

On **macOS 15+**, open **Server → Settings → Create a database**. SpawnLoft downloads verified
MySQL 8.4 LTS binaries for your Mac, initializes a private data directory, starts the database,
and creates scoped credentials for the server. No Homebrew or separate database installation
is needed. Managed start/stop, restart, and SQL backup/restore use the downloaded tools.

**Plugin configs stay manual.** Copy the connection details into each plugin's configuration
yourself. The former `db apply` command and panel config-writing controls have been removed
from the application. See [Databases](/guide/databases) for setup and existing connections.


## Reporting a problem

Include the version and source commit from **Settings → About**, your OS version, and your Mac architecture. Describe the action, expected result and actual result. Never attach database passwords or private plugin configuration values.
