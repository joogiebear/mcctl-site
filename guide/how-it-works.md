# How it works

A Minecraft server is an interactive foreground process. Launched from a normal shell call it
blocks forever, its stdin is unreachable, and its console output is lost. That makes the ordinary
edit, restart, check loop painful to automate, and impossible to put a window around.

mcctl puts a supervisor in front of each server so short-lived commands, and the panel, can start
it, read what it printed, talk to it, and shut it down cleanly.

```
mcctl (short-lived CLI, or the panel)
   │
   ├─ spawns detached ──▶ daemon (one per server)
   │                        │
   │                        ├─ owns the java child process
   │                        ├─ mirrors stdout/stderr ──▶ run/<name>/console.log
   │                        └─ listens on a named pipe
   │                              ops: ping | send | stop | kill
   │
   ├─ reads run/<name>/state.json  (pids, ports, start time)
   ├─ reads run/<name>/console.log (logs, ready detection, follow)
   └─ connects to RCON on 127.0.0.1 (commands, players, save flush)
```

The daemon exists because the CLI is short-lived and the JVM is not. It holds the pipe to the
server's stdin for as long as the server runs.

## Crash recovery

The daemon also owns crash recovery, because it is the only thing alive at the moment a server
dies. With auto-restart on, a crash is relaunched in place after ten seconds; three crashes in ten
minutes and it stays down saying why, so a broken plugin cannot grind the machine all night. A stop
that was asked for always sticks, including `stop` typed straight into the console.

An optional per-server Discord webhook gets a message for the events nobody is watching the panel
for: crashed, recovered, gave up, or a scheduled task that failed. Routine lifecycle stays quiet.

Scheduled restarts can warn the players first: the countdown is said over the console at the full
figure, one minute, and ten seconds.

## State

State is reconciled against live processes on every read, so a daemon that dies takes its server
to `stale` rather than reporting `running` forever. A java process that outlives its daemon shows
as `orphaned`, and `kill` cleans it up.

The registry is the source of truth for ports and RCON. `start` pushes those values into
`server.properties` before every launch, so hand-editing the file cannot silently desync a server
from what mcctl believes about it.

## Backups

Backing up a running server issues `save-off` and `save-all flush` over RCON first and `save-on`
afterward, so a hot snapshot is coherent rather than a torn copy of a world mid-write. Every path
that takes a snapshot gets this: the command line, the Backups tab, a scheduled task, and the
snapshot taken before a cross-version upgrade.

`verify` is a restore minus the writes. Listing the archive decompresses every block, so the gzip
checksums are genuinely checked, and the entries are compared against the manifest so a snapshot
missing a locked world is caught the week it was taken rather than the day it is needed.

## Scheduled work

Windows Task Scheduler runs scheduled tasks, so they happen whether or not mcctl is open. They run
while you are signed in, screen locked included, but not after you sign out. Running regardless
would mean storing a Windows password in the task definition, which is not a thing to do quietly
for a nightly backup.

mcctl keeps the task definitions in its own file and gives Windows only a trigger that calls back
into `mcctl task run <id>`. What a task *does* stays inside mcctl, constrained to the handful of
things a task is allowed to be, rather than an arbitrary command line.

## Zero dependencies

The engine is plain Node and the `tar` Windows already ships. No framework, no build step, no
package that rots. The panel is one HTML file served by Node's own http module. The desktop app
runs the engine inside the Electron process, so there is one process, no second Node to ship, and
no orphaned child if the window dies.
