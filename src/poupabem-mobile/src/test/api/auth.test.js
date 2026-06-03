import { login, registerUser } from '../../api/auth';

jest.mock('../../api/client', () => ({
  request: jest.fn(),
}));

import { request } from '../../api/client';

describe('auth API', () => {
  it('login envia credenciais para /api/auth/login', async () => {
    request.mockResolvedValueOnce({ accessToken: 'jwt' });

    await login({ email: 'user@test.com', password: 'Senha@123' });

    expect(request).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { email: 'user@test.com', password: 'Senha@123' },
    });
  });

  it('registerUser envia dados completos de cadastro', async () => {
    const payload = {
      firstName: 'Ana',
      lastName: 'Silva',
      email: 'ana@test.com',
      password: 'Senha@123',
      confirmPassword: 'Senha@123',
    };
    request.mockResolvedValueOnce({ accessToken: 'jwt' });

    await registerUser(payload);

    expect(request).toHaveBeenCalledWith('/api/auth/register', {
      method: 'POST',
      body: payload,
    });
  });
});
