import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050'

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor: attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('poupabem.accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: 401 → redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('poupabem.accessToken')
      localStorage.removeItem('poupabem.refreshToken')
      localStorage.removeItem('poupabem.user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// Helper: extract API error message from .NET global exception middleware
export function extractError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.title ||
    err?.message ||
    'Erro inesperado'
  )
}
