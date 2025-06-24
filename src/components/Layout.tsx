import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { SearchProvider } from '../context/SearchContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SearchProvider>
      <div className="bg-gray-900 text-white min-h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6 sm:p-8 lg:p-10">
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