import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'

vi.mock('../../api/transactions', () => ({
  listTransactions: vi.fn(),
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn()
}))

vi.mock('../../api/categories', () => ({
  listCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn()
}))

vi.mock('../../api/savingsGoals', () => ({
  listGoals: vi.fn(),
  getGoal: vi.fn(),
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  depositGoal: vi.fn(),
  deleteGoal: vi.fn()
}))

vi.mock('../../api/reports', () => ({
  getSummary: vi.fn(),
  getExpensesByCategory: vi.fn(),
  exportTransactionsCsv: vi.fn()
}))

// Recharts ResponsiveContainer não funciona bem em jsdom; renderiza os filhos diretamente
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts')
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 800, height: 260 }}>{children}</div>
    )
  }
})

import { listTransactions } from '../../api/transactions'
import { listCategories } from '../../api/categories'
import { listGoals } from '../../api/savingsGoals'
import { getSummary } from '../../api/reports'
import Dashboard from '../../pages/Dashboard'
import { renderWithProviders, seedAuthenticatedUser } from '../utils/renderWithProviders'

beforeEach(() => {
  vi.clearAllMocks()
  seedAuthenticatedUser({
    id: 'u1',
    email: 'gabriel@test.com',
    fullName: 'Gabriel Santos'
  })
})

describe('Dashboard (integração)', () => {
  it('exibe saudação personalizada com o primeiro nome', async () => {
    getSummary.mockResolvedValueOnce({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    })
    listTransactions.mockResolvedValueOnce([])
    listGoals.mockResolvedValueOnce([])
    listCategories.mockResolvedValueOnce([])

    renderWithProviders(<Dashboard />, {
      route: '/dashboard',
      path: '/dashboard'
    })

    expect(await screen.findByText('Olá, Gabriel')).toBeInTheDocument()
  })

  it('renderiza saldo, receitas e despesas formatados em BRL', async () => {
    getSummary.mockResolvedValueOnce({
      totalIncome: 6500,
      totalExpense: 3200,
      balance: 3300
    })
    listTransactions.mockResolvedValueOnce([])
    listGoals.mockResolvedValueOnce([])
    listCategories.mockResolvedValueOnce([])

    renderWithProviders(<Dashboard />, {
      route: '/dashboard',
      path: '/dashboard'
    })

    await waitFor(() => expect(getSummary).toHaveBeenCalled())

    expect(screen.getByText(/R\$\s?3\.300,00/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s?6\.500,00/)).toBeInTheDocument()
    expect(screen.getByText(/R\$\s?3\.200,00/)).toBeInTheDocument()
  })

  it('mostra os últimos 5 lançamentos com categoria e valor', async () => {
    const cats = [
      { id: 'c1', name: 'Alimentação', type: 2 },
      { id: 'c2', name: 'Salário', type: 1 }
    ]
    const txs = [
      {
        id: 't1',
        title: 'Mercado Extra',
        amount: 120,
        transactionType: 2,
        categoryId: 'c1',
        ocurredAt: '2026-04-10T10:00:00Z'
      },
      {
        id: 't2',
        title: 'Salário Abril',
        amount: 4500,
        transactionType: 1,
        categoryId: 'c2',
        ocurredAt: '2026-04-01T10:00:00Z'
      }
    ]
    getSummary.mockResolvedValueOnce({
      totalIncome: 4500,
      totalExpense: 120,
      balance: 4380
    })
    listTransactions.mockResolvedValueOnce(txs)
    listGoals.mockResolvedValueOnce([])
    listCategories.mockResolvedValueOnce(cats)

    renderWithProviders(<Dashboard />, {
      route: '/dashboard',
      path: '/dashboard'
    })

    expect(await screen.findByText('Mercado Extra')).toBeInTheDocument()
    expect(screen.getByText('Salário Abril')).toBeInTheDocument()
    expect(screen.getAllByText('Alimentação').length).toBeGreaterThan(0)
  })

  it('exibe mensagem de erro amigável quando o backend falha', async () => {
    getSummary.mockRejectedValueOnce(new Error('boom'))
    listTransactions.mockResolvedValueOnce([])
    listGoals.mockResolvedValueOnce([])
    listCategories.mockResolvedValueOnce([])

    renderWithProviders(<Dashboard />, {
      route: '/dashboard',
      path: '/dashboard'
    })

    expect(
      await screen.findByText(/Não foi possível carregar os dados/i)
    ).toBeInTheDocument()
  })

  it('renderiza placeholder quando o usuário não tem cofrinhos', async () => {
    getSummary.mockResolvedValueOnce({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    })
    listTransactions.mockResolvedValueOnce([])
    listGoals.mockResolvedValueOnce([])
    listCategories.mockResolvedValueOnce([])

    renderWithProviders(<Dashboard />, {
      route: '/dashboard',
      path: '/dashboard'
    })

    expect(
      await screen.findByText('Você ainda não tem cofrinhos.')
    ).toBeInTheDocument()
  })
})
