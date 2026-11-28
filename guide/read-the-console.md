---
title: Read a Minecraft server console and find what went wrong
description: Search and filter the console, follow a stack trace, let SpawnLoft name the likely cause, and export the log or a diagnostics zip when you need help. A practical way to read a server error.
---

# Read a Minecraft server console and find what went wrong

A console is a wall of text until you know where to look. Most failures are one line near the first error, and SpawnLoft can often name the cause for you.

## Look at the right part

In the **Console** tab:

- **Filter** to warnings or errors to hide the routine lines. A stack trace takes the level of the line above it, so filtering to errors shows the whole failure and not just its first line.
- **Search** for a plugin or player name to see only what mentions it.
- A coloured rail in the gutter marks the level of each line, so `ERROR` stands out without the text being recoloured.
- **Pause** stops the scroll while you read; **Wrap** fits long lines on screen.

Read from the **first** error, not the last. Later errors are usually the same problem repeating or a consequence of it.

## Let SpawnLoft name the cause

SpawnLoft recognises the common failures: a port already in use, an EULA not accepted, the wrong Java, running out of memory or disk, a plugin or mod missing a dependency, two copies of one plugin, a damaged world, a ticking crash, a watchdog stall and a missing jar. When it sees one, the explanation and the fix show in the panel under the server's vitals, on a failed `spawnloft start`, and in a crash alert if you use [Discord alerts](/guide/discord-alerts). You can ask directly:

```sh
spawnloft why survival
```

[Troubleshooting](/guide/troubleshooting) lists each recognised failure with its fix.

## Crash reports

When Minecraft writes its own crash report, SpawnLoft shows it beside the findings, with its description line and a way to open the folder. The description line is usually the clearest single sentence about what happened.

## Check the machine too

If the console looks fine but something is off, `spawnloft doctor` checks Java, `tar`, each server's folder, jar, EULA, port collisions, RCON exposure and disk use.

## When you need to ask someone

Do not paste screenshots of a scrolling console. Use one of these:

- **Export** in the console saves a `.log` file, or uploads it to mclo.gs after a dialog that says what the file contains. Your account name is removed from file paths first.
- `spawnloft diag survival` writes one zip with the console, the daemon log, crash reports, `server.properties` with secrets removed, and the known-problem findings, for a bug report.

[Ask for help](/guide/ask-for-help) covers what else to include and where to post.
