import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import ProtectedRoute from '../../components/ProtectedRoute'
import { render } from '@testing-library/react'
import { seedAuthenticatedUser } from '../utils/renderWithProviders'

function setup(initialRoute = '/privado') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AuthProvider>
        <Routes>
          <Route
            path="/privado"
            element={
              <ProtectedRoute>
                <div>Conteudo privado</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Tela de login</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('redireciona para /login quando não há usuário autenticado', () => {
    setup()
    expect(screen.getByText('Tela de login')).toBeInTheDocument()
    expect(screen.queryByText('Conteudo privado')).not.toBeInTheDocument()
  })

  it('renderiza o conteúdo quando o usuário está autenticado', () => {
    seedAuthenticatedUser()
    setup()
    expect(screen.getByText('Conteudo privado')).toBeInTheDocument()
    expect(screen.queryByText('Tela de login')).not.toBeInTheDocument()
  })
})
