import React from 'react';

const LifeWealth: React.FC = () => {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-3">
          <div className="flex items-center space-x-2">
            <img src="/lifewealth-assets/icon1.png" alt="LifeWealth Logo" className="h-10 w-10" />
            <span className="text-xl font-bold text-gray-900">人生财富</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">关于理念</a>
            <a href="#contacts" className="text-gray-600 hover:text-blue-600 transition">重要的人</a>
            <a href="#records" className="text-gray-600 hover:text-blue-600 transition">活动记录</a>
          </nav>
          {/* Mobile menu button can be added here if needed */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                珍惜时间，珍视关系
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                你很清楚自己每个月收入多少，但没有一个倒计时表，告诉你还剩下多少次见到父母的机会，还能再陪孩子度过多少个完整的周末。
              </p>
              <div className="mt-8 flex justify-center lg:justify-start gap-4">
                <a href="#contacts" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
                  管理重要的人
                </a>
              </div>
            </div>
            <div className="flex justify-center">
                <img src="/lifewealth-assets/icon1.png" alt="LifeWealth Dashboard" className="w-60 h-60 lg:w-72 lg:h-72" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Intro Section (About) */}
      <section id="about" className="py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">认识时间的真正价值</h2>
            <p className="mt-4 text-lg text-gray-600">为什么我们对金钱特别敏感，对陪伴父母的次数不敏感？因为金钱是非常可测量的。</p>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="italic text-gray-700">当时他(作者)在加州工作，而他的父母住在美国东海岸。有一次一个朋友问他，你多久见一次你的父母？他说大概一年一次。朋友又问你父母现在多大年纪了？他说65岁左右。然后朋友淡淡地说了一句："那你大概还能再见他们15次。"</p>
              <p className="text-right text-sm text-gray-500 mt-4">— 摘自《五种财富》，萨希尔·布卢姆著</p>
              <p className="mt-6 text-gray-800">你很清楚自己每个月收入多少。但是并没有一个倒计时表，告诉你还剩下多少次见到父母的机会，还能再陪孩子度过多少个完整的周末。</p>
            </div>
            <div className="flex justify-center">
              <img src="/lifewealth-assets/TimeCalculate.jpeg" alt="时间管理插图" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Relationship Management Section (Contacts) */}
      <section id="contacts" className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">管理重要的社交关系</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">添加并管理与你生命中重要的人，了解你们相处的宝贵时间。</p>
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Feature Item 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                  {/* Placeholder for an icon */}
                  <span>👤</span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">管理重要联系人</h3>
                <p className="mt-2 text-base text-gray-500">添加父母、子女、朋友等重要人物</p>
              </div>
              {/* Feature Item 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                  <span>⏰</span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">设置见面频率</h3>
                <p className="mt-2 text-base text-gray-500">每天、每周、每月或自定义时间间隔</p>
              </div>
              {/* Feature Item 3 */}
              <div className="text-center col-span-1 sm:col-span-2">
                 <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white mx-auto">
                  <span>👥</span>
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">从通讯录导入</h3>
                <p className="mt-2 text-base text-gray-500">一键导入已有联系人信息</p>
              </div>
            </div>
             <div className="flex justify-center">
              <img src="/lifewealth-assets/ContactManagement.jpeg" alt="联系人管理界面" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* App Features Section (Records) */}
      <section id="records" className="py-20 lg:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">活动记录</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">记录与重要的人相处的点滴，珍藏美好回忆</p>
          </div>
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl">✏️</div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">创建活动记录</h3>
                <p className="mt-2 text-base text-gray-500">记录与重要的人相处的活动、经历和感受，添加照片和思考。</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="text-3xl">📊</div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">查看时间统计</h3>
                <p className="mt-2 text-base text-gray-500">追踪与不同人相处的时间，发现需要更多关注的关系。</p>
              </div>
            </div>
            <div className="flex justify-center">
              <img src="/lifewealth-assets/ActivitiesRecord.PNG" alt="活动记录界面" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-blue-700">
        <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">开始珍惜与重要的人相处的时间</h2>
          <p className="mt-4 text-lg text-blue-200">记录重要的人和活动，不再错过珍贵的相处时光</p>
          <div className="mt-8">
            <a href="#" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
              立即开始
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
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
            <p>© {new Date().getFullYear()} 𝕎𝕙𝕠 𝕄𝕒𝕥𝕥𝕖𝕣𝕤 by Chii Magnus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LifeWealth; 