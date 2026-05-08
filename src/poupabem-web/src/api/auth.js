import { api } from './client'

export async function login({ email, password }) {
  const { data } = await api.post('/api/auth/login', { email, password })
  return data
}

export async function register({ firstName, lastName, email, password, confirmPassword }) {
  const { data } = await api.post('/api/auth/register', {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  })
  return data
}

export async function refresh(refreshToken) {
  const { data } = await api.post('/api/auth/refresh', { refreshToken })
  return data
}

export async function me() {
  const { data } = await api.get('/api/auth/me')
  return data
}
