import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Sidebar from '../../components/Sidebar'
import { seedAuthenticatedUser } from '../utils/renderWithProviders'

function setup(initialRoute = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  it('exibe os links de navegação principais', () => {
    seedAuthenticatedUser()
    setup()
    expect(screen.getByRole('link', { name: /Dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard'
    )
    expect(screen.getByRole('link', { name: /Transações/i })).toHaveAttribute(
      'href',
      '/transacoes'
    )
    expect(screen.getByRole('link', { name: /Cofrinhos/i })).toHaveAttribute(
      'href',
      '/cofrinhos'
    )
  })

  it('exibe o nome, email e iniciais do usuário autenticado', () => {
    seedAuthenticatedUser({
      id: 'u1',
      email: 'gabriel@test.com',
      fullName: 'Gabriel Santos'
    })
    setup()
    expect(screen.getByText('Gabriel Santos')).toBeInTheDocument()
    expect(screen.getByText('gabriel@test.com')).toBeInTheDocument()
    expect(screen.getByText('GS')).toBeInTheDocument()
  })

  it('o botão "Sair" remove os dados do localStorage', async () => {
    seedAuthenticatedUser()
    setup()

    expect(localStorage.getItem('poupabem.accessToken')).not.toBeNull()

    await userEvent.click(screen.getByTitle('Sair'))

    expect(localStorage.getItem('poupabem.accessToken')).toBeNull()
    expect(localStorage.getItem('poupabem.user')).toBeNull()
    expect(localStorage.getItem('poupabem.refreshToken')).toBeNull()
  })

  it('marca como ativo o item da rota atual (Transações)', () => {
    seedAuthenticatedUser()
    setup('/transacoes')
    const link = screen.getByRole('link', { name: /Transações/i })
    expect(link.className).toMatch(/bg-white\/10/)
  })
})
