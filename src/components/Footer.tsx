import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-white">ChiiBlog</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              分享技术、记录生活的个人博客。专注于前端开发、用户体验设计和技术思考。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/chiiblog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/chiiblog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@chiiblog.com"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/posts" className="text-gray-400 hover:text-white transition-colors">
                  所有文章
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-400 hover:text-white transition-colors">
                  分类
                </Link>
              </li>
              <li>
                <Link to="/tags" className="text-gray-400 hover:text-white transition-colors">
                  标签
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  关于我
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">最新文章</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/posts/react-18-deep-dive"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  React 18 新特性深度解析
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/typescript-advanced-types"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  TypeScript 高级类型系统详解
                </Link>
              </li>
              <li>
                <Link
                  to="/posts/modern-frontend-architecture"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  构建现代化的前端工程架构
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} ChiiBlog. 所有权利保留。
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> using React & TailwindCSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 