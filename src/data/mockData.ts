import { BlogPost, Category, Tag, Author, SiteConfig } from '../types';

export const author: Author = {
  id: '1',
  name: 'ChiiBlog',
  bio: '一个热爱技术和写作的开发者，专注于前端开发和用户体验设计。',
  avatar: 'https://via.placeholder.com/150',
  email: 'hello@chiiblog.com',
  website: 'https://chiiblog.com',
  social: {
    github: 'https://github.com/chiiblog',
    twitter: 'https://twitter.com/chiiblog',
  },
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

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'React 18 新特性深度解析',
    slug: 'react-18-deep-dive',
    excerpt: 'React 18 带来了许多令人兴奋的新特性，包括并发渲染、自动批处理、Suspense 改进等。本文将深入解析这些新特性的原理和使用方法。',
    content: `# React 18 新特性深度解析

React 18 是 React 的一个重要版本，引入了许多突破性的新特性。

## 并发渲染

并发渲染是 React 18 最重要的特性之一...

## 自动批处理

在 React 18 中，所有更新都会被自动批处理...

## Suspense 改进

Suspense 组件得到了显著改进...`,
    author: 'ChiiBlog',
    publishedAt: '2024-01-15',
    tags: ['React', 'JavaScript'],
    category: '前端开发',
    readingTime: 8,
    coverImage: 'https://via.placeholder.com/800x400',
    featured: true,
  },
  {
    id: '2',
    title: 'TypeScript 高级类型系统详解',
    slug: 'typescript-advanced-types',
    excerpt: 'TypeScript 的类型系统非常强大，本文将详细介绍高级类型的使用技巧，包括联合类型、交叉类型、条件类型等。',
    content: `# TypeScript 高级类型系统详解

TypeScript 的类型系统是其最强大的特性之一...

## 联合类型

联合类型允许我们定义一个值可以是几种类型之一...

## 交叉类型

交叉类型将多个类型合并为一个类型...`,
    author: 'ChiiBlog',
    publishedAt: '2024-01-10',
    tags: ['TypeScript', 'JavaScript'],
    category: '前端开发',
    readingTime: 12,
    coverImage: 'https://via.placeholder.com/800x400',
    featured: true,
  },
  {
    id: '3',
    title: '构建现代化的前端工程架构',
    slug: 'modern-frontend-architecture',
    excerpt: '随着前端项目复杂度的增加，如何构建一个可维护、可扩展的前端架构变得越来越重要。本文分享一些最佳实践。',
    content: `# 构建现代化的前端工程架构

现代前端开发面临着越来越复杂的挑战...

## 项目结构设计

一个好的项目结构是成功的关键...

## 状态管理

合理的状态管理策略...`,
    author: 'ChiiBlog',
    publishedAt: '2024-01-05',
    tags: ['前端架构', '最佳实践'],
    category: '前端开发',
    readingTime: 15,
  },
  {
    id: '4',
    title: '我的 2024 年技术总结',
    slug: 'tech-summary-2024',
    excerpt: '回顾这一年的技术学习和成长，分享一些心得体会和对未来的展望。',
    content: `# 我的 2024 年技术总结

又是一年年末，是时候回顾这一年的技术成长了...

## 学到的新技术

这一年我学习了很多新技术...

## 踩过的坑

技术路上总是充满挑战...`,
    author: 'ChiiBlog',
    publishedAt: '2023-12-31',
    tags: ['总结', '随想'],
    category: '生活随笔',
    readingTime: 6,
  },
  {
    id: '5',
    title: 'CSS Grid 布局完全指南',
    slug: 'css-grid-complete-guide',
    excerpt: 'CSS Grid 是现代网页布局的强大工具，本文将全面介绍 Grid 布局的各种用法和技巧。',
    content: `# CSS Grid 布局完全指南

CSS Grid 是一个二维布局系统...

## 基础概念

Grid 容器和 Grid 项目...

## 实际应用

一些常见的布局模式...`,
    author: 'ChiiBlog',
    publishedAt: '2023-12-20',
    tags: ['CSS', '前端'],
    category: '前端开发',
    readingTime: 10,
  },
];

export const siteConfig: SiteConfig = {
  title: 'ChiiBlog',
  description: '分享技术、记录生活的个人博客',
  author,
  url: 'https://chiiblog.com',
  postsPerPage: 6,
}; 