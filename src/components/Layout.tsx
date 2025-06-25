import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SearchProvider } from '../context/SearchContext';
import { Menu } from 'lucide-react';
import LiquidGlass from './LiquidGlass';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="min-h-screen flex">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col lg:ml-72">
          <main className="flex-1 p-6 pt-16 sm:p-8 sm:pt-16 lg:p-10 relative">
            <LiquidGlass 
              className={`lg:hidden rounded-md fixed top-4 left-4 z-50 overflow-hidden ${isSidebarOpen ? 'hidden' : ''}`}
            >
              <button 
                className="p-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            </LiquidGlass>
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