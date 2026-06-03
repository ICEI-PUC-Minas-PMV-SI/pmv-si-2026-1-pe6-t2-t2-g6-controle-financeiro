import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TransactionItem from '../../components/TransactionItem';

describe('TransactionItem', () => {
  it('renderiza receita com sinal positivo', () => {
    render(
      <TransactionItem
        transaction={{
          title: 'Salário',
          category: 'Renda',
          date: '01/04',
          amount: 2500,
        }}
      />
    );

    expect(screen.getByText('Salário')).toBeTruthy();
    expect(screen.getByText('Renda • 01/04')).toBeTruthy();
    expect(screen.getByText(/\+ R\$\s?2\.500,00/)).toBeTruthy();
  });

  it('renderiza despesa com sinal negativo', () => {
    render(
      <TransactionItem
        transaction={{
          title: 'Mercado',
          category: 'Alimentação',
          date: '02/04',
          amount: -80,
        }}
      />
    );

    expect(screen.getByText('Mercado')).toBeTruthy();
    expect(screen.getByText(/- R\$\s?80,00/)).toBeTruthy();
  });
});
