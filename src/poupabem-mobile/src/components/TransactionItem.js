import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { formatCurrency } from '../utils/format';

export default function TransactionItem({ transaction }) {
  const isIncome = transaction.amount > 0;
  const toneStyle = isIncome ? styles.incomeText : styles.expenseText;

  return (
    <View style={styles.item}>
      <View style={[styles.icon, isIncome ? styles.incomeIcon : styles.expenseIcon]}>
        <Text style={[styles.iconText, toneStyle]}>{isIncome ? '+' : '-'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{transaction.title}</Text>
        <Text style={styles.meta}>
          {transaction.category} • {transaction.date}
        </Text>
      </View>

      <Text style={[styles.amount, toneStyle]}>
        {isIncome ? '+' : '-'} {formatCurrency(Math.abs(transaction.amount))}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    borderBottomColor: colors.surface2,
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 72,
    paddingHorizontal: 16,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    marginRight: 12,
    width: 38,
  },
  incomeIcon: {
    backgroundColor: '#E9F8F1',
  },
  expenseIcon: {
    backgroundColor: '#FDECEC',
  },
  iconText: {
    fontSize: 20,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
  amount: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
  },
  incomeText: {
    color: colors.income,
  },
  expenseText: {
    color: colors.expense,
  },
});
