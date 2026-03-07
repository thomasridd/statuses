import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { api, AuthError } from './lib/api.js'
import LoginGate from './components/LoginGate.jsx'
import Home from './pages/Home.jsx'
import Analytics from './pages/Analytics.jsx'
import Library from './pages/Library.jsx'

// authState: 'checking' | 'authed' | 'login'
export default function App() {
  const [authState, setAuthState] = useState('checking')

  useEffect(() => {
    api.getStatuses()
      .then(() => setAuthState('authed'))
      .catch(err => {
        if (err instanceof AuthError) {
          sessionStorage.removeItem('app_password')
          setAuthState('login')
        } else {
          // Non-auth error (network, server error) — still show the app
          setAuthState('authed')
        }
      })
  }, [])

  function handleLogin(password) {
    sessionStorage.setItem('app_password', password)
    setAuthState('authed')
  }

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading…</div>
      </div>
    )
  }

  if (authState === 'login') {
    return <LoginGate onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/library" element={<Library />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
