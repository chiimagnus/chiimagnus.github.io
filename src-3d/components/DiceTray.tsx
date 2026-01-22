import React, { useEffect, useMemo } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface DiceTrayProps {
  position?: [number, number, number];
  innerColor?: string;
  outerColor?: string;
  runeColor?: string;
  scale?: number;
}

/**
 * 骰子托盘组件 - 博德之门3风格
 * 带有神秘符文的圆形托盘
 */
export const DiceTray: React.FC<DiceTrayProps> = ({
  position = [0, 0, 0],
  scale = 1,
}) => {
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

  const wallColliders = useMemo(() => {
    // “空气墙”：沿托盘外沿布一圈不可见碰撞体，避免骰子飞出托盘
    const count = 64;
    const radius = 1.14;
    const y = 0.8;
    const halfHeight = 1.2;
    const halfThickness = 0.12;
    const halfLength = 0.14;

    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        key: i,
        position: [Math.cos(angle) * radius, y, Math.sin(angle) * radius] as const,
        rotation: [0, angle + Math.PI / 2, 0] as const,
        args: [halfLength, halfHeight, halfThickness] as const,
      };
    });
  }, []);

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      {/* 托盘碰撞体：底面 + 围墙（近似圆形），用于与骰子发生真实碰撞 */}
      <CuboidCollider
        args={[1.05, 0.03, 1.05]}
        position={[0, 0.06, 0]}
        friction={1.2}
        restitution={0.05}
      />
      {wallColliders.map((wall) => (
        <CuboidCollider
          key={wall.key}
          args={wall.args}
          position={wall.position}
          rotation={wall.rotation}
          friction={1.2}
          restitution={0.05}
        />
      ))}

      {/* 视觉托盘（模型自带材质/贴图）。保留旧 props 以兼容调用方。 */}
      <primitive object={model} scale={scale} />
    </RigidBody>
  );
};

export default DiceTray;

useGLTF.preload('/models/casino_dice_tray/casino_dice_tray_CC0.glb');
