---
title: "Six SpawnLoft features that are easy to miss"
description: "Activity undo, clones, locked backups, leave-out lists, chained schedules and the Needs attention row. Quiet features in SpawnLoft that save a bad evening."
date: 2026-11-28
author: joogiebear
tags: [Guide, Features]
lastUpdated: false
sidebar: false
aside: false
---

# Six SpawnLoft features that are easy to miss

Some of SpawnLoft's most useful features do not announce themselves. Here are six worth knowing about.

## 1. Undo in Activity

The **Activity** tab records what was done to a server, when, and by whom: you in the app or a terminal, a scheduled task by name, an AI assistant by the name its app gives, or SpawnLoft itself. A change that kept an exact copy of what it changed, such as a file edit, a replaced file or an assistant's configuration change, has an **Undo** button.

## 2. Clones

`spawnloft clone survival scratch` makes a disposable copy of your plugins and configuration on its own port, with a fresh world, or with your world if you add `--with-worlds`. It is the right place to try a risky plugin or a version upgrade. [Try before you trust](/blog/try-before-you-trust) has the habit.

## 3. Locked and annotated backups

A snapshot can be **locked**, so neither Delete nor a schedule's retention removes it, and given a **note** like "before the 1.21 upgrade". Lock the ones you would hate to lose.

## 4. A leave-out list

Each server has a list of paths, with `*` wildcards, that every backup of it skips, such as a dynmap tile cache. The manifest records what was left out, so you can tell a deliberate gap from a mistake.

## 5. Chained schedule tasks

A task can be several steps in order: tell the players, count down, back up, verify, stop, start. A step waits for the one before it, and a step that fails stops the rest unless the task says to keep going. There are ready-made chains for a restart with a countdown and a backup first. See [Schedule restarts and backups](/guide/schedule-restarts-and-backups).

## 6. The Needs attention row

On **Overview**, a **Needs attention** row collects what wants doing, each with the button that fixes it: a server that crashed or was restarted by crash guard today, plugin updates found by the last check, a server never backed up or not backed up in a week, and a Java too old to start a server. It is a good thing to glance at before a session.

## A bonus: it remembers where you were

Each server remembers which tool you left open, and the console keeps streaming while another tool is open. On a wide window (1600 px and up) the console keeps a column of its own beside the tool.

The whole tour is in [The panel](/guide/panel).
