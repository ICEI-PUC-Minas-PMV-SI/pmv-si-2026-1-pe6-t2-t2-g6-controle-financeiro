export const transactionCategories = [
  { id: 'salary', name: 'Salário', type: 'income' },
  { id: 'freelance', name: 'Freelance', type: 'income' },
  { id: 'food', name: 'Alimentação', type: 'expense' },
  { id: 'transport', name: 'Transporte', type: 'expense' },
  { id: 'home', name: 'Casa', type: 'expense' },
];

export const initialTransactions = [
  {
    id: '1',
    title: 'Mercado',
    categoryId: 'food',
    category: 'Alimentação',
    date: 'Hoje',
    amount: -80,
  },
  {
    id: '2',
    title: 'Salário',
    categoryId: 'salary',
    category: 'Salário',
    date: 'Ontem',
    amount: 2500,
  },
  {
    id: '3',
    title: 'Transporte',
    categoryId: 'transport',
    category: 'Transporte',
    date: '13/05',
    amount: -12,
  },
  {
    id: '4',
    title: 'Freelance',
    categoryId: 'freelance',
    category: 'Freelance',
    date: '10/05',
    amount: 600,
  },
];
