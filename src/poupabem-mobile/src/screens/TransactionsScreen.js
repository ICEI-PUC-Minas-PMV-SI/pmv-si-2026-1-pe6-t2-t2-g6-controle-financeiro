import { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { listCategories } from '../api/categories';
import {
  createTransaction,
  listTransactions,
} from '../api/transactions';
import FilterChip from '../components/FilterChip';
import SectionHeader from '../components/SectionHeader';
import TransactionFormModal from '../components/TransactionFormModal';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../styles/theme';
import {
  toCreateTransactionRequest,
  toMobileCategory,
  toMobileTransaction,
  TransactionType,
} from '../utils/mappers';

export default function TransactionsScreen({ session }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterCategoryId, setFilterCategoryId] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function refreshCategoriesOnly() {
    try {
      const categoriesData = await listCategories(session.accessToken);
      setCategories(categoriesData.map(toMobileCategory));
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTransactions() {
    try {
      setLoading(true);
      setError('');

      const transactionType =
        filterType === 'income'
          ? TransactionType.Income
          : filterType === 'expense'
            ? TransactionType.Expense
            : undefined;

      const [categoriesData, transactionsData] = await Promise.all([
        listCategories(session.accessToken),
        listTransactions(session.accessToken, {
          categoryId: filterCategoryId === 'all' ? undefined : filterCategoryId,
          transactionType,
        }),
      ]);

      const mappedCategories = categoriesData.map(toMobileCategory);
      setCategories(mappedCategories);
      setTransactions(
        transactionsData.map((transaction) =>
          toMobileTransaction(transaction, mappedCategories),
        ),
      );
    } catch (err) {
      setError(err.message || 'Não foi possível carregar as transações.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [filterCategoryId, filterType, session.accessToken]);

  const filteredTransactions = useMemo(() => {
    return transactions;
  }, [transactions]);

  async function handleCreate(transaction) {
    try {
      setError('');
      await createTransaction(session.accessToken, toCreateTransactionRequest(transaction));
      setModalVisible(false);
      setFilterType('all');
      setFilterCategoryId('all');
      await loadTransactions();
    } catch (err) {
      setError(err.message || 'Não foi possível criar a transação.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Transações</Text>
            <Text style={styles.subtitle}>Registre receitas e despesas</Text>
          </View>

          <Pressable onPress={() => setModalVisible(true)} style={styles.newButton}>
            <Text style={styles.newButtonText}>Nova</Text>
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.filters}>
          <FilterChip label="Todas" active={filterType === 'all'} onPress={() => setFilterType('all')} />
          <FilterChip
            label="Receitas"
            active={filterType === 'income'}
            onPress={() => setFilterType('income')}
          />
          <FilterChip
            label="Despesas"
            active={filterType === 'expense'}
            onPress={() => setFilterType('expense')}
          />
        </View>

        <ScrollView
          horizontal
          contentContainerStyle={styles.categoryFilters}
          showsHorizontalScrollIndicator={false}
        >
          <FilterChip
            label="Todas categorias"
            active={filterCategoryId === 'all'}
            onPress={() => setFilterCategoryId('all')}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.id}
              label={category.name}
              active={filterCategoryId === category.id}
              onPress={() => setFilterCategoryId(category.id)}
            />
          ))}
        </ScrollView>

        <SectionHeader title="Listagem" actionLabel={`${filteredTransactions.length} itens`} />

        <View style={styles.panel}>
          {loading ? (
            <Text style={styles.emptyText}>Carregando...</Text>
          ) : filteredTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </View>
      </ScrollView>

      <TransactionFormModal
        categories={categories}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreate}
        onRefreshCategories={refreshCategoriesOnly}
        token={session.accessToken}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brand900,
  },
  content: {
    backgroundColor: colors.bg,
    paddingBottom: 96,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -20,
    marginTop: -18,
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  title: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.brand300,
    fontSize: 14,
    marginTop: 4,
  },
  newButton: {
    backgroundColor: colors.brand500,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  newButtonText: {
    color: colors.brand900,
    fontSize: 14,
    fontWeight: '900',
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  categoryFilters: {
    gap: 10,
    paddingTop: 12,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  error: {
    backgroundColor: colors.dangerBg,
    borderRadius: 12,
    color: colors.expense,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
    padding: 12,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    padding: 20,
    textAlign: 'center',
  },
});
