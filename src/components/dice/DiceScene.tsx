import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { D20Dice } from './D20Dice';
import { DiceTray } from './DiceTray';
import { useTheme } from '../../context/ThemeContext';

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
 * GradientDrivenLighting
 * Use the ThemeProvider's shared GradientClock palette to drive Three.js lighting colors.
 *
 * Important:
 * - Runs in the R3F render loop via `useFrame` (no React 60fps rerender)
 * - Only mutates light colors/intensities (cheap, stable)
 */
const GradientDrivenLighting: React.FC = () => {
  const { getGradientPalette, getGradientPhase } = useTheme();

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const hemisphereRef = useRef<THREE.HemisphereLight>(null);
  const keySpotRef = useRef<THREE.SpotLight>(null);
  const highlightSpotRef = useRef<THREE.SpotLight>(null);
  const fillPointRef = useRef<THREE.PointLight>(null);
  const underGlowRef = useRef<THREE.PointLight>(null);
  const underSoftRef = useRef<THREE.PointLight>(null);
  const frontFillRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const palette = getGradientPalette();
    const phase = getGradientPhase();
    const pulse = Math.sin(phase.raw * Math.PI * 2);

    ambientRef.current?.color.set(palette.fillLight);
    hemisphereRef.current?.color.set(palette.fillLight);

    keySpotRef.current?.color.set(palette.keyLight);
    highlightSpotRef.current?.color.set(palette.highlight);

    fillPointRef.current?.color.set(palette.fillLight);

    if (underGlowRef.current) {
      underGlowRef.current.color.set(palette.underGlow);
      underGlowRef.current.intensity = 0.72 + pulse * 0.06;
    }
    if (underSoftRef.current) {
      underSoftRef.current.color.set(palette.velvetTint);
      underSoftRef.current.intensity = 0.32 + pulse * 0.04;
    }

    frontFillRef.current?.color.set('#ffffff');
    rimRef.current?.color.set(palette.rimLight);
  });

  return (
    <>
      {/* 环境光（整体提亮）：避免“夜景环境贴图”导致整体过暗 */}
      <ambientLight ref={ambientRef} intensity={0.5} />
      <hemisphereLight ref={hemisphereRef} intensity={0.5} color="#ffffff" groundColor="#1a0f2e" />

      {/* 主光源 - 顶部暖色调光 */}
      <spotLight
        ref={keySpotRef}
        position={[2, 5, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={1.35}
        color="#ff9966"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 高光强化灯：更聚焦的白光，用来“打出”金属边缘高光 */}
      <spotLight ref={highlightSpotRef} position={[-2.5, 5.2, 3.8]} angle={0.32} penumbra={0.65} intensity={1.0} color="#ffffff" />

      {/* 补光 - 侧面冷色调 */}
      <pointLight ref={fillPointRef} position={[-3, 2, -2]} intensity={0.6} color="#6699ff" distance={12} decay={2} />

      {/* 底部反射光 */}
      <pointLight ref={underGlowRef} position={[0, -0.6, 0]} intensity={0.75} color="#ff6b35" distance={8} decay={2} />
      {/* 底部柔光 */}
      <pointLight ref={underSoftRef} position={[0, -0.15, 0]} intensity={0.35} color="#ffb38a" distance={10} decay={2} />

      {/* 前方柔和补光：避免托盘整体偏暗 */}
      <directionalLight ref={frontFillRef} position={[0, 4, 6]} intensity={0.55} color="#ffffff" />
      {/* 背后轮廓光：让骰子边缘更立体 */}
      <directionalLight ref={rimRef} position={[0, 3, -6]} intensity={0.25} color="#cfe6ff" />
    </>
  );
};

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
          <GradientDrivenLighting />

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
