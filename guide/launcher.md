---
title: The game launcher
description: In the 1.6 betas. Play on your own SpawnLoft server from a launcher window. Setups by Minecraft version, Vanilla or Fabric, Microsoft sign-in on Microsoft's own page, and a Play button that starts the server first when it has to.
---

# The game launcher

A window for the real Minecraft client, already pointed at one of your SpawnLoft servers. You make a
**setup** (a Minecraft version, Vanilla or Fabric, how much memory), press **Play**, and the game Mojang
ships starts and joins the server. It is a developer's tool that goes with SpawnLoft: the quickest way
to stand in the world you are hosting, or to test the plugin you are writing as a player.

::: warning In the 1.6 betas
The launcher ships in the 1.6 beta builds; SpawnLoft 1.5 does not have it. To follow the betas, turn on
**Settings → Updates → Get beta builds**; see [automatic updates and beta builds](/guide/beta#automatic-updates-and-beta-builds).
Betas are what they sound like, so keep a backup of anything you care about. Two things are still
being verified as this is written: signing in from the packaged Windows app, and the Window menu entry
on macOS. If the sign-in page never comes back, run `spawnloft client login` in a terminal and the
launcher picks the account up.
:::

Nothing is drawn or patched by SpawnLoft. It downloads the client from Mojang's own servers, the way
Prism and MultiMC do, and runs it. It is not a mods launcher, a news feed or a store, and it has no
account system of its own: you sign in with Microsoft, on Microsoft's page, or play offline on a test
server.

## Opening it

| From | How |
| --- | --- |
| The desktop app | **Play** at the bottom of the sidebar opens the launcher in a window of its own. A second press brings the open one forward. |
| A server card | **Play** on a server card opens the launcher with that server and its Minecraft version filled in. |
| macOS | **Window → Game launcher** in the menu bar. |
| The command line | `spawnloft ui --launcher` starts the panel and opens the launcher in your browser. |
| A browser | Go to `/launcher` on a running panel, for example `http://127.0.0.1:8770/launcher`. |

## One screen

The launcher is one screen with three things on it.

**Play** is a split button. The big half plays; the small half shows the setup's version and opens the
setups menu, where you pick another setup, edit one, or make a new one. A line under the button says
exactly what will happen: "Opens Minecraft 1.21.11 and joins survival as Alex." The first launch of a
version downloads the game, with progress where the button was. Closing the window does not stop the
download, and the files are kept for next time.

**Join** is one field. Its menu lists your SpawnLoft servers with their state, plus *Title screen only*.
A stopped server is started first: the button then reads **Start server and play**, waits for the
server to come up, launches the game and joins it. You can also type any other address, `host` or
`host:port`, to join a server SpawnLoft does not run. A typed address is checked for shape only;
whether it answers is between the game and that server.

**The account chip**, top right, opens the account menu: who plays, **Add Microsoft account**, an
offline name for servers with `online-mode=false`, and sign out. A setup plays as its own account if it
names one, else the default account. When neither exists, Play first asks who is playing.

On a fresh install with no setup, Play makes one for the latest release (Vanilla, 2 GB), asks who is
playing, and plays. Nothing downloads before that is answered.

## Setups

A setup is a Minecraft version plus how to run it. The setup sheet (**New setup**, or the gear on an
existing one) has:

- **Version.** Releases by default, or with snapshots, or everything Mojang has ever listed, from the
  2009 alphas to this week's snapshot. The list is cached for an hour so it works offline once fetched;
  **Refresh** reads it again.
- **Loader.** Vanilla, or Fabric from 1.14 on. Mods go in the setup's `mods/` folder; the launcher does
  not install them for you.
- **Memory.** 2, 4 or 8 GB, or a custom amount with a slider that shows how much the machine has free.
- **Name**, who it plays as, and the server it usually joins.
- **Let SpawnLoft see the game**, which adds the harness mod (and Fabric API) so an [AI assistant](/guide/ai-assistants)
  can send a command, read what came back and take a screenshot, as a real player would.
- Under **Advanced**, the Java path and the Fabric loader version.

The version, loader, Java, memory and harness cannot be changed while that setup's game is running.
Changing the version of a setup that has mods in its folder warns that they may not load. **Remove
setup** keeps its folder unless you tick the box.

Setups and the command line's profiles are the same thing (`spawnloft client list` shows them);
nothing is kept twice.

## Java

The version decides which Java it runs on: 8 for 1.16.5 and older, 16 or 17 for 1.17 to 1.20.4, 21 for
1.20.5 to 1.21.x, 25 for 26.1 and newer. A Java you already installed for your servers is used when it
fits. When none on the machine fits, SpawnLoft downloads Mojang's own build of the right Java once,
the same one Mojang's launcher uses, and shares it between setups. Most people download nothing.

On an Apple Silicon Mac, versions older than 1.19 run through Rosetta, as Mojang's launcher does;
without Rosetta the launch is refused with the command that installs it.

## Signing in

**Add Microsoft account** opens Microsoft's own sign-in page, in a small window of its own in the
desktop app or a new tab in a browser, and the window closes by itself when the sign-in is done. No
password passes through SpawnLoft. What it keeps is a refresh token, in a file only your user can
read; the game gets a short-lived session token at each launch.

An **offline name** is enough for any of your servers running `online-mode=false`, which is what a
test server usually is. A server in online mode refuses an offline player, and the launcher says so
before anything downloads.

Accounts are shared with the command line: `spawnloft client login` and `spawnloft client logout <name>`
work on the same list.

## While the game runs

The button turns into **Stop**, with **Open folder** beside it in the desktop app (a browser tab shows
the folder's path instead). If the game closes within a minute of
starting without a Stop from you, a notice says so, shows the last lines of the game log, and offers
**Report a problem**, which writes the same diagnostics bundle as `spawnloft diag --client`. When Play
cannot work, it is greyed with the reason where the line under it was, and a link that fixes it: a
sign-in that expired, an online-mode server picked for an offline player, another launch under way,
or a machine that cannot run the client.

## Platforms

Windows x64, macOS on Apple Silicon and Linux x64 are supported. Windows on arm64 is experimental.
Linux arm64 is not supported: Mojang ships no arm64 Linux build of the game or of Java, so the
launcher refuses before downloading anything; use [bots](https://github.com/joogiebear/spawnloft/blob/dev/BOTS.md)
there instead.

## What it does not do

- Bundle mods, FPS boosters or cosmetics. The only mod it ever installs is the harness, and only when a setup asks for it.
- Install modpacks for the client. A setup's `mods/` folder is yours to fill.
- Sign in for an AI assistant. A person signs in; an assistant launch plays offline unless you allow the setup's account for it.
- Run on a machine with no display. The client needs a graphics driver.

## From the command line

Everything the launcher does, the command line does too:

```sh
spawnloft client new play --mc 1.21.11 --server survival
spawnloft client launch play
spawnloft client login
spawnloft client launch play --account Joogiebear
```

The full reference, including the harness and where the files live, is [CLIENT.md](https://github.com/joogiebear/spawnloft/blob/dev/CLIENT.md)
in the app repository.
