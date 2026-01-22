import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { D20Dice } from './D20Dice';
import { DiceTray } from './DiceTray';

export interface DiceSceneProps {
  className?: string;
  /**
   * 外部触发投掷：当该值发生变化时，场景会开启一轮新的投掷。
   * 用于“进入博客需要检定”等场景。
   */
  rollRequestId?: number;
  /**
   * 用于“骰子点击/投掷完成”的轻量回调（后续用于触发抽卡逻辑）。
   * 注意：当前实现会在骰子稳定后触发。
   */
  onDiceClick?: () => void;
  /**
   * 骰子稳定后的最终点数回调（用于抽卡/命运逻辑）。
   */
  onRollSettled?: (diceResult: number) => void;
}

/**
 * DiceScene
 * 博德之门 3 风格的 3D 骰子场景（含物理、光照与托盘）。
 */
export const DiceScene: React.FC<DiceSceneProps> = ({ className, rollRequestId, onDiceClick, onRollSettled }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [rollId, setRollId] = useState(0);
  const lastResultRef = useRef<number | null>(null);
  const lastRollRequestIdRef = useRef<number | undefined>(rollRequestId);
  const trayScale = 2.2;

  /**
   * rollDice
   * 开启一轮新的物理投掷（通过 rollId 驱动子组件重置并施加冲量）。
   */
  const rollDice = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    lastResultRef.current = null;
    setRollId((id) => id + 1);
  }, [isRolling]);

  // 外部触发投掷：rollRequestId 变化时启动一轮投掷
  useEffect(() => {
    if (rollRequestId === undefined) return;
    if (lastRollRequestIdRef.current === rollRequestId) return;
    lastRollRequestIdRef.current = rollRequestId;
    rollDice();
  }, [rollDice, rollRequestId]);

  /**
   * handleDiceSettled
   * 骰子稳定后回传最终点数（避免重复回调）。
   */
  const handleDiceSettled = useCallback(
    (result: number) => {
      setIsRolling(false);
      if (lastResultRef.current === result) return;
      lastResultRef.current = result;
      onRollSettled?.(result);
      onDiceClick?.();
    },
    [onDiceClick, onRollSettled],
  );

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 7.2, 7.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.35,
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* 环境光 */}
          <ambientLight intensity={0.35} />
          <hemisphereLight intensity={0.35} color="#ffffff" groundColor="#1a0f2e" />

          {/* 主光源 - 顶部暖色调光 */}
          <spotLight
            position={[2, 5, 2]}
            angle={0.4}
            penumbra={0.5}
            intensity={1.35}
            color="#ff9966"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* 补光 - 侧面冷色调 */}
          <pointLight position={[-3, 2, -2]} intensity={0.45} color="#6699ff" />

          {/* 底部反射光 */}
          <pointLight position={[0, -1, 0]} intensity={0.25} color="#ff6b35" />

          {/* 前方柔和补光：避免托盘整体偏暗 */}
          <directionalLight position={[0, 4, 6]} intensity={0.35} color="#ffffff" />

          <Physics gravity={[0, -9.81, 0]}>
            {/* 防止骰子掉出场景的“兜底地面”（不可见） */}
            <RigidBody type="fixed" colliders={false}>
              <CuboidCollider args={[20, 0.5, 20]} position={[0, -3, 0]} />
            </RigidBody>

            {/* 封闭空气墙：六个面封闭，强制骰子始终在托盘范围内（不可见） */}
            <RigidBody type="fixed" colliders={false}>
              {/* 参数说明：
                 - 盒子中心在 y=0.9，覆盖托盘上方的主要活动空间
                 - 顶面足够高，避免影响正常滚动，但防止“跳出空气墙” */}
              <CuboidCollider args={[0.12, 1.6, 1.75 * trayScale]} position={[1.82 * trayScale, 1.0, 0]} />
              <CuboidCollider args={[0.12, 1.6, 1.75 * trayScale]} position={[-1.82 * trayScale, 1.0, 0]} />
              <CuboidCollider args={[1.75 * trayScale, 1.6, 0.12]} position={[0, 1.0, 1.82 * trayScale]} />
              <CuboidCollider args={[1.75 * trayScale, 1.6, 0.12]} position={[0, 1.0, -1.82 * trayScale]} />
              <CuboidCollider args={[1.75 * trayScale, 0.12, 1.75 * trayScale]} position={[0, -0.65, 0]} />
              <CuboidCollider args={[1.75 * trayScale, 0.12, 1.75 * trayScale]} position={[0, 2.65, 0]} />
            </RigidBody>

            {/* 骰子：投掷使用物理，停下后读取顶面点数 */}
            <D20Dice
              position={[0, 0.9, 0]}
              rollId={rollId}
              isRolling={isRolling}
              glowColor="#FFE5B4"
              baseColor="#D4AF37"
              onRequestRoll={rollDice}
              onSettled={handleDiceSettled}
            />

            {/* 托盘：固定刚体，骰子与其碰撞 */}
            <DiceTray position={[0, -0.05, 0]} scale={trayScale} />
          </Physics>

          {/* 接触阴影 - 调整位置到丝绒表面 */}
          <ContactShadows
            position={[0, 0.03, 0]}
            opacity={0.4}
            scale={7}
            blur={2}
            far={2}
            color="#000000"
          />

          {/* 环境贴图 - 提供反射 */}
          <Environment preset="night" background={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};
