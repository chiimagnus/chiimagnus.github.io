# Casino Dice Tray (CC0) — Source Generator

This folder contains a Python script that procedurally generates a casino-style dice tray and exports it as a GLB (glTF 2.0) file with embedded PBR textures.

## Requirements
- Python 3.9+
- `numpy`, `pillow`, `trimesh`, `scipy`

Install:
```
pip install numpy pillow trimesh scipy
```

## Run
Generate a GLB with embedded textures:
```
python generate_casino_dice_tray_cc0.py --out casino_dice_tray_CC0.glb
```

Optionally export the textures to a folder as PNGs:
```
python generate_casino_dice_tray_cc0.py --out casino_dice_tray_CC0.glb --export-textures ./textures
```

## Notes for Three.js / React Three Fiber
- The model is Y-up and centered at origin; bottom sits at y≈0.
- Materials are standard metallic-roughness PBR (BaseColor/Normal/MetallicRoughness/AO).
- You can attach physics colliders separately (recommended).
