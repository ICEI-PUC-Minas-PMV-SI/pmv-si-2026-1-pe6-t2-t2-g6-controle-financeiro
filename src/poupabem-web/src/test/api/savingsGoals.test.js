import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import { api } from '../../api/client'
import {
  listGoals,
  getGoal,
  createGoal,
  updateGoal,
  depositGoal,
  deleteGoal
} from '../../api/savingsGoals'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('savingsGoals API', () => {
  it('listGoals chama GET /api/savings-goals', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await listGoals()
    expect(api.get).toHaveBeenCalledWith('/api/savings-goals')
  })

  it('getGoal chama GET por id', async () => {
    api.get.mockResolvedValueOnce({ data: { id: 'g1' } })
    await getGoal('g1')
    expect(api.get).toHaveBeenCalledWith('/api/savings-goals/g1')
  })

  it('createGoal envia POST com nome e valor da meta', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 'g1' } })
    await createGoal({ name: 'Viagem', targetAmount: 5000 })
    expect(api.post).toHaveBeenCalledWith('/api/savings-goals', {
      name: 'Viagem',
      targetAmount: 5000
    })
  })

  it('updateGoal envia PUT no id correto', async () => {
    api.put.mockResolvedValueOnce({ data: {} })
    await updateGoal('g1', { name: 'Nova', targetAmount: 6000 })
    expect(api.put).toHaveBeenCalledWith('/api/savings-goals/g1', {
      name: 'Nova',
      targetAmount: 6000
    })
  })

  it('depositGoal envia POST em /deposit com valor', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    await depositGoal('g1', 250)
    expect(api.post).toHaveBeenCalledWith('/api/savings-goals/g1/deposit', {
      amount: 250
    })
  })

  it('deleteGoal envia DELETE no id', async () => {
    api.delete.mockResolvedValueOnce({})
    await deleteGoal('g1')
    expect(api.delete).toHaveBeenCalledWith('/api/savings-goals/g1')
  })
})
