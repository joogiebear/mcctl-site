---
description: "How SpawnLoft runs a Minecraft server: a supervisor for each one, crash recovery, hot backups, scheduled tasks and where your data lives."
---

# How it works

A Minecraft server is an interactive foreground process. Launched from a short-lived shell call it blocks, its stdin is unreachable, and its console output is lost. That makes the edit, restart, check loop painful to automate and impossible to put a window around. SpawnLoft puts a supervisor in front of each server so short-lived commands and the panel can start it, read what it printed, talk to it, and stop it cleanly.

```
spawnloft / mcctl (short-lived CLI, or the panel)
   │
   ├─ spawns detached ──▶ daemon (one per server)
   │                        ├─ owns the java child process
   │                        ├─ mirrors stdout/stderr ──▶ run/<name>/console.log
   │                        ├─ samples CPU and memory every 10 s ──▶ run/<name>/metrics.log
   │                        └─ listens on a local control channel: ping | send | stop | kill
   │
   ├─ reads run/<name>/state.json   (pids, ports, start time)
   ├─ reads run/<name>/console.log  (logs, ready detection, follow)
   └─ connects to RCON on 127.0.0.1 (commands, players, save flush)
```

The daemon exists because the CLI is short-lived and the JVM is not. It holds the pipe to the server's stdin for as long as the server runs.

| Platform | Control channel |
| --- | --- |
| Windows | Named pipe `\\.\pipe\mcctl-<name>` |
| macOS, Linux | Unix socket `run/<name>/control.sock`. When that path exceeds the socket limit (103 bytes on macOS, 107 on Linux), a socket under `/tmp/spawnloft-<uid>/` named by a hash of the path is used; the folder must be private to your user. |

## State

State is reconciled against live processes on every read.

| Status | Meaning |
| --- | --- |
| `running` | Daemon and Java process are alive. |
| `stopping` | A graceful stop is in progress. |
| `stopped` | No daemon and no state. |
| `stale` | The state file names dead processes, usually after a restart of the machine. Cleared on the next read, or by `spawnloft doctor`. |
| `orphaned` | A Java process outlived its daemon. **Kill** or `spawnloft kill <name>` cleans it up. |

A server is ready when its console prints `Done (<seconds>s)!`. `start` also stops waiting early on known failure shapes (`Failed to start the minecraft server`, `A fatal error has occurred`, heap reservation failures, `Unable to access jarfile`), prints the last 25 console lines, and exits non-zero.

The registry (`instances.json`) is the source of truth for ports and RCON. `start` writes those values into `server.properties` before every launch, so a hand edit cannot desynchronise a server from what SpawnLoft believes about it. `--no-sync` leaves the file alone. New servers take ports from `25565` (game) and `25575` (RCON) upward, skipping anything claimed or in use.

JVM flags default to Aikar's G1 tuning, switching to the large-heap variant at 12 GB and above. A per-server `jvmFlags` array in `instances.json` overrides them. `start` truncates `run/<name>/console.log` each launch; the server's own `logs/` folder keeps the rolling history.

## Crash recovery

The daemon owns crash recovery because it is the only process alive when a server dies.

| Setting | Behavior |
| --- | --- |
| `auto-restart=on` | A crash relaunches the server in place after 10 seconds. |
| Crash-loop limit | Three crashes within ten minutes: the server stays down and records why, so a broken plugin cannot grind the machine all night. |
| Requested stops | Always stick, including `stop` typed into the console. |
| `webhook=<url>` | A per-server Discord webhook for crashed, recovered, gave-up and failed scheduled-task events. Routine lifecycle events stay quiet. |
| Restart warnings | A scheduled restart with `warnMinutes` announces the countdown over the console at the full figure, at one minute, and at ten seconds. |

## Where data lives

| Item | Location |
| --- | --- |
| Settings file | Windows `%APPDATA%\mcctl\settings.json`; elsewhere `$XDG_CONFIG_HOME/mcctl/settings.json`, default `~/.config/mcctl/settings.json` |
| Default data folder | Windows `%LOCALAPPDATA%\mcctl`; elsewhere `$XDG_DATA_HOME/mcctl`, default `~/.local/share/mcctl` |
| Override | The `MCCTL_DATA_ROOT` environment variable, inherited by daemons |

| Path in the data folder | Contents |
| --- | --- |
| `instances.json` | Registry: ports, memory, RCON credentials, software, options |
| `instances/` | Servers SpawnLoft created. Servers you added from an existing folder stay where they were. |
| `templates/` | Saved plugin and config sets |
| `jars/` | Server jar store, including `jars/buildtools/` |
| `backups/` | Snapshots and manifests |
| `run/<name>/` | `state.json`, `console.log`, `daemon.log`, `metrics.log`, task run logs |
| `engines/` | Database engines, shared by version |
| `services/<name>/` | Data for each managed database |

`spawnloft config` shows the layout and moves it: `set-root`, `set-instances`, `same-drive` and `set-backup-mirror`. Moving a location never moves existing data.

## Backups

Snapshots are tar archives with a manifest.

| Scope | Contents |
| --- | --- |
| `plugins` | `plugins/` and `mods/` |
| `worlds` | The active world set |
| `config` | Root configuration files and `config/` |
| `standard` (default) | Plugins, active worlds and config |
| `full` | Everything except `cache/`, `libraries/`, `versions/` and `logs/` |

Backing up a running server issues `save-off` and `save-all flush` over RCON first and `save-on` afterward, so a hot snapshot is coherent rather than a torn copy of a world mid-write. Every path that takes a snapshot gets this: the command line, the **Backups** tool, a scheduled task, MCP, and the snapshot taken before a cross-version upgrade. If the flush cannot be done the snapshot is still taken and its manifest says so.

`verify` is a restore minus the writes. Listing the archive decompresses every block, so the gzip checksums are genuinely checked, and entries are compared against the manifest so a snapshot missing a world is caught the week it was taken rather than the day it is needed.

Snapshots of `standard` and `full` scope include a `databases/` dump of any attached database. `restore` extracts in place and deletes nothing, so a file added after the snapshot survives. `tar` exits 1 when it skips a file the running server holds locked; that is expected on hot snapshots and is not treated as failure.

## Scheduled work {#scheduled-work}

The operating system holds only a trigger that calls `spawnloft task run <id>`. Task definitions live in SpawnLoft's own file, and what a task does is limited to an allowlist (`backup`, `verify`, `command`, `restart`, `stop`, `start`) rather than an arbitrary command line. A value SpawnLoft does not recognise is refused.

| Platform | Scheduler | Behavior |
| --- | --- | --- |
| Windows | Task Scheduler | Runs while you are signed in, screen locked included, never after sign-out. Running regardless would mean storing a Windows password in the task definition. |
| macOS | Per-user launchd agents | Daily and weekly jobs missed during sleep run once on wake; interval jobs skip missed runs; login jobs also run when registered or enabled. Remove tasks before deleting the app. |
| Linux | systemd user timers | Requires lingering to run after logout: `spawnloft task linger on`. |

Tasks run whether or not SpawnLoft is open, as the signed-in user, with no stored password and no elevation.

## Zero dependencies

The engine is plain Node and the operating system's `tar`. There is no framework, no build step, and no package to go stale. The panel is one HTML file served by Node's own `http` module. The desktop app runs the engine inside the Electron process, so there is one process, no second Node to ship, and no orphaned child if the window dies. Installed packages include `spawnloft` and `mcctl` launchers that use the bundled runtime; both run the same commands.
