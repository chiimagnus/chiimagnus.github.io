import React from 'react';

interface JetFooterProps {
  className?: string;
}

const JetFooter: React.FC<JetFooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-fighter-jet text-2xl text-blue-400"></i>
              <span className="text-xl font-bold">JETJETJET</span>
            </div>
            <p className="text-gray-400">
              创新的飞机运动追踪应用
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-lg font-semibold mb-4">技术栈</h4>
            <ul className="space-y-2 text-gray-400">
              <li>SwiftUI</li>
              <li>SwiftData</li>
              <li>CoreMotion</li>
              <li>SceneKit</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">联系方式</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <i className="fab fa-github"></i>
                <span>GitHub</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope"></i>
                <span>Email</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JETJETJET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default JetFooter;
