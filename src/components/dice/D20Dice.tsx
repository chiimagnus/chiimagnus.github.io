import React, { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ConvexHullCollider, quat, RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { playDiceCollisionSfx } from '../../features/dice/diceSfx';

export interface D20DiceProps {
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
 * D20Dice
 * 二十面骰（带物理 + 顶面点数识别），支持拖动旋转与点击投掷。
 *
 * 注意：为了性能与稳定性，几何体、面法线与模型 clone 通过 useMemo 缓存。
 */
export const D20Dice: React.FC<D20DiceProps> = ({
  position = [0, 0.8, 0],
  isRolling = false,
  rollId = 0,
  glowColor = '#FFD700',
  baseColor = '#D4AF37',
  onRequestRoll,
  onSettled,
  onTopFaceChange,
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const lastRollIdRef = useRef(rollId);
  const lastTopFaceRef = useRef<number | null>(null);
  const rollingRef = useRef(false);
  const settleTimerRef = useRef(0);
  const lastCollisionSoundAtRef = useRef(0);

  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  // 视觉模型（CC0）
  const { scene: diceScene } = useGLTF('/models/d20_with_face_nodes_CC0_bundle/d20_with_face_nodes_CC0.glb');
  const diceModel = useMemo(() => diceScene.clone(true), [diceScene]);

  useEffect(() => {
    diceModel.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        const material = obj.material;
        if (material instanceof THREE.MeshStandardMaterial && !material.map) {
          material.color = new THREE.Color(baseColor);
        }
      }
    });
  }, [baseColor, diceModel]);

  // 创建二十面体几何体（用于凸包碰撞）
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.5, 0), []);

  const colliderVertices = useMemo(() => {
    const positionAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    return positionAttr.array as ArrayLike<number>;
  }, [geometry]);

  /**
   * faceNodeNormals
   * 读取模型内命名为 `Face_1..Face_20` 的节点，并以其 +Z 轴作为“面法线”基准。
   * 这样就能在任何姿态下计算“哪个面朝上”。
   */
  const faceNodeNormals = useMemo(() => {
    const faces: Array<{ number: number; normal: THREE.Vector3 }> = [];
    const root = diceModel;
    root.updateMatrixWorld(true);

    const rootWorldQuat = new THREE.Quaternion();
    root.getWorldQuaternion(rootWorldQuat);
    const invRootWorldQuat = rootWorldQuat.clone().invert();

    const tmpWorldQuat = new THREE.Quaternion();
    const zAxis = new THREE.Vector3(0, 0, 1);

    root.traverse((obj) => {
      const match = obj.name.match(/^Face_(\d+)$/);
      if (!match) return;

      const number = Number(match[1]);
      if (!Number.isFinite(number)) return;

      obj.getWorldQuaternion(tmpWorldQuat);
      tmpWorldQuat.premultiply(invRootWorldQuat);
      const normal = zAxis.clone().applyQuaternion(tmpWorldQuat).normalize();
      faces.push({ number, normal });
    });

    faces.sort((a, b) => a.number - b.number);
    return faces.length ? faces : null;
  }, [diceModel]);

  /**
   * getTopFace
   * 给定骰子世界旋转，返回“最朝向上方（+Y）”的面编号。
   */
  const getTopFace = useMemo(() => {
    const up = new THREE.Vector3(0, 1, 0);
    const tmp = new THREE.Vector3();
    return (worldQuaternion: THREE.Quaternion) => {
      let bestDot = -Infinity;
      let bestNumber = 1;

      if (faceNodeNormals) {
        for (const face of faceNodeNormals) {
          tmp.copy(face.normal).applyQuaternion(worldQuaternion);
          const dot = tmp.dot(up);
          if (dot > bestDot) {
            bestDot = dot;
            bestNumber = face.number;
          }
        }
      }

      return bestNumber;
    };
  }, [faceNodeNormals]);

  useEffect(() => {
    if (rollId === lastRollIdRef.current) return;
    lastRollIdRef.current = rollId;

    const rb = rigidBodyRef.current;
    if (!rb) return;

    // 开始新一轮投掷：解除拖动锁定，重置速度并施加随机冲量/扭矩
    isDraggingRef.current = false;
    lastPointerRef.current = null;
    movedRef.current = false;
    settleTimerRef.current = 0;
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

    // 以“水平滑入托盘”为主：X/Z 较大、Y 较小（避免一脚踢飞）
    const angle = Math.random() * Math.PI * 2;
    const horizontalPower = 1.8 + Math.random() * 0.9;
    const upwardPower = 0.6 + Math.random() * 0.6;

    rb.applyImpulse(
      {
        x: Math.cos(angle) * horizontalPower,
        y: upwardPower,
        z: Math.sin(angle) * horizontalPower,
      },
      true,
    );
    rb.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
        z: (Math.random() - 0.5) * 3,
      },
      true,
    );
  }, [getTopFace, position, rollId]);

  // 在渲染帧里同步“顶面点数”（用于用户拖动时刷新 UI）
  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const translation = rb.translation();
    if (translation.y < -2 || Math.abs(translation.x) > 6 || Math.abs(translation.z) > 6) {
      const wasRolling = rollingRef.current || isRolling;
      rollingRef.current = false;
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
      rb.setTranslation({ x: position[0], y: position[1], z: position[2] }, true);
      const resetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
      rb.setRotation(resetQuat, true);

      const top = getTopFace(resetQuat);
      lastTopFaceRef.current = top;
      onTopFaceChange?.(top);
      if (wasRolling) onSettled?.(top);
    }

    if (rollingRef.current && isRolling && !isDraggingRef.current) {
      const linearVelocity = rb.linvel();
      const angularVelocity = rb.angvel();
      const linearSpeed = Math.hypot(linearVelocity.x, linearVelocity.y, linearVelocity.z);
      const angularSpeed = Math.hypot(angularVelocity.x, angularVelocity.y, angularVelocity.z);

      // Rapier 的 onSleep 往往会比“肉眼静止”慢一点，这里用速度阈值提前判定
      if (linearSpeed < 0.12 && angularSpeed < 0.6) {
        settleTimerRef.current += delta;
        if (settleTimerRef.current > 0.25) {
          rollingRef.current = false;
          settleTimerRef.current = 0;
          rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
          rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
          const top = getTopFace(quat(rb.rotation()));
          lastTopFaceRef.current = top;
          onSettled?.(top);
          onTopFaceChange?.(top);
        }
      } else {
        settleTimerRef.current = 0;
      }
      return;
    }

    settleTimerRef.current = 0;

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
      ccd
      onCollisionEnter={({ target, other }) => {
        // Avoid noise while not actively rolling (and while user is dragging).
        if (!isRolling && !rollingRef.current) return;
        if (isDraggingRef.current) return;

        // Cooldown to prevent rapid-fire sounds when the dice keeps contacting surfaces.
        const nowMs = performance.now();
        if (nowMs - lastCollisionSoundAtRef.current < 55) return;

        const selfVelocity = target.rigidBody?.linvel?.() as { x: number; y: number; z: number } | undefined;
        const otherVelocity = other.rigidBody?.linvel?.() as { x: number; y: number; z: number } | undefined;

        const relativeSpeed = Math.hypot(
          (selfVelocity?.x ?? 0) - (otherVelocity?.x ?? 0),
          (selfVelocity?.y ?? 0) - (otherVelocity?.y ?? 0),
          (selfVelocity?.z ?? 0) - (otherVelocity?.z ?? 0),
        );

        // Ignore tiny resting contacts.
        if (relativeSpeed < 0.35) return;

        lastCollisionSoundAtRef.current = nowMs;
        playDiceCollisionSfx({ relativeSpeed });
      }}
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
      <ConvexHullCollider args={[colliderVertices]} friction={1.0} restitution={0.08} />

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
        {/* 骰子视觉模型（自带贴图与数字） */}
        <primitive object={diceModel} />

        {/* 点光源 - 骰子自身发光 */}
        <pointLight color={glowColor} intensity={0.5} distance={3} decay={2} />
      </group>
    </RigidBody>
  );
};

useGLTF.preload('/models/d20_with_face_nodes_CC0_bundle/d20_with_face_nodes_CC0.glb');
