---
title: Get Discord alerts when your server crashes
description: Send SpawnLoft crash, recovery and failed-task alerts to a Discord channel with a webhook. How to make the webhook, set it on a server, and keep the URL private.
---

# Get Discord alerts when your server crashes

A webhook lets SpawnLoft post a message to a Discord channel when something needs your attention, so you find out about a crash before your friends tell you.

## What it sends

A per-server webhook reports **crashed**, **recovered**, **gave up** and **failed scheduled-task** events. Routine starts and stops stay quiet, so the channel is not noise. A scheduled `verify` that fails reports here too.

## 1. Make the webhook in Discord

You need permission to manage webhooks in the channel.

1. In Discord, open the channel's settings (the gear beside its name), then **Integrations**, then **Webhooks**.
2. Choose **Create Webhook** (or **View Webhooks → New Webhook** if the channel already has one), then click the new webhook to name it and pick the channel.
3. Choose **Copy Webhook URL**.

A private channel only you (and any co-admins) can see is a sensible home for it.

## 2. Give it to the server

```sh
spawnloft set survival webhook=<your Discord webhook URL>
```

Turn it off again with `spawnloft set survival webhook=off`.

Pair it with crash recovery, so a crash both restarts the server and tells you. See [Make a server restart itself after a crash](/guide/crash-recovery).

## Keep the URL private

Anyone with the webhook URL can post to that channel. SpawnLoft treats it as a secret: it is left out of diagnostics, structured `--json` status and everything an AI assistant can see. Do the same: do not paste it into a bug report or a screenshot. If it leaks, delete the webhook in Discord and make a new one.

The URL is stored in your data folder, which is on your own disk. See [Security](/guide/security).

## When nothing arrives

Check that the URL was copied in full, that the webhook still exists in Discord, and that your PC can reach Discord. Stopping the server yourself never sends one: requested stops are not crashes.
