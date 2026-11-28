---
title: "How SpawnLoft updates itself without kicking your players"
description: "Update checks, background downloads, signed packages and servers that keep running. What happens when SpawnLoft updates, and how to go back if you need to."
date: 2026-11-28
author: joogiebear
tags: [Release, How it works]
lastUpdated: false
sidebar: false
aside: false
---

# How SpawnLoft updates itself without kicking your players

Updating the app that runs your server should not disconnect the people playing on it. In SpawnLoft 2.0 it does not, and this is how that works.

## The routine

SpawnLoft checks for a new release 20 seconds after it starts, and every six hours while it is open. If it finds one, it downloads it in the background. When it is ready, the header button reads **Restart to update**, and nothing is replaced until you press it. Closing the app with an update waiting applies it on exit too.

A background check that fails stays quiet. One you pressed yourself, with **Check now** in **Preferences → Updates**, answers either way.

## Servers are not part of the app

A server is a detached process that does not belong to the window. Each one is looked after by a small supervisor that keeps running while the app updates or restarts. So closing the window, or restarting to update, leaves them alone: only the window closes or restarts. Running servers, and the people on them, carry on.

(The single exception was the one-time move from SpawnLoft 1 to 2.0, which replaced the whole program. On Windows that stopped servers once with a normal save and started them again. After that, updates no longer touch running servers.)

## Every update is checked first

An update is verified against SpawnLoft's own signing key before it installs, on top of the Windows and Apple code signatures. A download that does not match is not installed.

If an update fails to install, SpawnLoft tries again the next time you quit, and `update.log` in the SpawnLoft settings folder says why.

## On Linux

Your package manager installs updates. The app downloads and verifies the package and shows the `apt` or `dnf` command to run, and `spawnloft update apply` does the same from a terminal. The `spawnloft-cli` package has no updater, so install a newer package the same way.

## Going back

**Preferences → Updates → Reinstall a previous version** lists earlier 2.x releases that can read your servers' data and installs the one you pick. Updates are then paused until you resume them.

## Following the betas

If you want to try things early, turn on **Get beta builds** in the same place. It is opt-in, and you can turn it off again.

More in [The desktop app](/guide/desktop#updates) and [Downloads & platforms](/guide/beta).
