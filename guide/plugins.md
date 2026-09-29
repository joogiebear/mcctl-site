---
title: Plugins and mods
description: Find, install, update, disable and inventory plugins and mods on a SpawnLoft server, and what SpawnLoft does and does not manage.
---

# Plugins and mods

The **Plugins** tool (**Mods** on Fabric and NeoForge servers) installs and updates what a server can load. The tool follows the server software; see [server software](/reference/servers#plugins-follow-the-software) for what each one searches.

## Install a plugin

1. Open the server and choose **Plugins**.
2. Search by name. Results from Modrinth and Hangar appear together, each naming its source.
3. Choose **Install**. SpawnLoft takes a plugins snapshot first, downloads the file, and verifies its checksum.
4. Restart the server. Installs take effect at the next start.

| Behavior | Detail |
| --- | --- |
| Compatibility | Results are filtered or checked against the server's Minecraft version. On modded servers, search shows the loader's whole ecosystem, and a mismatched build installs with the author's version claim stated. |
| Verification | Modrinth and Hangar downloads are checksum-verified (sha256 for Hangar). |
| Hangar external downloads | Projects that host their downloads elsewhere, including premium plugins, are linked to rather than installed. |
| Snapshot | A plugins-scope snapshot is taken before every install and update. |

## Update plugins

**Check for updates** compares each plugin SpawnLoft installed against its source: by file hash for Modrinth, and by version name for Hangar. Update one plugin, or update everything found behind a single snapshot and restart.

To restore the previous version, restore that snapshot from the **Backups** tool. See [Backups](/guide/backups).

## What SpawnLoft manages

SpawnLoft records provenance for what it installs, in the plugins folder. The panel manages **only** those plugins.

| Plugin | In the panel | Offered updates | Hash sent to a service |
| --- | --- | --- | --- |
| Installed by SpawnLoft | Listed and managed | Yes | Yes, to check for updates |
| Added by hand (custom, premium, self-built) | Listed, unmanaged | No | Never |

`spawnloft plugins <name>` lists the full inventory with a source column that separates the two.

## Enable and disable

**Disable** renames the jar in place, so a disabled plugin keeps its position and its configuration folder. **Enable** renames it back. From a terminal: `spawnloft plugins <name> disable <plugin>`.

## Change plugin settings

SpawnLoft does not edit plugin configuration in the panel. Edit the files in the server's `plugins/<Plugin>/` folder with an editor, or ask an [AI assistant](/guide/ai-assistants#configuration-file-access) to change them: it reads the file, changes the lines it means to, and snapshots the file first. Passwords and tokens in those files are hidden from the assistant and cannot be changed through it.

## Plugins that need a database

Create a database from **Settings → Create a database**, then copy its connection details into the plugin's own configuration. SpawnLoft never writes them for you. See [Databases](/guide/databases).

## When a plugin fails

The console strip under the server's name names known causes: a missing dependency, two plugins claiming the same name, a missing Java. See [Troubleshooting](/guide/troubleshooting).
