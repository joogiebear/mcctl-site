# Questions

## Is it free?

Yes. mcctl is open source under the MIT licence, and the desktop app is a free download. There
is no paid tier, no account and nothing to unlock. If it earns its keep, there is a
[Sponsor](https://github.com/sponsors/joogiebear) button.

## Can my friends join?

Anyone on your home network can join straight away with your PC's local address and the server's
port. Anyone outside it needs a way in, and that is the one thing mcctl deliberately does not do
for you. Opening a port on your router, or running a tunnel such as playit.gg, is a decision about
exposing your machine to the internet, and it should be yours. See [Security](/guide/security).
A Share screen that lays those options out honestly is on the [roadmap](/roadmap).

## Does it work on Mac or Linux?

The desktop app is Windows only for now. The command line underneath runs anywhere Node does,
apart from the scheduler, which speaks to Windows Task Scheduler. Other platforms are on the
[roadmap](/roadmap).

## Do I need to install Java?

Yes, and it is the one thing mcctl cannot do for you, because a Minecraft server *is* a Java
program. Current Minecraft needs Java 25; 1.21 runs on 21, and older versions on 17. The app
checks for Java on first run and links the download if it is missing. Each server picks the
Java it needs from what is installed, so a 1.20 server and a current one can run side by side.

## Which servers can it run?

Paper, Purpur, Folia, Advanced Slime Paper, vanilla, Spigot, CraftBukkit, Fabric and NeoForge,
or a whole modpack from Modrinth. The [server software](/reference/servers) page has the
details, including which ones load plugins and which load mods.

## Can I use a server I already have?

Yes. **Add one I already have** points mcctl at the folder. Nothing is moved or rewritten; the
ports and RCON password are read from its own `server.properties`. Removing it from mcctl later
leaves the folder exactly where it was.

## Does closing the window stop my server?

No. Servers are detached processes that do not belong to the window. Close it, sign back in
tomorrow, and they are still running with their consoles intact.

## Where is my data?

In folders on your disk. Servers, worlds, backups and the jar store live in the data folder,
which **Settings** can move. Nothing is uploaded anywhere.

## Windows says "Windows protected your PC"

The installer is signed, but SmartScreen judges by reputation, and a new publisher earns that
through real installs. Click **More info**, then **Run anyway**. It goes away on its own as the
reputation builds.

## Is it safe to leave the panel open?

The panel only answers the machine it runs on, and refuses requests from any page that is not
itself, port included. There is no way to bind it to another address. See
[Security](/guide/security) for exactly what leaves the machine, which is two things, both on a
click.

## Something broke. Where do I report it?

**Feedback → Something broke** in the panel opens a GitHub issue with the version, Java, server
status and panel log already filled in. For a server that will not start, the
[troubleshooting](/guide/troubleshooting) page covers the failures mcctl recognises.
