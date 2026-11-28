---
title: Why SpawnLoft runs on your own PC
description: SpawnLoft keeps your server, your worlds and your backups on your machine, with no account and no cloud. What that buys you, what it costs, and who it is not for.
date: 2026-11-28
author: joogiebear
tags: [Design, Local-first]
lastUpdated: false
sidebar: false
aside: false
---

# Why SpawnLoft runs on your own PC

Most ways of running a Minecraft server for friends start with a sign-up. You make an account, pick a plan or a queue, and your world lives on somebody else's machine. That is a fine answer for plenty of people. SpawnLoft is built around the opposite answer, and it is worth saying plainly what that means.

## What stays on your machine

Your servers, worlds, backups and the downloaded server software all live in folders on your disk. The data folder can be moved from **Preferences**. SpawnLoft has no account system, so there is nothing to sign up for, and nothing is uploaded unless you choose a feature that sends it, such as a mclo.gs log upload.

The panel is a local web page served by the app itself, so it works offline. When SpawnLoft does reach out, it is for a reason you can name: downloading server software and plugins from their official sources and checking checksums, its own update checks, searching Modrinth and Hangar, signing in with Microsoft for the game launcher, and Discord webhooks or plugin update checks if you set them up. [Security](/guide/security) covers what leaves the machine.

## What you get from that

- **Your world is a folder.** You can copy it, zip it, open it in a file manager, or hand it to a friend. If you stop using SpawnLoft, the folder is exactly what you had. Adding a server you already have to SpawnLoft does not move or rewrite it, and removing it leaves it where it was.
- **Nothing expires.** There is no plan to lapse, no idle timeout and no queue to wait in. The server runs when you start it, for as long as you want.
- **Backups you control.** Snapshots can be verified, locked, and can be copied to a second location, such as an external drive or a synced folder. [Backups](/guide/backups) covers the options.
- **The full power of your hardware.** A modern PC is plenty for a server for friends, and you decide how much memory each server gets.
- **It is free, and open source.** The code is MIT licensed, and the app stays free.

## What it costs

This is the part that is easy to leave out, so here it is.

- **The PC has to be on.** If you want a server that is up while your computer is off, that is hosting, and a PC at home is the wrong tool. [The comparison](/guide/compare) says where to look instead.
- **Friends outside your home network need a way in, and you set it up.** SpawnLoft never opens your router's ports for you. It leaves that decision to you, because letting the internet reach your machine is a choice about exposure. You can forward a port, which makes your home address public, or use a tunnel service, which hides it but depends on that service. [Sharing your server](/guide/sharing) lays out both.
- **Your home connection is the limit.** Upload speed decides how many people can play comfortably.

## Who it is for

SpawnLoft fits you if you want a server for yourself and a handful of friends, with real tools (a console, plugins, backups, schedules) and no terminal required. It fits too if you build plugins and want a safe place to try them, or if you want to run a modpack without learning how loaders and Java versions fit together.

It does not fit if you need a server that is online around the clock without a computer left on, or if you plan to run a public server for hundreds of strangers from a home connection.

## Where it is going

The one thing missing from the "friends anywhere" story is a guided way to do it. A **Share** screen that lays out the options, and prompts you to turn on the whitelist and online mode at the moment anything goes public, is on the [roadmap](/roadmap). The rule behind it will not change: SpawnLoft stays a program on your computer, and your world stays yours.
