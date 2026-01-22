#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_casino_dice_tray_cc0.py

Casino-style dice tray generator (rounded octagon) exporting GLB (glTF 2.0) with embedded PBR textures.
License: CC0 1.0 Universal (Public Domain Dedication)

Requirements (Python):
  - numpy
  - pillow
  - trimesh
  - scipy (for Delaunay triangulation; used to robustly triangulate planar surfaces)
Optional:
  - pygltflib (NOT required; trimesh exports GLB)

Install example:
  pip install numpy pillow trimesh scipy

Usage:
  python generate_casino_dice_tray_cc0.py --out casino_dice_tray_CC0.glb
  python generate_casino_dice_tray_cc0.py --out casino_dice_tray_CC0.glb --export-textures ./textures

Notes:
  - Output model uses +Y up, pivot at tray center, bottom on/near y=0.
  - Materials: Wood_Frame, Felt_Insert, Metal_Studs
  - Textures embedded in GLB by default (via trimesh PBRMaterial images).
"""

from __future__ import annotations
import argparse
import math
import random
import pathlib
from dataclasses import dataclass
from typing import Tuple, Optional

import numpy as np
import trimesh
from PIL import Image, ImageFilter, ImageChops
from scipy.spatial import Delaunay


# ------------------------------
# Texture generation (procedural)
# ------------------------------
def _make_noise(size: Tuple[int, int], block: int = 8, seed: int = 0) -> Image.Image:
    """Coarse block noise blurred into a usable texture signal."""
    rnd = random.Random(seed)
    w, h = size
    img = Image.new("L", (w, h), 0)
    px = img.load()
    for y in range(h):
        by = y // block
        for x in range(w):
            bx = x // block
            # deterministic per-block RNG to avoid storing a full random field
            rnd2 = random.Random(seed + bx * 928371 + by * 192837)
            px[x, y] = rnd2.randint(0, 255)
    return img.filter(ImageFilter.GaussianBlur(radius=block * 0.35))


def _normal_from_height(height_img: Image.Image, strength: float = 2.0) -> Image.Image:
    """Convert grayscale height to tangent-space normal map."""
    h = np.asarray(height_img, dtype=np.float32) / 255.0
    gx = np.zeros_like(h)
    gy = np.zeros_like(h)
    gx[:, 1:-1] = (h[:, 2:] - h[:, :-2]) * 0.5
    gy[1:-1, :] = (h[2:, :] - h[:-2, :]) * 0.5

    nx = -gx * strength
    ny = -gy * strength
    nz = np.ones_like(h)

    length = np.sqrt(nx * nx + ny * ny + nz * nz) + 1e-8
    nx /= length
    ny /= length
    nz /= length

    R = ((nx * 0.5 + 0.5) * 255.0).clip(0, 255).astype(np.uint8)
    G = ((ny * 0.5 + 0.5) * 255.0).clip(0, 255).astype(np.uint8)
    B = ((nz * 0.5 + 0.5) * 255.0).clip(0, 255).astype(np.uint8)
    return Image.fromarray(np.dstack([R, G, B]).astype(np.uint8))


def make_wood_textures(size: int = 1024, seed: int = 11) -> Tuple[Image.Image, Image.Image, Image.Image, Image.Image]:
    """Return (BaseColor, Normal, MetallicRoughness, AO) for dark walnut-like wood."""
    w = h = size
    n1 = _make_noise((w, h), block=10, seed=seed)
    n2 = _make_noise((w, h), block=26, seed=seed + 13)
    n = ImageChops.add(n1, n2, scale=2.0)
    n_arr = np.asarray(n, dtype=np.float32) / 255.0

    x = np.linspace(0, 1, w, dtype=np.float32)
    stripes = (0.5 + 0.5 * np.sin((x * 28.0 + (n_arr[0] * 2.0)) * math.pi)).astype(np.float32)
    stripes = np.tile(stripes[None, :], (h, 1))

    grain = (0.55 * stripes + 0.45 * n_arr).clip(0, 1)

    col = np.zeros((h, w, 3), dtype=np.float32)
    col[:, :, 0] = 0.30 + 0.20 * grain
    col[:, :, 1] = 0.17 + 0.14 * grain
    col[:, :, 2] = 0.09 + 0.10 * grain
    basecolor = Image.fromarray((col * 255).astype(np.uint8))

    height = Image.fromarray((grain * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.0))
    normal = _normal_from_height(height, strength=6.0)

    rough = (0.55 + 0.25 * (n_arr - 0.5)).clip(0.35, 0.85)
    mr = np.zeros((h, w, 3), dtype=np.uint8)
    mr[:, :, 1] = (rough * 255).astype(np.uint8)  # G = roughness
    mr[:, :, 2] = 0                                # B = metallic
    metallic_roughness = Image.fromarray(mr)

    ao = (0.90 - 0.10 * (n_arr - 0.5)).clip(0.75, 1.0)
    ao_img = Image.fromarray((ao * 255).astype(np.uint8))
    return basecolor, normal, metallic_roughness, ao_img


def make_felt_textures(size: int = 1024, seed: int = 21, color_rgb=(68, 10, 18)) -> Tuple[Image.Image, Image.Image, Image.Image, Image.Image]:
    """Return (BaseColor, Normal, MetallicRoughness, AO) for felt/velvet insert."""
    w = h = size
    n = _make_noise((w, h), block=6, seed=seed)
    n_arr = np.asarray(n, dtype=np.float32) / 255.0

    speck = (n_arr ** 1.4)
    c = np.array(color_rgb, dtype=np.float32) / 255.0
    var = (0.85 + 0.30 * (speck - 0.5)).clip(0.6, 1.15)
    col = (c[None, None, :] * var[:, :, None]).clip(0, 1)
    basecolor = Image.fromarray((col * 255).astype(np.uint8))

    height = Image.fromarray((speck * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=0.6))
    normal = _normal_from_height(height, strength=2.5)

    rough = (0.88 + 0.08 * (n_arr - 0.5)).clip(0.78, 0.95)
    mr = np.zeros((h, w, 3), dtype=np.uint8)
    mr[:, :, 1] = (rough * 255).astype(np.uint8)  # roughness
    mr[:, :, 2] = 0                                # metallic
    metallic_roughness = Image.fromarray(mr)

    ao = (0.95 - 0.08 * (n_arr - 0.5)).clip(0.85, 1.0)
    ao_img = Image.fromarray((ao * 255).astype(np.uint8))
    return basecolor, normal, metallic_roughness, ao_img


def make_brass_textures(size: int = 512, seed: int = 31) -> Tuple[Image.Image, Image.Image, Image.Image, Image.Image]:
    """Return (BaseColor, Normal, MetallicRoughness, AO) for dull brass studs."""
    w = h = size
    n = _make_noise((w, h), block=12, seed=seed)
    n_arr = np.asarray(n, dtype=np.float32) / 255.0

    col = np.zeros((h, w, 3), dtype=np.float32)
    col[:, :, 0] = 0.70 + 0.10 * (n_arr - 0.5)
    col[:, :, 1] = 0.56 + 0.08 * (n_arr - 0.5)
    col[:, :, 2] = 0.26 + 0.06 * (n_arr - 0.5)
    col = col.clip(0, 1)
    basecolor = Image.fromarray((col * 255).astype(np.uint8))

    height = Image.fromarray((n_arr * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=1.2))
    normal = _normal_from_height(height, strength=1.5)

    rough = (0.42 + 0.18 * (n_arr - 0.5)).clip(0.30, 0.65)
    mr = np.zeros((h, w, 3), dtype=np.uint8)
    mr[:, :, 1] = (rough * 255).astype(np.uint8)  # roughness
    mr[:, :, 2] = 255                              # metallic = 1
    metallic_roughness = Image.fromarray(mr)

    ao = (0.98 - 0.05 * (n_arr - 0.5)).clip(0.90, 1.0)
    ao_img = Image.fromarray((ao * 255).astype(np.uint8))
    return basecolor, normal, metallic_roughness, ao_img


# ------------------------------
# Geometry helpers
# ------------------------------
def rounded_octagon_points(radius: float, fillet: float, arc_segments: int, rotation: float = math.pi / 8) -> np.ndarray:
    """
    Approximate rounded octagon in XZ plane by adding small arcs at each vertex.
    Returns Nx3 points, CCW order.
    """
    V = []
    for i in range(8):
        ang = rotation + i * (2 * math.pi / 8)
        V.append(np.array([math.cos(ang), 0.0, math.sin(ang)], dtype=np.float32) * radius)

    pts = []
    for i in range(8):
        v = V[i]
        v_prev = V[(i - 1) % 8]
        v_next = V[(i + 1) % 8]
        d1 = (v_prev - v); d1 /= (np.linalg.norm(d1) + 1e-12)
        d2 = (v_next - v); d2 /= (np.linalg.norm(d2) + 1e-12)

        p1 = v + d1 * fillet
        p2 = v + d2 * fillet

        a1 = math.atan2(float(p1[2] - v[2]), float(p1[0] - v[0]))
        a2 = math.atan2(float(p2[2] - v[2]), float(p2[0] - v[0]))
        delta = a2 - a1
        while delta <= 0:
            delta += 2 * math.pi

        for s in range(arc_segments):
            t = s / (arc_segments - 1) if arc_segments > 1 else 0.0
            ang = a1 + delta * t
            pt = np.array([v[0] + math.cos(ang) * fillet, 0.0, v[2] + math.sin(ang) * fillet], dtype=np.float32)
            pts.append(pt)
    return np.array(pts, dtype=np.float32)


def planar_uv(points: np.ndarray, scale: float) -> np.ndarray:
    x = points[:, 0]
    z = points[:, 2]
    u = x / scale * 0.5 + 0.5
    v = z / scale * 0.5 + 0.5
    return np.stack([u, v], axis=1).astype(np.float32)


def cylindrical_uv(points: np.ndarray, angle_offset: float = 0.0) -> np.ndarray:
    x = points[:, 0]
    z = points[:, 2]
    ang = np.arctan2(z, x) + angle_offset
    u = (ang / (2 * np.pi)) % 1.0
    y = points[:, 1]
    v = (y - y.min()) / (y.max() - y.min() + 1e-12)
    return np.stack([u, v], axis=1).astype(np.float32)


def build_wall(loop_bottom: np.ndarray, loop_top: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Connect bottom and top loops into a quad strip (triangulated)."""
    N = len(loop_bottom)
    verts = []
    faces = []
    for i in range(N):
        i2 = (i + 1) % N
        b0, b1 = loop_bottom[i], loop_bottom[i2]
        t0, t1 = loop_top[i], loop_top[i2]
        idx = len(verts)
        verts.extend([b0, b1, t1, t0])
        faces.append([idx + 0, idx + 1, idx + 2])
        faces.append([idx + 0, idx + 2, idx + 3])
    verts = np.array(verts, dtype=np.float32)
    uv = cylindrical_uv(verts)
    return verts, np.array(faces, dtype=np.int64), uv


