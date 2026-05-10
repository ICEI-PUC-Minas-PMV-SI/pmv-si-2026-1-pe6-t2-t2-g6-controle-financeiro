import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../api/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
  refresh: vi.fn(),
  me: vi.fn()
}))

import * as authApi from '../../api/auth'
import Login from '../../pages/Login'
import { renderWithProviders } from '../utils/renderWithProviders'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Login (integração)', () => {
  it('renderiza os campos e o link para cadastro', () => {
    renderWithProviders(<Login />, { route: '/login', path: '/login' })

    expect(screen.getByText(/Entrar na sua conta/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cadastre-se/i })).toHaveAttribute(
      'href',
      '/cadastro'
    )
  })

  it('faz login com sucesso e persiste tokens no localStorage', async () => {
    authApi.login.mockResolvedValueOnce({
      accessToken: 'jwt-123',
      refreshToken: 'refresh-123',
      userId: 'u1',
      email: 'ana@test.com',
      fullName: 'Ana Teste'
    })

    renderWithProviders(<Login />, { route: '/login', path: '/login' })

    await userEvent.type(
      screen.getByPlaceholderText('seu@email.com'),
      'ana@test.com'
    )
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'Senha@123')
    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'ana@test.com',
        password: 'Senha@123'
      })
    })

    expect(localStorage.getItem('poupabem.accessToken')).toBe('jwt-123')
    expect(localStorage.getItem('poupabem.refreshToken')).toBe('refresh-123')
    const stored = JSON.parse(localStorage.getItem('poupabem.user'))
    expect(stored.fullName).toBe('Ana Teste')
  })

  it('exibe a mensagem de erro retornada pela API', async () => {
    authApi.login.mockRejectedValueOnce({
      response: { data: { message: 'Credenciais inválidas' } }
    })

    renderWithProviders(<Login />, { route: '/login', path: '/login' })

    await userEvent.type(screen.getByPlaceholderText('seu@email.com'), 'a@a.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'errada')
    await userEvent.click(screen.getByRole('button', { name: /^Entrar$/i }))

    expect(
      await screen.findByText('Credenciais inválidas')
    ).toBeInTheDocument()
    expect(localStorage.getItem('poupabem.accessToken')).toBeNull()
  })
})
