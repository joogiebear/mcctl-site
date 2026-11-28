---
title: "Letting an AI run your server without handing over the keys"
description: "SpawnLoft can let an AI assistant check on and run your Minecraft server. How the permissions work, what it never sees, and why the dangerous tools are off by default."
date: 2026-11-28
author: joogiebear
tags: [Design, AI]
lastUpdated: false
sidebar: false
aside: false
---

# Letting an AI run your server without handing over the keys

Letting an AI assistant near your server is a reasonable thing to want. It can read a crash, tell you which plugin is the problem, take a backup and apply an update, with you approving each change. It is also a reasonable thing to be careful about. Here is how SpawnLoft draws the lines.

## It is your assistant, and it stays on your terms

SpawnLoft does not include an AI, and it has no account for one. The AI app you choose launches `spawnloft mcp` on your machine and talks to it over standard input and output. There is no port to open and nothing sent on SpawnLoft's own initiative. If you use a model that runs on your own PC, nothing leaves it at all. With a hosted assistant, whatever a tool returns goes to that provider, which is why the guide lists exactly what a tool can return.

## Secrets are not in the results

RCON passwords, database passwords and Discord webhook URLs are left out of every result, and replaced with `[redacted]` if one shows up in console output. Passwords, tokens and API keys inside configuration files are redacted when read. Player IP addresses, which Paper prints on every join, show as `[ip hidden]` unless you turn that off. And a file read with hidden values can never be written back with a placeholder where the real value was: the tool refuses.

## Changes ask first, and leave a way back

Tools carry annotations, so the AI app knows which ones only read and which change something, and asks you before the second kind. Before a configuration file changes, it is snapshotted on its own, and restoring that snapshot puts back that one file. Installing a plugin takes a plugins snapshot first. **Activity** records what happened under the name the assistant's app gives, and a change with an exact copy has **Undo**.

## The dangerous ones are not offered

Restoring a backup over a server, killing a process without saving and moving to a new Minecraft version can all lose work. Unless you add the `--allow-destructive` option, the assistant is never shown them. With it on, each one describes what it would do and changes nothing until it is called again with a confirmation. Deleting a server, database credentials and settings that hold secrets are not available through the assistant at all.

## What this adds up to

An assistant can be useful for the dull, careful parts of running a server and most of what it changes can be put back. The exception is console commands, which run as you would type them and cannot always be undone. If that suits you, [connect one](/guide/connect-an-ai-assistant). The reference with every tool and limit is [AI assistants](/guide/ai-assistants).
