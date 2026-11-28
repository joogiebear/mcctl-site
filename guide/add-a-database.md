---
title: Add a database for a plugin
description: Create a MySQL or Redis database for a SpawnLoft server with one click, copy the connection details into your plugin, and keep it backed up. No separate install needed.
---

# Add a database for a plugin

Some plugins want a database for things like economy, claims or logs. SpawnLoft can create one for your server, or attach one you already run. It gives you the connection details, and you put them into the plugin yourself.

## Create one

Open the server's **Settings** and choose **Create a database**. SpawnLoft downloads the engine if it needs to, creates a private database folder, starts it, and gives the server its own database and user, on the port after the game port.

From a terminal:

```sh
spawnloft db create survival
```

It defaults to MySQL on Windows, macOS 15 or later and Linux x64. For a Redis-compatible service, or on the systems in the table below that have no managed MySQL, add `--engine garnet`.

| System | What you get |
| --- | --- |
| Windows | MySQL 8.4 LTS and a Redis-compatible service (Garnet) |
| macOS 15 or later | MySQL 8.4 LTS and Garnet |
| macOS 13 or 14 | Garnet, or an external SQL database |
| Linux x64 | MySQL 8.4 LTS and Garnet |
| Linux arm64 | Garnet, or an external SQL database |

You do not need Homebrew, a system service or a separate MySQL install, and downloads are checksum-verified.

## Give the plugin its details

SpawnLoft does not detect plugins or write credentials into their configuration. Show the credentials in **Settings → Databases** (or `spawnloft db creds <db> <server>`) and copy the host, port, database name, username and password into the plugin's own config, following that plugin's documentation. Restart or reload the plugin as its author says, then check the console for connection errors.

The credentials include a password, so keep them out of screenshots and shared logs.

## It stays local

A database listens on `127.0.0.1` only, and the user a server gets can reach its own database and nothing else. Databases sit beside servers in the panel, with a console, start, stop, restart and crash recovery.

## Back it up

A `standard` or `full` snapshot of a server with an attached database includes a dump of it, and restoring imports it back into the database it came from, which has to be running. A MySQL database also has its own **Backups** tool with downloadable SQL dumps. A completed server archive does not guarantee every optional dump succeeded, so check the result and test a restore, covering both the server files and the plugin's data. See [Backups](/guide/backups#databases).

## Use one you already run

You can attach an external MySQL or Redis service with `spawnloft db connect`. It keeps its own installation and lifecycle, and SpawnLoft does not start or stop it. See [Databases](/guide/databases#connect-to-an-existing-database).
