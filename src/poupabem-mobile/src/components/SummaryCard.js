import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { formatCurrency } from '../utils/format';

export default function SummaryCard({ label, value, helper, tone }) {
  const valueStyle = tone === 'income' ? styles.incomeText : styles.expenseText;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{formatCurrency(value)}</Text>
      <Text style={styles.helper}>{helper}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flex: 1,
    padding: 18,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  value: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 8,
  },
  helper: {
    color: colors.ink2,
    fontSize: 12,
    marginTop: 5,
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
});
