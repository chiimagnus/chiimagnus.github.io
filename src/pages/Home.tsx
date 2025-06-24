import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { mockPosts } from '../data/mockData';
import { BlogPost } from '../types';

const Home: React.FC = () => {
  const featuredPost = mockPosts.find(p => p.featured) as BlogPost;
  const otherPosts = mockPosts.filter(p => !p.featured);

  return (
    <div className="space-y-12">
      {/* Featured Post */}
      {featuredPost && (
        <section>
          <h2 className="text-2xl font-bold mb-6">推荐阅读</h2>
          <BlogCard post={featuredPost} featured />
        </section>
      )}

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        <div className="grid gap-8 md:grid-cols-2">
          {otherPosts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">产品开发</h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">这里是我的产品展示区，敬请期待...</p>
        </div>
      </section>

      {/* About Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">关于我</h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">热爱创造与表达的多面体，致力于将诗意融入产品设计。</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 