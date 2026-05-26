import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import BottomNav from './src/components/BottomNav';
import DashboardScreen from './src/screens/DashboardScreen';
import TransactionsScreen from './src/screens/TransactionsScreen';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isDashboard = activeTab === 'dashboard';

  return (
    <>
      <StatusBar style="light" />
      {isDashboard ? (
        <DashboardScreen onOpenTransactions={() => setActiveTab('transactions')} />
      ) : (
        <TransactionsScreen />
      )}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </>
  );
}
