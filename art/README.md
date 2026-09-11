# SpawnLoft island prototype

Original procedural artwork for SpawnLoft. The editable scene is `spawnloft-island.blend`.
The website loads `public/models/spawnloft-island.glb`; the matching WebP poster is the loading,
reduced-motion, and unavailable-WebGL fallback.

## Direction

A quiet woodland miniature, warm timber, slate, and lapis-blue server lights.
The landing page introduces the world, demonstrates three actual app panels, explains local
ownership, and ends with a download. The hero arrives gently and responds to the pointer;
scrolling advances the Console, Plugins, and Backups panels and separates the island's layers.

## Editing

Open the `.blend` in Blender. Keep these parent objects and their origins:

- `Surface`: grass, cabin, trees, stream.
- `Strata`: stone and ore beneath the world.
- `Core`: the server and its light strips.
- `Additions`: extra trees that grow into the scene.

Export those four groups and their children as glTF Binary (`.glb`), with cameras and lights
excluded. Preserve the parent names because `IslandScene.vue` animates them. Materials use
simple colors and emission; no external textures or proprietary assets are needed.

Meshes are combined by parent and material to reduce browser draw calls. To change individual
blocks, edit the generator or separate a mesh by loose parts in Blender.

## Rebuild from source

From the repository root (Blender 5.2 and Python with Pillow):

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python tools/build-island.py
python -c "from PIL import Image; Image.open('art/island-poster.png').save('public/models/island-poster.webp', quality=88, method=6)"
npm run build
```

The generator recreates the model, overwriting the `.blend` and `.glb`; save hand-edited variants
under a different filename before rebuilding.

## Runtime

Three.js and GSAP load dynamically in the browser. The 3D renderer pauses offscreen, when the
tab is hidden, and after motion settles. Device pixel ratio is capped at 1.6. Reduced motion
uses the poster and ordinary document flow; widths of 900px or less show every panel inline.
The documentation and GitHub release-based download component remain available.

## Checks

- Production VitePress build passes.
- Desktop scroll reaches Console, Plugins, and Backups; inactive chapter links are inert.
- 390px mobile viewport: inline panels, no horizontal overflow.
- Reduced motion: all chapters readable, poster visible, no WebGL canvas created.
- Guide navigation and current installer link verified in the browser.

This is a visual prototype. The scene is illustrative; it does not connect to a local Minecraft server.
