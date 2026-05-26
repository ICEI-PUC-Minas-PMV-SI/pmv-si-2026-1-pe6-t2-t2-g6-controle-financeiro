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
import { colors } from '../styles/theme';

export default function TransactionFormModal({ categories, visible, onClose, onSubmit }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === type),
    [categories, type],
  );

  function handleTypeChange(nextType) {
    setType(nextType);
    setCategoryId('');
    setError('');
  }

  function handleSubmit() {
    const normalizedAmount = Number(amount.replace(',', '.'));

    if (!title.trim()) {
      setError('Informe um título.');
      return;
    }

    if (!normalizedAmount || normalizedAmount <= 0) {
      setError('Informe um valor válido.');
      return;
    }

    const category = categories.find((item) => item.id === categoryId);
    if (!category) {
      setError('Selecione uma categoria.');
      return;
    }

    onSubmit({
      id: String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      categoryId: category.id,
      category: category.name,
      date: 'Hoje',
      amount: type === 'income' ? normalizedAmount : -normalizedAmount,
    });

    setTitle('');
    setAmount('');
    setCategoryId('');
    setDescription('');
    setError('');
    setType('expense');
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
                active={type === 'expense'}
                onPress={() => handleTypeChange('expense')}
              />
              <FilterChip
                label="Receita"
                active={type === 'income'}
                onPress={() => handleTypeChange('income')}
              />
            </View>

            <Text style={styles.label}>Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Mercado"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
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
                  active={categoryId === category.id}
                  onPress={() => setCategoryId(category.id)}
                />
              ))}
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(2, 48, 32, 0.36)',
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
