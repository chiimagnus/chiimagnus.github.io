import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Mail, Search, Rss } from 'lucide-react';

const navItems = [
  { label: '文章', path: '/posts' },
  { label: '产品开发', path: '/products' },
  { label: '关于我', path: '/about' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex-shrink-0 flex flex-col p-4 fixed h-full">
      <div className="flex flex-col items-center text-center py-8">
        <img src="/avatar.png" alt="头像" className="w-24 h-24 rounded-full mb-4" />
        <h1 className="text-xl font-bold blog-title">𝓒𝓱𝓲𝓲 𝓜𝓪𝓰𝓷𝓾𝓼</h1>
      </div>
      
      <div className="flex justify-center space-x-4 mb-8">
        <a href="mailto:chii_magnus@outlook.com" className="text-gray-500 hover:text-primary-600" title="Email">
          <Mail size={20} />
        </a>
        <a href="https://github.com/chiimagnus" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600" title="GitHub">
          <Github size={20} />
        </a>
        <a href="/rss.xml" className="text-gray-500 hover:text-primary-600" title="RSS">
          <Rss size={20} />
        </a>
      </div>

      <nav className="mb-8">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-md text-center transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="relative mt-auto">
        <input
          type="text"
          placeholder="搜索（快捷键 cmd+k）"
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>
    </aside>
  );
};

export default Sidebar; 