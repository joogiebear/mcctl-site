---
description: "What the SpawnLoft desktop app adds around the panel: a native folder picker, first-run setup, appearance themes, signed automatic updates and a way back."
---

# The desktop app

A window around the [panel](/guide/panel), plus a native folder picker, first-run setup and update checking. In 2.0 the window is a Tauri 2 shell that uses your system's web view (WebView2 on Windows, WebKit on Mac and Linux) around the same panel the browser gets. There is no bundled browser and no Node inside it.

SpawnLoft runs on Windows, Apple Silicon Mac, and Linux. See [downloads and platform support](/guide/beta).

## Preferences

The gear in the header opens **Preferences**.

| Item | What it does |
| --- | --- |
| **Appearance** | **SpawnLoft** (charcoal, warm white and lime, the default) or **Classic**, the original blue palette. The choice is saved on this computer and applies at once. |
| **Interface size** | Desktop app only. **Auto** fits the screen; 80% to 200% overrides it. Ctrl and + or −, and Ctrl 0 for 100%, work too. |
| **Where SpawnLoft keeps things** | Where servers, the jar store and backups live. Changing it affects servers created from now on. |
| **Updates** | **Check now**, **Get beta builds**, **Reinstall a previous version** and the update log. |
| **AI assistants** | The exact setup text for this install. See [AI assistants](/guide/ai-assistants). |
| **About** | The version and the exact commit the build came from, so a bug report can name a build rather than a version several builds could share. |
| **Feedback**, **Copy diagnostics** | See [The panel](/guide/panel#preferences). |

## First run

On first run SpawnLoft checks for Java before it downloads anything. If none that fits is installed, it says so and offers **Get Java**; the header keeps a **Java** pill until it is fixed.

## Closing the window does not stop your servers

Servers are detached processes that do not belong to the app. Close the window, sign back in later, and they are still running with their consoles intact. Each is looked after by a small supervisor that keeps running while the app updates or restarts.

## Terminal commands

Packages include `spawnloft` and `mcctl` launchers, and the same native program serves both, so no separate Node is needed. On Windows the installer puts them on your `PATH`. See [CLI setup](/reference/commands#preview-cli-setup).

## Updates

SpawnLoft checks for new releases 20 seconds after startup and every six hours while it is open, and downloads a newer one in the background. When one is ready, the header button reads **Restart to update**. Every update is verified against SpawnLoft's own signing key before it installs.

The app waits for you to restart before replacing the running version. Closing the app with an update waiting also applies it on exit. Running servers survive either way: only the app window restarts. A background check that fails stays quiet; one you pressed answers either way. If an update fails to install, SpawnLoft tries again the next time you quit, and `update.log` in the SpawnLoft settings folder says why.

On Linux the package manager installs updates: the app downloads and verifies the package and shows the `apt` or `dnf` command to run.

To follow the betas between releases, turn on **Preferences → Updates → Get beta builds**; see [automatic updates and beta builds](/guide/beta#automatic-updates-and-beta-builds). **Reinstall a previous version** in the same place goes back to an earlier 2.x release and pauses updates until you resume them.

## Signed builds and SmartScreen

Windows releases are signed under a validated publisher identity, which is what turns "Unknown publisher" into a name in the install prompt.

Mac builds are Developer ID signed with hardened runtime, Apple notarization and a stapled ticket. The DMG is for Apple Silicon.

Signing does not make SmartScreen go away immediately. SmartScreen is a reputation system, not a signature check, and reputation accrues through real installs, so a new publisher still gets warned about. **More info → Run anyway** is the way past it until the reputation builds.

## Uninstalling

On Windows, the uninstaller removes the program and asks one question: whether to delete your servers, worlds, backups, downloaded jars and settings too. The default is no, so uninstalling to reinstall loses nothing. Either way it first stops every running server and removes every scheduled task, since a task left behind would keep firing at a program that is gone. An update never does any of this.

Choosing yes deletes only what SpawnLoft created. A server you added from an existing folder stays where it is, and a data folder shared with other files loses only SpawnLoft's own folders. If you keep backups in a folder you chose, only the files SpawnLoft wrote there are removed.

The terminal equivalent is `spawnloft uninstall --yes [--data]`. **On Mac and Linux there is no uninstaller of this kind**: run that command first, then drag the app to the Trash (Mac) or remove the package (Linux, see [Removing it on Linux](/guide/beta#uninstall-linux)), because the system cannot stop your servers or remove your scheduled tasks for you.

## Where things live

The data folder holds the registry of servers, the servers SpawnLoft created, the jar store, backups and per-server runtime state. **Preferences** can move it. Servers you added from a folder you already had keep living wherever they are; only their runtime state lands in the data folder. See [How it works](/guide/how-it-works#where-data-lives).
