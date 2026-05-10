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
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api/categories'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('categories API', () => {
  it('listCategories chama GET /api/categories', async () => {
    api.get.mockResolvedValueOnce({ data: [{ id: 'c1' }] })
    const result = await listCategories()
    expect(api.get).toHaveBeenCalledWith('/api/categories')
    expect(result).toHaveLength(1)
  })

  it('createCategory envia POST com name e type', async () => {
    api.post.mockResolvedValueOnce({ data: { id: 'c1' } })
    await createCategory({ name: 'Mercado', type: 2 })
    expect(api.post).toHaveBeenCalledWith('/api/categories', {
      name: 'Mercado',
      type: 2
    })
  })

  it('updateCategory envia PUT no id correto', async () => {
    api.put.mockResolvedValueOnce({ data: { id: 'c1' } })
    await updateCategory('c1', { name: 'Alimentação', type: 2 })
    expect(api.put).toHaveBeenCalledWith('/api/categories/c1', {
      name: 'Alimentação',
      type: 2
    })
  })

  it('deleteCategory envia DELETE no id correto', async () => {
    api.delete.mockResolvedValueOnce({})
    await deleteCategory('c1')
    expect(api.delete).toHaveBeenCalledWith('/api/categories/c1')
  })
})
