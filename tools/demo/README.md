# The landing-page demo video

`public/demo/demo.mp4`, `demo.webm` and `poster.webp` are a scripted run through the real SpawnLoft
panel: create a server, start it, install WorldEdit, take a backup. `.vitepress/theme/demo.json`
holds the step names and timings that `DemoVideo.vue` shows under it. Re-record when the panel's
look changes enough to show.

Nothing here needs ffmpeg or a package install. It needs Node 22, a Chromium (Chrome preferred; the
scripts look for it), and a checkout of the SpawnLoft app to run the panel from.

## Re-recording

1. Start the panel against a throwaway data root, so it cannot touch real servers or settings. Pick a
   neutral path: the panel shows the backups folder on screen, and your username is in the default.

   ```bash
   # from the SpawnLoft checkout; Windows shown, use XDG_CONFIG_HOME on Linux and macOS
   mkdir -p C:/SpawnLoft/appdata/mcctl && echo '{"theme":"spawnloft"}' > C:/SpawnLoft/appdata/mcctl/settings.json
   APPDATA=C:/SpawnLoft/appdata LOCALAPPDATA=C:/SpawnLoft/local MCCTL_DATA_ROOT=C:/SpawnLoft/data \
     node mcctl.mjs ui --port 8790 --no-open
   ```

   The data root must have no servers in it. The run creates `Weekend-World` and needs internet for
   the Paper jar and the plugin.
2. `DEMO_OUT=<somewhere> node tools/demo/record.mjs` drives the panel and keeps every frame the
   browser produces, with timestamps (a few hundred MB). It logs each step as it goes.
3. `DEMO_OUT=<somewhere> node tools/demo/encode.mjs` replays that with the waiting sped up, a drawn
   cursor and click ripples, and records the result as mp4, webm and a poster. Real time: about
   twice the length of the finished video. Both files come out near 3 MB; `?bits=<n>` (pass it as the first argument, for example `"?bits=900000"`) overrides the target, and `?formats=webm` encodes just one.
4. Copy `demo.mp4`, `demo.webm` and `poster.webp` from the output folder to `public/demo/`, and
   `demo.json` to `.vitepress/theme/`.

Stop and delete the throwaway server afterwards. The Windows machine this was recorded on prints one
harmless Java error at startup (a broken performance-counter registry); it shows as `Errors 1` in
the console filter.

`record.mjs` edits nothing but the throwaway data root. Selectors are the panel's own element ids,
so a renamed button is the usual reason a re-record stops with "Timed out waiting for ...".
