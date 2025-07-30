import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import articlesData from '../data/articles.json';
import productsData from '../data/products.json';
import { BlogPost } from '../types';

// 从 JSON 数据结构定义 Product 类型
export interface Product {
  title: string;
  description: string;
  tags: string[];
  status?: string;
  links: Array<{ text: string; url: string; }>;
}

// 定义统一的搜索结果类型
export type SearchResult = (BlogPost & { type: 'article' }) | (Product & { type: 'product' });

interface SearchContextType {
  isSearchActive: boolean;
  setIsSearchActive: (isActive: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  // 产品标签过滤相关
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  availableTags: string[];
  filteredProducts: Product[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 计算所有可用标签
  const availableTags = useMemo(() => {
    const allTags = new Set<string>();
    productsData.forEach(product => {
      product.tags.forEach(tag => allTags.add(tag));
    });
    return Array.from(allTags).sort();
  }, []);

  // 根据选中标签过滤产品
  const filteredProducts = useMemo(() => {
    if (selectedTags.length === 0) {
      return productsData;
    }
    return productsData.filter(product =>
      selectedTags.some(tag => product.tags.includes(tag))
    );
  }, [selectedTags]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const lowerCaseQuery = searchQuery.toLowerCase();

    // 筛选文章，扩展搜索范围
    const filteredArticles = articlesData.filter(article =>
      article.title.toLowerCase().includes(lowerCaseQuery) ||
      article.description.toLowerCase().includes(lowerCaseQuery) ||
      article.slug.toLowerCase().includes(lowerCaseQuery) ||
      article.date.toLowerCase().includes(lowerCaseQuery)
    );

    // 使用 Home.tsx 中的适配器逻辑
    const adaptedArticles: BlogPost[] = filteredArticles.map((article, index) => ({
      id: `${article.slug}-${index}`,
      title: article.title,
      slug: article.slug || '',
      excerpt: article.description,
      content: '', // 搜索结果不需要完整内容
      author: 'chiimagnus',
      publishedAt: article.date,
      tags: [],
      category: 'default',
      readingTime: 0,
      url: article.url,
      external: article.external,
    }));
    
    // 筛选产品，扩展搜索范围
    const filteredProducts: Product[] = productsData.filter(product =>
      product.title.toLowerCase().includes(lowerCaseQuery) ||
      product.description.toLowerCase().includes(lowerCaseQuery) ||
      (product.status && product.status.toLowerCase().includes(lowerCaseQuery)) ||
      product.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)) ||
      product.links.some(link => link.text.toLowerCase().includes(lowerCaseQuery))
    );

    // 合并结果并添加类型标识
    const combinedResults: SearchResult[] = [
      ...adaptedArticles.map(a => ({ ...a, type: 'article' as const })),
      ...filteredProducts.map(p => ({ ...p, type: 'product' as const }))
    ];

    return combinedResults;

  }, [searchQuery]);

  const value = {
    isSearchActive,
    setIsSearchActive,
    searchQuery,
    setSearchQuery,
    searchResults,
    selectedTags,
    setSelectedTags,
    availableTags,
    filteredProducts
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}; 