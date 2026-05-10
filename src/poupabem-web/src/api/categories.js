import { api } from './client'

// TransactionType: 1 = Income, 2 = Expense

export async function listCategories() {
  const { data } = await api.get('/api/categories')
  return data
}

export async function createCategory({ name, type }) {
  const { data } = await api.post('/api/categories', { name, type })
  return data
}

export async function updateCategory(id, { name, type }) {
  const { data } = await api.put(`/api/categories/${id}`, { name, type })
  return data
}

export async function deleteCategory(id) {
  await api.delete(`/api/categories/${id}`)
}
