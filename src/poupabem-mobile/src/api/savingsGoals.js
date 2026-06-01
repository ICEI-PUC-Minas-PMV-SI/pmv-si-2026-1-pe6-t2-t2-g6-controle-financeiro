import { request } from './client';

export function listGoals(token) {
  return request('/api/savings-goals', { token });
}
