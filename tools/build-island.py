"""Rebuild the original SpawnLoft island. Run with Blender --background --python tools/build-island.py."""
import bpy, math, random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'models'
OUT.mkdir(parents=True, exist_ok=True)
(ROOT / 'art').mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
random.seed(18)

def material(name, color, emission=0, metallic=0):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color, 1)
    bs.inputs['Roughness'].default_value = .78
    bs.inputs['Metallic'].default_value = metallic
    if emission:
        bs.inputs['Emission Color'].default_value = (*color, 1)
        bs.inputs['Emission Strength'].default_value = emission
    return m

grass = [material('Moss '+str(i), c) for i,c in enumerate([(0.22,.34,.19),(.29,.41,.23),(.35,.44,.25),(.18,.29,.18)])]
rock = [material('Slate '+str(i), c) for i,c in enumerate([(.20,.24,.30),(.27,.31,.36),(.32,.35,.39),(.16,.19,.25)])]
soil = material('Earth', (.23,.18,.14))
wood = material('Cedar', (.44,.27,.15))
wood_light = material('Cut timber', (.65,.44,.24))
roof = material('Midnight roof', (.11,.19,.26))
leaves = [material('Pine '+str(i),c) for i,c in enumerate([(.13,.25,.20),(.18,.32,.23),(.24,.39,.26)])]
water = material('River blue', (.19,.46,.62), metallic=.35)
core_mat = material('Core metal', (.10,.14,.24), metallic=.6)
blue = material('Lapis light', (.19,.40,1), 3)
amber = material('Window light', (1,.60,.18), 2)

def group(name):
    o=bpy.data.objects.new(name,None); bpy.context.collection.objects.link(o); return o
surface=group('Surface'); strata=group('Strata'); core=group('Core'); additions=group('Additions')

def cube(name, loc, scale, mat, parent=surface, bevel=0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat); o.parent=parent
    if bevel:
        mod=o.modifiers.new('Soft edges','BEVEL'); mod.width=bevel; mod.segments=1
        bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
    return o

# Hand-shaped footprint, with separate strata for the scroll-driven exploded view.
tiles=[]
for x in range(-4,5):
    for y in range(-3,4):
        if abs(x)+abs(y)>6 or (x==4 and y==2): continue
        z=random.choice([0,.03,.06])
        tiles.append((x,y))
        cube('Grass tile', (x*.7,y*.7,z),(.7,.7,.32),random.choice(grass))
        cube('Earth edge',(x*.7,y*.7,-.29),(.69,.69,.30),soil)
        h=random.uniform(.40,.85)
        cube('Upper stone',(x*.7,y*.7,-.50-h/2),(.68,.68,h),random.choice(rock),strata)
        if abs(x)<4 and abs(y)<3:
            h=random.uniform(.35,.70)
            cube('Lower stone',(x*.61,y*.60,-1.20-h/2),(.60,.60,h),random.choice(rock),strata)

# A small angular stream and stepping stones.
for x,y in [(-4,-1),(-3,-1),(-2,-2),(-1,-2),(0,-2),(1,-3),(2,-3)]:
    cube('Water',(x*.7,y*.7,.18),(.69,.69,.065),water)
for x,y in [(-2,-1.7),(-1.3,-1.5),(-.6,-1.25)]:
    cube('Stepping stone',(x,y,.26),(.35,.32,.13),rock[2],bevel=.035)

# Cabin, facing the camera. Roof made from two pitched planes, timber courses and warm windows.
cx,cy=.40,.48
cube('Cabin foundation',(cx,cy,.28),(2.25,1.82,.28),rock[1])
for z in range(7):
    cube('Timber course',(cx,cy,.51+z*.19),(2.12,1.70,.17),wood if z%2 else wood_light)
for xx in [-.72,1.52]:
    for yy in [-.43,1.39]: cube('Corner post',(xx,yy,1.03),(.15,.15,1.64),wood)
for side in [-1,1]:
    o=cube('Roof pitch',(cx+side*.62,cy,2.23),(1.49,2.12,.14),roof)
    o.rotation_euler.y=side*math.radians(34)
cube('Roof ridge',(cx,cy,2.66),(.14,2.20,.15),core_mat)
for yy in [-.39,1.35]:
    mesh=bpy.data.meshes.new('Gable')
    mesh.from_pydata([(cx-1.04,yy,1.72),(cx+1.04,yy,1.72),(cx,yy,2.59)],[],[(0,1,2)])
    obj=bpy.data.objects.new('Timber gable',mesh); bpy.context.collection.objects.link(obj); obj.parent=surface; obj.data.materials.append(wood)
