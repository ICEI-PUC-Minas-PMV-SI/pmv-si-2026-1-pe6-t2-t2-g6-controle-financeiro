import { api } from './client'

export async function listTransactions({ fromUtc, toUtc, categoryId, transactionType } = {}) {
  const params = {}
  if (fromUtc) params.fromUtc = fromUtc
  if (toUtc) params.toUtc = toUtc
  if (categoryId) params.categoryId = categoryId
  if (transactionType) params.transactionType = transactionType

  const { data } = await api.get('/api/transactions', { params })
  return data
}

export async function createTransaction(payload) {
  const { data } = await api.post('/api/transactions', payload)
  return data
}

export async function updateTransaction(id, payload) {
  const { data } = await api.put(`/api/transactions/${id}`, payload)
  return data
}

export async function deleteTransaction(id) {
  await api.delete(`/api/transactions/${id}`)
}
