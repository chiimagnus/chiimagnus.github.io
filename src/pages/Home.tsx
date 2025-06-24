import React from 'react';
import BlogCard from '../components/BlogCard';
import { mockPosts } from '../data/mockData';
import ProductCard from '../components/ProductCard';

const Home: React.FC = () => {
  const otherPosts = mockPosts.filter(p => !p.featured);

  return (
    <div className="space-y-12">
      <section id="articles">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">文章</h2>
          <button className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white">
            <span>展开</span>
            <span>↓</span>
          </button>
        </div>
        <div className="space-y-6">
          {mockPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products">
        <h2 className="text-2xl font-bold mb-6">产品开发</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            title="LifeWealth"
            icon="⌛"
            description="拥有真正的富足不仅仅是物质财富，而是平衡发展五种关键财富维度：时间、社交、精神、物质和经验财富。"
            tags={['iOS', 'macOS', '即将发布!']}
            linkText="详细介绍"
            linkUrl="#"
          />
           <ProductCard
            title="Logseq-AI-Search"
            icon="🔌"
            description="Logseq智能搜索插件，基于当前block内容，进行logseq文档内的全局搜索，返回笔记来源，并可以进行AI总结。"
            tags={['Logseq-Plugin', 'AI', '已发布']}
            linkText="GitHub"
            linkUrl="#"
          />
          <ProductCard
            title="Vniverse"
            icon="📖"
            description="macOS软件, markdown、PDF、AI Chat聊天记录阅读器, 能够自然语言文本朗读和自动高亮朗读文本。"
            tags={['macOS', '语音合成', '已归档']}
            linkText="GitHub"
            linkUrl="#"
          />
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <h2 className="text-2xl font-bold mb-6">关于我</h2>
        <div className="glass-card p-6">
          <p className="text-center text-lg mb-4">热爱创造与表达的多面体，致力于将诗意融入产品设计。</p>
          <div className="flex justify-center flex-wrap gap-3">
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full">✍️ 诗人</span>
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full">💡 产品设计与开发</span>
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full">🚀 创业者</span>
            <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-4 py-1.5 rounded-full">🧠 INTJ</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 