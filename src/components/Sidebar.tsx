import React, {useRef, useEffect } from 'react';
import { Github, Mail, Search, X } from 'lucide-react';
import { Bilibili } from '../../public/Bilibili';
import { Dedao } from '../../public/Dedao';
import { useSearch } from '../context/SearchContext';
import { ThemeSelector } from './ThemeSelector';
import LiquidGlass from './LiquidGlass';

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsSearchActive(true);
    } else {
      setIsSearchActive(false);
    }
  };

  return (
    <>
      {/* Overlay for mobile, now transparent */}
      <div 
        className={`fixed inset-0 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <aside 
        className={`fixed inset-y-4 left-4 w-64 z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1rem)]'} lg:translate-x-0 flex flex-col space-y-4 p-0`
        }
      >
        {/* Profile Card */}
        <LiquidGlass className="rounded-2xl overflow-hidden">
          <div className="bg-black/30 p-4 text-center">
            <div className="flex justify-between items-start lg:justify-center">
              <div className="flex flex-col items-center w-full">
                <img src="/avatar.png" alt="头像" className="w-24 h-24 rounded-full mb-4 border-2 border-white" />
                <h1 className="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1>
              </div>
              <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 -mr-2 -mt-2 text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              <a href="mailto:chii_magnus@outlook.com" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="Email"><Mail size={16} /></a>
              <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="GitHub"><Github size={16} /></a>
              <a href="https://m.igetget.com/native/mine/account#/user/detail?enId=GEznR6VwQNKxEeXPOz9xB9Ojy0d24k" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="得到"><Dedao className="w-4 h-4" /></a>
              <a href="https://space.bilibili.com/1055823731" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 ease-in-out hover:scale-110" title="哔哩哔哩"><Bilibili className="w-4 h-4" /></a>
            </div>
          </div>
        </LiquidGlass>

        {/* Navigation Card */}
        <LiquidGlass className="rounded-2xl overflow-hidden">
          <div className="bg-black/30">
            <nav>
              <ul className="space-y-1 p-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleNavClick(e, item.id)}
                      className="block py-2 px-4 rounded-lg text-left transition-all duration-200 ease-in-out text-white hover:bg-white/10 hover:pl-6"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </LiquidGlass>

        {/* Theme Selector Card */}
        <LiquidGlass className="rounded-2xl overflow-hidden">
          <div className="bg-black/30 p-4">
            <ThemeSelector />
          </div>
        </LiquidGlass>
        
        {/* Search Card */}
        <LiquidGlass className="rounded-2xl overflow-hidden">
          <div className="relative bg-black/30 rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-300" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="搜索 (⌘K)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 border-none rounded-2xl text-sm bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </LiquidGlass>
      </aside>
    </>
  );
};

export default Sidebar; 