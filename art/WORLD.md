# SpawnLoft launch world

Original authored geometry, generated in Blender. All shapes are editable meshes with no third-party model or texture dependencies.

- `spawnloft-world.blend`: complete editable scene, camera, materials and lighting.
- `../public/models/spawnloft-world.glb`: web model, 633 KB and 46 mesh primitives.
- `../public/models/world-poster.webp`: transparent 1500 x 1350 fallback, 108 KB.
- `../tools/build-world.py`: deterministic generator (random seed 31).

Rebuild from the repository root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python tools/build-world.py
```

Pillow must be available in the workstation `python` command for WebP conversion. Blender saves the PNG in `art/world-poster.png` first.

## Animation contract

Six top-level empty groups have origin `(0, 0, 0)`: `World`, `Foundation`, `Core`, `Satellites`, `Portal`, `Details`. Child mesh transforms are baked so rotation/translation of these groups is predictable. Each group is batched by material; the entire model uses 46 primitives.

GLB is Y-up. Bounds: min `(-4.165, -2.265, -2.421)`; max `(3.805, 3.507, 2.421)`. Main island is centered on the origin, cabin faces +Z, monumental portal sits behind and to the left of the cabin. Hero camera `(9, 8, 12)` aimed at `(0, 0.55, 0)` closely matches the orthographic poster. The stone foundation and server core are separate for an exploded animation; the satellites rotate around the common origin. Portal is a stone octagon with lime inner rails, glyphs and floating pixel seeds.

The asset exports geometry/materials only: application lights and camera must be supplied by the renderer. Emissive `Portal ion lime` has strength 1.35, and `Warm windows` 1.7. No textures, transparent surfaces, embedded lights or cameras.
