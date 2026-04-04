
import { Stack } from 'expo-router';
import { FarmerProvider, FarmerContext } from '../contexts/FarmerContext';
import { useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

const RootLayoutSub = () => {
  const { farmer, loading } = useContext(FarmerContext);

  useEffect(() => {
    if (!loading) {
      if (!farmer) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  }, [farmer, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1D9E75" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <FarmerProvider>
      <RootLayoutSub />
    </FarmerProvider>
  );
}
