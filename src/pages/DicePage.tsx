import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DiceScene } from '../components/dice';
import '../styles/dice.css';
import { DiceResultOverlay } from '../components/dice/DiceResultOverlay';
import { buildDicePool, drawCard, type DiceCard } from '../features/dice/dicePool';
import { useTheme } from '../context/ThemeContext';

/**
 * DicePage
 * - 主站入口页面（`/`）
 * - 展示 3D 命运骰子（全屏）
 * - 为避免影响 `/blog` 的滚动，仅在本页挂载期间禁用 body 滚动
 */
const DicePage: React.FC = () => {
  const pool = useMemo(() => buildDicePool(), []);
  const [resultCard, setResultCard] = useState<DiceCard | null>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  /**
   * handleRollSettled
   * 骰子稳定后抽取一张命运卡并展示结果浮层（停留，等待用户点击跳转）。
   */
  const handleRollSettled = useCallback(
    (diceResult: number) => {
      const card = drawCard({ diceResult, pool });
      if (!card) return;
      if (card.type === 'theme') {
        setTheme(card.themeName);
      }
      setResultCard(card);
    },
    [pool, setTheme],
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 背景暗化层：保留主题背景变化，同时让 3D 场景更沉浸 */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 顶部栏 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="font-light">进入博客</span>
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h1 className="text-white font-medium tracking-wider">命运骰子</h1>
          </div>

          <div className="w-24" />
        </div>
      </header>

      {/* 3D 场景 */}
      <div className="absolute inset-0 z-0">
        <DiceScene onRollSettled={handleRollSettled} />
      </div>

      {/* 底部装饰文字 */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <p className="text-white/30 text-xs font-light tracking-widest">
          &quot;命运的齿轮开始转动...&quot;
        </p>
      </footer>

      {resultCard && (
        <DiceResultOverlay
          card={resultCard}
          onClose={() => setResultCard(null)}
        />
      )}
    </div>
  );
};

export default DicePage;
