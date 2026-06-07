import { listTransactions, createTransaction } from '../../api/transactions';

jest.mock('../../api/client', () => ({
  request: jest.fn(),
}));

import { request } from '../../api/client';

describe('transactions API', () => {
  it('listTransactions repassa token e filtros', async () => {
    request.mockResolvedValueOnce([]);
    await listTransactions('token-1', { categoryId: 'c1', transactionType: 2 });

    expect(request).toHaveBeenCalledWith('/api/transactions', {
      token: 'token-1',
      params: { categoryId: 'c1', transactionType: 2 },
    });
  });

  it('createTransaction envia POST com payload', async () => {
    const payload = {
      title: 'Mercado',
      amount: 120,
      transactionType: 2,
      categoryId: 'c1',
    };
    request.mockResolvedValueOnce({ id: 't1' });

    const result = await createTransaction('token-1', payload);

    expect(request).toHaveBeenCalledWith('/api/transactions', {
      method: 'POST',
      token: 'token-1',
      body: payload,
    });
    expect(result.id).toBe('t1');
  });
});
