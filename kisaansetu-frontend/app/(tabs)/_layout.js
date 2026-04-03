import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { t } = useContext(FarmerContext);

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#1D9E75',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#FAFAF5' },
      headerStyle: { backgroundColor: '#1D9E75' },
      headerTintColor: '#fff',
    }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />, headerTitle: 'KisaanSetu' }} />
      <Tabs.Screen name="schemes" options={{ title: t.schemes || 'Schemes', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} /> }} />
      <Tabs.Screen name="crops" options={{ title: t.cropPlan || 'Crops', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="leaf" size={24} color={color} /> }} />
      <Tabs.Screen name="disease" options={{ title: t.disease || 'Disease', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="scan-circle" size={32} color={color} /> }} />
      <Tabs.Screen name="mandi" options={{ title: t.mandi || 'Mandi', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={24} color={color} /> }} />
      <Tabs.Screen name="water" options={{ title: t.water || 'Water', tabBarShowLabel: false, tabBarIcon: ({ color }) => <Ionicons name="water" size={24} color={color} /> }} />
    </Tabs>
  );
}
