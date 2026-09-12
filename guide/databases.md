---
title: Databases
description: Create or attach a database for your Minecraft server while keeping plugin configuration manual.
---

# Databases

SpawnLoft can create a database for a Minecraft server or connect it to a database you
already run. It provides connection details; **you configure your plugins yourself**.

::: info Development preview
This page describes [beta.21](/guide/beta). Managed Mac installation and the removal of
plugin config-writing helpers belong to the development preview, not the current stable release.
:::

## Create a database

Open your server's **Settings** and choose **Create a database**. SpawnLoft downloads the
engine when needed, creates a private database folder, starts the database, and assigns
the server its own database and user credentials.

| Platform | Managed engine |
| --- | --- |
| Windows | MariaDB for SQL; Garnet for a Redis-compatible service |
| macOS 15+ | MySQL 8.4 LTS for SQL, on Apple Silicon and Intel |
| macOS 13–14 | Use an existing external database; managed MySQL requires macOS 15+ |

The Mac download is checksum-verified and stored in SpawnLoft's engine store. You do not
need Homebrew, a system service, or a separate MySQL installation. Existing databases are
not silently moved to another engine or version. Managed Garnet is not available on Mac yet.

## Configure each plugin manually

Copy the host, port, database name, username, and password from the connection details into
the plugin's own config using that plugin's documentation. Restart or reload the plugin
as its author instructs, then check the server console for connection errors.

SpawnLoft does not detect plugins and inject database credentials into their configs.
The preview removes `db apply` and the panel's config-writing controls. Existing plugin
files are left unchanged. A created database is not proof that a plugin is using it;
verify the plugin's behavior after configuring it.

## Use the command line

After [setting up the preview launcher](/reference/commands#preview-cli-setup):

```sh
# Create, start, and attach a database for this server.
spawnloft db create survival

# Or create a standalone database and attach it explicitly.
spawnloft db add testdb
spawnloft start testdb
spawnloft db attach testdb survival

# Show the connection details again for this attachment.
spawnloft db creds testdb survival
```

Choose one creation route. `db create` defaults to MariaDB on Windows and MySQL on Mac.
Credential output contains passwords: keep it private and out of shared logs.

## Connect to an existing database

Existing external MariaDB, MySQL, and Redis connections remain available. External services
keep their own installation and lifecycle; SpawnLoft does not start or stop them.

For SQL operations, Mac tool discovery checks the managed engine store, Homebrew install
locations, `/usr/local/mysql`, and PATH. If the required MySQL tools are not found, supply
the tools directory with `spawnloft db connect ... --tools <folder>`. See
`spawnloft help` for the connection commands.

## Back up and verify

Managed SQL backup/restore uses the engine's tools. Review backup results for skipped database
dumps or warnings, especially in automation: a completed server archive does not guarantee
every optional database dump succeeded. Verify both the server files and the plugin's data
when testing a restore.
