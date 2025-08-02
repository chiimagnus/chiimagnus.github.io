export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  readingTime: number;
  coverImage?: string;
  featured?: boolean;
  url: string;
  external?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Author {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  email?: string;
  website?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface SiteConfig {
  title: string;
  description: string;
  author: Author;
  url: string;
  postsPerPage: number;
}

// JETJETJET 项目相关类型定义
export interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface TechItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface JetJetJetProps {
  className?: string;
}