export const TransactionType = {
  Income: 1,
  Expense: 2,
};

export function toMobileCategory(category) {
  return {
    id: category.id,
    name: category.name,
    type: normalizeType(category.type),
  };
}

export function toMobileTransaction(transaction, categories = []) {
  const type = normalizeType(transaction.transactionType);
  const category = categories.find((item) => item.id === transaction.categoryId);

  return {
    id: transaction.id,
    title: transaction.title,
    description: transaction.description || '',
    categoryId: transaction.categoryId,
    category: category?.name || 'Categoria',
    date: formatShortDate(transaction.ocurredAt),
    amount:
      type === 'income'
        ? Number(transaction.amount)
        : -Math.abs(Number(transaction.amount)),
    occurredAt: transaction.ocurredAt,
  };
}

export function toCreateTransactionRequest(formTransaction) {
  const isIncome = formTransaction.amount > 0;

  return {
    title: formTransaction.title,
    description: formTransaction.description || null,
    amount: Math.abs(Number(formTransaction.amount)),
    transactionType: isIncome ? TransactionType.Income : TransactionType.Expense,
    categoryId: formTransaction.categoryId,
    ocurredAt: new Date().toISOString(),
  };
}

export function toMobileGoal(goal) {
  return {
    id: goal.id,
    name: goal.name,
    currentAmount: Number(goal.currentAmount),
    targetAmount: Number(goal.targetAmount),
    progressPercent: Number(goal.progressPercent),
    createdAt: goal.createdAt,
  };
}

export function normalizeType(type) {
  if (type === TransactionType.Income || type === 'Income' || type === 'income') {
    return 'income';
  }

  return 'expense';
}

function formatShortDate(isoDate) {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}
