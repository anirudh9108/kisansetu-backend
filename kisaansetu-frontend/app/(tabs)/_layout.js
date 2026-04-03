import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/Theme';
import { View, Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const { t } = useContext(FarmerContext);

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Theme.colors.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
      tabBarShowLabel: false,
      tabBarStyle: styles.tabBar,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: Theme.colors.primary,
      headerTransparent: true,
      headerTitleAlign: 'left',
    }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
            </View>
          ), 
          headerTitle: 'AgriSense' 
        }} 
      />
      <Tabs.Screen 
        name="schemes" 
        options={{ 
          title: t.schemes || 'Schemes', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={focused ? "document-text" : "document-text-outline"} size={24} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="disease" 
        options={{ 
          title: t.disease || 'Disease', 
          tabBarIcon: ({ focused }) => (
            <View style={[styles.fab, focused && styles.fabActive]}>
              <Ionicons name="scan" size={28} color="#FFF" />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="crops" 
        options={{ 
          title: t.cropPlan || 'Crops', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={focused ? "leaf" : "leaf-outline"} size={24} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="mandi" 
        options={{ 
          title: t.mandi || 'Mandi', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={focused ? "stats-chart" : "stats-chart-outline"} size={24} color={color} />
            </View>
          )
        }} 
      />
      <Tabs.Screen 
        name="water" 
        options={{ 
          title: t.water || 'Water', 
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={focused ? "water" : "water-outline"} size={24} color={color} />
            </View>
          )
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    height: 70,
    borderTopWidth: 0,
    ...Theme.colors.cardShadow,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    paddingBottom: 0,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 12,
  },
  fab: {
    width: 58,
    height: 58,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35,
    borderWidth: 4,
    borderColor: Theme.colors.background,
    ...Theme.colors.cardShadow
  },
  fabActive: {
    backgroundColor: Theme.colors.accent,
  },
  header: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Theme.colors.primary,
    letterSpacing: 0.5,
    marginTop: 10,
    marginLeft: 10
  }
});
