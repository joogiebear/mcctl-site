---
title: SpawnLoft command line basics
description: The few spawnloft commands most people use, from creating and starting a server to backups, scheduled tasks and clones, and how to get the command on your PATH.
---

# SpawnLoft command line basics

Most of what the panel does is also a command. You never have to use them, but a handful are worth knowing, especially for scripts, servers with no screen and when someone asks you to "run this and paste the output". The full list is in the [command reference](/reference/commands).

## Get the command

| Install | Command |
| --- | --- |
| Windows desktop | `spawnloft`, after opening a new terminal following the install |
| macOS desktop | Add `/Applications/SpawnLoft.app/Contents/Resources/bin` to your `PATH` |
| Linux desktop or `spawnloft-cli` | `spawnloft` is at `/usr/bin/spawnloft` |

`mcctl` works too and takes the same arguments, so older scripts keep working. `spawnloft help` shows usage.

## Daily use

```sh
spawnloft list                      # every server and database, with status
spawnloft start survival            # waits until the server is ready
spawnloft stop survival             # graceful, saves the world
spawnloft restart survival
spawnloft cmd survival "list"       # one console command, reply printed
spawnloft logs survival             # the console
spawnloft backup survival           # a snapshot, safe while running
```

A failed `start` prints the last 25 console lines and the likely cause. `spawnloft why survival` says what went wrong.

## Creating and changing

```sh
spawnloft new survival --paper 1.21.4 --accept-eula
spawnloft set survival memory=6G
spawnloft set survival auto-restart=on
spawnloft clone survival scratch
spawnloft rm scratch --purge --yes
```

`--accept-eula` means you accept Minecraft's EULA, so read it before using the flag.

## Plugins, backups and schedules

```sh
spawnloft plugins survival                       # what is installed
spawnloft verify survival --all                  # read every backup end to end
spawnloft restore survival --yes                 # latest snapshot, server stopped
spawnloft task add survival --do backup --daily 03:00
```

## For scripts

Add `--json` to `list`, `status`, `plugins`, `backups`, `why`, `doctor`, `backup` or `metrics` to get structured output. `status` leaves out RCON and database passwords, webhook URLs and JVM arguments. `why --json` includes console lines, which can contain plugin output, so review them before sharing.

## The panel from a terminal

`spawnloft ui` opens the panel in your browser, already signed in, and prints a one-use link. `spawnloft ui --link` makes a new one. See [The panel](/guide/panel).
