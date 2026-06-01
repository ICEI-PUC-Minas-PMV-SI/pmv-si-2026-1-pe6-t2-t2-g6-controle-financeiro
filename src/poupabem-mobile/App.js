import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import BottomNav from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';

// Importando o SEU componente de login refatorado com as conexões da API corrigidas
import Login from './src/pages/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Controle de sessão: se quiser que o app já inicialize logado para testar o Dashboard direto, 
  // você pode colocar um objeto fictício temporariamente aqui, ex: useState({ name: 'João' });
  const [session, setSession] = useState(null);
  
  const isDashboard = activeTab === 'dashboard';

  // Fluxo de Autenticação: se não houver sessão ativa, renderiza a SUA tela de Login
  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        <Login onLogin={setSession} />
      </>
    );
  }

  // Fluxo Principal: renderiza o Dashboard ou Transações com o menu inferior (trabalho do seu colega)
  return (
    <>
      <StatusBar style="light" />
      {isDashboard ? (
        <DashboardScreen
          onOpenTransactions={() => setActiveTab('transactions')}
          session={session}
        />
      ) : (
        <TransactionsScreen session={session} />
      )}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </>
  );
}