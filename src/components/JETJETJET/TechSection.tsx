import React from 'react';
import { TechItem } from '../../types';

interface TechSectionProps {
  techStack: TechItem[];
  className?: string;
}

const TechSection: React.FC<TechSectionProps> = ({ techStack, className = '' }) => {
  return (
    <section id="tech" className={`py-20 bg-gray-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Tech Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              技术亮点
            </h2>
            <div className="space-y-6">
              {techStack.map((tech) => (
                <div key={tech.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <i className={`${tech.icon} text-white text-lg`}></i>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {tech.title}
                    </h4>
                    <p className="text-gray-600">
                      {tech.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Preview */}
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm font-mono">FlightData.swift</span>
            </div>
            <div className="p-6">
              <pre className="text-sm font-mono leading-relaxed">
                <code>
                  <span className="text-blue-400">@Model</span>
                  {'\n'}
                  <span className="text-blue-400">final class</span> <span className="text-green-400">FlightData</span> {'{'}
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">timestamp</span>: <span className="text-yellow-400">Date</span> = Date()
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">speed</span>: <span className="text-yellow-400">Double</span> = 0.0
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">pitch</span>: <span className="text-yellow-400">Double</span> = 0.0  <span className="text-gray-500">// 俯仰角</span>
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">roll</span>: <span className="text-yellow-400">Double</span> = 0.0   <span className="text-gray-500">// 横滚角</span>
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">yaw</span>: <span className="text-yellow-400">Double</span> = 0.0    <span className="text-gray-500">// 偏航角</span>
                  {'\n'}
                  {'    '}
                  <span className="text-blue-400">var</span> <span className="text-cyan-400">sessionId</span>: <span className="text-yellow-400">UUID</span>?
                  {'\n'}
                  {'}'}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechSection;
