import { api } from './client'

export async function getSummary({ fromUtc, toUtc } = {}) {
  const params = {}
  if (fromUtc) params.fromUtc = fromUtc
  if (toUtc) params.toUtc = toUtc
  const { data } = await api.get('/api/reports/summary', { params })
  return data
}

export async function getExpensesByCategory({ fromUtc, toUtc } = {}) {
  const params = {}
  if (fromUtc) params.fromUtc = fromUtc
  if (toUtc) params.toUtc = toUtc
  const { data } = await api.get('/api/reports/expenses-by-category', { params })
  return data
}

export async function exportTransactionsCsv({ fromUtc, toUtc, categoryId, transactionType } = {}) {
  const params = {}
  if (fromUtc) params.fromUtc = fromUtc
  if (toUtc) params.toUtc = toUtc
  if (categoryId) params.categoryId = categoryId
  if (transactionType) params.transactionType = transactionType

  const response = await api.get('/api/reports/transactions-export', {
    params,
    responseType: 'blob'
  })

  const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `transacoes_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
