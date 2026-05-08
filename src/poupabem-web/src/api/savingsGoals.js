import { api } from './client'

export async function listGoals() {
  const { data } = await api.get('/api/savings-goals')
  return data
}

export async function getGoal(id) {
  const { data } = await api.get(`/api/savings-goals/${id}`)
  return data
}

export async function createGoal({ name, targetAmount }) {
  const { data } = await api.post('/api/savings-goals', { name, targetAmount })
  return data
}

export async function updateGoal(id, { name, targetAmount }) {
  const { data } = await api.put(`/api/savings-goals/${id}`, { name, targetAmount })
  return data
}

export async function depositGoal(id, amount) {
  const { data } = await api.post(`/api/savings-goals/${id}/deposit`, { amount })
  return data
}

export async function deleteGoal(id) {
  await api.delete(`/api/savings-goals/${id}`)
}
