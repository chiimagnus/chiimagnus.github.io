#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_d20_with_face_nodes_cc0.py (CC0)

Generate a D20 GLB for Three.js / React Three Fiber + physics.

- Pivot at center (origin), +Y up.
- One D20 mesh with PBR textures embedded in GLB (BaseColor/Normal/MetalRough/AO).
- 20 helper nodes named Face_1..Face_20.
  Each Face_N is a small plane whose local +Z points outward along that face normal.

Requirements:
  pip install numpy pillow trimesh
"""
import math, random, argparse, pathlib
import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

def normalize(v):
    v=np.array(v,dtype=np.float64)
    return v/(np.linalg.norm(v)+1e-12)

def rotation_from_z_to_vec(target):
    t=normalize(target)
    z=np.array([0.0,0.0,1.0],dtype=np.float64)
    c=float(np.dot(z,t))
    if c>0.999999: return np.eye(4)
    if c<-0.999999: return trimesh.transformations.rotation_matrix(math.pi,[1,0,0])
    axis=normalize(np.cross(z,t))
    angle=math.acos(max(-1.0,min(1.0,c)))
    return trimesh.transformations.rotation_matrix(angle,axis)

def make_noise(size, block=8, seed=0):
    w,h=size
    img=Image.new("L",(w,h),0); px=img.load()
    for y in range(h):
        by=y//block
        for x in range(w):
            bx=x//block
            px[x,y]=random.Random(seed + bx*928371 + by*192837).randint(0,255)
    return img.filter(ImageFilter.GaussianBlur(radius=block*0.35))

def normal_from_height(height_img, strength=2.0):
    h=np.asarray(height_img,dtype=np.float32)/255.0
    gx=np.zeros_like(h); gy=np.zeros_like(h)
    gx[:,1:-1]=(h[:,2:]-h[:,:-2])*0.5
    gy[1:-1,:]=(h[2:,:]-h[:-2,:])*0.5
    nx=-gx*strength; ny=-gy*strength; nz=np.ones_like(h)
    l=np.sqrt(nx*nx+ny*ny+nz*nz)+1e-8
    nx/=l; ny/=l; nz/=l
    R=((nx*0.5+0.5)*255).clip(0,255).astype(np.uint8)
    G=((ny*0.5+0.5)*255).clip(0,255).astype(np.uint8)
    B=((nz*0.5+0.5)*255).clip(0,255).astype(np.uint8)
    return Image.fromarray(np.dstack([R,G,B]).astype(np.uint8))

def assign_d20_numbers(face_centers):
    dirs=face_centers/(np.linalg.norm(face_centers,axis=1,keepdims=True)+1e-12)
    used=set(); pairs=[]
    for i in range(len(dirs)):
        if i in used: continue
        target=-dirs[i]
        dots=dirs@target
        for k in np.argsort(-dots):
            k=int(k)
            if k!=i and k not in used:
                used.add(i); used.add(k)
                pairs.append((i,k,float(dots[k])))
                break
    pairs.sort(key=lambda x:x[2], reverse=True)
    mapping={}; num=1
    for i,j,_ in pairs[:10]:
        mapping[i]=num; mapping[j]=21-num; num+=1
    return [mapping[i] for i in range(len(dirs))]

def build_d20(radius=0.5, atlas_size=1024, cols=5, rows=4, seed=9):
    base=trimesh.creation.icosahedron()
    V=base.vertices
    V=V/np.linalg.norm(V,axis=1,keepdims=True)*radius
    F=base.faces.copy()
    fv=V[F]
    centers=fv.mean(axis=1)
    normals=np.cross(fv[:,1]-fv[:,0], fv[:,2]-fv[:,0])
    normals=normals/(np.linalg.norm(normals,axis=1,keepdims=True)+1e-12)
    flip=(np.sum(normals*centers,axis=1)<0)
    normals[flip]*=-1.0
    fv[flip]=fv[flip][:,[0,2,1],:]
    numbers=assign_d20_numbers(centers)

    vertices=fv.reshape(-1,3).astype(np.float32)
    faces=np.arange(len(vertices),dtype=np.int64).reshape(-1,3)

    cell_w=1.0/cols; cell_h=1.0/rows
    uv=np.zeros((len(vertices),2),dtype=np.float32)
    margin=0.10
    for fi in range(20):
        ci=fi%cols; ri=fi//cols
        u0=ci*cell_w
        v0=1.0-(ri+1)*cell_h
        A=np.array([0.5,1.0-margin]); B=np.array([margin,margin]); C=np.array([1.0-margin,margin])
        tri=np.stack([A,B,C],axis=0)
        tri[:,0]=u0+tri[:,0]*cell_w
        tri[:,1]=v0+tri[:,1]*cell_h
        uv[fi*3:(fi+1)*3]=tri.astype(np.float32)

    W=H=atlas_size
    n1=make_noise((W,H),block=10,seed=seed)
    n2=make_noise((W,H),block=28,seed=seed+11)
    n=ImageChops.add(n1,n2,scale=2.0)
    n_arr=np.asarray(n,dtype=np.float32)/255.0

    gold=np.zeros((H,W,3),dtype=np.float32)
    gold[:,:,0]=0.62+0.20*(n_arr-0.5)
    gold[:,:,1]=0.50+0.16*(n_arr-0.5)
    gold[:,:,2]=0.18+0.10*(n_arr-0.5)
    base_img=Image.fromarray((gold.clip(0,1)*255).astype(np.uint8))

    height=(0.45*n_arr + 0.55*(np.asarray(make_noise((W,H),block=6,seed=seed+3),dtype=np.float32)/255.0)).clip(0,1)
    height_img=Image.fromarray((height*255).astype(np.uint8)).convert("L")

    try:
        font=ImageFont.truetype("DejaVuSans-Bold.ttf", size=int(atlas_size*0.08))
    except Exception:
        font=ImageFont.load_default()
    ivory=(240,236,220)
    draw=ImageDraw.Draw(base_img)
    cell_px_w=W//cols; cell_px_h=H//rows

    for fi in range(20):
        num=numbers[fi]
        ci=fi%cols; ri=fi//cols
        x0=ci*cell_px_w; y0=ri*cell_px_h
        pad=int(0.14*cell_px_w)
        box=(x0+pad,y0+pad,x0+cell_px_w-pad,y0+cell_px_h-pad)
        text=str(num)
        bbox=draw.textbbox((0,0),text,font=font)
        tw=bbox[2]-bbox[0]; th=bbox[3]-bbox[1]
        cx=(box[0]+box[2])//2; cy=(box[1]+box[3])//2
        pos=(int(cx-tw/2), int(cy-th/2))

        shadow=Image.new("L",(W,H),0)
        ImageDraw.Draw(shadow).text(pos,text,font=font,fill=200)
        shadow_blur=shadow.filter(ImageFilter.GaussianBlur(radius=2.2))
        base_img=ImageChops.subtract(base_img, Image.merge("RGB",(shadow_blur,shadow_blur,shadow_blur)))
        ImageDraw.Draw(base_img).text(pos,text,font=font,fill=ivory)

        digit_mask=Image.new("L",(W,H),0)
        ImageDraw.Draw(digit_mask).text(pos,text,font=font,fill=255)
        digit_mask=digit_mask.filter(ImageFilter.GaussianBlur(radius=1.2))
        h_arr=np.asarray(height_img,dtype=np.float32)/255.0
        m_arr=np.asarray(digit_mask,dtype=np.float32)/255.0
        height_img=Image.fromarray((np.clip(h_arr+0.25*m_arr,0,1)*255).astype(np.uint8)).convert("L")

    normal_img=normal_from_height(height_img, strength=5.0)

    mr=np.zeros((H,W,3),dtype=np.uint8)
    rough=(0.48+0.12*(n_arr-0.5)).clip(0.35,0.70)
    mr[:,:,1]=(rough*255).astype(np.uint8)
    mr[:,:,2]=255
    mr_img=Image.fromarray(mr).convert("RGB")

    ao=np.ones((H,W),dtype=np.float32)*0.97
    bw=int(0.05*cell_px_w)
    for ri in range(rows):
        for ci in range(cols):
            x0=ci*cell_px_w; y0=ri*cell_px_h
            x1=x0+cell_px_w; y1=y0+cell_px_h
            ao[y0:y1,x0:x1]-=0.03
            ao[y0:y0+bw,x0:x1]-=0.04
            ao[y1-bw:y1,x0:x1]-=0.04
            ao[y0:y1,x0:x0+bw]-=0.04
            ao[y0:y1,x1-bw:x1]-=0.04
    ao=(ao+0.03*(n_arr-0.5)).clip(0.75,1.0)
    ao_img=Image.fromarray((ao*255).astype(np.uint8)).convert("L")

    mat=trimesh.visual.material.PBRMaterial(
        name="D20_Gold",
        baseColorTexture=base_img,
        normalTexture=normal_img,
        metallicRoughnessTexture=mr_img,
        occlusionTexture=ao_img,
        metallicFactor=1.0,
        roughnessFactor=1.0
    )
    visual=trimesh.visual.texture.TextureVisuals(uv=uv, image=base_img, material=mat)
    mesh=trimesh.Trimesh(vertices=vertices, faces=faces, visual=visual, process=False)
    return mesh, normals, centers, numbers, (base_img, normal_img, mr_img, ao_img)

def build_markers(normals, centers, size=0.008, offset=0.003):
    half=size/2.0
    pv=np.array([[-half,-half,0.0],[half,-half,0.0],[half,half,0.0],[-half,half,0.0]],dtype=np.float32)
    pf=np.array([[0,1,2],[0,2,3]],dtype=np.int64)
    puv=np.array([[0,0],[1,0],[1,1],[0,1]],dtype=np.float32)
    mmat=trimesh.visual.material.PBRMaterial(name="FaceMarker", baseColorFactor=[1,0,1,1], metallicFactor=0, roughnessFactor=1)
    mvis=trimesh.visual.texture.TextureVisuals(uv=puv, material=mmat)
    mmesh=trimesh.Trimesh(vertices=pv, faces=pf, visual=mvis, process=False)
    xforms=[]
    for n,c in zip(normals, centers):
        R=rotation_from_z_to_vec(n)
        T=np.eye(4); T[:3,3]=c + normalize(n)*offset
        xforms.append(T@R)
    return mmesh, xforms

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--out", type=str, default="d20_with_face_nodes_CC0.glb")
    ap.add_argument("--radius", type=float, default=0.5)
    ap.add_argument("--atlas", type=int, default=1024)
    ap.add_argument("--cols", type=int, default=5)
    ap.add_argument("--rows", type=int, default=4)
    ap.add_argument("--seed", type=int, default=9)
    ap.add_argument("--export-textures", type=str, default="")
    args=ap.parse_args()

    mesh, normals, centers, nums, tex = build_d20(radius=args.radius, atlas_size=args.atlas, cols=args.cols, rows=args.rows, seed=args.seed)
    marker_mesh, marker_xforms = build_markers(normals, centers)

    scene=trimesh.Scene()
    scene.add_geometry(mesh, node_name="D20")

    num_to_face={nums[i]: i for i in range(20)}
    for number in range(1,21):
        fi=num_to_face[number]
        scene.add_geometry(marker_mesh, node_name=f"Face_{number}", transform=marker_xforms[fi])

    out=pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    scene.export(str(out))
    print(f"Wrote: {out.resolve()}")
    print("Pivot at origin. Bottom point at y=-radius, top at y=+radius.")
    if args.export_textures:
        d=pathlib.Path(args.export_textures); d.mkdir(parents=True, exist_ok=True)
        tex[0].save(d/"D20_BaseColor.png")
        tex[1].save(d/"D20_Normal.png")
        tex[2].save(d/"D20_MetalRough.png")
        tex[3].save(d/"D20_AO.png")
        print(f"Textures exported to: {d.resolve()}")

if __name__=="__main__":
    main()
