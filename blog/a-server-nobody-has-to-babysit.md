---
title: A server nobody has to babysit
description: Four small settings, crash restart, scheduled restarts and backups, Discord alerts and the Overview page, turn a home Minecraft server from something you watch into something that tells you when it needs you.
date: 2026-11-28
author: joogiebear
tags: [Guide, Servers]
lastUpdated: false
sidebar: false
aside: false
---

# A server nobody has to babysit

The first weeks of a server are spent watching it. Is it up? Did it crash overnight? Did the backup run? The goal is a server that only asks for your attention when it needs it. Four settings get you most of the way.

## 1. Let it restart after a crash

Turn on crash restart for the server. If it dies, SpawnLoft starts it again. It has a limit: if the server crashes again and again, it stops trying, because a server that crashes the same way every time needs you, not another restart. [Restart after a crash](/guide/crash-recovery) has the detail.

## 2. Schedule restarts and backups

A nightly backup and a regular restart keep memory tidy and the safety net fresh. A scheduled restart warns the players first, so nobody is dropped mid-build. Tasks run while you are signed in whether or not the SpawnLoft window is open. [Schedule restarts and backups](/guide/schedule-restarts-and-backups) walks through it.

## 3. Get told when it matters

A Discord webhook sends the events nobody is watching for, such as a crash, to a channel you already read. If it names a likely cause, you often know what to do before you reach the computer. [Discord crash alerts](/guide/discord-alerts) shows how to set one up.

## 4. Look at Overview, not the console

The **Overview** page shows every server's state, players, TPS, memory and last backup. A **Needs attention** row collects what wants doing: a server that crashed today, plugin updates, a server never backed up or not backed up in a week, and a Java that is too old. Each item has the one button that resolves it. If Needs attention is empty, you are done for the day.

## What is still on you

Updates are a decision, not an automatic one. SpawnLoft checks for plugin updates and takes a snapshot before applying one, but you press the button. A Minecraft version change is deliberately harder, because worlds migrate one way. [Update Minecraft safely](/guide/update-minecraft-version) shows the rehearsal on a clone.

And a backup you have never restored is a guess, so [test one](/blog/a-backup-you-never-tested-is-a-guess).
