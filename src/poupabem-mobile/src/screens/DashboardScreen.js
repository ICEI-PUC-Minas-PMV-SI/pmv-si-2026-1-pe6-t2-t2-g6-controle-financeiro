import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { listCategories } from '../api/categories';
import { getSummary } from '../api/reports';
import { listGoals } from '../api/savingsGoals';
import { listTransactions } from '../api/transactions';
import BalanceCard from '../components/BalanceCard';
import DashboardHeader from '../components/DashboardHeader';
import GoalCard from '../components/GoalCard';
import SectionHeader from '../components/SectionHeader';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import { colors } from '../styles/theme';
import { toMobileCategory, toMobileGoal, toMobileTransaction } from '../utils/mappers';

const emptySummary = {
  balance: 0,
  income: 0,
  expense: 0,
};

export default function DashboardScreen({ onOpenTransactions, session }) {
  const [summary, setSummary] = useState(emptySummary);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const [summaryData, categoriesData, transactionsData, goalsData] = await Promise.all([
          getSummary(session.accessToken),
          listCategories(session.accessToken),
          listTransactions(session.accessToken),
          listGoals(session.accessToken),
        ]);

        const categories = categoriesData.map(toMobileCategory);

        setSummary({
          balance: Number(summaryData.balance),
          income: Number(summaryData.totalIncome),
          expense: Number(summaryData.totalExpense),
        });
        setTransactions(
          transactionsData
            .map((transaction) => toMobileTransaction(transaction, categories))
            .slice(0, 4),
        );
        setGoals(goalsData.map(toMobileGoal).slice(0, 3));
      } catch (err) {
        setError(err.message || 'Não foi possível carregar o dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [session.accessToken]);

  const firstName = session.fullName?.split(' ')[0] || 'usuário';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader name={firstName} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <BalanceCard balance={summary.balance} />

        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Receitas"
            value={summary.income}
            tone="income"
            helper={loading ? 'Carregando' : 'Entradas'}
          />
          <SummaryCard
            label="Despesas"
            value={summary.expense}
            tone="expense"
            helper={loading ? 'Carregando' : 'Saídas'}
          />
        </View>

        <SectionHeader
          title="Últimas transações"
          actionLabel="Ver todas"
          onActionPress={onOpenTransactions}
        />
        <View style={styles.panel}>
          {loading ? (
            <Text style={styles.emptyText}>Carregando...</Text>
          ) : transactions.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          ) : (
            transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          )}
        </View>

        <SectionHeader title="Cofrinhos" actionLabel="Novo" />
        <View style={styles.goalsList}>
          {loading ? (
            <Text style={styles.emptyText}>Carregando...</Text>
          ) : goals.length === 0 ? (
            <Text style={styles.emptyText}>Você ainda não tem cofrinhos.</Text>
          ) : (
            goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
          )}
        </View>
      </ScrollView>
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
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
  },
  goalsList: {
    gap: 12,
  },
  error: {
    backgroundColor: '#FDECEC',
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
