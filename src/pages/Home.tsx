import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Twitter } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { blogPosts, siteConfig } from '../data/mockData';

const Home: React.FC = () => {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <img
                src={siteConfig.author.avatar}
                alt={siteConfig.author.name}
                className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              欢迎来到 <span className="text-primary-600">ChiiBlog</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {siteConfig.description}
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <a
                href={siteConfig.author.social?.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-primary-600"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href={siteConfig.author.social?.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-gray-700 hover:text-primary-600"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            <Link
              to="/posts"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              浏览所有文章
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">精选文章</h2>
              <p className="text-gray-600">这里是一些我认为值得推荐的优质内容</p>
            </div>
            <div className="space-y-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">最新文章</h2>
              <p className="text-gray-600">分享我最新的思考和学习心得</p>
            </div>
            <Link
              to="/posts"
              className="hidden md:inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              查看全部
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12 md:hidden">
            <Link
              to="/posts"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              查看更多文章
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">关于我</h2>
            <p className="text-lg text-gray-600 mb-8">
              {siteConfig.author.bio}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
            >
              了解更多
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 