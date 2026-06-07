import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import FilterChip from './FilterChip';
import NewCategoryModal from './NewCategoryModal';
import { colors } from '../styles/theme';
import { TransactionKind } from '../utils/constants';
import { parseCurrencyInput } from '../utils/format';
import { isPositiveNumber, isRequired } from '../utils/validators';

const initialForm = {
  type: TransactionKind.Expense,
  title: '',
  amount: '',
  categoryId: '',
  description: '',
};

const errorMessages = {
  titleRequired: 'Informe um título.',
  amountInvalid: 'Informe um valor válido.',
  categoryRequired: 'Selecione uma categoria.',
};

export default function TransactionFormModal({ categories, visible, onClose, onSubmit, onRefreshCategories, token }) {
  const [form, setForm] = useState({ ...initialForm });
  const [error, setError] = useState('');

  const [newCategoryModalVisible, setNewCategoryModalVisible] = useState(false);

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === form.type),
    [categories, form.type],
  );

  function updateForm(nextValues) {
    setForm((current) => ({ ...current, ...nextValues }));
  }

  function handleTypeChange(nextType) {
    updateForm({ type: nextType, categoryId: '' });
    setError('');
  }

  function handleSubmit() {
    const normalizedAmount = parseCurrencyInput(form.amount);
    const trimmedTitle = form.title.trim();
    const trimmedDescription = form.description.trim();

    if (!isRequired(trimmedTitle)) {
      setError(errorMessages.titleRequired);
      return;
    }

    if (!isPositiveNumber(normalizedAmount)) {
      setError(errorMessages.amountInvalid);
      return;
    }

    const category = categories.find((item) => item.id === form.categoryId);
    if (!category) {
      setError(errorMessages.categoryRequired);
      return;
    }

    onSubmit({
      id: String(Date.now()),
      title: trimmedTitle,
      description: trimmedDescription,
      categoryId: category.id,
      category: category.name,
      date: 'Hoje',
      amount: form.type === TransactionKind.Income ? normalizedAmount : -normalizedAmount,
    });

    setForm({ ...initialForm });
    setError('');
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Nova transação</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.row}>
              <FilterChip
                label="Despesa"
                active={form.type === TransactionKind.Expense}
                onPress={() => handleTypeChange(TransactionKind.Expense)}
              />
              <FilterChip
                label="Receita"
                active={form.type === TransactionKind.Income}
                onPress={() => handleTypeChange(TransactionKind.Income)}
              />
            </View>

            <Text style={styles.label}>Título</Text>
            <TextInput
              value={form.title}
              onChangeText={(value) => updateForm({ title: value })}
              placeholder="Ex: Mercado"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              value={form.amount}
              onChangeText={(value) => updateForm({ amount: value })}
              keyboardType="decimal-pad"
              placeholder="80,00"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.name}
                  active={form.categoryId === category.id}
                  onPress={() => updateForm({ categoryId: category.id })}
                />
              ))}
              <FilterChip
                label="+ Nova"
                active={false}
                onPress={() => setNewCategoryModalVisible(true)}
              />
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              value={form.description}
              onChangeText={(value) => updateForm({ description: value })}
              multiline
              placeholder="Opcional"
              placeholderTextColor={colors.muted}
              style={[styles.input, styles.textArea]}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Salvar transação</Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      <NewCategoryModal
        visible={newCategoryModalVisible}
        onClose={() => setNewCategoryModalVisible(false)}
        token={token}
        transactionType={form.type}
        onCreated={onRefreshCategories}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlaySoft,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  closeButton: {
    paddingVertical: 8,
  },
  closeText: {
    color: colors.brand700,
    fontSize: 13,
    fontWeight: '800',
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.surface2,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  textArea: {
    minHeight: 82,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  error: {
    color: colors.expense,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderRadius: 14,
    marginBottom: 28,
    marginTop: 18,
    paddingVertical: 15,
  },
  submitText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
});
