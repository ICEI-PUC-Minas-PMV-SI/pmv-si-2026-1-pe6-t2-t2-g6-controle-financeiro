import { request } from './client';

export function listCategories(token) {
  return request('/api/categories', { token });
}
