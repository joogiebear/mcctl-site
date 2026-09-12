# Commands

Everything the panel does, from a terminal. Run from the SpawnLoft folder as `node mcctl.mjs <command>`,
or as `mcctl <command>` once that folder is on your PATH.

In the [development preview](/guide/beta), **`spawnloft` is the preferred command** and
`mcctl` remains compatible. Existing stable examples below still work. JSON output, metrics,
and the installed launchers described here require the preview.

## Preview CLI setup

Installed preview packages include both launchers and use their bundled runtime. No separate
Node installation is needed. On Mac, after installing into Applications:

```sh
"/Applications/SpawnLoft.app/Contents/Resources/bin/spawnloft" status survival --json

# Optional: enable the short commands in this terminal session.
export PATH="/Applications/SpawnLoft.app/Contents/Resources/bin:$PATH"
spawnloft status survival --json
```

Add that export to your shell configuration if you want it to persist. The app does not edit
PATH automatically. Keep the launcher in its bundled directory; it finds the runtime relative
to itself, so symlinking the launcher alone is not supported.

On Windows, run `resources\bin\spawnloft.cmd` inside your installed SpawnLoft directory,
or add that `resources\bin` directory to your user PATH. `mcctl.cmd` remains alongside it.
From a preview source checkout, use `node spawnloft.mjs ...` with Node 20+.

## JSON output (preview)

```sh
spawnloft list --json
spawnloft status survival --json
spawnloft plugins survival --json
spawnloft backups survival --json
spawnloft diagnostics survival --json
spawnloft doctor --json
spawnloft backup survival --scope plugins --json
```

Each command writes one JSON object and a newline to stdout, with no progress text or ANSI
colors mixed in. The envelope includes `schemaVersion`, `command`, `ok`, and `data` on success:

```json
{"schemaVersion":1,"command":"status","ok":true,"data":{"name":"survival","status":"stopped"}}
```

This abbreviated example omits other status fields. Accept additional fields and check the
schema version. On failure, inspect `error.code`, `error.message`, and the process exit code.

| Exit | Meaning for structured commands and metrics |
| --- | --- |
| `0` | Completed; a stopped server or empty inventory is valid data |
| `1` | Operation failed, or `doctor` found environment problems |
| `2` | Invalid usage or unsupported JSON operation; no command action ran |
| `130` / `143` | Metrics follower interrupted by Ctrl+C / SIGTERM |

Other existing commands retain their exit behavior. JSON on unsupported operations is
rejected before acting; for example, `plugins ... enable --json` does not modify a JAR.
`snapshots` remains an alias for `backups`, and `why` for `diagnostics`.

Structured status omits configured credentials and webhook URLs. Diagnostics include console
excerpts, so review them before sharing. A historical diagnostic is not a plugin-health check.
`doctor --json` is read-only; plain-text `doctor` retains its stale-state repair behavior.

Backup exit `0` means the archive was created. Inspect warnings, skipped database dumps,
mirror errors, and pruning results before treating every optional backup operation as successful.

## Performance and export (preview)

```sh
spawnloft metrics survival --json
spawnloft metrics survival --seconds 1800 --json
spawnloft metrics survival --follow --json
spawnloft metrics survival --csv --output survival-run.csv
spawnloft metrics survival --follow --csv
```

These are the Performance tab's ten-second CPU and resident-memory samples, collected on
Windows and Mac. CPU is a percentage of the whole machine; `rssMiB` includes memory outside
the Java heap. A snapshot defaults to retained history for the current or last server run.
An empty sample list is valid before the first reading or outside the selected time range.

`--follow --json` uses **JSON Lines**: a `snapshot` envelope first, then new `sample` envelopes.
A restart or clock rollback emits `reset`; use `runId` to separate runs. It waits while the
server is stopped and follows the next start. Press Ctrl+C to stop.

CSV columns are `instance,run_id,timestamp,cpu_percent,rss_mib,cores`, with UTC timestamps.
`--output` creates a new file and refuses to overwrite an existing one. It is for finite CSV
snapshots; stream a continuous capture to stdout instead. JSON and CSV are mutually exclusive.

## Databases (preview)

See [Databases](/guide/databases) for managed Mac MySQL, Windows MariaDB/Garnet, and existing
connections. Creation and attachment provide credentials for **manual plugin configuration**.
There is no `db apply` config-writing command in the preview.

## Lifecycle

| Command | Does |
| --- | --- |
| `list` | Every server with status, ports, memory, uptime |
| `status <name>` | Detail for one server, including pids and level-name |
| `start <name>` | Launch and block until the server reports ready |
| `stop <name>` | Graceful shutdown by writing `stop` to the console |
| `restart <name>` | Stop, then start |
| `kill <name>` | Force-kill the process tree |

