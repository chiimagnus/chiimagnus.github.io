import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold">LifeWealth</h3>
            <p className="mt-4 text-gray-400">珍惜时间，珍视关系，记录与重要的人相处的珍贵时光。</p>
          </div>
          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">功能</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#contacts" className="text-gray-400 hover:text-white">联系人管理</a></li>
              <li><a href="#records" className="text-gray-400 hover:text-white">活动记录</a></li>
            </ul>
          </div>
          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">资源</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-white">关于理念</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">使用指南</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">常见问题</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase">联系我们</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="mailto:chii_magnus@outlook.com" className="text-gray-400 hover:text-white">邮箱</a></li>
              <li><a href="https://github.com/chiimagnus" className="text-gray-400 hover:text-white">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} LifeWealth by Chii Magnus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 