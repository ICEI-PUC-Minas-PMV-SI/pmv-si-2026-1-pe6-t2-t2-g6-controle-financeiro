import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('poupabem.user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  function persist(authResponse) {
    const userData = {
      id: authResponse.userId,
      email: authResponse.email,
      fullName: authResponse.fullName
    }
    localStorage.setItem('poupabem.accessToken', authResponse.accessToken)
    localStorage.setItem('poupabem.refreshToken', authResponse.refreshToken)
    localStorage.setItem('poupabem.user', JSON.stringify(userData))
    setUser(userData)
  }

  async function login(credentials) {
    setLoading(true)
    try {
      const data = await authApi.login(credentials)
      persist(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true)
    try {
      const data = await authApi.register(payload)
      persist(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('poupabem.accessToken')
    localStorage.removeItem('poupabem.refreshToken')
    localStorage.removeItem('poupabem.user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
