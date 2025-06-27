import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import LifeWealth from './pages/LifeWealth'
import AiChat from './pages/AiChat'
import Layout from './components/Layout'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/lifewealth" element={<LifeWealth />} />
          <Route path="/ai-chat" element={<AiChat />} />
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
) 