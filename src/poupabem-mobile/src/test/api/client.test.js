import { request, extractErrorMessage } from '../../api/client';

jest.mock('../../api/config', () => ({
  API_BASE_URL: 'http://localhost:5043',
}));

describe('request', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('envia GET com token e query params', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [{ id: 't1' }],
    });

    const result = await request('/api/transactions', {
      token: 'abc123',
      params: { categoryId: 'c1', transactionType: 2 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5043/api/transactions?categoryId=c1&transactionType=2',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer abc123',
          'Content-Type': 'application/json',
        }),
      })
    );
    expect(result).toEqual([{ id: 't1' }]);
  });

  it('envia POST com body JSON', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 't2' }),
    });

    await request('/api/transactions', {
      method: 'POST',
      body: { title: 'Mercado', amount: 50 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5043/api/transactions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'Mercado', amount: 50 }),
      })
    );
  });

  it('ignora params vazios na query string', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [],
    });

    await request('/api/transactions', {
      params: { categoryId: '', transactionType: 1 },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:5043/api/transactions?transactionType=1',
      expect.any(Object)
    );
  });

  it('retorna null para resposta 204', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 204,
    });

    const result = await request('/api/transactions/t1', { method: 'DELETE' });
    expect(result).toBeNull();
  });

  it('lança erro com mensagem da API', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Categoria inválida' }),
    });

    await expect(request('/api/transactions')).rejects.toThrow('Categoria inválida');
  });
});

describe('extractErrorMessage', () => {
  it('retorna message do erro', () => {
    expect(extractErrorMessage(new Error('Falha na rede'))).toBe('Falha na rede');
  });

  it('retorna mensagem padrão quando erro é indefinido', () => {
    expect(extractErrorMessage(null)).toBe('Erro inesperado');
  });
});
