import { formatCurrency } from '../../utils/format';

describe('formatCurrency', () => {
  it('formata número como real brasileiro', () => {
    expect(formatCurrency(1234.5)).toMatch(/R\$\s?1\.234,50/);
  });

  it('formata zero', () => {
    expect(formatCurrency(0)).toMatch(/R\$\s?0,00/);
  });

  it('formata valores negativos', () => {
    expect(formatCurrency(-50)).toMatch(/-R\$\s?50,00/);
  });
});
