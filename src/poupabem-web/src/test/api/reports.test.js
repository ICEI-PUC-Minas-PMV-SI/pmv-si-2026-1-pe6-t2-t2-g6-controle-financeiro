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
  getSummary,
  getExpensesByCategory,
  exportTransactionsCsv
} from '../../api/reports'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('reports API', () => {
  it('getSummary sem filtros envia params vazios', async () => {
    api.get.mockResolvedValueOnce({
      data: { totalIncome: 0, totalExpense: 0, balance: 0 }
    })
    await getSummary()
    expect(api.get).toHaveBeenCalledWith('/api/reports/summary', { params: {} })
  })

  it('getSummary aplica fromUtc e toUtc quando informados', async () => {
    api.get.mockResolvedValueOnce({ data: {} })
    await getSummary({ fromUtc: '2026-01-01', toUtc: '2026-12-31' })
    expect(api.get).toHaveBeenCalledWith('/api/reports/summary', {
      params: { fromUtc: '2026-01-01', toUtc: '2026-12-31' }
    })
  })

  it('getExpensesByCategory chama o endpoint correto', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await getExpensesByCategory({ fromUtc: '2026-04-01' })
    expect(api.get).toHaveBeenCalledWith('/api/reports/expenses-by-category', {
      params: { fromUtc: '2026-04-01' }
    })
  })

  it('exportTransactionsCsv baixa um arquivo blob', async () => {
    api.get.mockResolvedValueOnce({
      data: new Blob(['title,amount\nMercado,120'], { type: 'text/csv' })
    })

    const clickSpy = vi.fn()
    const appendSpy = vi.spyOn(document.body, 'appendChild')
    const removeSpy = vi
      .spyOn(HTMLAnchorElement.prototype, 'remove')
      .mockImplementation(() => {})
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(clickSpy)

    await exportTransactionsCsv({ categoryId: 'c1' })

    expect(api.get).toHaveBeenCalledWith(
      '/api/reports/transactions-export',
      expect.objectContaining({
        params: { categoryId: 'c1' },
        responseType: 'blob'
      })
    )
    expect(window.URL.createObjectURL).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalled()
    expect(appendSpy).toHaveBeenCalled()
    expect(removeSpy).toHaveBeenCalled()
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })
})
