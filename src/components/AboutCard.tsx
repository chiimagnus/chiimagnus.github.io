import React from 'react';
import LiquidGlass from './LiquidGlass';

const AboutCard: React.FC = () => {
  const personalTraits = [
    {
      icon: '💡',
      title: '创新思维',
      description: '探索新技术与创意解决方案'
    },
    {
      icon: '📚',
      title: '自主学习',
      description: '快速掌握并应用新技术'
    },
    {
      icon: '🤝',
      title: '团队协作',
      description: '良好沟通与团队合作'
    },
    {
      icon: '🔍',
      title: '细节导向',
      description: '注重代码质量与用户体验'
    },
    {
      icon: '🌱',
      title: '长期视角',
      description: '重视可维护性与可持续发展'
    }
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
          <h3 className="text-center text-2xl font-bold mb-8 text-white">个人特质</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {personalTraits.map((trait, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-opacity-20 hover:scale-105 hover:shadow-lg">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {trait.icon}
                  </div>
                  <h4 className="text-white font-semibold text-lg mb-2">{trait.title}</h4>
                  <p className="text-white text-opacity-70 text-sm leading-relaxed">
                    {trait.description}
                  </p>
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