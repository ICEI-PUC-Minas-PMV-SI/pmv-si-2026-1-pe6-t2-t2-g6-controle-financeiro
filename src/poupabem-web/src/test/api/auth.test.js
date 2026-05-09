import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import { api } from '../../api/client'
import { login, register, refresh, me } from '../../api/auth'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('auth API', () => {
  it('login envia POST /api/auth/login com credenciais', async () => {
    api.post.mockResolvedValueOnce({ data: { accessToken: 'jwt' } })
    const result = await login({ email: 'a@a.com', password: '123' })
    expect(api.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'a@a.com',
      password: '123'
    })
    expect(result).toEqual({ accessToken: 'jwt' })
  })

  it('register envia POST /api/auth/register com payload completo', async () => {
    api.post.mockResolvedValueOnce({ data: { accessToken: 'jwt' } })
    const payload = {
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'a@a.com',
      password: 'Senha@123',
      confirmPassword: 'Senha@123'
    }
    await register(payload)
    expect(api.post).toHaveBeenCalledWith('/api/auth/register', payload)
  })

  it('refresh envia POST /api/auth/refresh com refreshToken', async () => {
    api.post.mockResolvedValueOnce({ data: { accessToken: 'novo' } })
    const result = await refresh('refresh-token-abc')
    expect(api.post).toHaveBeenCalledWith('/api/auth/refresh', {
      refreshToken: 'refresh-token-abc'
    })
    expect(result.accessToken).toBe('novo')
  })

  it('me envia GET /api/auth/me e devolve os dados', async () => {
    api.get.mockResolvedValueOnce({ data: { userId: 'u1', email: 'a@a.com' } })
    const result = await me()
    expect(api.get).toHaveBeenCalledWith('/api/auth/me')
    expect(result.userId).toBe('u1')
  })
})
