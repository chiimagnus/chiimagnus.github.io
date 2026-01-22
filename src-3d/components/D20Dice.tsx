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
  glowColor = '#FFD700', // 金色光晕
  baseColor = '#D4AF37', // 金属金基色
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 创建二十面体几何体
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.5, 0);
  }, []);

  const numberPlane = useMemo(() => {
    return new THREE.PlaneGeometry(0.18, 0.18);
  }, []);

  const numberTextures = useMemo(() => {
    return Array.from({ length: 20 }, (_, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;

      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 140px "Cinzel", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      ctx.fillStyle = '#1a0f2e';
      ctx.strokeStyle = '#f5e6a8';
      ctx.lineWidth = 8;

      const text = String(index + 1);
      ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      return texture;
    });
  }, []);

  const faceLabels = useMemo(() => {
    const labels: Array<{
      position: THREE.Vector3;
      rotation: THREE.Euler;
      number: number;
    }> = [];

    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const faceCount = positionAttr.count / 3;

    for (let faceIndex = 0; faceIndex < faceCount; faceIndex += 1) {
      const i = faceIndex * 3;

      const a = new THREE.Vector3(
        positionAttr.getX(i),
        positionAttr.getY(i),
        positionAttr.getZ(i)
      );
      const b = new THREE.Vector3(
        positionAttr.getX(i + 1),
        positionAttr.getY(i + 1),
        positionAttr.getZ(i + 1)
      );
      const c = new THREE.Vector3(
        positionAttr.getX(i + 2),
        positionAttr.getY(i + 2),
        positionAttr.getZ(i + 2)
      );

      const center = new THREE.Vector3()
        .add(a)
        .add(b)
        .add(c)
        .multiplyScalar(1 / 3);

      const normal = new THREE.Vector3()
        .subVectors(b, a)
        .cross(new THREE.Vector3().subVectors(c, a))
        .normalize();

      const offset = normal.clone().multiplyScalar(0.02);
      const position = center.clone().add(offset);

      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      const rotation = new THREE.Euler().setFromQuaternion(quaternion);

      labels.push({
        position,
        rotation,
        number: faceIndex + 1,
      });
    }

    return labels;
  }, [geometry]);

  // 骰子材质 - 金色金属质感
  const diceMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.9, // 提高金属感
      roughness: 0.1, // 降低粗糙度，增加光泽
      emissive: glowColor,
      emissiveIntensity: 0.2, // 微微发光
    });
  }, [baseColor, glowColor]);

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
  });

  return (
    <group position={position}>
      {/* 主骰子 */}
      <mesh ref={meshRef} geometry={geometry} material={diceMaterial} castShadow receiveShadow>
        {/* 数字 */}
        {faceLabels.map((label) => (
          <mesh
            key={label.number}
            geometry={numberPlane}
            position={[label.position.x, label.position.y, label.position.z]}
            rotation={[label.rotation.x, label.rotation.y, label.rotation.z]}
            renderOrder={2}
          >
            <meshBasicMaterial
              map={numberTextures[label.number - 1]}
              transparent
              toneMapped={false}
            />
          </mesh>
        ))}
      </mesh>

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
