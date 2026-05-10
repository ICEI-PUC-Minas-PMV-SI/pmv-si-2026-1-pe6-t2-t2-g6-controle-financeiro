import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext.jsx'

export function renderWithProviders(
  ui,
  { route = '/', path = '*', withAuthProvider = true } = {}
) {
  const tree = (
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  )

  return render(withAuthProvider ? <AuthProvider>{tree}</AuthProvider> : tree)
}

export function seedAuthenticatedUser(
  user = { id: 'user-1', email: 'ana@test.com', fullName: 'Ana Teste' }
) {
  localStorage.setItem('poupabem.user', JSON.stringify(user))
  localStorage.setItem('poupabem.accessToken', 'fake-token')
  localStorage.setItem('poupabem.refreshToken', 'fake-refresh')
  return user
}
