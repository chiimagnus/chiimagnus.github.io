import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DiceTrayProps {
  position?: [number, number, number];
  innerColor?: string;
  outerColor?: string;
  runeColor?: string;
}

/**
 * 骰子托盘组件 - 博德之门3风格
 * 带有神秘符文的圆形托盘
 */
export const DiceTray: React.FC<DiceTrayProps> = ({
  position = [0, 0, 0],
  innerColor = '#2a0a12',
  outerColor = '#B8860B',
  runeColor = '#FFD700',
}) => {
  const runeRingRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  // 托盘基座 - 外圈 - 增加分段数使其更圆滑
  const outerRingGeometry = useMemo(() => {
    return new THREE.TorusGeometry(1.2, 0.15, 32, 128);
  }, []);

  // 托盘底部 - 圆盘
  const baseGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(1.2, 1.1, 0.1, 64);
  }, []);

  // 内部凹陷 - 稍微加大半径以嵌入外圈
  const innerBaseGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(1.1, 1.05, 0.08, 64);
  }, []);

  // 符文环
  const runeRingGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.8, 0.02, 16, 128);
  }, []);

  // 外圈材质 - 深色金属
  const outerMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: outerColor,
      metalness: 0.8,
      roughness: 0.4,
    });
  }, [outerColor]);

  // 底部材质 - 丝绒质感
  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: innerColor,
      metalness: 0.2,
      roughness: 0.8,
    });
  }, [innerColor]);

  // 符文材质 - 发光
  const runeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: runeColor,
      transparent: true,
      opacity: 0.8,
    });
  }, [runeColor]);

  // 内部发光材质
  const innerGlowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: runeColor,
      transparent: true,
      opacity: 0.15,
    });
  }, [runeColor]);

  // 动画
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 符文环缓慢旋转
    if (runeRingRef.current) {
      runeRingRef.current.rotation.z = time * 0.2;
    }

    // 内部发光脉动
    if (innerGlowRef.current && innerGlowRef.current.material instanceof THREE.MeshBasicMaterial) {
      innerGlowRef.current.material.opacity = 0.1 + Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* 外圈装饰环 */}
      <mesh
        geometry={outerRingGeometry}
        material={outerMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
        receiveShadow
      />

      {/* 托盘底座 */}
      <mesh
        geometry={baseGeometry}
        material={outerMaterial}
        position={[0, 0, 0]}
        receiveShadow
      />

      {/* 内部凹陷（丝绒面） */}
      <mesh
        geometry={innerBaseGeometry}
        material={baseMaterial}
        position={[0, 0.02, 0]}
        receiveShadow
      />

      {/* 符文环 - 第一层 */}
      <mesh
        ref={runeRingRef}
        geometry={runeRingGeometry}
        material={runeMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.07, 0]}
      />

      {/* 符文环 - 第二层（反向旋转） */}
      <mesh
        geometry={new THREE.TorusGeometry(0.6, 0.015, 8, 64)}
        material={runeMaterial}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0.07, 0]}
      />

      {/* 内部发光效果 */}
      <mesh
        ref={innerGlowRef}
        geometry={new THREE.CircleGeometry(0.9, 64)}
        material={innerGlowMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.08, 0]}
      />

      {/* 装饰性小球 - 围绕托盘 */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.15;
        const z = Math.sin(angle) * 1.15;
        return (
          <mesh key={i} position={[x, 0.15, z]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial
              color={runeColor}
              emissive={runeColor}
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default DiceTray;
