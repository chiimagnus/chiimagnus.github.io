import React, { useState, useEffect } from 'react';
import { Github, Mail, Search } from 'lucide-react';
import { Bilibili } from '../../public/Bilibili';
import { Dedao } from '../../public/Dedao';

const navItems = [
  { label: '文章', id: 'articles' },
  { label: '产品开发', id: 'products' },
  { label: '关于我', id: 'about' },
];

const Sidebar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('articles');

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { root: mainContent, threshold: 0.5 }
    );

    const sections = mainContent.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <aside className="w-full lg:w-64 bg-black bg-opacity-20 flex-shrink-0 flex flex-col p-4">
      <div className="flex flex-col items-center text-center py-8">
        <img src="/avatar.png" alt="头像" className="w-24 h-24 rounded-full mb-4 border-2 border-white" />
        <h1 className="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1>
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
                className={`block py-2 px-4 rounded-lg text-center transition-colors text-white ${
                  activeSection === item.id
                    ? 'bg-white bg-opacity-30 font-semibold'
                    : 'hover:bg-white hover:bg-opacity-10'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative">
        <input
          type="text"
          placeholder="搜索（快捷键 cmd+k）"
          className="w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm bg-white bg-opacity-20 text-white placeholder-gray-300 focus:ring-2 focus:ring-purple-300"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
      </div>
    </aside>
  );
};

export default Sidebar; 