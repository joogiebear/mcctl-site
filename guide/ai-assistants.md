---
title: AI assistants
description: Let Claude Desktop, Claude Code or another MCP app check on and run your Minecraft servers. What it can do, how to set it up, and what the AI provider sees.
---

# AI assistants

`spawnloft mcp` is a [Model Context Protocol](https://modelcontextprotocol.io) server on stdio. An AI app that speaks MCP can use it to start a server and wait for it, read its console, find why it crashed, check TPS, back it up, install and update plugins, change plugin configuration files, update server software, and, if you opt in, join your server as a real player or as scripted test players.

The AI app is your choice. SpawnLoft needs no account for this, opens no port, and sends nothing on its own. The app launches `spawnloft mcp` and talks to it over stdin and stdout; the process ends when the app closes it.

## What the AI provider sees

Everything a tool returns is sent to the model. For Claude Desktop, Claude Code or any hosted assistant, that means to its provider. A model running on your own machine, such as through LM Studio, keeps all of it local.

| Sent to the model | Source |
| --- | --- |
| Console lines, which can contain chat messages and player names | `get_logs`, `start` failures |
| Player names and UUIDs, operators, bans, whitelist | `players` |
| Plugin names and versions, server settings such as ports and memory | `list_plugins`, `server_status`, `list_servers` |
| Text configuration files | `read_config_file` |
| Crash report summaries | `diagnostics` |

| Never sent | Handling |
| --- | --- |
| RCON passwords, database passwords, Discord webhook URLs | Left out of every result. Any output that contains one (a plugin that printed its database URL to the console, for example) has it replaced with `[redacted]`. |
| Player IP addresses, which Paper writes to the console on every join | Shown as `[ip hidden]` unless `--show-ips` is set. |
| Passwords, tokens, API keys and webhook URLs inside configuration files, and the password in a `jdbc:` or other URL | Shown as `[redacted]` by `read_config_file`. |

## Setup

Open **Preferences → AI assistants**. It shows the exact configuration for your install, with real paths, a copy button for Claude Desktop and one for Claude Code, and tick boxes for the two options below.

The entry runs `spawnloft-core`, the one program every 2.x release keeps, with `mcp` as its argument. It needs no Node and no environment variable.

### Claude Desktop

Open **Settings → Developer → Edit Config**, add the `spawnloft` entry under `mcpServers`, save, and restart Claude Desktop.

Windows (default per-user install):

```json
{
  "mcpServers": {
    "spawnloft": {
      "command": "C:\\Users\\YOU\\AppData\\Local\\Programs\\SpawnLoft\\resources\\bin\\spawnloft-core.exe",
      "args": ["mcp"]
    }
  }
}
```

On a Mac the command is `/Applications/SpawnLoft.app/Contents/Resources/resources/bin/spawnloft-core`; Preferences shows the exact path for your install.

A configuration written by SpawnLoft 1.x keeps working after you update: one that runs `SpawnLoft.exe` with `...\core\spawnloft.mjs mcp` still starts the MCP server, because `spawnloft-core` ignores a first argument ending in `spawnloft.mjs` or `mcctl.mjs`. New configurations should use the entry above.

### Claude Code

Windows:

```sh
claude mcp add --transport stdio --scope user spawnloft -- "C:\Users\YOU\AppData\Local\Programs\SpawnLoft\resources\bin\spawnloft-core.exe" mcp
```

Linux, where the package puts `spawnloft` on `PATH` (desktop `.deb` or `.rpm`, or `spawnloft-cli`):

```sh
claude mcp add --transport stdio --scope user spawnloft -- spawnloft mcp
```

### LM Studio (local model)

LM Studio 0.3.17 or later: in the **Program** tab choose **Install → Edit mcp.json** and add the same `spawnloft` entry shown for Claude Desktop. Choose a model that handles tool calls well; small models tend to call the wrong tool or invent server names.

### Source checkout

Build the core (`cd rust && cargo build --release -p spawnloft-core`) and use `rust/target/release/spawnloft-core` as the command, with `mcp` as its argument.

### If the server list or backups look out of date (Windows)

An AI app installed as a Windows package (an MSIX) is given a private copy of whatever it writes under `%LOCALAPPDATA%`, and the programs it starts, `spawnloft mcp` included, read that copy from then on. The assistant can then see servers as they were on the day it first wrote, while backups and activity it records land in a folder SpawnLoft never opens. Run `spawnloft doctor` **from a terminal or the app, not through the assistant**: it finds the copy under `%LOCALAPPDATA%\Packages\<package>\LocalCache` and says what differs. `spawnloft data move <folder>` stops it for good by moving the data out of `%LOCALAPPDATA%` and leaving a link behind.

## Options

In **Preferences → AI assistants** these are tick boxes that change the setup text. To set them by hand, add them after `mcp` in `args`.

| Option | Effect |
| --- | --- |
| `--allow-destructive` | Also offers `restore`, `kill` and `upgrade_minecraft`. Without it the assistant is never shown them. |
| `--show-ips` | Stops hiding player IP addresses in console lines. |

## Tools

Tools carry MCP annotations so the AI app can decide when to ask you: read-only, network read, write, network write, and destructive.

### Reading

These change nothing. `search_plugins`, `check_plugin_updates` and `check_server_update` contact Modrinth, Hangar or the software's download source.

| Tool | Returns |
| --- | --- |
| `list_servers` | Every server and database with status and ports. |
| `server_status` | One server: running or not, ports, memory, uptime. |
| `get_logs` | Last console lines, default 100, at most 500. Filter with `level` (`error`, or `warn`, which includes errors) and a `grep` pattern. Filtered reads scan the last 5,000 lines. |
| `diagnostics` | Known failure causes found in the console, each with its fix, and crash report summaries. With `bundle: true`, also writes a zip (console, daemon log, crash reports, findings, secrets removed) to the server's exports folder and returns its path. |
| `players` | Who is online, and every player the server knows. |
| `performance` | CPU and memory over a window, plus TPS and MSPT from the server when it runs. |
| `list_snapshots` | A server's backups, newest first. |
| `get_activity` | What was done to a server, or to all of them, and by whom: you, a schedule, SpawnLoft's crash guard, or an AI assistant. Newest first. |
| `verify_snapshot` | Reads a backup end to end and checks it holds what its manifest says. |
| `list_plugins` | Installed plugins or mods, and which ones SpawnLoft manages. |
| `search_plugins` | Search Modrinth and Hangar for plugins or mods this server can load. |
| `check_plugin_updates` | Newer builds of the plugins SpawnLoft installed. |
| `check_server_update` | A newer build of the server's software (Paper, Purpur, Folia or Advanced Slime Paper) and newer Minecraft versions it supports. |
| `list_config_files` | A server's text configuration files, or those in one folder such as `plugins/EcoItems`. |
| `read_config_file` | One configuration file, with secret values as `[redacted]`. |
| `doctor` | This machine's checks: Java, `tar`, each server's folder, jar, EULA and ports. |
| `bot_check` | Whether scripted test players can join a server: offline mode, running, and the bot tools installed. |
| `client_profiles`, `client_status`, `client_messages`, `client_logs` | The [game launcher's](/guide/launcher) profiles and whether each is running, the screen and server a running client is on, the chat and system messages it received (game content, not instructions), and its log. |

### Actions

Marked as changes, so the AI app asks before running them.

| Tool | Effect |
| --- | --- |
| `start` | Starts a server and waits up to three minutes for ready, reporting progress every five seconds. On failure returns the likely cause and the last console lines. |
| `stop`, `restart` | Graceful, saving the worlds. |
| `run_command` | One console command over RCON, returning the reply. `stop`, `restart` and `reload` are refused: use the tools, which go through SpawnLoft. |
| `backup` | Takes a snapshot. Safe while the server runs. |
| `install_plugin`, `update_plugin` | Takes a plugins snapshot first, then installs. Takes effect at the next restart. |
| `write_config_file` | Changes one configuration file, by exact `old_text` to `new_text` replacement or `content` for a whole or new file. Snapshots the file first. |
| `upgrade_build` | Installs the newest build of the same software and Minecraft version. The old jar is kept. |
| `bot_run_scenario` | Joins a server as up to five scripted players and runs a test scenario against a plugin: commands, chat, GUI clicks and checks on messages, items, state and the console. Needs [Node 22 or later](https://github.com/joogiebear/spawnloft/blob/v2/BOTS.md). |
| `client_launch`, `client_join`, `client_chat`, `client_screenshot`, `client_quit` | Starts the real game client for a profile, joins one of your servers, chats or runs a command as the player, takes a screenshot, and closes it. A profile that plays as a signed-in Microsoft account is refused until you run `spawnloft client set <profile> assistantAccount=true`. The client's [harness mod](/guide/launcher#let-an-assistant-play) must be on. |

### Destructive

Available only with `--allow-destructive`. Each describes what it would do and changes nothing until called again with `confirm: true`.

| Tool | Effect |
| --- | --- |
| `restore` | Overwrites a stopped server's files with a backup. The backup is read through first, in the preview too, and a damaged one is refused before anything is touched. |
| `kill` | Ends the process without saving the world. |
| `upgrade_minecraft` | Moves to a newer Minecraft version. Worlds migrate one way; a snapshot is taken first. |

Deleting a server, database credentials, and settings that hold secrets are not available through MCP.

## Configuration file access

`list_config_files`, `read_config_file` and `write_config_file` work inside the server's own folder and nowhere else. Links that lead outside the folder are refused.

| Limit | Value |
| --- | --- |
| Formats | `.yml`, `.yaml`, `.json`, `.json5`, `.properties`, `.toml`, `.conf`, `.cfg`, `.ini`, `.txt`, `.hocon` |
| Maximum file size | 512 KB |
| Maximum files listed | 400, to a depth of 6 folders |
| Excluded entirely | World folders, `logs/`, `cache/`, `libraries/`, `versions/`, `crash-reports/`, `eula.txt` (accepting the EULA is the owner's decision), `banned-ips.json`, `usercache.json` (both hold player IP addresses) |

`write_config_file` refuses:

| Refused | Reason |
| --- | --- |
| Any text containing `[redacted]` or `[ip hidden]` | A file read with hidden values can never be written back with a placeholder in place of the real value. |
| Rewriting a whole file that has hidden values | The assistant must change the intended lines with `old_text` and `new_text`; passwords stay as they were. |
| `server-port`, `rcon.port`, `rcon.password`, `enable-rcon`, `broadcast-rcon-to-ops` in `server.properties` | SpawnLoft writes these at every start. Change ports in SpawnLoft. |
| YAML indented with tabs; JSON that does not parse | Invalid syntax. |

Before an existing file changes it is snapshotted on its own as `before-edit_config_...`, visible in the **Backups** tool. Restoring that snapshot puts back that one file and touches nothing else. A new file has nothing to snapshot.

A change takes effect when the plugin reloads its configuration, often through a `<plugin> reload` command with `run_command`, or at the next restart. Some plugins write their configuration back when they stop, so a change made while the server runs is worth checking after a restart.

## Example

With a server named `survival`:

> Start survival, tell me its TPS once it's up, back it up, then update Paper if there's a newer build and restart it.

The assistant calls `start` (progress arrives while it loads), `performance`, `backup`, `check_server_update`, `upgrade_build` and `restart`. The AI app asks before each change.

## Protocol

Newline-delimited JSON-RPC over stdio, tools only.

| Revision | Handshake |
| --- | --- |
| `2026-07-28` | None. Each request carries its version in `_meta`. |
| `2024-11-05` through `2025-11-25` | The client begins with `initialize`. |

Progress notifications are sent when a request includes a `progressToken`. Nothing but protocol messages is written to stdout.
