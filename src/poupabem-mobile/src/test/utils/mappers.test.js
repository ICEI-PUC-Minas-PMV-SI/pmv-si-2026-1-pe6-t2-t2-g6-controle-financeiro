import {
  TransactionType,
  normalizeType,
  toMobileCategory,
  toMobileGoal,
  toMobileTransaction,
  toCreateTransactionRequest,
} from '../../utils/mappers';

describe('normalizeType', () => {
  it('normaliza Income numérico e string', () => {
    expect(normalizeType(TransactionType.Income)).toBe('income');
    expect(normalizeType('Income')).toBe('income');
    expect(normalizeType('income')).toBe('income');
  });

  it('normaliza Expense e demais valores como expense', () => {
    expect(normalizeType(TransactionType.Expense)).toBe('expense');
    expect(normalizeType('Expense')).toBe('expense');
    expect(normalizeType('expense')).toBe('expense');
  });
});

describe('toMobileCategory', () => {
  it('mapeia categoria da API para o formato mobile', () => {
    expect(
      toMobileCategory({ id: 'c1', name: 'Alimentação', type: TransactionType.Expense })
    ).toEqual({
      id: 'c1',
      name: 'Alimentação',
      type: 'expense',
    });
  });
});

describe('toMobileTransaction', () => {
  const categories = [{ id: 'c1', name: 'Salário', type: 'income' }];

  it('mapeia receita com valor positivo', () => {
    const result = toMobileTransaction(
      {
        id: 't1',
        title: 'Salário',
        description: '',
        amount: 2500,
        transactionType: TransactionType.Income,
        categoryId: 'c1',
        ocurredAt: '2026-04-01T12:00:00.000Z',
      },
      categories
    );

    expect(result).toMatchObject({
      id: 't1',
      title: 'Salário',
      category: 'Salário',
      amount: 2500,
    });
    expect(result.date).toMatch(/\d{2}\/\d{2}/);
  });

  it('mapeia despesa com valor negativo', () => {
    const result = toMobileTransaction(
      {
        id: 't2',
        title: 'Mercado',
        amount: 80,
        transactionType: TransactionType.Expense,
        categoryId: 'c2',
        ocurredAt: '2026-04-02T12:00:00.000Z',
      },
      [{ id: 'c2', name: 'Alimentação', type: 'expense' }]
    );

    expect(result.amount).toBe(-80);
    expect(result.category).toBe('Alimentação');
  });

  it('usa fallback de categoria quando id não é encontrado', () => {
    const result = toMobileTransaction(
      {
        id: 't3',
        title: 'Outros',
        amount: 10,
        transactionType: TransactionType.Expense,
        categoryId: 'missing',
        ocurredAt: '2026-04-03T12:00:00.000Z',
      },
      categories
    );

    expect(result.category).toBe('Categoria');
  });
});

describe('toCreateTransactionRequest', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-01T10:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('monta payload de receita', () => {
    expect(
      toCreateTransactionRequest({
        title: 'Freela',
        description: 'Projeto X',
        amount: 500,
        categoryId: 'c1',
      })
    ).toEqual({
      title: 'Freela',
      description: 'Projeto X',
      amount: 500,
      transactionType: TransactionType.Income,
      categoryId: 'c1',
      ocurredAt: '2026-04-01T10:00:00.000Z',
    });
  });

  it('monta payload de despesa com amount absoluto', () => {
    expect(
      toCreateTransactionRequest({
        title: 'Uber',
        amount: -35.5,
        categoryId: 'c2',
      })
    ).toEqual({
      title: 'Uber',
      description: null,
      amount: 35.5,
      transactionType: TransactionType.Expense,
      categoryId: 'c2',
      ocurredAt: '2026-04-01T10:00:00.000Z',
    });
  });
});

describe('toMobileGoal', () => {
  it('converte números e preserva progresso', () => {
    expect(
      toMobileGoal({
        id: 'g1',
        name: 'Viagem',
        currentAmount: '450',
        targetAmount: '1000',
        progressPercent: '45',
        createdAt: '2026-01-01T00:00:00.000Z',
      })
    ).toEqual({
      id: 'g1',
      name: 'Viagem',
      currentAmount: 450,
      targetAmount: 1000,
      progressPercent: 45,
      createdAt: '2026-01-01T00:00:00.000Z',
    });
  });
});

describe('TransactionType', () => {
  it('está alinhado ao backend', () => {
    expect(TransactionType.Income).toBe(1);
    expect(TransactionType.Expense).toBe(2);
  });
});
