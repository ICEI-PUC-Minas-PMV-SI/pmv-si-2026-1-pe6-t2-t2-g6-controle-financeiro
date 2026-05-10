import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../api/savingsGoals', () => ({
  listGoals: vi.fn(),
  getGoal: vi.fn(),
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  depositGoal: vi.fn(),
  deleteGoal: vi.fn()
}))

import {
  listGoals,
  createGoal,
  depositGoal,
  deleteGoal
} from '../../api/savingsGoals'
import Cofrinhos from '../../pages/Cofrinhos'
import { renderWithProviders } from '../utils/renderWithProviders'

const metas = [
  {
    id: 'g1',
    name: 'Viagem Europa',
    targetAmount: 5000,
    currentAmount: 1500,
    progressPercent: 30,
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'g2',
    name: 'Reserva',
    targetAmount: 10000,
    currentAmount: 2500,
    progressPercent: 25,
    createdAt: '2026-01-15T00:00:00Z'
  }
]

beforeEach(() => {
  vi.clearAllMocks()
  listGoals.mockResolvedValue(metas)
})

describe('Cofrinhos (integração)', () => {
  it('lista os cofrinhos com nome, valores e progresso', async () => {
    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    expect(await screen.findByText('Viagem Europa')).toBeInTheDocument()
    expect(screen.getByText('Reserva')).toBeInTheDocument()
    expect(screen.getByText('30% concluído')).toBeInTheDocument()
    expect(screen.getByText('25% concluído')).toBeInTheDocument()
  })

  it('mostra o total guardado somando o currentAmount de todas as metas', async () => {
    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    await screen.findByText('Viagem Europa')
    expect(screen.getByText(/R\$\s?4\.000,00/)).toBeInTheDocument()
    expect(screen.getByText(/em 2 metas/i)).toBeInTheDocument()
  })

  it('mostra estado vazio quando o usuário não tem metas', async () => {
    listGoals.mockResolvedValueOnce([])

    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    expect(
      await screen.findByText('Você ainda não tem cofrinhos.')
    ).toBeInTheDocument()
  })

  it('cria um cofrinho via modal "Novo cofrinho"', async () => {
    createGoal.mockResolvedValueOnce({ id: 'g3' })

    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    await screen.findByText('Viagem Europa')

    await userEvent.click(
      screen.getByRole('button', { name: /^Novo cofrinho$/ })
    )

    expect(
      await screen.findByRole('heading', { name: 'Novo cofrinho' })
    ).toBeInTheDocument()

    await userEvent.type(
      screen.getByPlaceholderText('Ex: Viagem Europa'),
      'Notebook'
    )
    await userEvent.type(screen.getByPlaceholderText('5000,00'), '3500')
    await userEvent.click(
      screen.getByRole('button', { name: /Criar cofrinho/i })
    )

    await waitFor(() => {
      expect(createGoal).toHaveBeenCalledWith({
        name: 'Notebook',
        targetAmount: 3500
      })
    })
  })

  it('valida valor inválido na criação do cofrinho', async () => {
    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    await screen.findByText('Viagem Europa')
    await userEvent.click(
      screen.getByRole('button', { name: /^Novo cofrinho$/ })
    )

    await screen.findByRole('heading', { name: 'Novo cofrinho' })

    await userEvent.type(
      screen.getByPlaceholderText('Ex: Viagem Europa'),
      'Invalid'
    )
    await userEvent.type(screen.getByPlaceholderText('5000,00'), '0')
    await userEvent.click(
      screen.getByRole('button', { name: /Criar cofrinho/i })
    )

    expect(
      await screen.findByText('Informe um valor de meta válido.')
    ).toBeInTheDocument()
    expect(createGoal).not.toHaveBeenCalled()
  })

  it('aporta valor em um cofrinho existente', async () => {
    depositGoal.mockResolvedValueOnce({})

    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    await screen.findByText('Viagem Europa')

    const cardViagem = screen.getByText('Viagem Europa').closest('.card')
    const adicionarBtn = within(cardViagem).getByRole('button', {
      name: /Adicionar valor/i
    })
    await userEvent.click(adicionarBtn)

    expect(
      await screen.findByText(/Aportar em "Viagem Europa"/)
    ).toBeInTheDocument()

    await userEvent.type(screen.getByPlaceholderText('100,00'), '250')
    await userEvent.click(
      screen.getByRole('button', { name: /Confirmar aporte/i })
    )

    await waitFor(() => {
      expect(depositGoal).toHaveBeenCalledWith('g1', 250)
    })
  })

  it('exclui um cofrinho após confirmação', async () => {
    deleteGoal.mockResolvedValueOnce({})

    renderWithProviders(<Cofrinhos />, {
      route: '/cofrinhos',
      path: '/cofrinhos'
    })

    await screen.findByText('Viagem Europa')

    const cardViagem = screen.getByText('Viagem Europa').closest('.card')
    const lixeira = within(cardViagem).getByTitle('Excluir')
    await userEvent.click(lixeira)

    await waitFor(() => {
      expect(deleteGoal).toHaveBeenCalledWith('g1')
    })
  })
  it('deve criar um novo cofrinho com sucesso', async () => {
    createGoal.mockResolvedValueOnce({ id: 'cg3', name: 'Viagem', targetAmount: 1000 })
    renderWithProviders(<Cofrinhos />, { route: '/cofrinhos', path: '/cofrinhos' })
    await userEvent.click(screen.getByRole('button', { name: /^Novo cofrinho$/i }))
    await userEvent.type(screen.getByPlaceholderText('Ex: Viagem Europa'), 'Notebook')
    await userEvent.type(screen.getByPlaceholderText('5000,00'), '3500')
    await userEvent.click(screen.getByRole('button', { name: /Criar cofrinho/i }))
    await waitFor(() => {
      expect(createGoal).toHaveBeenCalledWith({
        name: 'Notebook',
        targetAmount: 3500
      })
    })
  })
  it('deve excluir um cofrinho existente', async () => {
    deleteGoal.mockResolvedValueOnce({})
    renderWithProviders(<Cofrinhos />, { route: '/cofrinhos', path: '/cofrinhos' })
    await screen.findByText('Viagem Europa')
    const cardViagem = screen.getByText('Viagem Europa').closest('.card')
    const lixeira = within(cardViagem).getByTitle('Excluir')
    await userEvent.click(lixeira)
    await waitFor(() => {
      expect(deleteGoal).toHaveBeenCalledWith('g1')
    })
  })
})
