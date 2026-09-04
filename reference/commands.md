# Commands

Everything the panel does, from a terminal. Run from the SpawnLoft folder as `node mcctl.mjs <command>`,
or as `mcctl <command>` once that folder is on your PATH.

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
