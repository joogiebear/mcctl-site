# Questions

## Is it free?

The desktop app is a free download, and SpawnLoft is open source under the MIT licence.
You can get started without an account. If it earns its keep, there is a
[Sponsor](https://github.com/sponsors/joogiebear) button.

## Can my friends join?

Anyone on your home network can join straight away with your PC's local address and the server's port. Anyone outside it needs a way in, and that is the one thing SpawnLoft deliberately does not do for you: opening a port on your router, or running a tunnel such as playit.gg, is a decision about exposing your machine to the internet, and it should be yours. See [Sharing your server](/guide/sharing) and [Security](/guide/security). A Share screen that lays the options out is on the [roadmap](/roadmap).

## Does it work on Mac or Linux?

Yes. SpawnLoft runs on Windows, Apple Silicon and Intel Macs, and Linux: a `.deb` for Ubuntu and Debian and an `.rpm` for Fedora and the RHEL family, each for x64 and arm64. The Mac app needs macOS 13+; managed MySQL needs macOS 15+ on a Mac and x64 on Linux. Schedules, automatic backups, managed Redis and automatic app updates work everywhere. For a Linux server with no screen there is `spawnloft-cli`, the command line on its own. See [downloads and platform support](/guide/beta).

## Can I match the app to the website?

**Settings → Appearance** offers **Classic** and **SpawnLoft**.
Classic keeps the original palette; SpawnLoft follows the website's look.

## Can an AI assistant run my server?

If you connect one. `spawnloft mcp` lets an AI app you choose (Claude Desktop, Claude Code, LM Studio) check status, read the console, back up, install plugins, and change plugin configuration files. It needs no account and opens no port; the app asks before each change, and restore, force-kill and Minecraft version upgrades are off unless you enable them. What a tool returns is sent to the AI provider, so read [what the provider sees](/guide/ai-assistants#what-the-ai-provider-sees) first.

## Does SpawnLoft update itself?

Yes. It checks 20 seconds after it starts and every six hours, downloads in the background, and asks you to **Restart to update**. Servers keep running through it. **Settings → Updates → Get beta builds** follows the betas. On a Linux machine with no desktop, `spawnloft-cli` has no updater; install a newer package. See [Downloads & platforms](/guide/beta#automatic-updates-and-beta-builds).

## How do I back up my world?

The **Backups** tool, or `spawnloft backup <name>`. A running server is flushed first, so the snapshot is coherent. Schedule nightly backups in **Schedule**, and set a second location with `spawnloft config set-backup-mirror`. See [Backups](/guide/backups).

## Will scheduled backups run when I am logged out?

Not by default. Tasks run while you are signed in, screen locked included. On Linux, `spawnloft task linger on` keeps them running after logout. Windows never runs them signed out, because that would require storing your Windows password. See [How it works](/guide/how-it-works#scheduled-work).

## Will SpawnLoft fill in my plugin's database config?

No. database creation and attachment provide connection details for you to
copy yourself. The old config-writing helpers have been removed. Follow the plugin author's
instructions and verify the plugin connects. See [Databases](/guide/databases).

## Do I need to install Java?

Yes, and it is the one thing SpawnLoft cannot do for you, because a Minecraft server *is* a Java
program. Current Minecraft needs Java 25; 1.21 runs on 21, and older versions on 17. The app
checks for Java on first run and links the download if it is missing. Each server picks the
Java it needs from what is installed, so a 1.20 server and a current one can run side by side.

## Which servers can it run?

Paper, Purpur, Folia, Advanced Slime Paper, vanilla, Spigot, CraftBukkit, Fabric and NeoForge,
or a whole modpack from Modrinth. The [server software](/reference/servers) page has the
details, including which ones load plugins and which load mods.

## Can I use a server I already have?

Yes. **Add one I already have** points SpawnLoft at the folder. Nothing is moved or rewritten; the
ports and RCON password are read from its own `server.properties`. Removing it from SpawnLoft later
leaves the folder exactly where it was.

## Does closing the window stop my server?

No. Servers are detached processes that do not belong to the window. Close it, sign back in
tomorrow, and they are still running with their consoles intact.

## Where is my data?

In folders on your disk. Servers, worlds, backups and the jar store live in the data folder,
which **Settings** can move. Nothing is uploaded anywhere.

## Windows says "Windows protected your PC"

The stable installer is signed, but SmartScreen judges by reputation, and a new publisher earns that
through real installs. Click **More info**, then **Run anyway**. It goes away on its own as the
reputation builds.

Windows installers are signed, and Mac installers are Developer ID signed and Apple-notarized. See [Downloads & platforms](/guide/beta).

## Is it safe to leave the panel open?

The panel only answers the machine it runs on, and refuses requests from any page that is not
itself, port included. There is no way to bind it to another address. See
[Security](/guide/security) for local access controls, downloads, and optional sharing.

## Something broke. Where do I report it?

**Feedback → Something broke** in the panel opens a GitHub issue with the version, Java, server
status and panel log already filled in. For a server that will not start, the
[troubleshooting](/guide/troubleshooting) page covers the failures SpawnLoft recognises.