`start` flags: `--detach` (return as soon as the process launches), `--timeout <sec>` (ready
timeout, default 180), `--no-sync` (leave `server.properties` alone instead of pushing registry
ports into it).

If the server fails to reach ready, `start` prints the last 25 console lines and exits non-zero,
so a failed launch is self-diagnosing.

## Console

| Command | Does |
| --- | --- |
| `logs <name> [-n 60] [-f] [--grep re]` | Read the captured console; `-f` follows |
| `cmd <name> "<command>"` | Run over RCON and print the reply |
| `send <name> "<line>"` | Write a raw line to the server's stdin |
| `console <name>` | Interactive attach; `/detach` leaves the server running |
| `players <name>` | Who is online |

`cmd` goes over RCON and gets a reply back, which is what you want almost always. `send` writes to
stdin and gets no reply, which is what you want for anything RCON refuses to carry.

## Servers

| Command | Does |
| --- | --- |
| `adopt <name> <dir>` | Register an existing server directory in place |
| `new <name>` | Create a fresh server (`--paper <v>`, `--purpur <v>`, `--folia <v>`, `--asp <v>`, `--vanilla <v>`, `--spigot <v>`, `--craftbukkit <v>`, `--fabric <v>`, `--neoforge <v>`, `--modpack <slug>`, `--jar`, `--template`, `--accept-eula`) |
| `clone <src> <new>` | Copy plugins and config into a new server on a free port |
| `set <name> key=value` | `label`, `memory`, `java`, `jar`, `port`, `rcon.port`, `rcon.password`, `auto-restart=on\|off`, `webhook=<url>\|off` |
| `props <name> [key=value]` | Read or edit `server.properties` |
| `plugins <name> [enable\|disable <x>]` | List a server's plugins, flip one on or off |
| `upgrade <name> [--check]` | Newest Paper build for its version; `--version <v> --yes` crosses Minecraft versions |
| `rm <name> [--purge --yes]` | Unregister, optionally deleting the files |

`new` fetches whichever server software you name; the choices are on the
[server software](/reference/servers) page. `clone` gives fresh worlds by default; pass
`--with-worlds` to copy world data too. Ports are allocated automatically from 25565/25575
upward, skipping anything already claimed or in use on the box.

## Worlds

| Command | Does |
| --- | --- |
| `worlds <name>` | List a server's worlds and which is active |
| `worlds <name> use <world>` | Switch the world the server loads |
| `worlds <name> import <zip-or-folder> --as <world>` | Copy a world in under a new name |
| `worlds <name> export [world]` | Zip a world for sharing (default: the active one) |
| `worlds <name> delete <world> --yes` | Delete an inactive world and its companions |

## Snapshots

| Command | Does |
| --- | --- |
| `backup <name>` | Snapshot to `backups/<name>/` |
| `snapshots <name>` | List snapshots |
| `restore <name> [ref] --yes` | Restore (default `latest`); server must be stopped |
| `prune <name> --keep <n>` | Delete all but the newest n |
| `verify <name> [ref\|--all]` | Read a snapshot back end to end and check its coverage |

Scopes: `plugins`, `worlds`, `config`, `standard` (the default: plugins, the active world set,
and config), `full` (everything except `cache/`, `libraries/`, `versions/`, `logs/`).

`restore` refuses without `--yes` and prints what it would overwrite. It extracts over the server
in place and deletes nothing, so a file added after the snapshot was taken survives a restore.

`verify` exits non-zero on any failure, so a scheduled `verify <name> --all` can be noticed by
whatever runs it.

## Scheduled work

Scheduled tasks and automatic backups currently require Windows. The Mac beta does not
support them yet; manual backup/restore remains available.

| Command | Does |
| --- | --- |
| `task list` | Every scheduled task, with its next run and last result |
| `task add <server> --do <what> [when]` | Create one |
| `task rm <id>` / `task enable\|disable <id>` | Remove or pause one |
| `task run <id>` | Run it now. This is also what Windows calls |

`--do` is one of `backup`, `command` (with `--line "<what to send>"`), `restart`, `stop`, `start`.
When: `--daily 03:00`, `--hourly <n>`, `--minutes <n>`, `--weekly SUN --at 03:00`, or `--on-logon`.

Every run writes a line to the server's run directory recording what it did: the filename a
backup produced, the command it sent, or why it was skipped. A `command` task whose server is
down did not fail; there was nothing to send, and it reads as skipped. Renaming a server moves its
tasks with it, and deleting one takes them away.

## Other

| Command | Does |
| --- | --- |
| `ui` | Serve the panel at `http://127.0.0.1:8770` and open it |
| `templates` / `templates save <server> <tpl>` | Reusable plugin and config sets |
| `jars` / `jars import <path>` | Server jar store used by `new` |
| `doctor` | Environment, port collisions, EULA, disk, stale state |
