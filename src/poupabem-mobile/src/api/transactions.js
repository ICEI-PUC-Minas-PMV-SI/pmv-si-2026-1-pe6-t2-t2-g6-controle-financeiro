import { request } from './client';

export function listTransactions(token, { categoryId, transactionType } = {}) {
  return request('/api/transactions', {
    token,
    params: { categoryId, transactionType },
  });
}

export function createTransaction(token, payload) {
  return request('/api/transactions', {
    method: 'POST',
    token,
    body: payload,
  });
}
