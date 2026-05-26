import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../styles/theme';

export default function FilterChip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.activeChip]}>
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.surface2,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  activeChip: {
    backgroundColor: colors.brand900,
    borderColor: colors.brand900,
  },
  label: {
    color: colors.ink2,
    fontSize: 13,
    fontWeight: '800',
  },
  activeLabel: {
    color: colors.surface,
  },
});
