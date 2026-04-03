import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { FarmerProvider } from '../contexts/FarmerContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PaperBackground from '../components/PaperBackground';
import Colors from '../constants/Colors';

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const [uid, setUid] = useState(null);

  // Load premium typography
  let [fontsLoaded] = useFonts({
    'Jakarta-Regular': PlusJakartaSans_400Regular,
    'Jakarta-Medium': PlusJakartaSans_500Medium,
    'Jakarta-Bold': PlusJakartaSans_700Bold,
  });
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        let storedUid = await AsyncStorage.getItem('@farmer_uid');
        if (!storedUid) {
          storedUid = `farmer_${Math.random().toString(36).substr(2, 9)}`;
          await AsyncStorage.setItem('@farmer_uid', storedUid);
        }
        setUid(storedUid);
      } catch (err) {
        console.warn("Local Auth Error:", err);
        setUid('guest_farmer');
      } finally {
        setAuthReady(true);
      }
    };
    setupAuth();
  }, []);

  if (!authReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.light.background }}>
        <ActivityIndicator size="large" color={Colors.light.tint} />
        <Text style={{ marginTop: 10, color: Colors.light.text, fontFamily: 'Jakarta-Medium' }}>
          ਸਿਸਟਮ ਚਾਲੂ ਹੋ ਰਿਹਾ ਹੈ...
        </Text>
      </View>
    );
  }

  return (
    <FarmerProvider uid={uid}>
      <PaperBackground>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' } // Let PaperBackground show through
        }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </PaperBackground>
    </FarmerProvider>
  );
}
