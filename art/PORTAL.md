# Standalone SpawnLoft portal

Original Blender sculpture authored for the homepage fly-through. No island, cabin, floor or center plane. The center stays completely open.

- `spawnloft-portal.blend`: editable scene, studio lights and perspective camera.
- `../public/models/spawnloft-portal.glb`: 323,220 bytes; 12 mesh primitives.
- `../public/models/portal-poster.webp`: 82,858 bytes; transparent 1500 x 1350 poster.
- `../tools/build-portal.py`: deterministic procedural authoring source.

Rebuild from the repository root:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python tools/build-portal.py
```

Requires Pillow in workstation `python` for final WebP conversion.

## Animation contract

GLB is Y-up, front faces +Z. The aperture center is `(0, 0, 0)`. Three root groups share the origin: `Gate` is the front architectural octagon and light rails; `Tunnel` is the two receding frames and connecting spars; `Shards` contains floating exterior pixel fragments. Child transforms are baked for predictable group animation.

Full asset bounds including fragments: minimum `(-3.596, -2.878, -2.435)` and maximum `(3.559, 3.258, 0.680)`. The core gate's outer radius is approximately 3; the front inner aperture radius is approximately 2.1 and the rear aperture radius approximately 1.9. Receding frames are at Z -1.12 and -2.30. All geometry around the center is hollow, so a camera can advance from positive Z through negative Z.

Poster camera in Three.js coordinates is `(4.5, 4.0, 16)`, aimed at `(0, 0, -0.7)`, perspective 48mm equivalent. Graphite blocks carry cream chamfer faces, layered dark fascia, luminous lime inset rails, four cardinal locks and carved small glyph details. The portal exports no lights, camera or textures. Set application lights and camera independently.

## Website sequence

`PortalScene.vue` uses a perspective camera facing negative Z throughout the sequence. Clamped scroll progress advances it from Z 11.5 (15 on mobile) to Z -5. The gateway aligns to the camera before entry. Progress has no modulo or reset; moving upward retraces the passage. At the end, the portal is behind the camera and the arrival headline remains while the hero scrolls out.

Reduced-motion visitors receive the rendered poster and a normal-height hero. WebGL loading or failure also retains the poster. Rendering pauses offscreen or in a hidden tab, with capped mobile pixel ratio and frame rate.
