import React from 'react';

const About: React.FC = () => {
  return (
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
  );
};

export default About; 