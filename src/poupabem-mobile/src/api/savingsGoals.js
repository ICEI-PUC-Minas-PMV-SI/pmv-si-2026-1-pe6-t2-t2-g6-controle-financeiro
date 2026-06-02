import { request } from './client';

export function listGoals(token) {
  return request('/api/savings-goals', { token });
}

export function createGoal(token, payload) {
  return request('/api/savings-goals', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function depositGoal(token, id, amount) {
  return request(`/api/savings-goals/${id}/deposit`, {
    method: 'POST',
    token,
    body: { amount },
  });
}