import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { login } from '../api/auth';
import { extractErrorMessage } from '../api/client';
import { colors } from '../styles/theme';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');

    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    try {
      setLoading(true);
      const auth = await login({ email: email.trim(), password });
      onLogin(auth);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>PoupaBem</Text>
        <Text style={styles.subtitle}>Entre para ver seus dados reais</Text>

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="voce@email.com"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={email}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          onChangeText={setPassword}
          placeholder="Sua senha"
          placeholderTextColor={colors.muted}
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable disabled={loading} onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.brand900,
  },
  container: {
    backgroundColor: colors.bg,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    color: colors.brand900,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.ink2,
    fontSize: 15,
    marginBottom: 28,
    marginTop: 8,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginTop: 16,
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
  error: {
    color: colors.expense,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brand900,
    borderRadius: 14,
    marginTop: 20,
    paddingVertical: 15,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '900',
  },
});
