import { request } from './client';

export function listCategories(token) {
  return request('/api/categories', { token });
}

export function createCategory(token, payload) {
  return request('/api/categories', {
    method: 'POST',
    token,
    body: payload,
  });
}