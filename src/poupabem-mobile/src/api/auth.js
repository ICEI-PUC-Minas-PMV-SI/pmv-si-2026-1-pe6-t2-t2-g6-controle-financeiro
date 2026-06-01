import { request } from './client';

export function login({ email, password }) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
