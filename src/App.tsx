import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">文章列表页面</h1></div>} />
        <Route path="/posts/:slug" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">文章详情页面</h1></div>} />
        <Route path="/categories" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">分类页面</h1></div>} />
        <Route path="/tags" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">标签页面</h1></div>} />
        <Route path="/about" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">关于页面</h1></div>} />
        <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-3xl">404 - 页面未找到</h1></div>} />
      </Routes>
    </Layout>
  );
}

export default App; 