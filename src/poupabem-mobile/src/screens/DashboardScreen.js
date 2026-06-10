import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { listCategories } from '../api/categories';
import { getSummary } from '../api/reports';
import { listGoals, depositGoal, createGoal } from '../api/savingsGoals';
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

export default function DashboardScreen({ onOpenTransactions, session, onLogout }) {
  const [summary, setSummary] = useState(emptySummary);
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isNewGoalModalVisible, setIsNewGoalModalVisible] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');

  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

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

  useEffect(() => {
    loadDashboard();
  }, [session.accessToken]);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount.replace(',', '.'))) {
      Alert.alert('Aviso', 'Por favor, insira um valor válido.');
      return;
    }

    try {
      const parsedAmount = parseFloat(depositAmount.replace(',', '.'));

      if (parsedAmount <= 0) {
        Alert.alert('Aviso', 'O valor deve ser maior que zero.');
        return;
      }

      await depositGoal(session.accessToken, selectedGoal.id, parsedAmount);

      Alert.alert('Sucesso', 'Valor adicionado ao cofrinho!');
      
      setIsModalVisible(false);
      setDepositAmount('');
      setSelectedGoal(null);

      loadDashboard();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível realizar o depósito.');
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoalName.trim()) {
      Alert.alert('Aviso', 'Por favor, insira um nome para o objetivo.');
      return;
    }

    if (!newGoalTarget || isNaN(newGoalTarget.replace(',', '.'))) {
      Alert.alert('Aviso', 'Por favor, insira um valor de meta válido.');
      return;
    }

    try {
      const parsedTarget = parseFloat(newGoalTarget.replace(',', '.'));

      if (parsedTarget <= 0) {
        Alert.alert('Aviso', 'O valor da meta deve ser maior que zero.');
        return;
      }

      const payload = {
        name: newGoalName,
        description: `Meta para ${newGoalName}`,
        targetAmount: parsedTarget,
        currentAmount: 0,
        deadlineUtc: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      };

      await createGoal(session.accessToken, payload);

      Alert.alert('Sucesso', 'Novo cofrinho criado!');
      
      setIsNewGoalModalVisible(false);
      setNewGoalName('');
      setNewGoalTarget('');

      loadDashboard();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível criar o cofrinho.');
    }
  };

  const firstName = session.fullName?.split(' ')[0] || 'usuário';
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <DashboardHeader name={firstName} onPressAvatar={() => setIsProfileModalVisible(true)} />

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

        <SectionHeader 
          title="Cofrinhos" 
          actionLabel="Novo" 
          onActionPress={() => setIsNewGoalModalVisible(true)}
        />
        <View style={styles.goalsList}>
          {loading ? (
            <Text style={styles.emptyText}>Carregando...</Text>
          ) : goals.length === 0 ? (
            <Text style={styles.emptyText}>Você ainda não tem cofrinhos.</Text>
          ) : (
            goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onDeposit={() => {
                  setSelectedGoal(goal);
                  setIsModalVisible(true);
                }}
              />
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar valor em:</Text>
            <Text style={styles.modalGoalName}>{selectedGoal?.name}</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="R$ 0,00"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={depositAmount}
              onChangeText={setDepositAmount}
              autoFocus={true}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.neutral200 }]}
                onPress={() => {
                  setIsModalVisible(false);
                  setDepositAmount('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.brand900 }]} 
                onPress={handleDeposit}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isNewGoalModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalGoalName}>Novo Cofrinho</Text>
            
            <TextInput
              style={styles.modalInputForm}
              placeholder="Nome do objetivo (ex: Carro)"
              placeholderTextColor={colors.placeholder}
              value={newGoalName}
              onChangeText={setNewGoalName}
            />

            <TextInput
              style={styles.modalInputForm}
              placeholder="Valor da meta (R$)"
              placeholderTextColor={colors.placeholder}
              keyboardType="numeric"
              value={newGoalTarget}
              onChangeText={setNewGoalTarget}
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.neutral200 }]}
                onPress={() => {
                  setIsNewGoalModalVisible(false);
                  setNewGoalName('');
                  setNewGoalTarget('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.brand900 }]} 
                onPress={handleCreateGoal}
              >
                <Text style={styles.modalConfirmText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={isProfileModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsProfileModalVisible(false)}
        >
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.largeAvatar}>
                <Text style={styles.largeAvatarText}>{initial}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{session.fullName || 'Usuário'}</Text>
                <Text style={styles.profileEmail}>{session.email || 'email@poupabem.com'}</Text>
              </View>
            </View>

            <View style={styles.profileDivider} />

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => {
                setIsProfileModalVisible(false);
                if (onLogout) onLogout();
              }}
            >
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: colors.dangerBg,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    width: '85%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    color: colors.muted,
    fontSize: 14,
  },
  modalGoalName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
    marginTop: 2,
  },
  modalInput: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: colors.brand900,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 8,
    marginBottom: 24,
    color: colors.ink,
  },
  modalInputForm: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: colors.brand500,
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 20,
    color: colors.ink,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.muted,
  },
  modalConfirmText: {
    fontWeight: '800',
    fontSize: 14,
    color: colors.surface,
  },
  profileCard: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.brand500,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  largeAvatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: 16,
  },
  logoutButton: {
    backgroundColor: colors.dangerBgStrong,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.dangerText,
    fontSize: 15,
    fontWeight: '800',
  },
});
