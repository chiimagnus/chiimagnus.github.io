import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import LifeWealth from './pages/LifeWealth'
import Layout from './components/Layout'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lifewealth" element={<LifeWealth />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
) 