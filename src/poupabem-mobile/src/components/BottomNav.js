import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'transactions', label: 'Transações' },
];

export default function BottomNav({ activeTab, onChangeTab }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.item, active && styles.activeItem]}
          >
            <Text style={[styles.label, active && styles.activeLabel]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopColor: colors.surface2,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    gap: 10,
    left: 0,
    paddingBottom: 14,
    paddingHorizontal: 20,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
  },
  item: {
    alignItems: 'center',
    borderRadius: 12,
    flex: 1,
    paddingVertical: 10,
  },
  activeItem: {
    backgroundColor: colors.brand900,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  activeLabel: {
    color: colors.surface,
  },
});
