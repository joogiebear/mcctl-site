---
title: Import, export and switch Minecraft worlds
description: List the worlds on a server, import a downloaded map, export one as a zip, switch which world runs, and delete one safely. What the Worlds tab and the worlds command do, and what a backup covers.
---

# Import, export and switch Minecraft worlds

A server folder can hold more than one world. The **Worlds** tab shows them all, names the one that is running, and lets you bring one in, send one out, switch, or delete.

## See what you have

Open a server and choose **Worlds**. Every world in the folder is listed, with the active one named. From a terminal:

```sh
spawnloft worlds survival
```

## Import a map

Choose **Import** and pick a downloaded zip or a folder. SpawnLoft finds the world however deeply it is nested inside the download, so a map zipped inside two extra folders still works. It never overwrites a world that is already there. From a terminal:

```sh
spawnloft worlds survival import ~/Downloads/castle-map.zip --as castle
```

Importing puts the world in the list. It does not start using it. If you are bringing in a whole server rather than one map, [Bring your world or server](/guide/bring-your-world) covers that.

## Switch which world runs

Choose a world and make it active, or:

```sh
spawnloft worlds survival use castle
```

The other worlds stay in the folder, untouched. Switching back later brings the first one back as you left it.

## Export a world

Export saves a world as a zip, to hand to a friend or keep somewhere safe:

```sh
spawnloft worlds survival export castle
```

## Delete a world

Delete asks you to confirm, because a deleted world is gone. From a terminal it needs `--yes`:

```sh
spawnloft worlds survival delete castle --yes
```

## What a backup covers

Only the **active** world is included in snapshots. A world you imported but have not switched to is not in any backup yet. Before you delete anything, or rely on a world you have only imported, export it, or switch to it and take a snapshot. [Backups](/guide/backups) explains the scopes and how to restore.

## A safe order

1. Take a snapshot of the server as it is.
2. Import the new world.
3. Switch to it and start the server.
4. Take a snapshot again, now that it is the active world.
5. Delete the old world only when you are sure you do not want it, and export it first if there is any doubt.

If something goes wrong, [Recover a damaged world](/guide/recover-a-damaged-world) walks through restoring.
