import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../../constants/theme';
import { Platform, View, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: { 
          position: 'absolute',
          bottom: Platform.OS === 'android' ? 16 : 24,
          left: 16,
          right: 16,
          elevation: 0, // Disable android native shadow
          backgroundColor: Platform.OS === 'web' ? 'rgba(253, 252, 240, 0.85)' : Theme.colors.surface,
          borderRadius: 32,
          height: 64,
          paddingBottom: 0,
          borderTopWidth: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 8
        },
        // Only use BlurView on native, on web we use css via style above directly
        tabBarBackground: () => Platform.OS !== 'web' ? (
          <View style={{ flex: 1, backgroundColor: Theme.colors.surface, borderRadius: 32, ...Theme.shadows.float }} />
        ) : null,
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2
        }
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="schemes" 
        options={{ 
          title: 'Schemes',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "document-text" : "document-text-outline"} size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="crops" 
        options={{ 
          title: 'Crop AI',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="mandi" 
        options={{ 
          title: 'Mandi',
          tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? "bar-chart" : "bar-chart-outline"} size={22} color={color} /> 
        }} 
      />
      <Tabs.Screen name="disease" options={{ href: null }} />
      <Tabs.Screen name="water" options={{ href: null }} />
    </Tabs>
  );
}
