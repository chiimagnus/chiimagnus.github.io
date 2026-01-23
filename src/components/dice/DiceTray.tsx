import React, { useEffect, useMemo } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface DiceTrayProps {
  position?: [number, number, number];
  scale?: number;
}

/**
 * DiceTray
 * 骰子托盘（视觉模型 + 近似圆形空气墙碰撞体）。
 */
export const DiceTray: React.FC<DiceTrayProps> = ({ position = [0, 0, 0], scale = 1 }) => {
  // 视觉模型（CC0）
  const { scene } = useGLTF('/models/casino_dice_tray/casino_dice_tray_CC0.glb');
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [model]);

  /**
   * wallColliders
   * 沿托盘外沿布一圈不可见碰撞体，避免骰子飞出托盘。
   */
  const wallColliders = useMemo(() => {
    const count = 64;
    const radius = 1.14 * scale;
    const y = 0.8 * scale;
    const halfHeight = 1.2 * scale;
    const halfThickness = 0.12 * scale;
    const halfLength = 0.14 * scale;

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        key: i,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number],
        rotation: [0, angle + Math.PI / 2, 0] as [number, number, number],
        args: [halfLength, halfHeight, halfThickness] as [number, number, number],
      };
    });
  }, [scale]);

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      {/* 托盘碰撞体：底面 + 围墙（近似圆形），用于与骰子发生真实碰撞 */}
      <CuboidCollider
        args={[1.05 * scale, 0.03 * scale, 1.05 * scale]}
        position={[0, 0.06 * scale, 0]}
        // Slightly lower friction so the dice keeps rolling longer.
        friction={0.95}
        restitution={0.06}
      />
      {wallColliders.map((wall) => (
        <CuboidCollider
          key={wall.key}
          args={wall.args}
          position={wall.position}
          rotation={wall.rotation}
          friction={0.95}
          restitution={0.06}
        />
      ))}

      {/* 视觉托盘（模型自带材质/贴图） */}
      <primitive object={model} scale={scale} />
    </RigidBody>
  );
};

useGLTF.preload('/models/casino_dice_tray/casino_dice_tray_CC0.glb');
