import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import Layout from '../../components/Layout'
import { seedAuthenticatedUser } from '../utils/renderWithProviders'

describe('Layout', () => {
  it('renderiza a sidebar e o outlet com a página filha', () => {
    seedAuthenticatedUser()

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route
                path="/dashboard"
                element={<div>Pagina de Dashboard</div>}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Pagina de Dashboard')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Transações/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Cofrinhos/i })).toBeInTheDocument()
  })
})
