import React from 'react';

const Contacts: React.FC = () => {
  return (
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
  );
};

export default Contacts; 