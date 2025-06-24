import React from 'react';

const Features: React.FC = () => {
  return (
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
  );
};

export default Features; 