import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SearchProvider } from '../context/SearchContext';
import { Menu } from 'lucide-react';
import LiquidGlass from './LiquidGlass';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = true }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SearchProvider>
      <div className="min-h-screen flex">
        {showSidebar && <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />}
        <div className={`flex-1 flex flex-col ${showSidebar ? 'lg:ml-72' : ''}`}>
          <main className="flex-1 p-6 pt-16 sm:p-8 sm:pt-16 lg:p-10 relative">
            {showSidebar && (
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
            )}
            <div className={`${showSidebar ? 'max-w-4xl mx-auto' : ''}`}>
              {children}
            </div>
          </main>
          {showSidebar && <Footer />}
        </div>
      </div>
    </SearchProvider>
  );
};

export default Layout;