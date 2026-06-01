import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import BottomNav from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [session, setSession] = useState(null);
  const isDashboard = activeTab === 'dashboard';

  if (!session) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen onLogin={setSession} />
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
        />
      ) : (
        <TransactionsScreen session={session} />
      )}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </>
  );
}
