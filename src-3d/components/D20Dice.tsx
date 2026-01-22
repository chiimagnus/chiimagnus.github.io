import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ConvexHullCollider, quat, RapierRigidBody, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface D20DiceProps {
  position?: [number, number, number];
  isRolling?: boolean;
  rollId?: number;
  glowColor?: string;
  baseColor?: string;
  onRequestRoll?: () => void;
  onSettled?: (result: number) => void;
  onTopFaceChange?: (result: number) => void;
}

/**
 * D20 骰子组件 - 博德之门3风格
 * 二十面骰，带有神秘的发光效果
 */
export const D20Dice: React.FC<D20DiceProps> = ({
  position = [0, 0.8, 0],
  isRolling = false,
  rollId = 0,
  glowColor = '#FFD700', // 金色光晕
  baseColor = '#D4AF37', // 金属金基色
  onRequestRoll,
  onSettled,
  onTopFaceChange,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const lastRollIdRef = useRef(rollId);
  const lastTopFaceRef = useRef<number | null>(null);
  const rollingRef = useRef(false);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);
  
  // 创建二十面体几何体
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.5, 0);
  }, []);

  const numberPlane = useMemo(() => {
    return new THREE.PlaneGeometry(0.18, 0.18);
  }, []);

  const colliderVertices = useMemo(() => {
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    return positionAttr.array as ArrayLike<number>;
  }, [geometry]);

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

  const faceData = useMemo(() => {
    const faces: Array<{
      position: THREE.Vector3;
      rotation: THREE.Euler;
      normal: THREE.Vector3;
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
      // 统一为朝外法线（用于判断“顶面”）
      if (normal.dot(center) < 0) normal.multiplyScalar(-1);

      const offset = normal.clone().multiplyScalar(0.02);
      const position = center.clone().add(offset);

      const quaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        normal
      );
      const rotation = new THREE.Euler().setFromQuaternion(quaternion);

      faces.push({
        position,
        rotation,
        normal,
        number: faceIndex + 1,
      });
    }

    return faces;
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

  const getTopFace = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const tmp = new THREE.Vector3();
    return (worldQuaternion: THREE.Quaternion) => {
      let bestDot = -Infinity;
      let bestNumber = 1;

      for (const face of faceData) {
        tmp.copy(face.normal).applyQuaternion(worldQuaternion);
        const dot = tmp.dot(up);
        if (dot > bestDot) {
          bestDot = dot;
          bestNumber = face.number;
        }
      }

      return bestNumber;
    };
  }, [faceData]);

  useEffect(() => {
    if (rollId === lastRollIdRef.current) return;
    lastRollIdRef.current = rollId;

    const rb = rigidBodyRef.current;
    if (!rb) return;

    // 开始新一轮投掷：解除拖动锁定，重置速度并施加随机冲量/扭矩
    isDraggingRef.current = false;
    lastPointerRef.current = null;
    movedRef.current = false;
    rb.lockTranslations(false, true);
    rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    rb.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
    rb.setRotation(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2),
      ),
      true,
    );

    rollingRef.current = true;
    lastTopFaceRef.current = null;

    rb.applyImpulse(
      {
        x: (Math.random() - 0.5) * 2.5,
        y: 5 + Math.random() * 2,
        z: (Math.random() - 0.5) * 2.5,
      },
      true,
    );
    rb.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6,
        z: (Math.random() - 0.5) * 6,
      },
      true,
    );
  }, [getTopFace, position, rollId]);

  // 在渲染帧里同步“顶面点数”（用于用户拖动时刷新 UI）
  useFrame(() => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    if (rollingRef.current) return;

    const top = getTopFace(quat(rb.rotation()));
    if (lastTopFaceRef.current === top) return;
    lastTopFaceRef.current = top;
    onTopFaceChange?.(top);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={position}
      linearDamping={0.2}
      angularDamping={0.4}
      onSleep={() => {
        if (!rollingRef.current) return;
        rollingRef.current = false;
        const rb = rigidBodyRef.current;
        if (!rb) return;
        const top = getTopFace(quat(rb.rotation()));
        lastTopFaceRef.current = top;
        onSettled?.(top);
        onTopFaceChange?.(top);
      }}
      onWake={() => {
        // 当骰子醒来（投掷中），避免把中途变化误当最终结果
        if (rollingRef.current) return;
        if (isRolling) rollingRef.current = true;
      }}
    >
      <ConvexHullCollider args={[colliderVertices]} friction={0.9} restitution={0.2} />

      <group
        onPointerDown={(event) => {
          if (isRolling) return;
          const rb = rigidBodyRef.current;
          if (!rb) return;

          event.stopPropagation();
          (event.target as unknown as { setPointerCapture?: (id: number) => void })?.setPointerCapture?.(
            event.pointerId,
          );

          isDraggingRef.current = true;
          movedRef.current = false;
          lastPointerRef.current = { x: event.clientX, y: event.clientY };
          rb.lockTranslations(true, true);
          rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
          document.body.style.cursor = 'grabbing';
        }}
        onPointerMove={(event) => {
          if (isRolling) return;
          if (!isDraggingRef.current) return;
          const rb = rigidBodyRef.current;
          if (!rb) return;

          event.stopPropagation();

          const last = lastPointerRef.current;
          if (!last) {
            lastPointerRef.current = { x: event.clientX, y: event.clientY };
            return;
          }

          const deltaX = event.clientX - last.x;
          const deltaY = event.clientY - last.y;
          lastPointerRef.current = { x: event.clientX, y: event.clientY };

          if (Math.abs(deltaX) + Math.abs(deltaY) > 2) movedRef.current = true;

          const current = quat(rb.rotation());
          const delta = new THREE.Quaternion().setFromEuler(new THREE.Euler(deltaY * 0.01, deltaX * 0.01, 0));
          current.multiply(delta);
          rb.setRotation(current, true);
          rb.setAngvel({ x: 0, y: 0, z: 0 }, true);

          const top = getTopFace(current);
          if (lastTopFaceRef.current !== top) {
            lastTopFaceRef.current = top;
            onTopFaceChange?.(top);
          }
        }}
        onPointerUp={(event) => {
          if (isRolling) return;
          const rb = rigidBodyRef.current;
          if (!rb) return;

          event.stopPropagation();
          (event.target as unknown as { releasePointerCapture?: (id: number) => void })
            ?.releasePointerCapture?.(event.pointerId);

          const shouldClick = !movedRef.current;
          isDraggingRef.current = false;
          lastPointerRef.current = null;
          movedRef.current = false;
          rb.lockTranslations(false, true);
          document.body.style.cursor = '';

          if (shouldClick) onRequestRoll?.();
        }}
        onPointerCancel={(event) => {
          if (isRolling) return;
          const rb = rigidBodyRef.current;
          if (!rb) return;

          event.stopPropagation();
          isDraggingRef.current = false;
          lastPointerRef.current = null;
          movedRef.current = false;
          rb.lockTranslations(false, true);
          document.body.style.cursor = '';
        }}
        onPointerOver={() => {
          document.body.style.cursor = isRolling ? 'not-allowed' : 'grab';
        }}
        onPointerOut={() => {
          if (isDraggingRef.current) return;
          document.body.style.cursor = '';
        }}
      >
        {/* 主骰子 */}
        <mesh ref={meshRef} geometry={geometry} material={diceMaterial} castShadow receiveShadow>
          {/* 数字 */}
          {faceData.map((label) => (
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
    </RigidBody>
  );
};

export default D20Dice;
