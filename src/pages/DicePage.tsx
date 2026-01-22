import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [rollRequestId, setRollRequestId] = useState(0);
  const [isEnteringBlog, setIsEnteringBlog] = useState(false);
  const enterBlogDC = 10;

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
      // “进入博客”检定：成功才放行；失败就停留并允许再次投掷
      if (isEnteringBlog) {
        if (diceResult >= enterBlogDC) {
          navigate('/blog');
        }
        setIsEnteringBlog(false);
        return;
      }

      const card = drawCard({ diceResult, pool });
      if (!card) return;
      if (card.type === 'theme') {
        setTheme(card.themeName);
      }
      setResultCard(card);
    },
    [enterBlogDC, isEnteringBlog, navigate, pool, setTheme],
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* 背景暗化层：保留主题背景变化，同时让 3D 场景更沉浸 */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* 顶部栏 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setIsEnteringBlog(true);
              setRollRequestId((id) => id + 1);
            }}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <span className="font-light">进入博客</span>
          </button>

          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h1 className="text-white font-medium tracking-wider">命运骰子</h1>
          </div>

          <div className="w-24" />
        </div>
      </header>

      {/* 3D 场景 */}
      <div className="absolute inset-0 z-0">
        <DiceScene rollRequestId={rollRequestId} onRollSettled={handleRollSettled} />
      </div>

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
