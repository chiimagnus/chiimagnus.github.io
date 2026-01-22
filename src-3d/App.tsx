import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { DiceScene } from './components';

/**
 * 3D 骰子应用 - 博德之门3风格
 * 全屏沉浸式骰子体验
 */
const App: React.FC = () => {
  const handleBackClick = () => {
    // 返回主博客
    window.location.href = '/';
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-[#0a0a15] via-[#1a0f2e] to-[#0d0d1a]">
      {/* 背景装饰 - 神秘光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 顶部光晕 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 blur-[100px] rounded-full" />
        
        {/* 底部光晕 */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[80px] rounded-full" />
        
        {/* 侧面光晕 */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[200px] h-[400px] bg-blue-600/5 blur-[60px] rounded-full" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[200px] h-[400px] bg-red-600/5 blur-[60px] rounded-full" />
      </div>

      {/* 顶部导航栏 */}
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* 返回按钮 */}
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-light">返回博客</span>
          </button>

          {/* 标题 */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-400" />
            <h1 className="text-white font-medium tracking-wider">命运骰子</h1>
          </div>

          {/* 占位 */}
          <div className="w-24" />
        </div>
      </header>

      {/* 3D 场景 */}
      <div className="absolute inset-0 z-0">
        <DiceScene />
      </div>

      {/* 底部装饰文字 */}
      <footer className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <p className="text-white/30 text-xs font-light tracking-widest">
          "命运的齿轮开始转动..."
        </p>
      </footer>

      {/* 角落装饰 */}
      <div className="absolute top-20 left-8 w-px h-32 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
      <div className="absolute top-20 right-8 w-px h-32 bg-gradient-to-b from-transparent via-orange-500/30 to-transparent" />
      <div className="absolute bottom-20 left-8 w-px h-32 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
      <div className="absolute bottom-20 right-8 w-px h-32 bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />
    </div>
  );
};

export default App;
