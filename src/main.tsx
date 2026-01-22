import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import LifeWealth from './pages/LifeWealth'
import AiChat from './pages/AiChat'
import JetJetJetPage from './pages/JetJetJetPage'
import SyncNosOAuthCallback from './pages/SyncNosOAuthCallback'
import SyncNosOAuthTest from './pages/SyncNosOAuthTest'
import Layout from './components/blog/Layout'
import { ThemeProvider } from './context/ThemeContext'
import DicePage from './pages/DicePage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/lifewealth" element={<LifeWealth />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/jetjetjet" element={<JetJetJetPage />} />
          <Route path="/syncnos-oauth/callback" element={<SyncNosOAuthCallback />} />
          <Route path="/syncnos-oauth/test" element={<SyncNosOAuthTest />} />
          <Route path="/blog" element={
            <Layout>
              <Home />
            </Layout>
          } />
          <Route path="/" element={<DicePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
) 
