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
import Cadastro from '../../pages/Cadastro'
import { renderWithProviders } from '../utils/renderWithProviders'

beforeEach(() => {
  vi.clearAllMocks()
})

async function preencherFormulario({ password, confirmPassword, aceitar = true }) {
  await userEvent.type(screen.getByPlaceholderText('Seu nome'), 'Ana')
  await userEvent.type(screen.getByPlaceholderText('Seu sobrenome'), 'Silva')
  await userEvent.type(
    screen.getByPlaceholderText('seu@email.com'),
    'ana@test.com'
  )
  const passwordInputs = screen.getAllByPlaceholderText('••••••••')
  await userEvent.type(passwordInputs[0], password)
  await userEvent.type(passwordInputs[1], confirmPassword)
  if (aceitar) {
    await userEvent.click(screen.getByRole('checkbox'))
  }
  await userEvent.click(
    screen.getByRole('button', { name: /Criar conta gratuita/i })
  )
}

describe('Cadastro (integração)', () => {
  it('valida senhas diferentes sem chamar a API', async () => {
    renderWithProviders(<Cadastro />, { route: '/cadastro', path: '/cadastro' })

    await preencherFormulario({
      password: 'Senha@123',
      confirmPassword: 'Outra@123'
    })

    expect(
      await screen.findByText('As senhas não coincidem.')
    ).toBeInTheDocument()
    expect(authApi.register).not.toHaveBeenCalled()
  })

  it('valida senha curta sem chamar a API', async () => {
    renderWithProviders(<Cadastro />, { route: '/cadastro', path: '/cadastro' })

    await preencherFormulario({ password: '1234567', confirmPassword: '1234567' })

    expect(
      await screen.findByText('A senha deve ter no mínimo 8 caracteres.')
    ).toBeInTheDocument()
    expect(authApi.register).not.toHaveBeenCalled()
  })

  it('exige aceite dos Termos de Uso', async () => {
    renderWithProviders(<Cadastro />, { route: '/cadastro', path: '/cadastro' })

    await preencherFormulario({
      password: 'Senha@123',
      confirmPassword: 'Senha@123',
      aceitar: false
    })

    expect(
      await screen.findByText('Você precisa aceitar os Termos de Uso.')
    ).toBeInTheDocument()
    expect(authApi.register).not.toHaveBeenCalled()
  })

  it('cadastra com sucesso e armazena a sessão', async () => {
    authApi.register.mockResolvedValueOnce({
      accessToken: 'jwt-novo',
      refreshToken: 'rt-novo',
      userId: 'u1',
      email: 'ana@test.com',
      fullName: 'Ana Silva'
    })

    renderWithProviders(<Cadastro />, { route: '/cadastro', path: '/cadastro' })

    await preencherFormulario({
      password: 'Senha@123',
      confirmPassword: 'Senha@123'
    })

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledWith({
        firstName: 'Ana',
        lastName: 'Silva',
        email: 'ana@test.com',
        password: 'Senha@123',
        confirmPassword: 'Senha@123'
      })
    })
    expect(localStorage.getItem('poupabem.accessToken')).toBe('jwt-novo')
  })

  it('exibe erro do backend quando o e-mail já está em uso', async () => {
    authApi.register.mockRejectedValueOnce({
      response: { data: { message: 'E-mail já cadastrado.' } }
    })

    renderWithProviders(<Cadastro />, { route: '/cadastro', path: '/cadastro' })

    await preencherFormulario({
      password: 'Senha@123',
      confirmPassword: 'Senha@123'
    })

    expect(await screen.findByText('E-mail já cadastrado.')).toBeInTheDocument()
  })
})
