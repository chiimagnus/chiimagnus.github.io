import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SearchProvider } from '../context/SearchContext';
import { Menu } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="bg-gradient-main min-h-screen flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <main className="flex-1 p-6 sm:p-8 lg:p-10 relative">
            <button 
              className="lg:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 fixed top-4 left-4 z-50"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;