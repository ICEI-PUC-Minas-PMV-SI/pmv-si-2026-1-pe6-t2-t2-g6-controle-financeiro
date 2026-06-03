import { listGoals, createGoal, depositGoal } from '../../api/savingsGoals';

jest.mock('../../api/client', () => ({
  request: jest.fn(),
}));

import { request } from '../../api/client';

describe('savingsGoals API', () => {
  it('listGoals consulta metas com token', async () => {
    request.mockResolvedValueOnce([]);
    await listGoals('token-1');

    expect(request).toHaveBeenCalledWith('/api/savings-goals', { token: 'token-1' });
  });

  it('createGoal envia POST com payload', async () => {
    const payload = { name: 'Viagem', targetAmount: 5000 };
    request.mockResolvedValueOnce({ id: 'g1' });

    await createGoal('token-1', payload);

    expect(request).toHaveBeenCalledWith('/api/savings-goals', {
      method: 'POST',
      token: 'token-1',
      body: payload,
    });
  });

  it('depositGoal envia aporte no endpoint correto', async () => {
    request.mockResolvedValueOnce({ currentAmount: 100 });
    await depositGoal('token-1', 'g1', 50);

    expect(request).toHaveBeenCalledWith('/api/savings-goals/g1/deposit', {
      method: 'POST',
      token: 'token-1',
      body: { amount: 50 },
    });
  });
});
