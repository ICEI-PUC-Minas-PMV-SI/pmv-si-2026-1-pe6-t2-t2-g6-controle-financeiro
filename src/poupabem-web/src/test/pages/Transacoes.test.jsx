import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

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

vi.mock('../../api/reports', () => ({
  getSummary: vi.fn(),
  getExpensesByCategory: vi.fn(),
  exportTransactionsCsv: vi.fn()
}))

import {
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../../api/transactions'
import { listCategories, createCategory } from '../../api/categories'
import { exportTransactionsCsv } from '../../api/reports'
import Transacoes from '../../pages/Transacoes'
import { renderWithProviders } from '../utils/renderWithProviders'

const categorias = [
  { id: 'c1', name: 'Alimentação', type: 2 },
  { id: 'c2', name: 'Salário', type: 1 }
]

const transacoes = [
  {
    id: 't1',
    title: 'Mercado Extra',
    description: '',
    amount: 120,
    transactionType: 2,
    categoryId: 'c1',
    ocurredAt: '2026-04-10T10:00:00Z'
  },
  {
    id: 't2',
    title: 'Salário Abril',
    description: '',
    amount: 4500,
    transactionType: 1,
    categoryId: 'c2',
    ocurredAt: '2026-04-01T10:00:00Z'
  }
]

beforeEach(() => {
  vi.clearAllMocks()
  listTransactions.mockResolvedValue(transacoes)
  listCategories.mockResolvedValue(categorias)
})

describe('Transacoes (integração)', () => {
  it('lista as transações vindas da API', async () => {
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    expect(await screen.findByText('Mercado Extra')).toBeInTheDocument()
    expect(screen.getByText('Salário Abril')).toBeInTheDocument()
  })

  it('aplica filtro por tipo "Receitas" chamando listTransactions com transactionType=1', async () => {
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    await userEvent.click(screen.getByRole('button', { name: 'Receitas' }))

    await waitFor(() => {
      expect(listTransactions).toHaveBeenLastCalledWith(
        expect.objectContaining({ transactionType: 1 })
      )
    })
  })

  it('aplica filtro por categoria via select', async () => {
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    const combo = screen.getByRole('combobox')
    await userEvent.selectOptions(combo, 'c1')

    await waitFor(() => {
      expect(listTransactions).toHaveBeenLastCalledWith(
        expect.objectContaining({ categoryId: 'c1' })
      )
    })
  })

  it('exclui uma transação após confirmação', async () => {
    deleteTransaction.mockResolvedValueOnce({})

    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    const linhaMercado = screen.getByText('Mercado Extra').closest('div')
    const botaoExcluir = within(linhaMercado).getByTitle('Excluir')

    await userEvent.click(botaoExcluir)

    await waitFor(() => {
      expect(deleteTransaction).toHaveBeenCalledWith('t1')
    })
    expect(window.confirm).toHaveBeenCalled()
  })

  it('chama exportTransactionsCsv ao clicar em "Exportar CSV"', async () => {
    exportTransactionsCsv.mockResolvedValueOnce()

    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    await userEvent.click(
      screen.getByRole('button', { name: /Exportar CSV/i })
    )

    expect(exportTransactionsCsv).toHaveBeenCalled()
  })

  it('cria uma nova transação via modal', async () => {
    createTransaction.mockResolvedValueOnce({ id: 't3' })

    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    await userEvent.click(screen.getByRole('button', { name: /Nova/i }))

    expect(await screen.findByText('Nova transação')).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('0,00'), '50,75')
    await userEvent.type(
      screen.getByPlaceholderText('Ex: Mercado Extra'),
      'Padaria'
    )

    const selects = screen.getAllByRole('combobox')
    const categoriaSelect = selects[selects.length - 1]
    await userEvent.selectOptions(categoriaSelect, 'c1')

    await userEvent.click(
      screen.getByRole('button', { name: /Salvar transação/i })
    )

    await waitFor(() => expect(createTransaction).toHaveBeenCalledTimes(1))
    const payload = createTransaction.mock.calls[0][0]
    expect(payload.title).toBe('Padaria')
    expect(payload.amount).toBe(50.75)
    expect(payload.transactionType).toBe(2)
    expect(payload.categoryId).toBe('c1')
  })

  it('valida valor inválido no modal sem chamar a API', async () => {
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    await userEvent.click(screen.getByRole('button', { name: /Nova/i }))
    await screen.findByText('Nova transação')

    await userEvent.type(screen.getByPlaceholderText('0,00'), '0')
    await userEvent.type(
      screen.getByPlaceholderText('Ex: Mercado Extra'),
      'Algo'
    )

    const selects = screen.getAllByRole('combobox')
    const categoriaSelect = selects[selects.length - 1]
    await userEvent.selectOptions(categoriaSelect, 'c1')

    await userEvent.click(
      screen.getByRole('button', { name: /Salvar transação/i })
    )

    expect(
      await screen.findByText('Informe um valor válido.')
    ).toBeInTheDocument()
    expect(createTransaction).not.toHaveBeenCalled()
  })

  it('cria nova categoria inline a partir do modal', async () => {
    createCategory.mockResolvedValueOnce({
      id: 'c3',
      name: 'Lazer',
      type: 2
    })

    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })

    await screen.findByText('Mercado Extra')

    await userEvent.click(screen.getByRole('button', { name: /Nova/i }))
    await screen.findByText('Nova transação')

    const selects = screen.getAllByRole('combobox')
    const categoriaSelect = selects[selects.length - 1]
    await userEvent.selectOptions(categoriaSelect, '__new__')

    await userEvent.type(
      screen.getByPlaceholderText('Nome da nova categoria'),
      'Lazer'
    )
    await userEvent.click(screen.getByRole('button', { name: /Criar/i }))

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: 'Lazer', type: 2 })
    })
  })
  it('exibe mensagem de erro quando a listagem de transações falha', async () => {
    listTransactions.mockRejectedValueOnce(new Error('Erro interno no servidor'))
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })
    expect(await screen.findByText(/Erro interno no servidor/i)).toBeInTheDocument()
  })
  it('aplica filtros de tipo e categoria simultaneamente', async () => {
    renderWithProviders(<Transacoes />, { route: '/transacoes', path: '/transacoes' })

    await screen.findByText('Mercado Extra')
    const botaoReceitas = screen.getByRole('button', { name: /Receitas/i })
    await userEvent.click(botaoReceitas)
    const selectCategoria = screen.getByRole('combobox')
    await userEvent.selectOptions(selectCategoria, 'c1')
    await waitFor(() => {
      expect(listTransactions).toHaveBeenLastCalledWith(
        expect.objectContaining({ 
          transactionType: 1, 
          categoryId: 'c1' 
        })
      )
    })
  })
  it('impede o envio do formulário se o título estiver vazio', async () => {
    renderWithProviders(<Transacoes />, {
      route: '/transacoes',
      path: '/transacoes'
    })
    await screen.findByText('Mercado Extra')
    await userEvent.click(screen.getByRole('button', { name: /Nova/i }))
    await userEvent.click(screen.getByRole('button', { name: /Salvar transação/i }))
    expect(createTransaction).not.toHaveBeenCalled()
  })
})
