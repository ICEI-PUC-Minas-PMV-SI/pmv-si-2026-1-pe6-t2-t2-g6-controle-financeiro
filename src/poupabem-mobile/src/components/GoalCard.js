import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';
import { formatCurrency } from '../utils/format';

export default function GoalCard({ goal }) {
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name}>{goal.name}</Text>
        <Text style={styles.percent}>{Math.round(progress * 100)}%</Text>
      </View>

      <Text style={styles.values}>
        {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)}
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Adicionar valor</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
  },
  top: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: colors.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
  percent: {
    color: colors.income,
    fontSize: 15,
    fontWeight: '900',
  },
  values: {
    color: colors.ink2,
    fontSize: 13,
    marginTop: 8,
  },
  progressTrack: {
    backgroundColor: colors.surface2,
    borderRadius: 999,
    height: 9,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: colors.brand500,
    borderRadius: 999,
    height: '100%',
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderRadius: 12,
    marginTop: 16,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '800',
  },
});
