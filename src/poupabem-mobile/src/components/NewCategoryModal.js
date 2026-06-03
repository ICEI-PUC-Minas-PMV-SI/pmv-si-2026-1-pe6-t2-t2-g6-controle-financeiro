import { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { createCategory } from '../api/categories';
import { colors } from '../styles/theme';
import { TransactionKind } from '../utils/constants';
import { isRequired } from '../utils/validators';

export default function NewCategoryModal({
  visible,
  onClose,
  token,
  transactionType,
  onCreated,
}) {
  const [name, setName] = useState('');
  const typeLabel = transactionType === TransactionKind.Income ? 'Receita' : 'Despesa';

  async function handleCreate() {
    if (!isRequired(name)) {
      Alert.alert('Aviso', 'Informe o nome da categoria.');
      return;
    }

    try {
      const trimmedName = name.trim();
      const payload = {
        name: trimmedName,
        type: transactionType === TransactionKind.Income ? 1 : 2,
      };

      await createCategory(token, payload);

      Alert.alert('Sucesso', 'Categoria criada com sucesso!');
      setName('');

      if (onClose) {
        onClose();
      }

      if (onCreated) {
        await onCreated();
      }
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível criar a categoria.');
    }
  }

  function handleClose() {
    setName('');
    if (onClose) {
      onClose();
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Nova Categoria ({typeLabel})</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome da categoria (ex: Vestuário)"
            placeholderTextColor={colors.placeholder}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={[styles.buttonText, styles.cancelText]}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleCreate}
            >
              <Text style={[styles.buttonText, styles.confirmText]}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.surface,
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: colors.brand900,
    fontSize: 16,
    paddingVertical: 8,
    marginBottom: 24,
    color: colors.ink,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.neutral200,
  },
  confirmButton: {
    backgroundColor: colors.brand900,
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 14,
  },
  cancelText: {
    color: colors.neutral700,
  },
  confirmText: {
    color: colors.surface,
  },
});
