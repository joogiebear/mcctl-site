"""SpawnLoft launch world. Blender 5.2: blender --background --python tools/build-world.py"""
import bpy, math, random, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'models'; OUT.mkdir(parents=True,exist_ok=True)
ART=ROOT/'art'; ART.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
random.seed(31)
def mat(name,color,emission=0,metal=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=(*color,1); p.inputs['Roughness'].default_value=.67; p.inputs['Metallic'].default_value=metal
 if emission: p.inputs['Emission Color'].default_value=(*color,1); p.inputs['Emission Strength'].default_value=emission
 return m
moss=[mat('Fern '+str(i),c) for i,c in enumerate([(.19,.32,.15),(.27,.39,.19),(.35,.45,.22),(.12,.24,.13)])]
rock=[mat('Basalt '+str(i),c) for i,c in enumerate([(.16,.21,.22),(.22,.27,.28),(.31,.35,.34),(.10,.15,.17)])]
soil=mat('Cut earth',(.23,.19,.13)); wood=mat('Smoked oak',(.25,.15,.075)); cedar=mat('Golden cedar',(.52,.32,.13)); end=mat('Honey endgrain',(.71,.49,.23))
roof=mat('Oxidized copper',(.10,.24,.23),metal=.25); dark=mat('Ink hardware',(.045,.073,.081),metal=.55)
cream=mat('Limestone',(.64,.65,.48)); lime=mat('Portal ion lime',(.43,.95,.075),emission=1.35); amber=mat('Warm windows',(1,.56,.15),emission=1.7)
water=mat('Glacial water',(.14,.53,.47),metal=.25); foam=mat('Water glint',(.64,.86,.68),emission=.2)
leaf=[mat('Evergreen '+str(i),c) for i,c in enumerate([(.08,.20,.13),(.15,.30,.15),(.25,.40,.18)])]
def group(n):
 o=bpy.data.objects.new(n,None); bpy.context.collection.objects.link(o); return o
World=group('World'); Foundation=group('Foundation'); Core=group('Core'); Satellites=group('Satellites'); Portal=group('Portal'); Details=group('Details')
def cube(n,loc,dim,m,p=World,bev=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=n; o.scale=dim; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(m); o.parent=p
 if bev:
  mod=o.modifiers.new('Crafted edge','BEVEL'); mod.width=bev; mod.segments=1; bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
 return o
def beam(n,a,b,w,d,m,p=World):
 a,b=Vector(a),Vector(b); o=cube(n,(a+b)/2,(w,d,(b-a).length),m,p); o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler(); return o
def cone(n,loc,r1,r2,h,m,p=World,verts=4):
 bpy.ops.mesh.primitive_cone_add(vertices=verts,radius1=r1,radius2=r2,depth=h,location=loc); o=bpy.context.object; o.name=n; o.data.materials.append(m); o.rotation_euler.z=math.pi/4; o.parent=p; return o
# The island is a hand-cut stepped volume, with no flat circular base.
for ix in range(-6,7):
 for iy in range(-5,6):
  if (ix/6.2)**2+(iy/5.2)**2>1 or (ix==5 and iy==-2): continue
  x,y=ix*.44,iy*.44; top=.04+random.choice([0,.015,.025]);
  cube('Velvet grass',(x,y,top),(.442,.442,.19),random.choice(moss))
  cube('Soil lip',(x,y,-.16),(.435,.435,.22),soil)
  edge=(ix/6.2)**2+(iy/5.2)**2
  h=.40+(1-edge)*.72+random.uniform(-.1,.20)
  cube('Fractured basalt',(x,y,-.26-h/2),(.43,.43,h),random.choice(rock),Foundation)
  if edge<.54:
   h=.25+(.54-edge)*.85+random.uniform(0,.3)
   cube('Deep basalt',(x*.82,y*.82,-1.14-h/2),(.37,.37,h),random.choice(rock),Foundation)
# Watercourse runs to front left, with graphic falling ribbons.
for x,y in [(-1.95,-.44),(-1.95,-.88),(-1.51,-.88),(-1.51,-1.32),(-1.51,-1.76)]:
 cube('Spring surface',(x,y,.155),(.43,.44,.048),water)
for x,h in [(-1.68,1.30),(-1.50,1.87),(-1.32,1.47)]:
 cube('Falling spring',(x,-1.995,.10-h/2),(.15,.065,h),water,Foundation)
 cube('Water filament',(x-.05,-2.035,.10-h/2),(.018,.015,h),foam,Foundation)
 for j in range(2): cube('Falling droplets',(x,-2.01,-h-.15-j*.19),(.06,.06,.11),foam,Details)
# Cabin on the front/right. Exposed structure, deep eaves, porch and inset glass.
cx,cy=.82,-.17
cube('House plinth',(cx,cy,.25),(1.85,1.58,.25),rock[2],bev=.035)
for j in range(8): cube('Oak log course',(cx,cy,.46+j*.16),(1.73+(j%2)*.09,1.42,.145),cedar if j%2 else wood)
for x in [cx-.85,cx+.85]:
 for y in [cy-.73,cy+.73]: cube('Post end',(x,y,1.0),(.14,.14,1.48),end)
# Roof pitched east-west, tiled seam detail.
for side in [-1,1]:
 o=cube('Standing seam roof',(cx+side*.50,cy,2.02),(1.28,1.86,.13),roof); o.rotation_euler.y=side*math.radians(40)
 for k in range(8):
  yy=cy-.87+k*.25
  beam('Copper standing seam',(cx+side*.03,yy,2.40),(cx+side*.99,yy,1.60),.026,.032,dark)
 beam('Fascia front',(cx,cy-.95,2.45),(cx+side*1.03,cy-.95,1.58),.11,.10,end)
cube('Ridge cap',(cx,cy,2.46),(.12,2.01,.12),dark)
# Closed gables in two triangles.
for yy in [cy-.72,cy+.72]:
 mesh=bpy.data.meshes.new('Gable mesh'); mesh.from_pydata([(cx-.86,yy,1.51),(cx+.86,yy,1.51),(cx,yy,2.32)],[],[(0,1,2)]); o=bpy.data.objects.new('Oak gable',mesh); bpy.context.collection.objects.link(o); o.parent=World; o.data.materials.append(cedar)
# Front door and mullioned square windows.
cube('Door inset',(cx,cy-.724,.82),(.40,.035,.96),dark)
cube('Door glow',(cx,cy-.75,1.00),(.25,.024,.41),amber)
cube('Door handle',(cx+.125,cy-.78,.76),(.03,.06,.10),end)
for x in [cx-.59,cx+.59]:
 cube('Window casing',(x,cy-.76,1.04),(.40,.095,.48),dark)
 cube('Window warm pane',(x,cy-.819,1.04),(.30,.016,.37),amber)
 cube('Window crossbar',(x,cy-.833,1.04),(.035,.018,.39),end)
 cube('Window crossbar',(x,cy-.834,1.04),(.33,.018,.038),end)
 cube('Flower box',(x,cy-.85,.76),(.48,.17,.13),wood)
 for i in range(4): cube('Box greenery',(x-.15+i*.10,cy-.86,.86),(.075,.12,.10),leaf[2])
# Side window visible from hero camera.
cube('Side window frame',(cx+.925,cy+.02,1.08),(.035,.57,.56),dark)
cube('Side window light',(cx+.946,cy+.02,1.08),(.025,.45,.44),amber)
cube('Side mullion',(cx+.962,cy+.02,1.08),(.022,.034,.46),end)
# Porch deck and staircase.
for i in range(7): cube('Porch board',(cx-.78+i*.26,cy-1.02,.32),(.24,.58,.10),end)
for j in range(3): cube('Broad entry stair',(cx,cy-1.30-j*.17,.28-j*.057),(.72,.22,.10),rock[2])
for x in [cx-.79,cx+.79]:
 cube('Porch pillar',(x,cy-1.21,.79),(.10,.10,1.0),wood)
 cube('Porch cap',(x,cy-1.21,1.33),(.15,.15,.09),end)
 cube('Porch lantern case',(x,cy-1.21,1.42),(.12,.12,.13),dark)
 cube('Porch lantern light',(x,cy-1.21,1.41),(.13,.13,.08),amber)
cube('Brick chimney',(1.40,.29,2.44),(.28,.35,.93),rock[2])
for j in range(5): cube('Chimney course',(1.40,.29,2.05+j*.16),(.305,.365,.035),rock[0])
cube('Chimney crown',(1.40,.29,2.95),(.40,.45,.10),cream)
# Spawn portal: octagonal monumental stone ring enclosing luminous inner rail.
px,py,pz=-1.10,.78,1.94
for i in range(8):
 a=(i/8)*math.tau+math.pi/8; b=((i+1)/8)*math.tau+math.pi/8
 aa=(px+math.sin(a)*1.49,py,pz+math.cos(a)*1.49); bb=(px+math.sin(b)*1.49,py,pz+math.cos(b)*1.49)
 beam('Portal basalt segment',aa,bb,.30,.38,rock[1 if i%2 else 2],Portal)
 aa=(px+math.sin(a)*1.28,py-.205,pz+math.cos(a)*1.28); bb=(px+math.sin(b)*1.28,py-.205,pz+math.cos(b)*1.28)
 beam('Portal luminous rail',aa,bb,.065,.045,lime,Portal)
 # Glyph on each outer block.
 angle=(a+b)/2
 for g in range(2):
  x=px+math.sin(angle)*1.48+(g-.5)*.08; z=pz+math.cos(angle)*1.48
  cube('Portal carved glyph',(x,py-.211,z),(.036,.012,.085),lime,Portal)
for x in [px-.74,px+.74]:
 cube('Portal footing',(x,py,.27),(.52,.62,.36),rock[2],Portal,bev=.04)
 cube('Portal foundation marker',(x,py-.33,.36),(.15,.024,.06),lime,Portal)
# Floating pixel seeds trace a broken inner spiral without blocking the world behind.
for i in range(18):
 a=i*.67; r=.20+i*.043
 cube('Portal particles',(px+math.cos(a)*r,py-.02,pz+math.sin(a)*r),(.045,.05,.065),lime,Portal)
# Walkway to the portal with asymmetric cut stone.
for i,(x,y) in enumerate([(-.7,-.45),(-.9,-.13),(-1.1,.2)]):
 cube('Portal approach slab',(x,y,.18),(.43,.33,.14),cream,bev=.025)
# Layered voxel conifers with branch tiers, trunk rings, random silhouette.
def tree(x,y,s=1,p=World,z=.12):
 cube('Pine bark',(x,y,z+.65*s),(.13*s,.13*s,1.30*s),wood,p)
 for i in range(4):
  r=(.55-i*.10)*s
  cone('Pine bough',(x,y,z+(.8+i*.36)*s),r,.06*s,.75*s,leaf[i%3],p)
  # small offset horizontal branch shadows
  if i<3: cube('Branch',(x,y,z+(.69+i*.36)*s),(r*1.1,.075*s,.07*s),wood,p)
for x,y,s in [(1.86,1.15,1.20),(.80,1.58,.85),(2.10,.40,.72),(-2.15,.74,.78),(-2.08,-.16,.62),(-.3,1.95,.65)]: tree(x,y,s)
# Thin fence and camp details.
for j in range(5):
 x=.08+j*.45; cube('Fence upright',(x,1.97,.43),(.07,.07,.65),cedar,Details)
for z in [.35,.63]: cube('Fence rail',(.98,1.97,z),(1.94,.055,.065),end,Details)
for x,y in [(2.20,-.75),(-.35,-1.85),(-2.18,-1.12),(1.82,-1.41)]:
 cube('Ground boulder',(x,y,.23),(.24,.25,.22),rock[2],Details,bev=.045)
 for j in range(3): cube('Meadow tuft',(x+.15+j*.065,y-.13,.20),(.035,.04,.19+j*.025),moss[2],Details)
for x,y in [(-.45,-1.52),(-1.97,-1.31),(.08,1.53)]:
 cube('Mushroom stem',(x,y,.22),(.035,.035,.17),cream,Details); cube('Mushroom cap',(x,y,.32),(.16,.16,.055),end,Details,bev=.02)
# Machinery below the stone, framed and readable at small scale.
cube('Server core shell',(0,0,-1.75),(1.65,1.35,.55),dark,Core,bev=.055)
for z in [-1.96,-1.78,-1.60]:
 cube('Server drawer',(0,-.69,z),(1.43,.07,.12),rock[1],Core)
 cube('Status lime',(-.55,-.731,z),(.06,.017,.045),lime,Core)
 for x in [.05,.18,.31,.44,.57]: cube('Data vents',(x,-.733,z),(.055,.013,.025),lime,Core)
for x in [-.81,.81]: cube('Core support',(x,0,-1.78),(.07,1.53,.69),cream,Core)
cube('Core underglow',(0,0,-2.05),(1.10,.90,.05),lime,Core)
for x,y in [(-2.18,-.55),(1.76,-1.10),(.87,-1.76),(-1.20,1.75)]:
 for j in range(3): cube('Lime mineral',(x+j*.07,y,-.63-j*.14),(.09,.08,.12),lime,Foundation)
# Twin satellite worlds, each offset height/scale and able to orbit as one assembly.
for sx,sy,sz,ss in [(-3.62,.45,.48,.65),(3.26,.25,-.51,.51)]:
 for ix in range(-1,2):
  for iy in range(-1,2):
   if abs(ix)+abs(iy)>1: continue
   x,y=sx+ix*.36,sy+iy*.36
   cube('Satellite moss',(x,y,sz),(.37,.37,.14),moss[1],Satellites)
   h=.34+(.2 if ix==iy==0 else 0)
   cube('Satellite stone',(x,y,sz-.07-h/2),(.35,.35,h),rock[1+(ix%2)],Satellites)
 tree(sx,sy,ss,Satellites,sz+.07)
 cube('Satellite lamp',(sx+.25,sy-.26,sz+.16),(.08,.08,.19),lime,Satellites)
# Batch into one draw per material per animated group.
for p in [World,Foundation,Core,Satellites,Portal,Details]:
 buckets={}
 for o in list(p.children):
  if o.type=='MESH': buckets.setdefault(o.data.materials[0].name,[]).append(o)
 for name,objects in buckets.items():
  bpy.ops.object.select_all(action='DESELECT')
  for o in objects:o.select_set(True)
  bpy.context.view_layer.objects.active=objects[0]; bpy.ops.object.join(); bpy.context.object.name=p.name+'_'+name.replace(' ','_')
  # Bake locations so mesh vertices are in common root coordinates.
  bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(OUT/'spawnloft-world.glb'),export_format='GLB',use_selection=True)
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=40
scene.render.resolution_x=1500; scene.render.resolution_y=1350; scene.render.resolution_percentage=100
scene.render.film_transparent=True; scene.world.color=(.045,.065,.045)
def area(n,loc,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=loc); o=bpy.context.object; o.name=n; o.data.energy=power; o.data.shape='DISK'; o.data.size=size; o.data.color=color; o.rotation_euler=(Vector((0,0,.4))-o.location).to_track_quat('-Z','Y').to_euler()
area('Softbox warm',(-3,-5,8),800,7,(1,.88,.72)); area('Lime rim',(-3,5,5),850,5,(.71,1,.51)); area('Silver key',(5,-3,6),650,5,(.78,.89,1))
bpy.ops.object.light_add(type='POINT',location=(-1.1,.35,1.8)); bpy.context.object.data.energy=45; bpy.context.object.data.color=(.60,1,.24); bpy.context.object.data.shadow_soft_size=1.2
bpy.ops.object.camera_add(location=(9,-12,8)); cam=bpy.context.object; cam.rotation_euler=(Vector((0,0,.55))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='ORTHO'; cam.data.ortho_scale=9.4; scene.camera=cam
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'; scene.view_settings.exposure=-.35; scene.render.image_settings.file_format='PNG'; scene.render.filepath=str(ART/'world-poster.png')
bpy.ops.wm.save_as_mainfile(filepath=str(ART/'spawnloft-world.blend'))
bpy.ops.render.render(write_still=True)
# Pillow runs in the workstation Python, outside Blender's bundled runtime.
import subprocess, shutil
python=shutil.which('python')
if python:
 subprocess.run([python,'-c',"from PIL import Image; import sys; Image.open(sys.argv[1]).save(sys.argv[2],quality=93,method=6)",str(ART/'world-poster.png'),str(OUT/'world-poster.webp')],check=True)
print('WORLD COMPLETE',OUT/'spawnloft-world.glb')
