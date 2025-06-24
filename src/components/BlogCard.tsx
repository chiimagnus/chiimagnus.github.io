import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag } from 'lucide-react';
import { BlogPost } from '../types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const formattedDate = format(new Date(post.publishedAt), 'yyyy年MM月dd日');

  return (
    <article className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
      featured ? 'md:flex' : ''
    }`}>
      {post.coverImage && (
        <div className={`${featured ? 'md:w-1/2' : ''}`}>
          <img
            src={post.coverImage}
            alt={post.title}
            className={`w-full object-cover ${
              featured ? 'h-48 md:h-full' : 'h-48'
            }`}
          />
        </div>
      )}
      
      <div className={`p-6 ${featured && post.coverImage ? 'md:w-1/2' : ''}`}>
        {/* 分类和标签 */}
        <div className="flex items-center space-x-4 mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            {post.category}
          </span>
          {post.featured && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              推荐
            </span>
          )}
        </div>

        {/* 标题 */}
        <h2 className={`font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        }`}>
          <Link to={`/posts/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {/* 摘要 */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime} 分钟阅读</span>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              to={`/tags/${tag.toLowerCase()}`}
              className="inline-flex items-center space-x-1 text-xs text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
            </Link>
          ))}
        </div>

        {/* 阅读更多按钮 */}
        <div className="mt-4">
          <Link
            to={`/posts/${post.slug}`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
          >
            阅读全文 →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard; 