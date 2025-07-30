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

  const frontendSkills = [
    { name: 'JavaScript/TypeScript', level: '熟练掌握', desc: '现代前端开发，熟悉ES6+特性' },
    { name: 'React基础知识', level: '了解', desc: 'React核心概念和组件开发' },
    { name: '浏览器扩展开发', level: '熟悉', desc: 'Chrome扩展开发流程和API' },
    { name: 'Swift', level: '熟练掌握', desc: 'iOS/macOS原生应用开发' }
  ];

  const otherSkills = [
    { name: 'Git', level: '熟练', desc: '版本控制和团队协作经验' },
    { name: 'AI集成', level: '具备', desc: 'AI模型集成和应用开发经验' },
    { name: '插件开发', level: '熟悉', desc: '浏览器扩展和各种IDE插件开发' },
    { name: '跨平台开发', level: '具备', desc: 'iOS、macOS、Web多平台开发经验' }
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

      <LiquidGlass className="rounded-2xl overflow-hidden">
        <div className="p-8">
          <h3 className="text-center text-2xl font-bold mb-8 text-white">核心技能：Vibe Coding</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">前端开发</h4>
              <div className="space-y-3">
                {frontendSkills.map((skill, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-white font-medium">{skill.name}</h5>
                      <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">{skill.level}</span>
                    </div>
                    <p className="text-white text-opacity-70 text-sm">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold mb-4 text-white">开发工具 & 其他</h4>
              <div className="space-y-3">
                {otherSkills.map((skill, index) => (
                  <div key={index} className="bg-white bg-opacity-10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="text-white font-medium">{skill.name}</h5>
                      <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-1 rounded-full">{skill.level}</span>
                    </div>
                    <p className="text-white text-opacity-70 text-sm">{skill.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
};

export default AboutCard;
