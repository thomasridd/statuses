import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginGate from './components/LoginGate.jsx'
import Home from './pages/Home.jsx'
import Analytics from './pages/Analytics.jsx'
import Library from './pages/Library.jsx'

export default function App() {
  const [authed, setAuthed] = useState(() => {
    const pw = sessionStorage.getItem('app_password')
    const noPassword = import.meta.env.VITE_APP_PASSWORD === undefined || import.meta.env.VITE_APP_PASSWORD === ''
    return noPassword || Boolean(pw)
  })

  function handleLogin(password) {
    sessionStorage.setItem('app_password', password)
    setAuthed(true)
  }

  if (!authed) {
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
