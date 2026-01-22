import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface D20DiceProps {
  position?: [number, number, number];
  isRolling?: boolean;
  glowColor?: string;
  baseColor?: string;
}

/**
 * D20 骰子组件 - 博德之门3风格
 * 二十面骰，带有神秘的发光效果
 */
export const D20Dice: React.FC<D20DiceProps> = ({
  position = [0, 0.8, 0],
  isRolling = false,
  glowColor = '#ff6b35',
  baseColor = '#1a1a2e',
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  // 创建二十面体几何体
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.5, 0);
  }, []);

  // 骰子材质 - 深色金属质感
  const diceMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.7,
      roughness: 0.3,
      emissive: glowColor,
      emissiveIntensity: 0.1,
    });
  }, [baseColor, glowColor]);

  // 边缘发光材质
  const edgeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: 0.6,
      side: THREE.BackSide,
    });
  }, [glowColor]);

  // 动画帧更新
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    if (isRolling) {
      // 投掷时快速旋转
      meshRef.current.rotation.x += 0.15;
      meshRef.current.rotation.y += 0.12;
      meshRef.current.rotation.z += 0.08;
    } else {
      // 悬浮时缓慢旋转和上下浮动
      meshRef.current.rotation.y = time * 0.3;
      meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5) * 0.05;
    }

    // 发光层脉动效果
    if (glowRef.current) {
      const scale = 1.05 + Math.sin(time * 2) * 0.02;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* 主骰子 */}
      <mesh ref={meshRef} geometry={geometry} material={diceMaterial} castShadow>
        {/* 数字纹理会在后续添加 */}
      </mesh>

      {/* 发光边缘效果 */}
      <mesh ref={glowRef} geometry={geometry} material={edgeMaterial} scale={1.05} />

      {/* 点光源 - 骰子自身发光 */}
      <pointLight
        color={glowColor}
        intensity={0.5}
        distance={3}
        decay={2}
      />
    </group>
  );
};

export default D20Dice;
