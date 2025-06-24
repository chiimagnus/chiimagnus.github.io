import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="p-4 lg:p-8 min-h-screen">
      <div className="flex flex-col lg:flex-row container mx-auto bg-black bg-opacity-10 rounded-3xl border border-white border-opacity-20 shadow-2xl overflow-hidden min-h-[calc(100vh-4rem)]">
        <Sidebar />
        <div className="flex-grow flex flex-col">
          <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Layout;