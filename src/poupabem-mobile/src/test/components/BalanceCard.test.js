import React from 'react';
import { render, screen } from '@testing-library/react-native';
import BalanceCard from '../../components/BalanceCard';

describe('BalanceCard', () => {
  it('exibe label e saldo formatado', () => {
    render(<BalanceCard balance={2350} />);

    expect(screen.getByText('SALDO ATUAL')).toBeTruthy();
    expect(screen.getByText(/R\$\s?2\.350,00/)).toBeTruthy();
    expect(screen.getByText('Período total')).toBeTruthy();
  });
});
