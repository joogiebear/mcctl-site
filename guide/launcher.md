---
title: The game launcher
description: Play on your own SpawnLoft server from the panel's Play page. Setups by Minecraft version and mod loader, Microsoft sign-in on Microsoft's own page, and a Play button that starts the server first when it has to.
---

# The game launcher

A launcher for the real Minecraft client, already pointed at one of your SpawnLoft servers. You make a **setup** (a Minecraft version, a mod loader if you want one, how much memory), press **Play**, and the game Mojang ships starts and joins the server. It is a developer's tool that goes with SpawnLoft: the quickest way to stand in the world you are hosting, or to test the plugin you are writing as a player.

Nothing is drawn or patched by SpawnLoft. It downloads the client from Mojang's own servers, the way Prism and MultiMC do, and runs it. It is not a mods bundle, a news feed or a store, and it has no account system of its own: you sign in with Microsoft, on Microsoft's page, or play offline on a test server.

## Opening it

| From | How |
| --- | --- |
| The panel | **Play** in the sidebar, under **Overview**, shows the launcher as the panel's **Play** page in place of the server. Opening a server afterwards keeps it loaded: a launch under way keeps going, and **Play** brings it back as it was. |
| A server card | **Play** on a server card opens the launcher with that server and its Minecraft version filled in. |
| macOS | **Window → Play** in the menu bar. |
| The command line | `spawnloft ui --launcher` starts the panel and opens the launcher as a page of its own in your browser. |
| A browser | Go to `/launcher` on a panel your browser is signed in to, for example `http://127.0.0.1:8770/launcher`. |

## One page

The page is a card, a list and a row.

**The card** shows the selected setup (its name, version, loader, memory and when it was last played) with **Play** and **Edit setup**. A line under the button says exactly what will happen: "Opens Minecraft 1.21.11 and joins survival as Alex." The first launch of a version downloads the game, with progress where the button was. Leaving the page does not stop the download, and the files are kept for next time.

**Your setups** is always in view beside the card: press one to select it, its gear to edit, rename, duplicate or remove it, and **New** to make one.

**Your servers** sits under the card and shows the SpawnLoft servers on the setup's version, each with its own **Play here** (or **Start and play**). **Show all** brings the rest, where a server on another version offers a setup of that version instead.

**Join** is one choice. Its menu lists your SpawnLoft servers on the setup's version with their state (running ones first), then **Another address…** and **Title screen**. A stopped server is started first: the button then reads **Start server and play**, waits for the server to come up, launches the game and joins it. **Another address…** takes any other `host` or `host:port`, to join a server SpawnLoft does not run. A typed address is checked for shape only; whether it answers is between the game and that server.

A server on another Minecraft version than the setup stops **Play** before anything downloads, with three ways on: use a setup of the server's version, play on the title screen, or play anyway if the server takes other versions. A Fabric or NeoForge server shows its loader; a setup on a different loader gets a warning under **Play**, with a link to a setup that matches.

**The account chip**, top right, opens the account menu: who plays, **Add Microsoft account**, an offline name for servers with `online-mode=false`, and sign out. A setup plays as its own account if it names one, else the default account. When neither exists, **Play** first asks **Who's playing?**.

On a fresh install with no setup, **Play** makes one for the latest release (Vanilla, 2 GB), asks who is playing, and plays. Nothing downloads before that is answered.

Each time a setup's game starts, SpawnLoft also puts your servers on that version into the game's own Multiplayer list. Entries you add yourself are never changed. The setup's **Show my SpawnLoft servers in the game** switch turns it off.

## Setups

A setup is a Minecraft version plus how to run it. The setup sheet (**New**, or the gear on an existing one) has:

