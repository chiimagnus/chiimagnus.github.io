import React, { useState } from 'react';
import BlogCard from '../components/BlogCard';
import ProductCard from '../components/ProductCard';
import articlesData from '../data/articles.json';
import { BlogPost } from '../types';
import { useSearch } from '../context/SearchContext';
import SearchResults from '../components/SearchResults';
import AboutCard from '../components/AboutCard';
import HorizontalTagFilter from '../components/HorizontalTagFilter';

const Home: React.FC = () => {
  const [isArticlesExpanded, setIsArticlesExpanded] = useState(false);
  const { searchQuery, filteredProducts } = useSearch();
  const showSearchResults = searchQuery.trim() !== '';

  // 将 JSON 数据转换为 BlogPost 格式
  const adaptedArticles: BlogPost[] = articlesData.map((article, index) => ({
    id: index.toString(),
    title: article.title,
    slug: article.slug || '',
    excerpt: article.description,
    content: article.description,
    author: 'chiimagnus',
    publishedAt: article.date,
    tags: [],
    category: 'default',
    readingTime: 5,
    url: article.url,
    external: article.external,
  }));

  const displayedArticles = isArticlesExpanded ? adaptedArticles : adaptedArticles.slice(0, 3);

  return (
    <>
      <div className={`transition-opacity duration-500 ${showSearchResults ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
        <div className="space-y-12">
          <section id="articles">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">文章</h2>
              <button 
                onClick={() => setIsArticlesExpanded(!isArticlesExpanded)}
                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white"
              >
                <span>{isArticlesExpanded ? '收起' : '展开'}</span>
                <span className={`transform transition-transform ${isArticlesExpanded ? 'rotate-180' : ''}`}>↓</span>
              </button>
            </div>
            <div className="space-y-6">
              {displayedArticles.map((article, index) => (
                <BlogCard key={index} post={article} />
              ))}
            </div>
          </section>

          <section id="products">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 min-w-0 w-full">
              <h2 className="text-2xl font-bold flex-shrink-0">产品开发</h2>
              <div className="flex-1 sm:ml-6 min-w-0 max-w-full overflow-hidden">
                <HorizontalTagFilter />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  title={product.title}
                  description={product.description}
                  tags={product.tags}
                  status={product.status}
                  links={product.links}
                />
              ))}
            </div>
          </section>

          <section id="about">
            <h2 className="text-2xl font-bold mb-6">关于我</h2>
            <AboutCard />
          </section>
        </div>
      </div>

      {showSearchResults && (
        <div className="transition-opacity duration-500 opacity-100">
          <SearchResults />
        </div>
      )}
    </>
  );
};

export default Home; 