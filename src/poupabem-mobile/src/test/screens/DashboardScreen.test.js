import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../../screens/DashboardScreen';

jest.mock('../../api/reports', () => ({
  getSummary: jest.fn(),
}));

jest.mock('../../api/categories', () => ({
  listCategories: jest.fn(),
}));

jest.mock('../../api/transactions', () => ({
  listTransactions: jest.fn(),
}));

jest.mock('../../api/savingsGoals', () => ({
  listGoals: jest.fn(),
  depositGoal: jest.fn(),
  createGoal: jest.fn(),
}));

import { getSummary } from '../../api/reports';
import { listCategories } from '../../api/categories';
import { listTransactions } from '../../api/transactions';
import { listGoals } from '../../api/savingsGoals';

const session = {
  accessToken: 'jwt-123',
  email: 'gabriel@test.com',
  fullName: 'Gabriel Santos',
};

describe('DashboardScreen (integração)', () => {
  const onOpenTransactions = jest.fn();
  const onLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe saudação personalizada com o primeiro nome', async () => {
    getSummary.mockResolvedValueOnce({ totalIncome: 0, totalExpense: 0, balance: 0 });
    listCategories.mockResolvedValueOnce([]);
    listTransactions.mockResolvedValueOnce([]);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    expect(await screen.findByText('Olá, Gabriel')).toBeTruthy();
  });

  it('renderiza saldo, receitas e despesas formatados em BRL', async () => {
    getSummary.mockResolvedValueOnce({
      totalIncome: 6500,
      totalExpense: 3200,
      balance: 3300,
    });
    listCategories.mockResolvedValueOnce([]);
    listTransactions.mockResolvedValueOnce([]);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    await waitFor(() => expect(getSummary).toHaveBeenCalled());

    expect(screen.getByText(/R\$\s?3\.300,00/)).toBeTruthy();
    expect(screen.getByText(/R\$\s?6\.500,00/)).toBeTruthy();
    expect(screen.getByText(/R\$\s?3\.200,00/)).toBeTruthy();
  });

  it('mostra as últimas transações com categoria e valor', async () => {
    const cats = [
      { id: 'c1', name: 'Alimentação', type: 2 },
      { id: 'c2', name: 'Salário', type: 1 },
    ];
    const txs = [
      {
        id: 't1',
        title: 'Mercado Extra',
        amount: 120,
        transactionType: 2,
        categoryId: 'c1',
        ocurredAt: '2026-04-10T10:00:00Z',
      },
      {
        id: 't2',
        title: 'Salário Abril',
        amount: 4500,
        transactionType: 1,
        categoryId: 'c2',
        ocurredAt: '2026-04-01T10:00:00Z',
      },
    ];

    getSummary.mockResolvedValueOnce({
      totalIncome: 4500,
      totalExpense: 120,
      balance: 4380,
    });
    listCategories.mockResolvedValueOnce(cats);
    listTransactions.mockResolvedValueOnce(txs);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    expect(await screen.findByText('Mercado Extra')).toBeTruthy();
    expect(screen.getByText('Salário Abril')).toBeTruthy();
    expect(screen.getByText(/Alimentação/)).toBeTruthy();
  });

  it('exibe mensagem de erro amigável quando o backend falha', async () => {
    getSummary.mockRejectedValueOnce(new Error('boom'));
    listCategories.mockResolvedValueOnce([]);
    listTransactions.mockResolvedValueOnce([]);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    expect(await screen.findByText('boom')).toBeTruthy();
  });

  it('renderiza placeholder quando o usuário não tem cofrinhos', async () => {
    getSummary.mockResolvedValueOnce({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    });
    listCategories.mockResolvedValueOnce([]);
    listTransactions.mockResolvedValueOnce([]);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    expect(await screen.findByText('Você ainda não tem cofrinhos.')).toBeTruthy();
  });

  it('aciona onOpenTransactions ao tocar em "Ver todas"', async () => {
    getSummary.mockResolvedValueOnce({ totalIncome: 0, totalExpense: 0, balance: 0 });
    listCategories.mockResolvedValueOnce([]);
    listTransactions.mockResolvedValueOnce([]);
    listGoals.mockResolvedValueOnce([]);

    render(
      <DashboardScreen
        session={session}
        onOpenTransactions={onOpenTransactions}
        onLogout={onLogout}
      />,
    );

    await screen.findByText('Olá, Gabriel');
    fireEvent.press(screen.getByText('Ver todas'));

    expect(onOpenTransactions).toHaveBeenCalled();
  });
});
