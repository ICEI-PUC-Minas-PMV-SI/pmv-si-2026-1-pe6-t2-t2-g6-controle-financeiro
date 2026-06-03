import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import FilterChip from '../../components/FilterChip';

describe('FilterChip', () => {
  it('renderiza label do filtro', () => {
    render(<FilterChip label="Receitas" active={false} onPress={jest.fn()} />);

    expect(screen.getByText('Receitas')).toBeTruthy();
  });

  it('dispara onPress ao tocar no chip', () => {
    const onPress = jest.fn();
    render(<FilterChip label="Despesas" active={false} onPress={onPress} />);

    fireEvent.press(screen.getByText('Despesas'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