def build_cap(loop: np.ndarray, y: float, up: bool = True) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Convex cap triangulated as a fan.
    loop: Nx3 points CCW on XZ plane
    """
    loop_y = loop.copy()
    loop_y[:, 1] = y
    center = np.array([[0.0, y, 0.0]], dtype=np.float32)
    verts = np.vstack([center, loop_y])
    N = len(loop_y)
    faces = []
    for i in range(N):
        i2 = (i + 1) % N
        if up:
            faces.append([0, i + 1, i2 + 1])
        else:
            faces.append([0, i2 + 1, i + 1])
    scale = float(max(np.max(np.abs(loop[:, 0])), np.max(np.abs(loop[:, 2]))) * 2.0)
    uv_loop = planar_uv(loop_y, scale=scale)
    uv = np.vstack([np.array([[0.5, 0.5]], dtype=np.float32), uv_loop])
    return verts.astype(np.float32), np.array(faces, dtype=np.int64), uv.astype(np.float32)


def build_top_ring(loop_outer: np.ndarray, loop_inner: np.ndarray, y: float) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Horizontal ring between outer and inner loops at height y."""
    N = len(loop_outer)
    verts = []
    faces = []
    for i in range(N):
        i2 = (i + 1) % N
        o0, o1 = loop_outer[i].copy(), loop_outer[i2].copy()
        i0, i1 = loop_inner[i].copy(), loop_inner[i2].copy()
        o0[1] = o1[1] = i0[1] = i1[1] = y
        idx = len(verts)
        verts.extend([o0, o1, i1, i0])
        faces.append([idx + 0, idx + 1, idx + 2])
        faces.append([idx + 0, idx + 2, idx + 3])
    verts = np.array(verts, dtype=np.float32)
    scale = float(max(np.max(np.abs(loop_outer[:, 0])), np.max(np.abs(loop_outer[:, 2]))) * 2.0)
    uv = planar_uv(verts, scale=scale)
    return verts, np.array(faces, dtype=np.int64), uv.astype(np.float32)


