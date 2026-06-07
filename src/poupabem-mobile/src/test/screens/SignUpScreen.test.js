import React from 'react';
import { Alert } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../../screens/SignUpScreen';

jest.mock('../../api/auth', () => ({
  registerUser: jest.fn(),
}));

import { registerUser } from '../../api/auth';

describe('SignUpScreen (integração)', () => {
  const onNavigateToLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    Alert.alert.mockRestore();
  });

  it('renderiza os campos e o link para login', () => {
    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    expect(screen.getByText('PoupaBem')).toBeTruthy();
    expect(screen.getByText('Crie sua conta para começar')).toBeTruthy();
    expect(screen.getByPlaceholderText('Seu nome completo')).toBeTruthy();
    expect(screen.getByPlaceholderText('exemplo@email.com')).toBeTruthy();
    expect(screen.getByText(/Já tem uma conta\?/)).toBeTruthy();
  });

  it('valida campos vazios sem chamar a API', async () => {
    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Aviso',
        'Por favor, preencha todos os campos.',
      );
    });
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('valida senhas diferentes sem chamar a API', async () => {
    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Ana Silva');
    fireEvent.changeText(screen.getByPlaceholderText('exemplo@email.com'), 'ana@test.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[0], 'Senha@123');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[1], 'Outra@123');
    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Aviso',
        'As senhas informadas não coincidem.',
      );
    });
    expect(registerUser).not.toHaveBeenCalled();
  });

  it('cadastra com sucesso e navega para o login', async () => {
    registerUser.mockResolvedValueOnce({ accessToken: 'jwt-novo' });

    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Ana Silva');
    fireEvent.changeText(screen.getByPlaceholderText('exemplo@email.com'), 'ana@test.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[0], 'Senha@123');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[1], 'Senha@123');
    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        firstName: 'Ana',
        lastName: 'Silva',
        email: 'ana@test.com',
        password: 'Senha@123',
        confirmPassword: 'Senha@123',
      });
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso',
      'Conta criada com sucesso! Faça seu login.',
    );
    expect(onNavigateToLogin).toHaveBeenCalled();
  });

  it('exibe erro do backend quando o cadastro falha', async () => {
    registerUser.mockRejectedValueOnce(new Error('E-mail já cadastrado.'));

    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.changeText(screen.getByPlaceholderText('Seu nome completo'), 'Ana Silva');
    fireEvent.changeText(screen.getByPlaceholderText('exemplo@email.com'), 'ana@test.com');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[0], 'Senha@123');
    fireEvent.changeText(screen.getAllByPlaceholderText('••••••••')[1], 'Senha@123');
    fireEvent.press(screen.getByText('Cadastrar'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'E-mail já cadastrado.');
    });
    expect(onNavigateToLogin).not.toHaveBeenCalled();
  });

  it('navega para o login ao tocar no link', () => {
    render(<SignUpScreen onNavigateToLogin={onNavigateToLogin} />);

    fireEvent.press(screen.getByText('Entre aqui'));

    expect(onNavigateToLogin).toHaveBeenCalled();
  });
});
