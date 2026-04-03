import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, Text } from 'react-native';
import { FarmerProvider } from '../contexts/FarmerContext';
import { auth, signInAnonymously } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function RootLayout() {
  const [authReady, setAuthReady] = useState(false);
  const [uid, setUid] = useState(null);
  
  useEffect(() => {
    const setupAuth = async () => {
      try {
        if (!auth.currentUser) await signInAnonymously(auth);
      } catch (err) {
        console.warn("Auth failed:", err);
      }
    };
    setupAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);
      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF5' }}>
        <ActivityIndicator size="large" color="#1D9E75" />
        <Text style={{ marginTop: 10, color: '#1A1A2E' }}>ਸਿਸਟਮ ਚਾਲੂ ਹੋ ਰਿਹਾ ਹੈ...</Text>
      </View>
    );
  }

  return (
    <FarmerProvider uid={uid}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </FarmerProvider>
  );
}
