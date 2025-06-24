import React from 'react';

const Hero: React.FC = () => {
  return (
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
  );
};

export default Hero; 