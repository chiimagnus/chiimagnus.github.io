import React, { useMemo } from 'react';
import LiquidGlass from '../blog/LiquidGlass';
import { themes } from '../../data/themes';

export interface ThemeResultCardProps {
  themeName: string;
}

/**
 * ThemeResultCard
 * 主题“命运卡”展示：保持与 2D 卡片一致的 LiquidGlass 风格，并展示渐变预览。
 *
 * 注意：主题应用逻辑由上层页面负责（抽到即生效）；该组件仅负责展示“已生效”。
 */
export const ThemeResultCard: React.FC<ThemeResultCardProps> = ({ themeName }) => {
  const theme = useMemo(() => themes.find((t) => t.name === themeName) || null, [themeName]);

  if (!theme) {
    return (
      <LiquidGlass className="rounded-2xl overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">主题</h3>
          <p className="text-gray-200">未找到主题：{themeName}</p>
        </div>
      </LiquidGlass>
    );
  }

  return (
    <LiquidGlass className="rounded-2xl overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">主题已变更</h3>
            <p className="text-gray-200 text-sm">
              你抽到了：<span className="font-semibold">{theme.name}</span>
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-400 text-green-900">
            已生效
          </span>
        </div>

        <div
          className="rounded-xl border border-white/15 overflow-hidden h-20"
          style={{ backgroundImage: theme.colors.gradient, backgroundSize: 'cover' }}
        />

        <p className="text-white/70 text-sm">
          你可以点击下方“返回博客”查看整体视觉变化。
        </p>
      </div>
    </LiquidGlass>
  );
};

