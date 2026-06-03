import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SummaryCard from '../../components/SummaryCard';

describe('SummaryCard', () => {
  it('renderiza receita com label e valor', () => {
    render(
      <SummaryCard label="Receitas" value={1500} helper="Este mês" tone="income" />
    );

    expect(screen.getByText('Receitas')).toBeTruthy();
    expect(screen.getByText(/R\$\s?1\.500,00/)).toBeTruthy();
    expect(screen.getByText('Este mês')).toBeTruthy();
  });

  it('renderiza despesa', () => {
    render(
      <SummaryCard label="Despesas" value={800} helper="Este mês" tone="expense" />
    );

    expect(screen.getByText('Despesas')).toBeTruthy();
    expect(screen.getByText(/R\$\s?800,00/)).toBeTruthy();
  });
});