@dataclass
class TrayParams:
    # Dimensions (scene units)
    inner_radius: float = 1.20     # inner diameter ~2.4
    border: float = 0.35
    rim_height: float = 0.60
    floor_height: float = 0.10
    felt_thickness: float = 0.03

    # Shape details
    fillet: float = 0.18
    arc_segments: int = 3

    # Studs
    stud_count: int = 16
    stud_radius: float = 0.05
    stud_height: float = 0.04
    stud_center_y: float = 0.36

    # Felt color
    felt_color_rgb: Tuple[int, int, int] = (68, 10, 18)  # burgundy


def build_casino_tray_scene(params: TrayParams,
                            tex_size: int = 1024,
                            metal_tex_size: int = 512,
                            seed_base: int = 0,
                            export_textures_dir: Optional[pathlib.Path] = None) -> trimesh.Scene:
    # loops
    outer_radius = params.inner_radius + params.border
    outer_loop = rounded_octagon_points(radius=outer_radius, fillet=params.fillet, arc_segments=params.arc_segments)
    inner_loop = outer_loop * (params.inner_radius / outer_radius)
    floor_loop = outer_loop * ((params.inner_radius - 0.10) / outer_radius)

    # frame surfaces (wood)
    outer_bottom = outer_loop.copy(); outer_bottom[:, 1] = 0.0
    outer_top = outer_loop.copy();    outer_top[:, 1] = params.rim_height
    inner_top = inner_loop.copy();    inner_top[:, 1] = params.rim_height
    inner_floor = floor_loop.copy();  inner_floor[:, 1] = params.floor_height

    v_ow, f_ow, uv_ow = build_wall(outer_bottom, outer_top)

    # inner wall: normals should face into the cavity; flip winding
    v_iw, f_iw, uv_iw = build_wall(inner_floor, inner_top)
    f_iw = f_iw[:, ::-1]

    v_tr, f_tr, uv_tr = build_top_ring(outer_loop, inner_loop, y=params.rim_height)
    v_bc, f_bc, uv_bc = build_cap(outer_loop, y=0.0, up=False)

    # wood combine
    wood_parts = [(v_ow, f_ow, uv_ow), (v_iw, f_iw, uv_iw), (v_tr, f_tr, uv_tr), (v_bc, f_bc, uv_bc)]
    wood_v, wood_f, wood_uv = [], [], []
    offset = 0
    for v, f, uv in wood_parts:
        wood_v.append(v); wood_uv.append(uv); wood_f.append(f + offset)
        offset += len(v)
    wood_v = np.vstack(wood_v).astype(np.float32)
    wood_uv = np.vstack(wood_uv).astype(np.float32)
    wood_f = np.vstack(wood_f).astype(np.int64)

    # felt insert (thin solid)
    felt_top_loop = floor_loop * 0.98
    felt_bottom_loop = floor_loop * 0.98
    felt_top_loop[:, 1] = params.floor_height + params.felt_thickness
    felt_bottom_loop[:, 1] = params.floor_height

    v_fw, f_fw, uv_fw = build_wall(felt_bottom_loop, felt_top_loop)
    v_ft, f_ft, uv_ft = build_cap(felt_top_loop, y=params.floor_height + params.felt_thickness, up=True)
    v_fb, f_fb, uv_fb = build_cap(felt_bottom_loop, y=params.floor_height, up=False)

    felt_v = np.vstack([v_fw, v_ft, v_fb]).astype(np.float32)
    felt_uv = np.vstack([uv_fw, uv_ft, uv_fb]).astype(np.float32)
    felt_f = np.vstack([f_fw, f_ft + len(v_fw), f_fb + len(v_fw) + len(v_ft)]).astype(np.int64)

    # studs
    studs = []
    stud_ring_radius = outer_radius * 0.93
    for i in range(params.stud_count):
        ang = (2 * math.pi) * (i / params.stud_count)
        x = math.cos(ang) * stud_ring_radius
        z = math.sin(ang) * stud_ring_radius
        cyl = trimesh.creation.cylinder(radius=params.stud_radius, height=params.stud_height, sections=12)
        # trimesh cylinder axis is Z; rotate to Y
        cyl.apply_transform(trimesh.transformations.rotation_matrix(math.pi / 2, [1, 0, 0]))
        cyl.apply_translation([x, params.stud_center_y, z])
        studs.append(cyl)
    studs_mesh = trimesh.util.concatenate(studs)
    uv_studs = cylindrical_uv(studs_mesh.vertices)

    # textures
    wood_bc, wood_n, wood_mr, wood_ao = make_wood_textures(size=tex_size, seed=seed_base + 11)
    felt_bc, felt_n, felt_mr, felt_ao = make_felt_textures(size=tex_size, seed=seed_base + 21, color_rgb=params.felt_color_rgb)
    metal_bc, metal_n, metal_mr, metal_ao = make_brass_textures(size=metal_tex_size, seed=seed_base + 31)

    if export_textures_dir is not None:
        export_textures_dir.mkdir(parents=True, exist_ok=True)
        wood_bc.save(export_textures_dir / "wood_BaseColor.png")
        wood_n.save(export_textures_dir / "wood_Normal.png")
        wood_mr.save(export_textures_dir / "wood_MetalRough.png")
        wood_ao.save(export_textures_dir / "wood_AO.png")

        felt_bc.save(export_textures_dir / "felt_BaseColor.png")
        felt_n.save(export_textures_dir / "felt_Normal.png")
        felt_mr.save(export_textures_dir / "felt_MetalRough.png")
        felt_ao.save(export_textures_dir / "felt_AO.png")

        metal_bc.save(export_textures_dir / "metal_BaseColor.png")
        metal_n.save(export_textures_dir / "metal_Normal.png")
        metal_mr.save(export_textures_dir / "metal_MetalRough.png")
        metal_ao.save(export_textures_dir / "metal_AO.png")

    # materials
    wood_mat = trimesh.visual.material.PBRMaterial(
        name="Wood_Frame",
        baseColorTexture=wood_bc,
        normalTexture=wood_n,
        metallicRoughnessTexture=wood_mr,
        occlusionTexture=wood_ao,
        metallicFactor=0.0,
        roughnessFactor=1.0,
        doubleSided=False,
    )
    felt_mat = trimesh.visual.material.PBRMaterial(
        name="Felt_Insert",
        baseColorTexture=felt_bc,
        normalTexture=felt_n,
        metallicRoughnessTexture=felt_mr,
        occlusionTexture=felt_ao,
        metallicFactor=0.0,
        roughnessFactor=1.0,
        doubleSided=False,
    )
    metal_mat = trimesh.visual.material.PBRMaterial(
        name="Metal_Studs",
        baseColorTexture=metal_bc,
        normalTexture=metal_n,
        metallicRoughnessTexture=metal_mr,
        occlusionTexture=metal_ao,
        metallicFactor=1.0,
        roughnessFactor=1.0,
        doubleSided=False,
    )

    wood_visual = trimesh.visual.texture.TextureVisuals(uv=wood_uv, image=wood_bc, material=wood_mat)
    felt_visual = trimesh.visual.texture.TextureVisuals(uv=felt_uv, image=felt_bc, material=felt_mat)
    studs_visual = trimesh.visual.texture.TextureVisuals(uv=uv_studs, image=metal_bc, material=metal_mat)

    wood_mesh = trimesh.Trimesh(vertices=wood_v, faces=wood_f, visual=wood_visual, process=False)
    felt_mesh = trimesh.Trimesh(vertices=felt_v, faces=felt_f, visual=felt_visual, process=False)
    studs_mesh.visual = studs_visual

    scene = trimesh.Scene()
    scene.add_geometry(wood_mesh, node_name="Tray_Wood")
    scene.add_geometry(felt_mesh, node_name="Tray_Felt")
    scene.add_geometry(studs_mesh, node_name="Tray_Studs")
    return scene


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", type=str, default="casino_dice_tray_CC0.glb", help="Output GLB path")
    ap.add_argument("--export-textures", type=str, default="", help="Optional directory to export textures as PNGs")
    ap.add_argument("--tex", type=int, default=1024, help="Texture size for wood/felt (e.g. 1024 or 2048)")
    ap.add_argument("--metal-tex", type=int, default=512, help="Texture size for metal studs")
    ap.add_argument("--seed", type=int, default=0, help="Random seed base for procedural textures")

    # dimensions
    ap.add_argument("--inner-radius", type=float, default=1.20)
    ap.add_argument("--border", type=float, default=0.35)
    ap.add_argument("--rim-height", type=float, default=0.60)
    ap.add_argument("--floor-height", type=float, default=0.10)
    ap.add_argument("--felt-thickness", type=float, default=0.03)

    # studs
    ap.add_argument("--stud-count", type=int, default=16)
    ap.add_argument("--stud-radius", type=float, default=0.05)
    ap.add_argument("--stud-height", type=float, default=0.04)

    # felt color
    ap.add_argument("--felt-color", type=str, default="68,10,18", help="RGB like '68,10,18' (burgundy)")

    args = ap.parse_args()
    out = pathlib.Path(args.out)

    felt_rgb = tuple(int(x.strip()) for x in args.felt_color.split(","))
    params = TrayParams(
        inner_radius=args.inner_radius,
        border=args.border,
        rim_height=args.rim_height,
        floor_height=args.floor_height,
        felt_thickness=args.felt_thickness,
        stud_count=args.stud_count,
        stud_radius=args.stud_radius,
        stud_height=args.stud_height,
        felt_color_rgb=felt_rgb,
    )

    export_dir = pathlib.Path(args.export_textures) if args.export_textures else None
    scene = build_casino_tray_scene(params, tex_size=args.tex, metal_tex_size=args.metal_tex, seed_base=args.seed, export_textures_dir=export_dir)

    out.parent.mkdir(parents=True, exist_ok=True)
    scene.export(str(out))

    tris = sum(len(g.faces) for g in scene.geometry.values())
    print(f"Wrote: {out.resolve()}")
    print(f"Triangles: {tris}")
    if export_dir is not None:
        print(f"Textures exported to: {export_dir.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
