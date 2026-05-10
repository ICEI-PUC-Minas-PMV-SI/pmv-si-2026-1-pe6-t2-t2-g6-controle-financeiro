import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('inicia sem usuário', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toBeNull()
  })

  it('hidrata o usuário do localStorage', () => {
    const stored = { id: 'abc', email: 'ana@test.com', fullName: 'Ana Teste' }
    localStorage.setItem('poupabem.user', JSON.stringify(stored))

    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user).toEqual(stored)
  })

  it('logout limpa o estado e o localStorage', () => {
    localStorage.setItem('poupabem.accessToken', 'token')
    localStorage.setItem(
      'poupabem.user',
      JSON.stringify({ id: 'a', email: 'a@a.com', fullName: 'A' })
    )

    const { result } = renderHook(() => useAuth(), { wrapper })
    act(() => result.current.logout())

    expect(result.current.user).toBeNull()
    expect(localStorage.getItem('poupabem.accessToken')).toBeNull()
    expect(localStorage.getItem('poupabem.user')).toBeNull()
  })
})
