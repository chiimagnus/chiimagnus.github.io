import React, { Suspense, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { D20Dice } from './D20Dice';
import { DiceTray } from './DiceTray';

interface DiceSceneProps {
  className?: string;
  onDiceClick?: () => void;
}

/**
 * 博德之门3风格的骰子场景
 * 包含骰子、托盘、光照和环境效果
 */
export const DiceScene: React.FC<DiceSceneProps> = ({ className, onDiceClick }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);

  // 投掷骰子
  const rollDice = useCallback(() => {
    if (isRolling) return;

    setIsRolling(true);
    setDiceResult(null);

    // 模拟投掷动画时间
    setTimeout(() => {
      const result = Math.floor(Math.random() * 20) + 1;
      setDiceResult(result);
      setIsRolling(false);
      onDiceClick?.();
    }, 2000);
  }, [isRolling, onDiceClick]);

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <Canvas
        shadows
        camera={{ position: [0, 4.2, 4.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* 环境光 */}
          <ambientLight intensity={0.2} />

          {/* 主光源 - 顶部暖色调光 */}
          <spotLight
            position={[2, 5, 2]}
            angle={0.4}
            penumbra={0.5}
            intensity={1}
            color="#ff9966"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* 补光 - 侧面冷色调 */}
          <pointLight
            position={[-3, 2, -2]}
            intensity={0.3}
            color="#6699ff"
          />

          {/* 底部反射光 */}
          <pointLight
            position={[0, -1, 0]}
            intensity={0.2}
            color="#ff6b35"
          />

          {/* 骰子 - 可点击 */}
          <D20Dice
            position={[0, 0.8, 0]}
            isRolling={isRolling}
            glowColor="#FFE5B4" // 浅金色光晕
            baseColor="#D4AF37" // 金色本体
            onClick={rollDice}
          />

          {/* 托盘 */}
          <DiceTray
            position={[0, -0.05, 0]}
            innerColor="#2a0a12" // 深红色丝绒底座
            outerColor="#B8860B" // 暗金色边框
            runeColor="#FFD700"  // 金色符文
          />

          {/* 接触阴影 - 调整位置到丝绒表面 */}
          <ContactShadows
            position={[0, 0.03, 0]}
            opacity={0.4}
            scale={4}
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
        {/* 投掷提示 */}
        <p className="text-white/60 text-sm mb-2 font-light tracking-wider">
          {isRolling ? '命运之轮转动中...' : '点击骰子投掷'}
        </p>

        {/* 结果显示 */}
        {diceResult !== null && (
          <div className="animate-fade-in">
            <span
              className={`text-4xl font-bold ${
                diceResult === 20
                  ? 'text-yellow-400 animate-pulse'
                  : diceResult === 1
                  ? 'text-red-500'
                  : 'text-orange-400'
              }`}
            >
              {diceResult}
            </span>
            {diceResult === 20 && (
              <p className="text-yellow-400 text-sm mt-1">大成功！</p>
            )}
            {diceResult === 1 && (
              <p className="text-red-500 text-sm mt-1">大失败...</p>
            )}
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

export default DiceScene;
