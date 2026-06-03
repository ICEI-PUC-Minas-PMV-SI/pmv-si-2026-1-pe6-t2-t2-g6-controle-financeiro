import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { formatCurrency } from '../utils/format';

export default function BalanceCard({ balance }) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>SALDO ATUAL</Text>
      <Text style={styles.value}>{formatCurrency(balance)}</Text>
      <Text style={styles.hint}>Período total</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    elevation: 3,
    marginTop: -18,
    padding: 22,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
  },
  label: {
    color: colors.brand700,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  value: {
    color: colors.ink,
    fontSize: 34,
    fontWeight: '900',
    marginTop: 8,
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
});
