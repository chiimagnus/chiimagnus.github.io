import React, { useMemo } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BlogCard from '../blog/BlogCard';
import ProductCard from '../blog/ProductCard';
import LiquidGlass from '../blog/LiquidGlass';
import { BlogPost } from '../../types';
import type { DiceCard } from '../../features/dice/dicePool';
import { ThemeResultCard } from './ThemeResultCard';

export interface DiceResultOverlayProps {
  card: DiceCard;
  onClose: () => void;
}

/**
 * DiceResultOverlay
 * 投掷结束后的“命运结果卡”浮层：展示并停留；用户点击卡片/链接自行跳转。
 * UI 复用 2D 博客的卡片组件，以保证风格一致。
 */
export const DiceResultOverlay: React.FC<DiceResultOverlayProps> = ({ card, onClose }) => {
  const blogPost = useMemo<BlogPost | null>(() => {
    if (card.type !== 'article') return null;
    return {
      id: card.id,
      title: card.title,
      slug: '',
      excerpt: card.description,
      content: card.description,
      author: 'chiimagnus',
      publishedAt: card.publishedAt,
      tags: [],
      category: 'default',
      readingTime: 5,
      url: card.url,
      external: card.external,
    };
  }, [card]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 p-6 flex items-center justify-center">
        <div className="relative w-full max-w-3xl max-h-[85vh] overflow-auto">
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center"
            aria-label="关闭"
          >
            <X size={18} />
          </button>

          <div className="space-y-4">
            {card.type === 'article' && blogPost && <BlogCard post={blogPost} />}

            {card.type === 'product' && (
              <ProductCard
                title={card.title}
                description={card.description}
                tags={card.tags}
                status={card.status}
                links={card.links}
              />
            )}

            {card.type === 'about' && (
              <LiquidGlass className="rounded-2xl overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">关于我</h3>
                  <p className="text-gray-200 mb-4">抽到了关于我：去博客里看看我是谁。</p>
                  <Link
                    to="/blog#about"
                    className="inline-flex items-center font-semibold text-purple-300 hover:text-purple-200"
                  >
                    前往 /blog#about
                  </Link>
                </div>
              </LiquidGlass>
            )}

            {card.type === 'theme' && <ThemeResultCard themeName={card.themeName} />}
          </div>
        </div>
      </div>
    </div>
  );
};
