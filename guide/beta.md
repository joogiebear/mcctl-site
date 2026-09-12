---
title: Windows & Mac beta
description: Try the SpawnLoft development preview, with Mac setup, platform support, themes, CLI automation, and managed databases.
---

# Windows & Mac beta

The next version of SpawnLoft is being tested on Windows, Apple Silicon, and Intel Mac.
Each preview has separate installers built from the same development commit. Shared fixes
ship together after the packages pass their native checks.

::: info Stable and preview are separate
The main Windows download remains the stable release. Public macOS and Linux downloads
are **coming soon**. Mac is available for beta testing; there is no Linux desktop package yet.
This guide covers **v0.15.0-beta.21**, published September 11, 2026, and the work leading up to it.
:::

## Download the preview

Use the [beta.21 release and installation notes](https://github.com/joogiebear/spawnloft/releases/tag/v0.15.0-beta.21).
For later numbered previews, check [GitHub Releases](https://github.com/joogiebear/spawnloft/releases)
and read the notes for that build.

| Your machine | Choose this asset | Requirements |
| --- | --- | --- |
| Windows PC | `SpawnLoft-Setup-VERSION.exe` | Windows 10/11, x64 |
| Apple Silicon Mac | `SpawnLoft-VERSION-mac-arm64.dmg` | macOS 13 Ventura or later |
| Intel Mac | `SpawnLoft-VERSION-mac-x64.dmg` | macOS 13 Ventura or later |

All platforms need Java suitable for the Minecraft version you run. Managed MySQL on Mac
has a higher minimum: **macOS 15 or later**.

### Install on Mac

1. Check **Apple menu → About This Mac**. An Apple M-series chip needs the Apple Silicon build;
   an Intel processor needs the Intel build.
2. Quit SpawnLoft if it is open. Open the DMG and drag SpawnLoft into **Applications**,
   replacing the previous preview when updating. Application data lives outside the app.
3. Launch SpawnLoft and complete the Java check. Create a server or add an existing folder.

The beta is ad-hoc signed for testing and **not Apple-notarized**. If macOS blocks the first
launch, try opening the app once, then use **System Settings → Privacy & Security → Open Anyway**.
If it reports that the app is damaged, report the exact message with your macOS version and
build number. Mac updates are manual for now.

### Install on Windows

Run the preview's `.exe` installer. These development builds are unsigned, unlike signed
production builds, so SmartScreen may warn during a manual install.

Existing Windows beta installs continue to receive beta updates automatically. Stable installs
stay on the stable channel. The Mac preview does not change Windows update behavior.

## What changed

### Two app themes

Open **Settings → Appearance** and choose **Classic** for the original palette or **SpawnLoft**
for the look inspired by the website. Both themes are available in the Windows and Mac preview.

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
from the preview. See [Databases](/guide/databases) for setup and existing connections.

## Platform support in beta.21

| Capability | Windows beta | Mac beta |
| --- | --- | --- |
| Server controls, console, manual backup/restore | Available | Available |
| Classic and SpawnLoft themes | Available | Available |
| Live CPU and memory; CLI JSON/CSV | Available | Available |
| Managed SQL databases | MariaDB | MySQL 8.4 LTS on macOS 15+ |
| Managed Redis-compatible service | Garnet | Not yet available |
| Existing external MariaDB/MySQL/Redis connections | Available | Available |
| Scheduled tasks and automatic backups | Available | Not yet available |
| Automatic app updates | Existing beta channel | Manual installation for now |

## Help test the road to 1.0

Try setup, both themes, server creation, start/stop/restart, console commands, manual
backup/restore, database setup, and upgrading an existing install. Include the version and
commit from **Settings → About**, your OS version, and your Mac architecture in reports.

Mac scheduling, automatic backups, signing/notarization, and native automatic updates remain
follow-up work. Safe local plugin JAR deployment, required-plugin readiness checks, and an
automatic PATH setup option are proposed additions, not features in this preview.
