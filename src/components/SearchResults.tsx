import React from 'react';
import { useSearch, SearchResult } from '../context/SearchContext';
import { BookOpen, Package } from 'lucide-react';

// 从 ProductCard.tsx 借用颜色逻辑
const getTagColor = (tag: string) => {
  if (tag.includes('发布')) return 'bg-yellow-400 text-yellow-900';
  if (tag.includes('归档')) return 'bg-red-400 text-red-900';
  if (tag.includes('已发布')) return 'bg-green-400 text-green-900';
  return 'bg-white bg-opacity-25 text-white';
};

const SearchResults: React.FC = () => {
  const { searchResults, searchQuery } = useSearch();

  if (!searchQuery) return null;

  const renderArticle = (item: SearchResult & { type: 'article' }) => (
    <a 
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block glass-card p-4 hover:border-purple-400 transition-all"
    >
      <div className="flex items-center space-x-3">
        <BookOpen className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-20">
          文章
        </span>
      </div>
      <p className="text-sm text-gray-300 mt-2 ml-8">{item.excerpt}</p>
    </a>
  );

  const renderProduct = (item: SearchResult & { type: 'product' }) => (
    <div className="glass-card p-4">
      <div className="flex items-center space-x-3 mb-2">
        <Package className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-20">
          产品
        </span>
      </div>
      <div className="ml-8">
        <p className="text-sm text-gray-300 mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.map((tag, index) => (
            <span key={index} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
          {item.status && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-400 text-blue-900">
              {item.status}
            </span>
          )}
        </div>
        <div className="space-y-1">
          {item.links.map((link, index) => (
            <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-semibold text-purple-300 hover:text-purple-200">
              {link.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        搜索结果: <span className="text-purple-300">{searchQuery}</span>
      </h2>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((item, index) => (
            <div key={`${item.type}-${index}`}>
              {item.type === 'article' ? renderArticle(item) : renderProduct(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-lg text-gray-400">找不到相关内容。</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 