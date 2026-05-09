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
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../../api/transactions'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('transactions API', () => {
  it('listTransactions sem filtros envia params vazios', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await listTransactions()
    expect(api.get).toHaveBeenCalledWith('/api/transactions', { params: {} })
  })

  it('listTransactions monta apenas os filtros informados', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await listTransactions({ categoryId: 'c1', transactionType: 2 })
    expect(api.get).toHaveBeenCalledWith('/api/transactions', {
      params: { categoryId: 'c1', transactionType: 2 }
    })
  })

  it('listTransactions ignora valores falsy mas mantém estrutura', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await listTransactions({
      fromUtc: '2026-01-01',
      toUtc: '',
      categoryId: undefined,
      transactionType: 1
    })
    expect(api.get).toHaveBeenCalledWith('/api/transactions', {
      params: { fromUtc: '2026-01-01', transactionType: 1 }
    })
  })

  it('createTransaction envia POST com payload', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 't1' } })
    const payload = {
      title: 'Mercado',
      amount: 120,
      transactionType: 2,
      categoryId: 'c1',
      ocurredAt: '2026-04-01T10:00:00Z'
    }
    const result = await createTransaction(payload)
    expect(api.post).toHaveBeenCalledWith('/api/transactions', payload)
    expect(result.id).toBe('t1')
  })

  it('updateTransaction envia PUT no id correto', async () => {
    api.put.mockResolvedValueOnce({ data: {} })
    await updateTransaction('t1', { title: 'Novo' })
    expect(api.put).toHaveBeenCalledWith('/api/transactions/t1', {
      title: 'Novo'
    })
  })

  it('deleteTransaction envia DELETE no id', async () => {
    api.delete.mockResolvedValueOnce({})
    await deleteTransaction('t1')
    expect(api.delete).toHaveBeenCalledWith('/api/transactions/t1')
  })
})
