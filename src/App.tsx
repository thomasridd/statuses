import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { api, AuthError } from './lib/api'
import LoginGate from './components/LoginGate'
import Home from './pages/Home'
import Analytics from './pages/Analytics'
import Library from './pages/Library'
import Goals from './pages/Goals'
import Badges from './pages/Badges'

type AuthState = 'checking' | 'authed' | 'login'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>('checking')

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

  function handleLogin(password: string) {
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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/library" element={<Library />} />
        <Route path="/badges" element={<Badges />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
