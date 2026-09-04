# The desktop app

A window around the [panel](/guide/panel), plus a native folder picker, first-run setup and
update checking.

## Closing the window does not stop your servers

Servers are detached processes that do not belong to the app. Close the window, sign back in
later, and they are still running with their consoles intact.

## Updates

Checking, downloading and installing are three separate presses under **Settings**. Nothing
downloads or installs on its own. This app sits beside long-lived servers, and an update that
restarts the window unannounced is a surprise rather than a feature. Installing warns that running
servers survive it, because the honest answer is that only the window restarts.

## Signed builds and SmartScreen

Every release is signed under a validated publisher identity, which is what turns "Unknown
publisher" into a name in the install prompt.

It does not make SmartScreen go away immediately. SmartScreen is a reputation system, not a
signature check, and reputation accrues through real installs, so a new publisher still gets
warned about. **More info → Run anyway** is the way past it until the reputation builds.

## Which build you have

**Settings → About** names the version and the exact commit the build came from, so a bug report
can name a build rather than a version several builds could share.

## Where things live

The data folder holds the registry of servers, the servers SpawnLoft created, the jar store, backups
and per-server runtime state. **Settings** can move it. Servers you added from a folder you already
had keep living wherever they are; only their runtime state lands in the data folder.
