import { getSummary } from '../../api/reports';

jest.mock('../../api/client', () => ({
  request: jest.fn(),
}));

import { request } from '../../api/client';

describe('reports API', () => {
  it('getSummary consulta resumo financeiro com token', async () => {
    request.mockResolvedValueOnce({ balance: 1000, totalIncome: 2000, totalExpense: 1000 });
    const result = await getSummary('token-1');

    expect(request).toHaveBeenCalledWith('/api/reports/summary', { token: 'token-1' });
    expect(result.balance).toBe(1000);
  });
});
