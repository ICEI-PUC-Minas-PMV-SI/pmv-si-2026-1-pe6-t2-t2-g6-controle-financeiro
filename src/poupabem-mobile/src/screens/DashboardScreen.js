import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import BalanceCard from '../components/BalanceCard';
import DashboardHeader from '../components/DashboardHeader';
import GoalCard from '../components/GoalCard';
import SectionHeader from '../components/SectionHeader';
import SummaryCard from '../components/SummaryCard';
import TransactionItem from '../components/TransactionItem';
import {
  dashboardSummary,
  recentTransactions,
  savingsGoals,
} from '../data/dashboardMock';
import { colors } from '../styles/theme';

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader name="Maryana" />

        <BalanceCard balance={dashboardSummary.balance} />

        <View style={styles.summaryGrid}>
          <SummaryCard
            label="Receitas"
            value={dashboardSummary.income}
            tone="income"
            helper="4 entradas"
          />
          <SummaryCard
            label="Despesas"
            value={dashboardSummary.expense}
            tone="expense"
            helper="7 saídas"
          />
        </View>

        <SectionHeader title="Últimas transações" actionLabel="Ver todas" />
        <View style={styles.panel}>
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>

        <SectionHeader title="Cofrinhos" actionLabel="Novo" />
        <View style={styles.goalsList}>
          {savingsGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
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
    paddingBottom: 32,
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
});
