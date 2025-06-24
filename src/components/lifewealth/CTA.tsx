import React from 'react';

const CTA: React.FC = () => {
  return (
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
  );
};

export default CTA; 