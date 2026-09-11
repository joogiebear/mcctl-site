"""Rebuild the standalone SpawnLoft portal sculpture with Blender 5.2."""
import bpy, math, random, subprocess, shutil
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public'/'models'; ART=ROOT/'art'
OUT.mkdir(parents=True,exist_ok=True); ART.mkdir(exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False); random.seed(77)
def mat(n,c,emission=0,metal=0):
 m=bpy.data.materials.new(n); m.diffuse_color=(*c,1); m.use_nodes=True; bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*c,1); bs.inputs['Roughness'].default_value=.55; bs.inputs['Metallic'].default_value=metal
 if emission: bs.inputs['Emission Color'].default_value=(*c,1); bs.inputs['Emission Strength'].default_value=emission
 return m
graphite=mat('Obsidian graphite',(.035,.053,.052),metal=.3)
slate=mat('Cut graphite',(.085,.115,.106),metal=.25)
bone=mat('Ceramic bevel',(.66,.68,.53),metal=.12)
dark=mat('Deep aperture',(.018,.027,.027),metal=.4)
lime=mat('Spawn ion lime',(.42,.95,.065),1.8)
limeDark=mat('Secondary ion lime',(.23,.54,.035),.65)
def group(n):
 o=bpy.data.objects.new(n,None); bpy.context.collection.objects.link(o); return o
Gate=group('Gate'); Tunnel=group('Tunnel'); Shards=group('Shards')
def cube(n,loc,dim,m,p,bev=0,edge=None):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object; o.name=n; o.scale=dim; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(m); o.parent=p
 if bev:
  mod=o.modifiers.new('Machined edge','BEVEL'); mod.width=bev; mod.segments=1
  if edge: o.data.materials.append(edge); mod.affect='EDGES'; mod.material=1
  bpy.context.view_layer.objects.active=o; bpy.ops.object.modifier_apply(modifier=mod.name)
 return o
def beam(n,a,b,width,depth,m,p,bevel=0,edge=None):
 a,b=Vector(a),Vector(b); o=cube(n,(a+b)*.5,(width,depth,(b-a).length),m,p,bevel,edge); o.rotation_euler=(b-a).to_track_quat('Z','Y').to_euler(); return o
def ring(n,radius,y,width,depth,m,p,bevel=0,edge=None):
 for i in range(8):
  a=math.tau*i/8+math.pi/8; b=math.tau*(i+1)/8+math.pi/8
  beam(n,(math.sin(a)*radius,y,math.cos(a)*radius),(math.sin(b)*radius,y,math.cos(b)*radius),width,depth,m,p,bevel,edge)
# Front gate: oversized dark chamfered blocks, thin ceramic bevel and bright inset aperture rail.
ring('Front architectural block',2.60,0,.74,.60,graphite,Gate,.065,bone)
ring('Raised inset face',2.60,-.325,.55,.08,slate,Gate,.025)
ring('Aperture ceramic lip',2.23,-.34,.13,.095,bone,Gate,.018)
ring('Aperture energy rail',2.145,-.398,.053,.025,lime,Gate)
ring('Outer narrow trim',2.94,-.19,.045,.05,dark,Gate)
# Cardinal key blocks bring an instantly recognizable silhouette and front/back structure.
for i in range(4):
 a=math.tau*i/4; x,z=math.sin(a)*2.51,math.cos(a)*2.51
 o=cube('Gate lock housing',(x,-.12,z),(.41,.90,.65),graphite,Gate,.045,bone); o.rotation_euler.y=a
 for j in range(3):
  # Arrange three compact signals tangentially across the key.
  tx=(j-1)*.082; xx=x+math.cos(a)*tx; zz=z-math.sin(a)*tx
  o=cube('Gate status glyph',(xx,-.595,zz),(.035,.026,.13),lime,Gate); o.rotation_euler.y=a
# Carved indicators and bolt details spaced around the stone fascia.
for i in range(8):
 a=math.tau*i/8+math.pi/4; x,z=math.sin(a)*2.60,math.cos(a)*2.60
 for offset in [-.14,.14]:
  xx=x+math.cos(a)*offset; zz=z-math.sin(a)*offset
  o=cube('Recessed aperture mark',(xx,-.38,zz),(.045,.012,.15),dark,Gate); o.rotation_euler.y=a
 for offset in [-.24,.24]:
  xx=x+math.cos(a)*offset; zz=z-math.sin(a)*offset
  cube('Machined fastener',(xx,-.375,zz),(.042,.02,.042),bone,Gate,.006)
