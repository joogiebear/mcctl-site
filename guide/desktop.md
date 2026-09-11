# The desktop app

A window around the [panel](/guide/panel), plus a native folder picker, first-run setup and
update checking.

## Closing the window does not stop your servers

Servers are detached processes that do not belong to the app. Close the window, sign back in
later, and they are still running with their consoles intact.

## Updates

From **v0.14.0**, SpawnLoft checks for new releases after startup and every six hours while it
is open. New versions download in the background. When one is ready, the header button reads
**Restart to update**.

The app waits for you to restart before replacing the running version. Closing the app with an
update waiting also applies it on exit. Running servers survive either way: only the app window
restarts.

If you are on **v0.13.0 or earlier**, press **Check for updates** in the header to get the release
that enables automatic checking. See the [v0.14.0 release notes](/changelog#v0.14.0) for the details.

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
