---
title: AI assistants
description: Let Claude Desktop, Claude Code or another MCP app check on and run your Minecraft servers. What it can do, how to set it up, and what the AI provider sees.
---

# AI assistants

::: info In the 1.3 betas
This arrives in SpawnLoft 1.3. Turn on **Settings → Updates → Get beta builds** to try it now.
:::

SpawnLoft can be driven by an AI app that speaks the [Model Context Protocol](https://modelcontextprotocol.io) (MCP), such as Claude Desktop or Claude Code. Ask in plain words, and the app does the rest:

> Start survival, tell me its TPS once it's up, back it up, then update Paper if there's a newer build and restart it.

You choose the app. SpawnLoft needs no account for this, opens no port, and sends nothing on its own: the AI app starts SpawnLoft's MCP server itself and talks to it privately on your machine. Your AI app asks you before each change.

## What it can do

**Look, without changing anything:** list your servers and their status; read the console, filtered to warnings and errors; explain why a server crashed, with the fix; show who is online and who is whitelisted, opped or banned; check TPS, tick times, CPU and memory; list and verify backups; list, search for and check updates to plugins; see whether Paper has a newer build; and check your computer for problems.

**Act, with your approval:** start, stop and restart a server; run a console command; take a backup; install or update a plugin, with a snapshot first; update Paper to its newest build for the same Minecraft version.

**Only if you allow it:** restore a backup, force-kill a server, or move to a newer Minecraft version. These are hidden from the AI unless you switch them on, and even then each describes what it would do and waits to be confirmed. Deleting a server is never offered.

## What the AI provider sees

**Read this before you connect a cloud AI app.** What SpawnLoft hands the app is sent to its model, which for Claude Desktop, Claude Code or any other hosted assistant means to its provider. That includes console lines (which can contain chat and player names), player names, plugin lists, server settings such as ports and memory, and crash summaries.

It never includes RCON passwords, database passwords or Discord webhooks: they are left out, and any that turn up in a console line are replaced with `[redacted]`. Players' IP addresses, which the console records on every join, are hidden unless you choose to show them.

A model running on your own computer, through LM Studio for example, keeps all of this on the machine.

## Setting it up

Open **Settings → AI assistants** in SpawnLoft. It shows the exact configuration for your install, with the right paths already filled in, and switches for the two options below. Copy it into your AI app:

- **Claude Desktop:** Settings → Developer → Edit Config. Paste the `spawnloft` entry under `mcpServers`, save, and restart Claude Desktop.
- **Claude Code:** run the command SpawnLoft shows in a terminal.
- **LM Studio** (0.3.17 or later): in the Program tab, choose Install → Edit mcp.json and paste the same entry as for Claude Desktop. Pick a model that is good with tools; small ones tend to call the wrong one.

On Linux, where `spawnloft` is on your path, Claude Code needs only:

```sh
claude mcp add --transport stdio --scope user spawnloft -- spawnloft mcp
```

### Options

| Switch in Settings | Adds | Effect |
| --- | --- | --- |
| Allow restoring backups, force-kill and Minecraft version upgrades | `--allow-destructive` | The AI is offered those three. Each still waits to be confirmed. |
| Show players' IP addresses | `--show-ips` | IP addresses in console lines are no longer hidden. |

## For developers

The server is `spawnloft mcp`: newline-delimited JSON-RPC over stdin and stdout, tools only, with progress notifications. It speaks the current `2026-07-28` protocol revision and the earlier handshake-based ones back to `2024-11-05`. Every tool returns a readable summary and structured data. The full tool list is in [MCP.md](https://github.com/joogiebear/spawnloft/blob/dev/MCP.md).
