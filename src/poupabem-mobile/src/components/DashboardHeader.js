import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export default function DashboardHeader({ name = 'Maryana' }) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Olá, {name}</Text>
        <Text style={styles.subtitle}>Seu resumo financeiro</Text>
      </View>

      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -20,
    marginTop: -18,
    paddingBottom: 34,
    paddingHorizontal: 20,
    paddingTop: 26,
  },
  greeting: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B9D8CA',
    fontSize: 14,
    marginTop: 4,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors.brand500,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarText: {
    color: colors.brand900,
    fontSize: 18,
    fontWeight: '800',
  },
});
