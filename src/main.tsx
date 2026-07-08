import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import SyncNosOAuthCallback from './pages/SyncNosOAuthCallback'
import SyncNosOAuthTest from './pages/SyncNosOAuthTest'
import Layout from './components/blog/Layout'
import { ThemeProvider } from './context/ThemeContext'
import HomeEntry from './pages/HomeEntry'
import SyncNosRedirect from './pages/SyncNosRedirect'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/syncnos" element={<SyncNosRedirect to="https://chiimagnus.notion.site/syncnos" />} />
          <Route path="/syncnos-oauth/callback" element={<SyncNosOAuthCallback />} />
          <Route path="/syncnos-oauth/test" element={<SyncNosOAuthTest />} />
          <Route path="/blog" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/" element={<HomeEntry />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
) 
