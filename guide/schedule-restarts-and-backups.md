---
title: Schedule restarts and backups
description: Set up nightly backups, restarts that warn players first, and chained tasks in SpawnLoft. How schedules run, what happens when you sign out, and the Linux setting that keeps them going.
---

# Schedule restarts and backups

A server that looks after itself is mostly two tasks: a nightly backup and a morning restart that warns people first. Both live in the server's **Schedule** tab.

## A nightly backup

In **Schedule**, add a backup task, daily at a quiet hour. From a terminal:

```sh
spawnloft task add survival --do backup --daily 03:00
```

A running server is flushed before the snapshot, so it is complete. Set a retention (`keep`, 1 to 365) to remove old snapshots. Retention only removes snapshots that same schedule produced, never one you took by hand.

Add a weekly check that the backups can actually be restored:

```sh
spawnloft task add survival --do verify --weekly SUN --at 04:00
```

## A restart that warns players

Add a restart task with a warning set in the panel's task form (the warning is not a command-line flag). The countdown is announced in chat at the full figure, at one minute and at ten seconds, so nobody is surprised.

A task can also be several steps in order: tell the players, count down, back up, verify, stop, start. There are ready-made chains for a restart with a countdown and a backup first. A step waits for the one before it, and one that fails stops the rest unless the task says to keep going. Waits are capped at two hours in total and a chain at twelve steps.

## Triggers

| Trigger | Flag |
| --- | --- |
| Daily | `--daily 03:00` |
| Weekly | `--weekly SUN --at 03:00` |
| Every n hours | `--hourly <n>` |
| Every n minutes | `--minutes <n>` |
| At sign-in | `--on-logon` |

## When they run

Tasks run through Windows Task Scheduler, macOS launchd or Linux systemd timers, so they happen whether or not SpawnLoft is open, **while you are signed in**, screen locked or not.

| System | After you sign out |
| --- | --- |
| Windows | Tasks do not run. That would require storing your Windows password, which SpawnLoft never does. |
| macOS | Tasks do not run. |
| Linux | Run `spawnloft task linger on` (or use the **Keep running after logout** toggle in **Schedule**) and they keep running after logout. |

On Windows and Linux, nothing runs if the PC is asleep or off at the scheduled time, so pick a time when it will be on. On macOS, a missed daily or weekly task runs once when the Mac wakes.

## Know when something fails

Set a Discord webhook for the server and failed scheduled tasks are reported there, along with crashes:

```sh
spawnloft set survival webhook=<your Discord webhook URL>
```

See [Make a server restart itself after a crash](/guide/crash-recovery) for the other half, and [Host a server for your friends](/guide/host-for-friends#_5-make-it-look-after-itself) for the whole path.
