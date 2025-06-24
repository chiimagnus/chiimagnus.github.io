import React from 'react';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = format(new Date(post.publishedAt), 'yyyy年MM月dd日 HH:mm');

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