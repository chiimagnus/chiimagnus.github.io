import { BlogPost, Category, Tag, Author, SiteConfig } from '../types';

export const author: Author = {
  id: '1',
  name: 'Chii Magnus',
  avatar: '/avatar.png'
};

export const categories: Category[] = [
  {
    id: '1',
    name: '前端开发',
    slug: 'frontend',
    description: '前端技术相关的文章和教程',
    postCount: 12,
  },
  {
    id: '2',
    name: '后端开发',
    slug: 'backend',
    description: '后端技术和架构相关内容',
    postCount: 8,
  },
  {
    id: '3',
    name: '生活随笔',
    slug: 'life',
    description: '日常生活的思考和感悟',
    postCount: 5,
  },
];

export const tags: Tag[] = [
  { id: '1', name: 'React', slug: 'react', postCount: 8 },
  { id: '2', name: 'TypeScript', slug: 'typescript', postCount: 6 },
  { id: '3', name: 'JavaScript', slug: 'javascript', postCount: 10 },
  { id: '4', name: 'CSS', slug: 'css', postCount: 5 },
  { id: '5', name: 'Node.js', slug: 'nodejs', postCount: 4 },
  { id: '6', name: '随想', slug: 'thoughts', postCount: 3 },
];

export const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Stay In The Reality, Please',
    slug: 'stay-in-the-reality-please',
    excerpt: '我们太习惯于虚拟的世界, 甚至都以为那才是现实生活.',
    content: '',
    author: author.name,
    publishedAt: '2024-03-25T08:20:00Z',
    tags: ['随想'],
    category: '生活随笔',
    readingTime: 3,
  },
  {
    id: '2',
    title: 'AI辅助人, 而不是AI替代人',
    slug: 'ai-assistant-not-replacement',
    excerpt: '所以至关重要的是, 不能啥事都只让AI做, 我们也需要在这个过程中不断成长, 掌握更多的专业技术, 学会使用恰当的字词描述更准确的需求.',
    content: '',
    author: author.name,
    publishedAt: '2024-03-19T08:20:00Z',
    tags: ['AI', '技术思考'],
    category: '技术分享',
    readingTime: 4,
  },
  {
    id: '3',
    title: '我的产品开发理念：LifeWealth',
    slug: 'product-development-lifewealth',
    excerpt: '介绍我的个人项目 LifeWealth 的创作理念，以及如何通过产品设计来探索生活的五种财富。',
    content: '',
    author: author.name,
    publishedAt: '2024-07-15T09:00:00Z',
    tags: ['产品设计', '创业', '生活方式'],
    category: '产品开发',
    readingTime: 5,
    coverImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    featured: false,
  }
];

export const siteConfig: SiteConfig = {
  title: 'ChiiBlog',
  description: '分享技术、记录生活的个人博客',
  author,
  url: 'https://chiiblog.com',
  postsPerPage: 6,
}; 