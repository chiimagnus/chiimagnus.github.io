import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { format } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  const formattedDate = format(new Date(post.publishedAt), 'yyyy年MM月dd日 HH:mm');

  if (featured) {
    return (
      <article className="glass-card p-6 flex flex-col md:flex-row items-center gap-6">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full md:w-1/3 h-auto rounded-lg object-cover" />
        )}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
          <p className="text-sm text-gray-300 mb-3">{formattedDate}</p>
          <p className="text-gray-200 mb-4">{post.excerpt}</p>
          <a href="#" className="flex items-center font-semibold text-purple-300 hover:text-purple-200">
            阅读全文 <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="glass-card p-6">
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-sm text-gray-300 mb-3">{formattedDate}</p>
      <p className="text-gray-200 mb-4">{post.excerpt}</p>
      <a href="#" className="flex items-center font-semibold text-purple-300 hover:text-purple-200">
        阅读全文 <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </article>
  );
};

export default BlogCard; 