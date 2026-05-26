import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import FilterChip from '../components/FilterChip';
import SectionHeader from '../components/SectionHeader';
import TransactionFormModal from '../components/TransactionFormModal';
import TransactionItem from '../components/TransactionItem';
import { initialTransactions, transactionCategories } from '../data/transactionsMock';
import { colors } from '../styles/theme';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filterType, setFilterType] = useState('all');
  const [filterCategoryId, setFilterCategoryId] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionType = transaction.amount > 0 ? 'income' : 'expense';
      const matchesType = filterType === 'all' || filterType === transactionType;
      const matchesCategory =
        filterCategoryId === 'all' || filterCategoryId === transaction.categoryId;

      return matchesType && matchesCategory;
    });
  }, [filterCategoryId, filterType, transactions]);

  function handleCreate(transaction) {
    setTransactions((current) => [transaction, ...current]);
    setFilterType('all');
    setFilterCategoryId('all');
    setModalVisible(false);
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
          {transactionCategories.map((category) => (
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
          {filteredTransactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </View>
      </ScrollView>

      <TransactionFormModal
        categories={transactionCategories}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreate}
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
    color: '#B9D8CA',
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
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    padding: 20,
    textAlign: 'center',
  },
});
