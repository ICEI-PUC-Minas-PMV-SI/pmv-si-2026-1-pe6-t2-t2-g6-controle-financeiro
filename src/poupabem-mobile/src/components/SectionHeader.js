import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export default function SectionHeader({ title, actionLabel }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {actionLabel ? (
        <Pressable>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 24,
  },
  title: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
  },
  action: {
    color: colors.brand700,
    fontSize: 13,
    fontWeight: '800',
  },
});
