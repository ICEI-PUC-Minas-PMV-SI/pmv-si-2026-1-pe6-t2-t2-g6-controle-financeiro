import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';

jest.mock('../../api/auth', () => ({
  login: jest.fn(),
}));

import { login } from '../../api/auth';

describe('LoginScreen (integração)', () => {
  const onLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza os campos e o botão de entrar', () => {
    render(<LoginScreen onLogin={onLogin} />);

    expect(screen.getByText('PoupaBem')).toBeTruthy();
    expect(screen.getByText('Entre para ver seus dados reais')).toBeTruthy();
    expect(screen.getByPlaceholderText('voce@email.com')).toBeTruthy();
    expect(screen.getByPlaceholderText('Sua senha')).toBeTruthy();
    expect(screen.getByText('Entrar')).toBeTruthy();
  });

  it('valida campos vazios sem chamar a API', async () => {
    render(<LoginScreen onLogin={onLogin} />);

    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Informe e-mail e senha.')).toBeTruthy();
    expect(login).not.toHaveBeenCalled();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it('faz login com sucesso e repassa a sessão para onLogin', async () => {
    const auth = {
      accessToken: 'jwt-123',
      refreshToken: 'refresh-123',
      userId: 'u1',
      email: 'ana@test.com',
      fullName: 'Ana Teste',
    };
    login.mockResolvedValueOnce(auth);

    render(<LoginScreen onLogin={onLogin} />);

    fireEvent.changeText(screen.getByPlaceholderText('voce@email.com'), 'ana@test.com');
    fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'Senha@123');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'ana@test.com',
        password: 'Senha@123',
      });
    });

    expect(onLogin).toHaveBeenCalledWith(auth);
  });

  it('exibe a mensagem de erro retornada pela API', async () => {
    login.mockRejectedValueOnce(new Error('Credenciais inválidas'));

    render(<LoginScreen onLogin={onLogin} />);

    fireEvent.changeText(screen.getByPlaceholderText('voce@email.com'), 'a@a.com');
    fireEvent.changeText(screen.getByPlaceholderText('Sua senha'), 'errada');
    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Credenciais inválidas')).toBeTruthy();
    expect(onLogin).not.toHaveBeenCalled();
  });
});
