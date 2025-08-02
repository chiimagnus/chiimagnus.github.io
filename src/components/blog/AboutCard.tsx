import React from 'react';
import LiquidGlass from '../blog/LiquidGlass';

const AboutCard: React.FC = () => {

  const coreSkills = [
    { icon: '📱', name: 'iOS/macOS', tech: 'Swift' },
    { icon: '⚛️', name: 'React', tech: 'TypeScript' },
    { icon: '🔌', name: '插件开发', tech: 'Chrome/IDE' },
    { icon: '🤖', name: 'AI集成', tech: 'LLM/API' },
    { icon: '🎨', name: '产品设计', tech: 'UX/UI' }
  ];



  return (
    <div className="space-y-6">
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

      <LiquidGlass className="rounded-2xl overflow-hidden">
        <div className="p-8">
          <h3 className="text-center text-2xl font-bold mb-8 text-white">核心技能：Vibe Coding</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {coreSkills.map((skill, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-opacity-20 hover:scale-105">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{skill.name}</h4>
                  <p className="text-white text-opacity-70 text-xs">{skill.tech}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
};

export default AboutCard;
