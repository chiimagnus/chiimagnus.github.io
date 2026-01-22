import React, { Suspense, useCallback, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { D20Dice } from './D20Dice';
import { DiceTray } from './DiceTray';

export interface DiceSceneProps {
  className?: string;
  /**
   * 用于“骰子点击/投掷完成”的轻量回调（后续用于触发抽卡逻辑）。
   * 注意：当前实现会在骰子稳定后触发。
   */
  onDiceClick?: () => void;
}

/**
 * DiceScene
 * 博德之门 3 风格的 3D 骰子场景（含物理、光照与托盘）。
 */
export const DiceScene: React.FC<DiceSceneProps> = ({ className, onDiceClick }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [rollId, setRollId] = useState(0);
  const lastResultRef = useRef<number | null>(null);
  const trayScale = 2.2;

  /**
   * rollDice
   * 开启一轮新的物理投掷（通过 rollId 驱动子组件重置并施加冲量）。
   */
  const rollDice = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    setDiceResult(null);
    lastResultRef.current = null;
    setRollId((id) => id + 1);
  }, [isRolling]);

  /**
   * handleDiceSettled
   * 骰子稳定后回传最终点数（避免重复回调）。
   */
  const handleDiceSettled = useCallback(
    (result: number) => {
      setIsRolling(false);
      if (lastResultRef.current !== result) {
        lastResultRef.current = result;
        setDiceResult(result);
      }
      onDiceClick?.();
    },
    [onDiceClick],
  );

  /**
   * handleTopFaceChange
   * 用户拖动旋转时实时更新“顶面点数”展示（不影响最终 settle 回调）。
   */
  const handleTopFaceChange = useCallback(
    (result: number) => {
      if (isRolling) return;
      if (lastResultRef.current === result) return;
      lastResultRef.current = result;
      setDiceResult(result);
    },
    [isRolling],
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
              onTopFaceChange={handleTopFaceChange}
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

      {/* UI 覆盖层 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
        <p className="text-white/60 text-sm mb-2 font-light tracking-wider">
          {isRolling ? '命运之轮转动中...' : '拖动骰子旋转，点击投掷'}
        </p>

        {diceResult !== null && (
          <div className="dice-animate-fade-in">
            <span
              className={`text-4xl font-bold ${
                diceResult === 20
                  ? 'text-yellow-400 dice-animate-pulse-glow'
                  : diceResult === 1
                  ? 'text-red-500'
                  : 'text-orange-400'
              }`}
            >
              {diceResult}
            </span>
            {diceResult === 20 && <p className="text-yellow-400 text-sm mt-1">大成功！</p>}
            {diceResult === 1 && <p className="text-red-500 text-sm mt-1">大失败...</p>}
          </div>
        )}
      </div>

      {/* 投掷按钮 */}
      <button
        onClick={rollDice}
        disabled={isRolling}
        className={`
          absolute bottom-24 left-1/2 transform -translate-x-1/2
          px-6 py-2 rounded-full
          bg-gradient-to-r from-orange-600 to-red-600
          text-white font-medium
          transition-all duration-300
          hover:from-orange-500 hover:to-red-500
          hover:shadow-lg hover:shadow-orange-500/30
          disabled:opacity-50 disabled:cursor-not-allowed
          border border-orange-400/30
        `}
      >
        {isRolling ? '投掷中...' : '🎲 投掷骰子'}
      </button>
    </div>
  );
};

