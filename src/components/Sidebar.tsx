import React, { useState, useRef, useEffect } from 'react';
import { Github, Mail, Search, Home, BookOpen, Package, User, X } from 'lucide-react';
import { Bilibili } from '../../public/Bilibili';
import { Dedao } from '../../public/Dedao';
import { useSearch } from '../context/SearchContext';

const navItems = [
  { label: '文章', id: 'articles' },
  { label: '产品开发', id: 'products' },
  { label: '关于我', id: 'about' },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { searchQuery, setSearchQuery, setIsSearchActive } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    if (window.innerWidth < 1024) { // lg breakpoint
      setIsOpen(false);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchExpanded(true);
    setIsSearchActive(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  };

  const handleSearchBlur = () => {
    if (searchQuery === '') {
      setIsSearchExpanded(false);
      setIsSearchActive(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-50 backdrop-blur-sm flex-shrink-0 flex flex-col p-4 z-40 transform transition-transform duration-300 ease-in-out lg:static lg:bg-opacity-20 lg:backdrop-blur-none lg:transform-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
      >
        <div className="flex justify-between items-center lg:justify-center text-center py-8">
          <div className="flex flex-col items-center">
            <img src="/avatar.png" alt="头像" className="w-24 h-24 rounded-full mb-4 border-2 border-white" />
            <h1 className="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex justify-center space-x-2 mb-8">
          <a href="mailto:chii_magnus@outlook.com" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30" title="Email">
            <Mail size={16} />
          </a>
          <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30" title="GitHub">
            <Github size={16} />
          </a>
          <a href="https://m.igetget.com/native/mine/account#/user/detail?enId=GEznR6VwQNKxEeXPOz9xB9Ojy0d24k" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30" title="得到">
            <Dedao className="w-4 h-4" />
          </a>
          <a href="https://space.bilibili.com/1055823731" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30" title="哔哩哔哩">
            <Bilibili className="w-4 h-4" />
          </a>
        </div>

        <nav className="mb-8">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className="block py-2 px-4 rounded-lg text-center transition-colors text-white hover:bg-white hover:bg-opacity-10"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative">
          <div 
            className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <Search className="h-5 w-5 text-gray-300" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="搜索 (⌘K)"
            value={searchQuery}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-300 ${isSearchExpanded ? 'focus:ring-purple-500' : ''}`}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 