# Two nested depth frames. All apertures remain completely open.
for index,(y,r,w) in enumerate([(1.12,2.45,.35),(2.30,2.29,.27)]):
 ring('Receding dark frame',r,y,w,.23,graphite,Tunnel,.035,bone)
 ring('Receding energy edge',r-w*.50-.035,y-.135,.045,.022,limeDark,Tunnel)
# Eight long architectural spars turn the rings into a sculptural tunnel.
for i in range(8):
 a=math.tau*i/8+math.pi/8
 beam('Tunnel connecting spar',(math.sin(a)*2.73,.23,math.cos(a)*2.73),(math.sin(a)*2.38,2.40,math.cos(a)*2.38),.105,.105,slate,Tunnel,.018)
# Floating fragmented voxels orbit outside the opening; never obscure the fly-through.
for i,(x,y,z,size) in enumerate([(-3.42,-.02,1.82,.21),(-3.16,.52,1.26,.13),(-3.40,.8,-1.81,.29),(-2.94,-.58,-2.77,.15),(3.17,.15,1.41,.31),(3.48,.68,.94,.12),(2.96,-.18,-2.35,.19),(.86,.65,3.18,.15),(-.94,-.16,3.15,.10)]):
 o=cube('Floating stone fragment',(x,y,z),(size,size,size),slate if i%3 else bone,Shards,.018); o.rotation_euler=(.17*i,.23*i,.11*i)
 if i%2==0:
  o=cube('Floating ion splinter',(x+.17,y-.13,z-.12),(.055,.055,.11),lime,Shards); o.rotation_euler=(.1*i,.2*i,.15*i)
# Consolidate each animated group into one mesh per material; preserve shared origin.
for p in [Gate,Tunnel,Shards]:
 # Separate material slots first so each resulting child is a single primitive.
 for o in list(p.children):
  if o.type=='MESH' and len(o.data.materials)>1:
   bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active=o; bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='MATERIAL'); bpy.ops.object.mode_set(mode='OBJECT')
 buckets={}
 for o in list(p.children):
  if o.type=='MESH': buckets.setdefault(o.data.materials[0].name,[]).append(o)
 for name,objs in buckets.items():
  bpy.ops.object.select_all(action='DESELECT')
  for o in objs:o.select_set(True)
  bpy.context.view_layer.objects.active=objs[0]; bpy.ops.object.join(); o=bpy.context.object; o.name=p.name+'_'+name.replace(' ','_'); bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.export_scene.gltf(filepath=str(OUT/'spawnloft-portal.glb'),export_format='GLB',use_selection=True)
scene=bpy.context.scene; scene.render.engine='CYCLES'; scene.cycles.samples=48; scene.render.resolution_x=1500; scene.render.resolution_y=1350; scene.render.resolution_percentage=100; scene.render.film_transparent=True; scene.world.color=(.03,.045,.04)
def light(n,loc,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=loc); o=bpy.context.object; o.name=n; o.data.energy=power; o.data.shape='DISK'; o.data.size=size; o.data.color=color; o.rotation_euler=(Vector((0,.8,0))-o.location).to_track_quat('-Z','Y').to_euler()
light('Cream key',(-4,-7,7),1800,6,(1,.93,.77)); light('Green rim',(3,4,4),1400,4,(.71,1,.42)); light('Cool fill',(5,-4,-1),1100,5,(.65,.85,.91))
bpy.ops.object.camera_add(location=(4.5,-16,4.0)); cam=bpy.context.object; cam.rotation_euler=(Vector((0,.7,0))-cam.location).to_track_quat('-Z','Y').to_euler(); cam.data.type='PERSP'; cam.data.lens=48; scene.camera=cam
scene.view_settings.view_transform='AgX'; scene.view_settings.look='AgX - Medium High Contrast'; scene.view_settings.exposure=-.25
# Keep all production outputs in the declared asset paths.
scene.render.image_settings.file_format='PNG'; temp=OUT/'portal-poster.png'; scene.render.filepath=str(temp)
bpy.ops.wm.save_as_mainfile(filepath=str(ART/'spawnloft-portal.blend')); bpy.ops.render.render(write_still=True)
python=shutil.which('python')
if python:
 subprocess.run([python,'-c',"from PIL import Image; import sys; Image.open(sys.argv[1]).save(sys.argv[2],quality=94,method=6)",str(temp),str(OUT/'portal-poster.webp')],check=True); temp.unlink()
print('PORTAL COMPLETE')
