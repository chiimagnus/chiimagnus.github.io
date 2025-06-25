import React from 'react';
import LiquidGlass from './LiquidGlass';

const AboutCard: React.FC = () => {
  return (
    <LiquidGlass className="rounded-2xl overflow-hidden">
      <div className="p-6">
        <p className="text-center text-lg mb-4">热爱创造与表达的多面体，致力于将诗意融入产品设计。</p>
        <div className="flex justify-center flex-wrap gap-3">
          <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">✍️ 诗人</span>
          <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">⚡ Builder</span>
          <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">🚀 创业者</span>
          <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">💡 产品设计与开发</span>
          <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-transform duration-200 hover:scale-105">🧠 INTJ</span>
        </div>
      </div>
    </LiquidGlass>
  );
};

export default AboutCard; 