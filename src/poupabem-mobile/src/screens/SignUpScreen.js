import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { registerUser } from '../api/auth';
import { colors } from '../styles/theme';
import { isRequired } from '../utils/validators';

export default function SignUpScreen({ onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (
      !isRequired(trimmedName) ||
      !isRequired(trimmedEmail) ||
      !isRequired(trimmedPassword) ||
      !isRequired(trimmedConfirm)
    ) {
      Alert.alert('Aviso', 'Por favor, preencha todos os campos.');
      return;
    }

    if (trimmedPassword !== trimmedConfirm) {
      Alert.alert('Aviso', 'As senhas informadas não coincidem.');
      return;
    }

    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Silva';

    try {
      setLoading(true);
      await registerUser({
        firstName,
        lastName,
        email: trimmedEmail,
        password: trimmedPassword,
        confirmPassword: trimmedConfirm,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça seu login.');
      onNavigateToLogin();
    } catch (err) {
      Alert.alert('Erro', err.message || 'Não foi possível realizar o cadastro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.safeArea}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.logo}>PoupaBem</Text>
          <Text style={styles.subtitle}>Crie sua conta para começar</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Nome Completo</Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="exemplo@email.com"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Text style={styles.label}>Confirmar Senha</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              style={styles.input}
            />

            <Pressable onPress={handleSignUp} disabled={loading} style={styles.button}>
              <Text style={styles.buttonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </Pressable>
          </View>

          <Pressable onPress={onNavigateToLogin} style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Já tem uma conta? <Text style={styles.linkBold}>Entre aqui</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logo: {
    color: colors.brand900,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.ink2,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: colors.brand900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: colors.bg,
    borderColor: colors.surface2,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 15,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
  linkContainer: {
    marginTop: 28,
    paddingVertical: 8,
  },
  linkText: {
    color: colors.ink2,
    fontSize: 14,
    fontWeight: '700',
  },
  linkBold: {
    color: colors.brand700,
    fontWeight: '900',
  },
});