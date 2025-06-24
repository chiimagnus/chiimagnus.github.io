import React from 'react';
import BlogCard from '../components/BlogCard';
import ProductCard from '../components/ProductCard';
import articlesData from '../data/articles.json';
import productsData from '../data/products.json';
import { BlogPost } from '../types';

const Home: React.FC = () => {
  // 将 JSON 数据转换为 BlogPost 格式
  const adaptedArticles: BlogPost[] = articlesData.map((article, index) => ({
    id: index.toString(),
    title: article.title,
    slug: article.slug || '',
    excerpt: article.description,
    content: article.description,
    author: 'chiimagnus',
    publishedAt: article.date,
    tags: [],
    category: 'default',
    readingTime: 5,
  }));

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
          {adaptedArticles.map((article, index) => (
            <BlogCard key={index} post={article} />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section id="products">
        <h2 className="text-2xl font-bold mb-6">产品开发</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {productsData.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              tags={product.tags}
              status={product.status}
              links={product.links}
            />
          ))}
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