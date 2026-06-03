import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import TransactionsScreen from '../../screens/TransactionsScreen';

jest.mock('../../api/transactions', () => ({
  listTransactions: jest.fn(),
  createTransaction: jest.fn(),
}));

jest.mock('../../api/categories', () => ({
  listCategories: jest.fn(),
  createCategory: jest.fn(),
}));

import { listTransactions, createTransaction } from '../../api/transactions';
import { listCategories } from '../../api/categories';

const session = {
  accessToken: 'jwt-123',
  email: 'gabriel@test.com',
  fullName: 'Gabriel Santos',
};

const categorias = [
  { id: 'c1', name: 'Alimentação', type: 2 },
  { id: 'c2', name: 'Salário', type: 1 },
];

const transacoes = [
  {
    id: 't1',
    title: 'Mercado Extra',
    description: '',
    amount: 120,
    transactionType: 2,
    categoryId: 'c1',
    ocurredAt: '2026-04-10T10:00:00Z',
  },
  {
    id: 't2',
    title: 'Salário Abril',
    description: '',
    amount: 4500,
    transactionType: 1,
    categoryId: 'c2',
    ocurredAt: '2026-04-01T10:00:00Z',
  },
];

describe('TransactionsScreen (integração)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    listTransactions.mockResolvedValue(transacoes);
    listCategories.mockResolvedValue(categorias);
  });

  it('lista as transações vindas da API', async () => {
    render(<TransactionsScreen session={session} />);

    expect(await screen.findByText('Mercado Extra')).toBeTruthy();
    expect(screen.getByText('Salário Abril')).toBeTruthy();
  });

  it('aplica filtro por tipo "Receitas" chamando listTransactions com transactionType=1', async () => {
    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Receitas'));

    await waitFor(() => {
      expect(listTransactions).toHaveBeenLastCalledWith('jwt-123', {
        categoryId: undefined,
        transactionType: 1,
      });
    });
  });

  it('aplica filtro por categoria via chip', async () => {
    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Alimentação'));

    await waitFor(() => {
      expect(listTransactions).toHaveBeenLastCalledWith('jwt-123', {
        categoryId: 'c1',
        transactionType: undefined,
      });
    });
  });

  it('exibe mensagem de erro quando a listagem de transações falha', async () => {
    listTransactions.mockRejectedValueOnce(new Error('Erro interno no servidor'));

    render(<TransactionsScreen session={session} />);

    expect(await screen.findByText('Erro interno no servidor')).toBeTruthy();
  });

  it('abre o modal de nova transação ao tocar em "Nova"', async () => {
    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Nova'));

    expect(await screen.findByText('Nova transação')).toBeTruthy();
  });

  it('valida valor inválido no modal sem chamar a API', async () => {
    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Nova'));
    await screen.findByText('Nova transação');

    fireEvent.changeText(screen.getByPlaceholderText('Ex: Mercado'), 'Padaria');
    fireEvent.changeText(screen.getByPlaceholderText('80,00'), '0');
    fireEvent.press(screen.getAllByText('Alimentação').at(-1));
    fireEvent.press(screen.getByText('Salvar transação'));

    expect(await screen.findByText('Informe um valor válido.')).toBeTruthy();
    expect(createTransaction).not.toHaveBeenCalled();
  });

  it('impede o envio do formulário se o título estiver vazio', async () => {
    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Nova'));
    await screen.findByText('Nova transação');

    fireEvent.changeText(screen.getByPlaceholderText('80,00'), '50,75');
    fireEvent.press(screen.getAllByText('Alimentação').at(-1));
    fireEvent.press(screen.getByText('Salvar transação'));

    expect(await screen.findByText('Informe um título.')).toBeTruthy();
    expect(createTransaction).not.toHaveBeenCalled();
  });

  it('cria uma nova transação via modal', async () => {
    createTransaction.mockResolvedValueOnce({ id: 't3' });

    render(<TransactionsScreen session={session} />);

    await screen.findByText('Mercado Extra');
    fireEvent.press(screen.getByText('Nova'));
    await screen.findByText('Nova transação');

    fireEvent.changeText(screen.getByPlaceholderText('Ex: Mercado'), 'Padaria');
    fireEvent.changeText(screen.getByPlaceholderText('80,00'), '50,75');
    fireEvent.press(screen.getAllByText('Alimentação').at(-1));
    fireEvent.press(screen.getByText('Salvar transação'));

    await waitFor(() => expect(createTransaction).toHaveBeenCalledTimes(1));

    const [, payload] = createTransaction.mock.calls[0];
    expect(payload.title).toBe('Padaria');
    expect(payload.amount).toBe(50.75);
    expect(payload.transactionType).toBe(2);
    expect(payload.categoryId).toBe('c1');
  });
});
