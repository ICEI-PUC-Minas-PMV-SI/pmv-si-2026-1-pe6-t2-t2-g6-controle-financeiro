import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  Alert 
} from 'react-native';
import api from '../api/api'; // Configuração do Axios apontando para o IP do seu PC

export default function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    // 1. Validação simples local antes de disparar a requisição
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, preencha o e-mail e a senha.');
      return;
    }

    setLoading(true);

    try {
      // 2. Dispara os dados para o endpoint correto do .NET
      const response = await api.post('/api/auth/login', {
        email: email,
        password: password 
      });

      // 3. Sucesso (Status 200) - Coleta a propriedade real vinda do C#
      console.log('Login bem-sucedido:', response.data);
      
      const nomeUsuario = response.data.firstName || 'Usuário';
      Alert.alert('Sucesso', `Bem-vindo de volta, ${nomeUsuario}!`);

      // 4. Integração com o fluxo de navegação do App.js
      // Envia os dados da sessão (dados do usuário/token) para destravar o Dashboard
      if (props.onLogin) {
        props.onLogin(response.data);
      }

    } catch (error) {
      console.error('Erro ao tentar logar:', error);

      // 5. Tratamento inteligente de erros da API .NET
      let mensagemErro = 'Não foi possível conectar ao servidor. Verifique se o Back-end está ligado e na mesma rede.';
      
      if (error.response) {
        // O servidor respondeu com um status de erro (Ex: 400 - Credenciais Inválidas)
        // Captura a mensagem enviada pelo controller ou middleware do back-end
        mensagemErro = error.response.data?.message || error.response.data || 'E-mail ou senha inválidos.';
      }

      Alert.alert('Falha no Login', mensagemErro);
    } finally {
      loading && setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          
          {/* Header/Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.title}>PoupaBem</Text>
            <Text style={styles.subtitle}>Controle Financeiro Inteligente</Text>
          </View>

          {/* Formulário */}
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

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />

            <TouchableOpacity 
              style={[styles.button, loading && styles.buttonDisabled]} 
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Carregando...' : 'Entrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerLink} disabled={loading}>
              <Text style={styles.registerText}>
                Não tem uma conta? <Text style={styles.registerTextBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
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