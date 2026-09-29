# The landing-page panel screenshots

`public/img/tabs/console.webp`, `plugins.webp`, `backups.webp` and `performance.webp` are the four
captures in the "Meet your new control room" section, taken from the real SpawnLoft panel at
2558x1392 (a 1279x696 window at 2x, the size `ProductExplorer.vue` expects). Re-take them when the
panel's look changes.

Nothing here needs a package install. It needs Node 22, a Chromium (Chrome preferred), and a
checkout of the SpawnLoft app to run the panel from.

1. Make a throwaway data root, with a neutral path (the backups screen shows it, and your username
   is in the default), and the SpawnLoft theme:

   ```bash
   R=C:/Users/Public/SpawnLoft-shots     # anywhere without your name in it
   mkdir -p $R/appdata/mcctl $R/local $R/data && echo '{"theme":"spawnloft"}' > $R/appdata/mcctl/settings.json
   export APPDATA=$R/appdata LOCALAPPDATA=$R/local MCCTL_DATA_ROOT=$R/data XDG_CONFIG_HOME=$R/appdata
   ```

2. From the SpawnLoft checkout, create and start a server, then start the panel:

   ```bash
   node mcctl.mjs new Weekend-World --paper 26.3 --memory 4G --accept-eula
   node mcctl.mjs set Weekend-World "label=Weekend World"
   node mcctl.mjs start Weekend-World
   node mcctl.mjs ui --port 8790 --no-open
   ```

3. From this repo, install four plugins through the panel, restart the server so they load, and
   check the console is clean (`node mcctl.mjs logs Weekend-World -n 400 --grep " ERROR\]| WARN\]"`):

   ```bash
   SHOTS_OUT=$R/out node tools/screenshots/capture.mjs prepare
   node mcctl.mjs restart Weekend-World
   ```

4. Let the server run a few minutes so the performance chart has samples, then:

   ```bash
   SHOTS_OUT=$R/out node tools/screenshots/capture.mjs shoot
   ```

   Copy the four `.webp` files from `$R/out` into `public/img/tabs/`.

Things that went wrong once, so you do not have to find out:

- **Do not enable automatic backups in the panel.** It registers a task in the operating system's
  scheduler, which is global, not part of the throwaway data root.
- **A plugin that does not support the server's Minecraft version prints a red ERROR at start-up**
  (EssentialsX did on 26.3). Pick plugins that load quietly; the script installs `WorldEdit`,
  `LuckPerms`, `Chunky` and `PlaceholderAPI` by default, so set `SHOTS_PLUGINS` to change that.
- **On Windows, Paper can log a long OSHI error at start-up** if the machine's performance-counter
  registry is broken. Add `-Doshi.os.windows.hkeyperfdata=false` to the server's `jvmFlags` in the
  throwaway `instances.json` (after the default flags) to avoid it.
- The panel remembers which tool is open, and clicking an open tool's tab closes it. The script
  only clicks a tab when its tool is not already showing.
