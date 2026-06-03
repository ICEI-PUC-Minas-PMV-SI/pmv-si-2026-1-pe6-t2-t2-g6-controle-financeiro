import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BottomNav from '../../components/BottomNav';

describe('BottomNav', () => {
  it('renderiza abas de navegação', () => {
    render(<BottomNav activeTab="dashboard" onChangeTab={jest.fn()} />);

    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByText('Transações')).toBeTruthy();
  });

  it('dispara onChangeTab ao pressionar aba', () => {
    const onChangeTab = jest.fn();
    render(<BottomNav activeTab="dashboard" onChangeTab={onChangeTab} />);

    fireEvent.press(screen.getByText('Transações'));

    expect(onChangeTab).toHaveBeenCalledWith('transactions');
  });
});
