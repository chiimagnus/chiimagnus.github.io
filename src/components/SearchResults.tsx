import React from 'react';
import { useSearch, SearchResult } from '../context/SearchContext';
import { BookOpen, Package } from 'lucide-react';

const SearchResults: React.FC = () => {
  const { searchResults, searchQuery } = useSearch();

  if (!searchQuery) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        搜索结果: <span className="text-purple-300">{searchQuery}</span>
      </h2>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((item, index) => (
            <a 
              key={`${item.type}-${index}`} 
              href={item.type === 'article' ? item.url : (item.links[0]?.url || '#')}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card p-4 hover:border-purple-400 transition-all"
            >
              <div className="flex items-center space-x-3">
                {item.type === 'article' ? (
                  <BookOpen className="h-5 w-5 text-green-400" />
                ) : (
                  <Package className="h-5 w-5 text-blue-400" />
                )}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white bg-opacity-20">
                  {item.type === 'article' ? '文章' : '产品'}
                </span>
              </div>
              <p className="text-sm text-gray-300 mt-2 ml-8">
                {item.type === 'article' ? item.excerpt : item.description}
              </p>
            </a>
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