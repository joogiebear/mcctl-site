# Troubleshooting

When a server fails, mcctl reads the console and names the cause wherever the failure surfaces:
a strip under the server's vitals in the panel, advice under a failed `mcctl start`,
`mcctl why <name>` from a terminal, and the Discord webhook message for a crash. Anything it does not
recognise stays a stack trace, honestly, rather than being guessed at.

These are the failures it recognises, and the way out of each.

## The port is already taken

Something else is listening on this server's port, usually another server or another copy of
this one. `mcctl list` shows who. Change the port under **Manage** if both should run at once.

## The EULA is not accepted

Set `eula=true` in the server folder's `eula.txt` (see [Minecraft's EULA](https://aka.ms/MinecraftEULA))
and start again. Servers mcctl creates ask at creation time.

## Java is too old for this server

The server is built for a newer Java than the one that launched it. Install the Java it names
and, if several are installed, point this server at it: **Manage** in the panel, or
`mcctl set <name> java=<path-to-java.exe>`. Current Minecraft needs Java 25, 1.21 needs 21,
1.18 to 1.20.4 need 17.

## The server ran out of memory

It has its configured memory and wants more. Raise it under **Manage**. Modded servers usually
want 4G or more, and the machine has to have that to give.

## The disk is full

The drive this server lives on has no room left, so saves and logs are failing. Free space, or
move the data folder onto a drive that has some under **Settings**. `mcctl prune` thins old
snapshots.

## A plugin is missing a dependency

A plugin depends on another plugin that is not installed; the lines above the error name it.
Install the missing one from the Plugins tab, or disable the one that wants it.

## A mod is missing a dependency

A mod needs another mod that is not installed. Install it from the Mods tab. For most Fabric
mods that means Fabric API first.

## Two plugins claim the same name

Two jars in the plugins folder provide the same plugin, usually an old copy beside a new one, or
WorldEdit installed beside FAWE, which already provides it. Disable one of them in the Plugins
tab.

## The world failed to load

Part of the world data would not read back, usually after a hard power-off mid-save. Restore the
latest snapshot from the Backups tab. `mcctl verify` proves which snapshots are whole.

## Something in the world crashed the server

An entity or block crashed the server mid-tick. Minecraft's own crash report names the exact
thing and where it stands, and the panel links to it beside the diagnosis. If it repeats, that
report is what the responsible plugin or mod's author needs.

## The server stalled and the watchdog stopped it

A tick took so long the server declared itself stuck: heavy world generation, a plugin doing too
much at once, or the machine out of breath. The thread dump above the shutdown names what it
was doing. More memory or fewer chunks loaded usually helps.

## The server jar is missing

Java could not find the server jar. Re-download it, with `mcctl upgrade` for Paper or by
choosing a jar again under **Manage**, or restore the folder from a snapshot.

## Other things that look like failures

**Windows protected your PC.** SmartScreen, not a problem with the installer. **More info**, then
**Run anyway**. See [Questions](/guide/faq#windows-says-windows-protected-your-pc).

**The server says `stale`.** Its supervisor died, usually because the machine restarted. mcctl
cleans it up on the next read; press Start.

**The server says `orphaned`.** A Java process outlived its supervisor. **Kill** cleans it up,
then Start.

**A crashed server keeps restarting, then stops.** That is auto-restart doing its job: three
crashes in ten minutes and it stays down saying why, so a broken plugin cannot grind the machine
all night. The diagnosis under the vitals says what to fix.

**A plugin feature that silently does nothing.** Usually not mcctl. Filter the console to
**Warnings** as well as Errors; several plugins only ever report a misconfiguration at WARN, and
a clean-looking log at ERROR is not a clean log.

## Still stuck

**Feedback → Something broke** in the panel opens a GitHub issue with the version, Java, server
status and panel log already filled in. For a question rather than a bug,
[Q&A](https://github.com/joogiebear/mcctl/discussions/categories/q-a) is the place. **Console →
Export → Upload to mclo.gs** shares the log with your account name already taken out of the
paths, which is what a plugin author will ask for.
