import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
        <div className="flex items-center space-x-2">
          <img src="/lifewealth-assets/icon1.png" alt="LifeWealth Logo" className="h-10 w-10" />
          <span className="text-xl font-bold text-gray-900">LifeWealth</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#about" className="text-gray-600 hover:text-blue-600 transition">关于理念</a>
          <a href="#contacts" className="text-gray-600 hover:text-blue-600 transition">重要的人</a>
          <a href="#records" className="text-gray-600 hover:text-blue-600 transition">活动记录</a>
        </nav>
        {/* Mobile menu button can be added here if needed */}
      </div>
    </header>
  );
};

export default Header; 