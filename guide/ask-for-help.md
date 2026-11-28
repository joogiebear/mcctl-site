---
title: How to ask for help with a server problem
description: Get a useful answer faster. What to collect from SpawnLoft before you ask, how to share a console log safely, and where to report a bug or ask a question.
---

# How to ask for help with a server problem

People can help you much faster when they can see what you see. SpawnLoft collects most of it for you. This takes a few minutes and gets a good answer the first time.

## 1. Read what SpawnLoft already says

The strip under the server's vitals names failures SpawnLoft recognises, such as a missing dependency, a taken port, too little memory or the wrong Java. The [troubleshooting guide](/guide/troubleshooting) covers each one. From a terminal, `spawnloft why <name>` gives the likely cause of a failed start.

## 2. Collect the facts

- **What you did and what you expected.** "I installed X and restarted, and expected Y."
- **The console.** Filter it to **Errors**, which keeps a stack trace together with the line that started it, and copy that part.
- **Your setup.** The server software and Minecraft version, how much memory it has, and which plugins or mods are installed.

**Preferences → Copy diagnostics** gathers the version, Java, locations, every server's status, the panel log and the last console lines of the selected server. It never includes an RCON password or a webhook URL.

## 3. Share the log without sharing secrets

The console's **Export** saves a `.log` file beside the server's snapshots, or uploads to [mclo.gs](https://mclo.gs), a log-sharing site, after a dialog that says what is in it. A console log can contain chat and player names, so read it before posting, and do not paste passwords, tokens, webhook URLs or database credentials anywhere. Player IP addresses appear in Paper's console on every join, so strip them from anything public.

## 4. Ask in the right place

**Preferences → Feedback** has three doors:

| You have | Choose |
| --- | --- |
| Something that is broken | **Something broke**, which opens a GitHub bug report with the version, Java, server status and panel log filled in, and puts full diagnostics on your clipboard |
| A question | **A question**, which opens the Q&A discussions |
| An idea | **An idea**, which opens the Ideas discussions |

SpawnLoft sends nothing itself. Opening the browser page is your consent, and you can edit anything before you post.

## If the problem is a plugin

Plugin problems usually belong to the plugin's author. Include the plugin's name and version, the server software and Minecraft version, and the error from the console. Try to reproduce it on a [clone](/guide/try-it-safely) first, so you can say whether it happens on a clean server.
