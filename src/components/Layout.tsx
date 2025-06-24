import React from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow ml-64 flex flex-col">
        <main className="flex-grow p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;