- **Version.** A list you can type in to narrow, with tabs for releases, releases and snapshots, or everything Mojang has ever listed, from the 2009 alphas to this week's snapshot. It marks the latest release and what is already downloaded, and lists a version this computer cannot run with the reason. The list is cached for an hour so it works offline once fetched; **Refresh** reads it again.
- **Mods.** None (plain Vanilla), Fabric, Quilt, Forge or NeoForge, from the first version each supports. A loader with no build for the version you picked is greyed out with the reason. Mods go in the setup's `mods/` folder; the launcher does not install them for you.
- **Memory.** 2, 4 or 8 GB, or a custom amount with a slider that shows how much the machine has free.
- **Name**, who it plays as, and the server it usually joins.
- **Let SpawnLoft see the game**, which adds the harness mod (and Fabric API) so an [AI assistant](/guide/ai-assistants) can play, [below](#let-an-assistant-play). It needs Fabric.
- Under **Advanced**, the Java (Automatic, Mojang's own, any Java found on this computer, or a path you give) and the loader's own version.

The version, loader, Java, memory and harness cannot be changed while that setup's game is running. Changing the version of a setup that has mods in its folder warns that they may not load. **Remove setup** keeps its folder unless you tick the box.

Setups and the command line's profiles are the same thing (`spawnloft client list` shows them); nothing is kept twice. Each setup has its own game folder, so its options, resource packs, mods and screenshots are its own.

## Java

The version decides which Java it runs on: 8 for 1.16.5 and older, 16 or 17 for 1.17 to 1.20.4, 21 for 1.20.5 to 1.21.x, 25 for 26.1 and newer. A Java you already installed for your servers is used when it fits. When none on the machine fits, SpawnLoft downloads Mojang's own build of the right Java once, the same one Mojang's launcher uses, and shares it between setups. Most people download nothing.

On an Apple Silicon Mac, versions older than 1.19 run through Rosetta, as Mojang's launcher does; without Rosetta the launch is refused with the command that installs it.

## Signing in

**Add Microsoft account** opens Microsoft's own sign-in page, in a small window of its own in the desktop app or a new tab in a browser, and the window closes by itself when the sign-in is done. No password passes through SpawnLoft. What it keeps is a refresh token, in a file only your user can read; the game gets a short-lived session token at each launch.

If the sign-in page never comes back, run `spawnloft client login` in a terminal: it shows a code you type on Microsoft's page, and the launcher picks the account up.

An **offline name** is enough for any of your servers running `online-mode=false`, which is what a test server usually is. A server in online mode refuses an offline player, and the launcher says so before anything downloads.

Accounts are shared with the command line: `spawnloft client login`, `spawnloft client accounts` and `spawnloft client logout <name>` work on the same list.

## While the game runs

The card shows how long it has run and offers **Stop**, **Show log** and **Open folder**. If the game goes away without a Stop from you and did not simply quit, a notice says when and how it ended, shows the last lines of the game log, and offers **Show crash reports**, **Open log folder** and **Report a problem**, which writes the same diagnostics bundle as `spawnloft diag --client`. On a Forge or NeoForge setup the notice names the likely cause where the log shows one: a mod made for another Minecraft version, a missing dependency, two copies of one mod, a Fabric mod in a Forge folder. When **Play** cannot work it is greyed with the reason where the line under it was, and a link that fixes it: a sign-in that expired, an online-mode server picked for an offline player, another launch under way, or a machine that cannot run the client.

## Let an assistant play {#let-an-assistant-play}

With **Let SpawnLoft see the game** on, launching installs a small Fabric mod, the [harness](https://github.com/joogiebear/spawnloft-harness-mod), and Fabric API into the setup's `mods/`. The harness listens on this machine only and answers just the process that holds a one-time token SpawnLoft gives the game at launch. Through it, `spawnloft mcp`'s `client_*` tools can join one of your servers, chat or run a command as the player, read what came back, take a screenshot, read the client's logs and quit, as a real player would, where scripted bots only see packets. Everything the harness returns is game content written by players and servers, and the tools say so.

The token is a launch flag, so another user on the same computer can read it from the process list while the game runs. On a machine shared with people you do not trust, leave the harness off. A setup that plays as a signed-in Microsoft account is launched by an assistant only after `spawnloft client set <name> assistantAccount=true`; otherwise an assistant plays offline.

## Platforms

Windows x64, macOS on Apple Silicon and Linux x64 are supported. Windows on arm64 is experimental. Linux arm64 is not supported: Mojang ships no arm64 Linux build of the game or of Java, so the launcher refuses before downloading anything; use [bots](https://github.com/joogiebear/spawnloft/blob/v2/BOTS.md) there instead.

## What it does not do

- Bundle mods, FPS boosters or cosmetics. The only mod it ever installs is the harness, and only when a setup asks for it.
- Install modpacks for the client. A setup's `mods/` folder is yours to fill.
- Sign in for an AI assistant unless you allow it per setup.
- Run on a machine with no display. The client needs a graphics driver.

## From the command line

Everything the launcher does, the command line does too:

```sh
spawnloft client versions                      # versions, with a column per mod loader
spawnloft client new play --mc 1.21.11 --server survival
spawnloft client launch play
spawnloft client login
spawnloft client launch play --account Joogiebear
```

The full reference, including the harness and where the files live, is [CLIENT.md](https://github.com/joogiebear/spawnloft/blob/v2/CLIENT.md) in the app repository.
