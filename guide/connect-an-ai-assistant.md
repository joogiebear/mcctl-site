---
title: Connect an AI assistant to your server, safely
description: Let Claude Desktop, Claude Code or a local model check on your SpawnLoft server. Set it up from Preferences, know what leaves your PC, and keep the risky tools switched off.
---

# Connect an AI assistant to your server, safely

SpawnLoft can let an AI app you choose check on and run your servers: start one and wait for it, read the console, work out why it crashed, back it up, install plugins and edit plugin configuration files. It uses the Model Context Protocol, needs no account, and opens no port.

Two things to understand before you switch it on, and then the setup is a copy and paste.

## What leaves your PC

Everything an assistant reads is sent to the model behind it. With a hosted assistant such as Claude Desktop or Claude Code that means its provider. A model running on your own machine, for example through LM Studio, keeps everything local.

What the assistant can see includes console lines (which can hold chat and player names), player names and UUIDs, plugin names and server settings, and text configuration files. What it never sees: RCON and database passwords, Discord webhook URLs, passwords and tokens inside configuration files, and player IP addresses, which are shown as `[ip hidden]` unless you turn on the show-IPs option. The full tables are in [AI assistants](/guide/ai-assistants#what-the-ai-provider-sees).

## Set it up

1. Open **Preferences → AI assistants**. It shows the exact configuration for your install, with real paths.
2. Use the copy button for Claude Desktop or Claude Code, or follow the LM Studio notes in the [full guide](/guide/ai-assistants#setup).
3. For Claude Desktop, add the entry under `mcpServers` in **Settings → Developer → Edit Config** and restart it.

Nothing needs Node or an environment variable.

## Leave the risky tools off

By default an assistant is not even shown the destructive tools. `restore`, `kill` and `upgrade_minecraft` appear only if you add the `--allow-destructive` option (a tick box in **Preferences → AI assistants**, after which you copy the updated configuration into your AI app and restart it), and each one describes what it would do and changes nothing until it is called again with a confirmation. Deleting a server, database credentials and settings that hold secrets are not available at all.

Changes are marked, so your AI app asks before it makes one. A configuration file is snapshotted before it changes, and **Activity** records the change with the assistant's name so you can see what it did, and a configuration change has **Undo**.

## Things worth asking

> Start survival, tell me its TPS once it's up, back it up, then update Paper if there's a newer build and restart it.

> Why did survival crash last night?

> Which of my plugins have updates?

> Look at the Essentials config and tell me what the home limits are.

## A sensible way to start

Ask for read-only things first, then a backup, and watch **Activity**. When you trust the shape of what it does, let it install a plugin on a [clone](/guide/try-it-safely) before it touches the real server.
