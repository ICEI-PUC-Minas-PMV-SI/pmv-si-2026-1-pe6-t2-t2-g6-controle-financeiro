import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  import { colors } from '../styles/theme';
  View, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert 
} from 'react-native';
import { login } from '../api/auth';
import { extractErrorMessage } from '../api/client';

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Login bem-sucedido:', auth);

      const nomeUsuario = auth.firstName || auth.fullName?.split(' ')[0] || 'Usuário';
      Alert.alert('Sucesso', `Bem-vindo de volta, ${nomeUsuario}!`);

      if (props.onLogin) {
        props.onLogin(auth);
      }
    } catch (error) {
      console.error('Erro ao tentar logar:', error);

      const mensagemErro = extractErrorMessage(error);
      const fallback = 'Não foi possível conectar ao servidor. Verifique se o Back-end está ligado e na mesma rede.';

      Alert.alert('Falha no Login', mensagemErro === 'Erro inesperado' ? fallback : mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          
          <View style={styles.logoContainer}>
            <Text style={styles.title}>PoupaBem</Text>
            <Text style={styles.subtitle}>Controle Financeiro Inteligente</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor={colors.placeholder}
      backgroundColor: colors.bgAlt,
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor={colors.placeholder}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
      color: colors.brand600,

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
      color: colors.textMuted,
            >
              <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Entrar'}
      backgroundColor: colors.surface,
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerLink} 
              onPress={props.onNavigateToSignUp} 
              disabled={loading}
            >
              <Text style={styles.registerText}>
                Não tem uma conta? <Text style={styles.registerTextBold}>Cadastre-se</Text>
              </Text>
      borderColor: colors.border,
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
      backgroundColor: colors.surfaceMuted,
      color: colors.textStrong,

const styles = StyleSheet.create({
  safeArea: {
      backgroundColor: colors.brand600,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
      backgroundColor: colors.brand200,
    justifyContent: 'center',
    paddingHorizontal: 24,
      color: colors.surface,
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 0.5,
      color: colors.textMuted,
  subtitle: {
    fontSize: 16,
      color: colors.brand600,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  input: {
    height: 54,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  button: {
    height: 54,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7', 
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666',
  },
  registerTextBold: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});