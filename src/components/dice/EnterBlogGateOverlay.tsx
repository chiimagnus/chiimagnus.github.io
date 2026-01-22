import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import LiquidGlass from '../blog/LiquidGlass';

export interface EnterBlogGateOverlayProps {
  dc: number;
  roll: number;
  onClose: () => void;
  onRetry: () => void;
}

/**
 * EnterBlogGateOverlay
 * “进入博客”检定失败后的反馈浮层。
 *
 * 设计目标：
 * - 失败要明确（发生了什么、为什么失败、下一步是什么）
 * - 交互要像游戏：下一步动作聚焦为“再掷一次”
 * - UI 视觉与 2D 卡片一致（LiquidGlass）
 */
export const EnterBlogGateOverlay: React.FC<EnterBlogGateOverlayProps> = ({ dc, roll, onClose, onRetry }) => {
  const title = useMemo(() => {
    if (roll === 1) return '大失败';
    return '失败';
  }, [roll]);

  /**
   * 失败调侃文案（轻松、无攻击性）
   * - 按 roll 段位给不同风格
   * - 使用 deterministic 选择，避免每次 re-render 变文案
   */
  const subtitle = useMemo(() => {
    if (roll === 1) {
      const lines = [
        '你这一下，连命运都笑出了声。',
        '骰子：我先撤了，你再想想。',
        '命运：今天不让你过。',
      ];
      return lines[roll % lines.length];
    }

    if (roll < dc - 4) {
      const lines = [
        '你差得有点多，但这很有“主角成长线”的味道。',
        '命运：先别急，练练手感再来。',
        '你这手气…像是刚起床。',
      ];
      return lines[roll % lines.length];
    }

    if (roll < dc) {
      const lines = [
        '就差一点点——骰子故意的。',
        '命运：很接近了，但我还想看你再掷一次。',
        '差一口气，下一把就中。',
      ];
      return lines[roll % lines.length];
    }

    return '通过了。';
  }, [dc, roll]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        onRetry();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onRetry]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 p-6 flex items-center justify-center">
        <div className="relative w-full max-w-md">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center border border-white/15 backdrop-blur-sm shadow-sm transition-colors"
            aria-label="关闭"
          >
            <X size={16} />
          </button>

          <LiquidGlass className="rounded-2xl overflow-hidden">
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <p className="text-white/60 text-xs tracking-widest">进入博客 · 检定</p>
                <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-white/70 text-sm">{subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <p className="text-white/60 text-xs tracking-widest mb-1">DC</p>
                  <p className="text-2xl font-bold text-white">{dc}</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/5 p-4">
                  <p className="text-white/60 text-xs tracking-widest mb-1">你掷出了</p>
                  <p
                    className={`text-2xl font-bold ${
                      roll === 1 ? 'text-red-400' : 'text-orange-300'
                    }`}
                  >
                    {roll}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onRetry}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold transition-colors border border-orange-400/30"
              >
                再掷一次
              </button>

              <p className="text-white/40 text-xs text-center">Enter 再掷｜Esc 关闭</p>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </div>
  );
};
