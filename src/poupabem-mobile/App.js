import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import BottomNav from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import Login from './src/pages/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);
  const [authScreen, setAuthScreen] = useState('login');
  
  const isDashboard = activeTab === 'dashboard';

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        {authScreen === 'login' ? (
          <Login 
            onLogin={setSession} 
            onNavigateToSignUp={() => setAuthScreen('signup')} 
          />
        ) : (
          <SignUpScreen 
            onNavigateToLogin={() => setAuthScreen('login')} 
          />
        )}
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      {isDashboard ? (
        <DashboardScreen
          onOpenTransactions={() => setActiveTab('transactions')}
          session={session}
          onLogout={() => setSession(null)}
        />
      ) : (
        <TransactionsScreen session={session} />
      )}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </>
  );
}