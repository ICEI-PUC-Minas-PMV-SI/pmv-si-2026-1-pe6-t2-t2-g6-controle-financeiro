import { request } from './client';

export function getSummary(token) {
  return request('/api/reports/summary', { token });
}
