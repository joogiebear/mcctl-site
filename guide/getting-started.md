# Getting started

SpawnLoft runs Minecraft servers on your own PC. The desktop app is a window around a panel that
starts and stops servers, keeps their consoles in front of you, installs plugins, takes backups
and schedules the boring parts. There is a command line underneath for anyone who wants it.

<Download fine />

## What you need

- **Java 25 or newer** for current Minecraft (26.x); 1.21.x runs on 21. This is the one thing
  SpawnLoft cannot supply: Minecraft servers *are* Java processes.
  [Temurin 25](https://adoptium.net/temurin/releases/?version=25) is a good default, and a JDK
  rather than a JRE if you want Spigot or CraftBukkit built on your machine.
- **Windows 10 or 11** for the desktop app. The command line runs anywhere Node 20+ does.

The app checks for Java on first run, and the panel shows a banner if it is missing. SpawnLoft looks
on PATH **and** in the usual install folders (Program Files, the per-user Programs folder,
`JAVA_HOME`), so a Java the installer did not add to PATH is still found. Each server can also be
pointed at a specific Java.

SpawnLoft knows which Java each Minecraft version needs (17 for 1.18 to 1.20.4, 21 for 1.20.5 and
1.21, 25 for 26.x) and picks the newest installed one that fits when a server is created. A version
nothing installed can run is refused before the download, with a link to the Java it needs.

## Three steps

1. **Install SpawnLoft.** Download the setup, run it, and let it check for Java.
2. **Add a server.** Create one, picking the software and the Minecraft version, and the jar
   downloads. Or point SpawnLoft at a server folder you already run: nothing is moved or rewritten,
   and its ports and RCON password are read from its own `server.properties`.
3. **Press Start.** Watch it come up in the console. Send `list`. Open the Plugins tab and install
   something. Take a backup.

## SmartScreen

The installer is signed, but Windows SmartScreen judges by reputation rather than by signature,
and a new publisher earns that through real installs. Until then Windows may show
"Windows protected your PC". Click **More info**, then **Run anyway**.

## From the command line

The same engine is a plain Node program with no dependencies. Clone the
[repository](https://github.com/joogiebear/spawnloft) and run it from its folder:

```bash
node mcctl.mjs list
```

Register a server directory you already have, in place:

```bash
node mcctl.mjs adopt survival "D:\Servers\Survival" --memory 6G
```

Start it and wait until it reports ready:

```bash
node mcctl.mjs start survival
```

Talk to it over RCON and get the reply back:

```bash
node mcctl.mjs cmd survival "tps"
```

Spin up a disposable copy of its plugins and config on its own port, with fresh worlds, for
reproducing a bug without touching the real server:

```bash
node mcctl.mjs clone survival ecotest && node mcctl.mjs start ecotest
```

On Windows `mcctl.cmd` wraps the above, so `mcctl list` works once the folder is on your PATH.
The full list is in the [command reference](/reference/commands).
