import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import GoalCard from '../../components/GoalCard';

describe('GoalCard', () => {
  const goal = {
    name: 'Viagem',
    currentAmount: 450,
    targetAmount: 1000,
  };

  it('exibe nome, percentual e valores formatados', () => {
    render(<GoalCard goal={goal} onDeposit={jest.fn()} />);

    expect(screen.getByText('Viagem')).toBeTruthy();
    expect(screen.getByText('45%')).toBeTruthy();
    expect(screen.getByText(/R\$\s?450,00 de R\$\s?1\.000,00/)).toBeTruthy();
  });

  it('dispara onDeposit ao pressionar botão', () => {
    const onDeposit = jest.fn();
    render(<GoalCard goal={goal} onDeposit={onDeposit} />);

    fireEvent.press(screen.getByText('Adicionar valor'));

    expect(onDeposit).toHaveBeenCalledTimes(1);
  });

  it('limita percentual a 100% quando meta é superada', () => {
    render(
      <GoalCard
        goal={{ name: 'Reserva', currentAmount: 1200, targetAmount: 1000 }}
        onDeposit={jest.fn()}
      />
    );

    expect(screen.getByText('100%')).toBeTruthy();
  });
});