cube('Door',(.40,-.385,.89),(.47,.04,1.03),core_mat)
cube('Door glass',(.40,-.414,1.08),(.32,.025,.40),amber)
for xx in [-.35,1.12]:
    cube('Window frame',(xx,-.40,1.26),(.48,.08,.49),roof)
    cube('Window',(xx,-.45,1.26),(.37,.025,.37),amber)
    cube('Window bar',(xx,-.47,1.26),(.035,.02,.40),wood)
    cube('Window bar',(xx,-.47,1.26),(.40,.02,.035),wood)
cube('Chimney',(1.04,.91,2.74),(.30,.37,.82),rock[1])
cube('Chimney cap',(1.04,.91,3.17),(.39,.45,.11),rock[2])
for i in range(3): cube('Entry step',(.40,-.65-i*.22,.31-i*.065),(.88,.24,.16),wood_light)

def tree(x,y,s=1,parent=surface):
    cube('Pine trunk',(x,y,.65*s),(.17*s,.17*s,1.1*s),wood,parent)
    for i in range(3):
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=(.68-i*.13)*s, radius2=0, depth=.95*s, location=(x,y,(1.05+i*.43)*s))
        o=bpy.context.object; o.name='Pine crown'; o.rotation_euler.z=math.pi/4; o.data.materials.append(leaves[i]); o.parent=parent
tree(-1.90,1.20,1.12); tree(-2.30,.18,.80); tree(2.20,1.14,.98)
tree(2.22,-.48,.65,additions); tree(-.98,1.85,.70,additions)
for x,y in [(2,-1.3),(-2.8,.8),(-1.3,-.6)]:
    cube('Boulder',(x,y,.32),(.37,.31,.34),rock[2],bevel=.08)
for x in [-1.10,-.55,0,.55]:
    cube('Fence post',(x,1.98,.53),(.09,.09,.66),wood_light)
cube('Fence rail',(-.28,1.98,.65),(1.84,.065,.085),wood)

# Server core lives under the terrain; emissive strips read clearly without expensive effects.
cube('Server chassis',(0,0,-1.91),(2.12,1.48,.68),core_mat,core,bevel=.08)
for z in [-2.12,-1.88,-1.64]:
    cube('Server drawer',(0,-.758,z),(1.94,.035,.15),rock[0],core)
    cube('Status lamp',(-.76,-.787,z),(.07,.035,.06),blue,core)
    cube('Data light',(.22,-.787,z),(.87,.035,.025),blue,core)
for x,y in [(-2.6,-.8),(2.4,.5),(-1.8,1.2)]:
    cube('Lapis ore',(x,y,-.87),(.20,.20,.23),blue,strata,bevel=.03)

# Export only asset geometry and its named animation groups.
# Batch meshes by material within each moving group to keep browser draw calls low.
for parent in [surface,strata,core,additions]:
    buckets={}
    for obj in list(parent.children):
        if obj.type=='MESH': buckets.setdefault(obj.data.materials[0].name,[]).append(obj)
    for objects in buckets.values():
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects: obj.select_set(True)
        bpy.context.view_layer.objects.active=objects[0]
        bpy.ops.object.join()
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(OUT/'spawnloft-island.glb'), export_format='GLB', use_selection=True)

# Matching transparent poster for loading, reduced motion, and WebGL fallback.
scene=bpy.context.scene
scene.render.engine='CYCLES'; scene.cycles.samples=32
scene.render.resolution_x=1400; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.world.color=(.30,.30,.30)
def area(name,loc,power,size,color):
    bpy.ops.object.light_add(type='AREA',location=loc)
    o=bpy.context.object; o.name=name; o.data.energy=power; o.data.shape='DISK'; o.data.size=size; o.data.color=color
    o.rotation_euler=(Vector((0,0,0))-o.location).to_track_quat('-Z','Y').to_euler()
area('Warm key',(-3,-4,8),1100,7,(1,.85,.69))
area('Blue rim',(4,3,5),1400,6,(.40,.60,1))
area('Front fill',(1,-6,1),400,5,(.65,.76,1))
bpy.ops.object.camera_add(location=(8,-12,8))
camera=bpy.context.object; camera.rotation_euler=(Vector((0,0,.25))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'; camera.data.ortho_scale=9.2; scene.camera=camera
scene.view_settings.view_transform='AgX'
scene.render.image_settings.file_format='PNG'; scene.render.filepath=str(ROOT/'art'/'island-poster.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art'/'spawnloft-island.blend'))
bpy.ops.render.render(write_still=True)
print('SpawnLoft island exported:', OUT)
