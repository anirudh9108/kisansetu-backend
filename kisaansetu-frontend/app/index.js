import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FarmerContext } from '../contexts/FarmerContext';

export default function LoginScreen() {
  const router = useRouter();
  const { farmer, loading } = useContext(FarmerContext);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    // If the user already has a configured profile, skip onboarding and login
    const checkSkip = async () => {
       const isLogged = await AsyncStorage.getItem('@user_logged_in');
       if (isLogged === 'true') {
         if (!loading && farmer && farmer.name && farmer.name !== "New Farmer") {
            router.replace('/home');
         } else {
            router.replace('/onboarding');
         }
       }
       setAuthChecking(false);
    }
    checkSkip();
  }, [farmer, loading]);

  const handleLogin = async () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    await AsyncStorage.setItem('@user_logged_in', 'true');
    
    // Check if farmer profile exists
    if (!loading && farmer && farmer.name && farmer.name !== "New Farmer") {
      router.replace('/home');
    } else {
      router.replace('/onboarding');
    }
  };

  if (authChecking) return null;

  return (
    <LinearGradient 
      colors={[Theme.colors.primary, Theme.colors.secondary]} 
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardView}
        >
          {/* Logo / Brand Section */}
          <View style={styles.brandSection}>
             <Ionicons name="leaf" size={64} color={Theme.colors.accent} style={{ marginBottom: 16 }} />
             <Text style={styles.brandTitle}>AgriSense</Text>
             <Text style={styles.brandSubtitle}>Empowering Agricultural Innovation</Text>
          </View>

          {/* Login Card */}
          <View style={styles.loginCard}>
             <Text style={styles.welcomeText}>Welcome Back</Text>
             <Text style={styles.promptText}>Sign in to your account</Text>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Enter mobile number"
                    placeholderTextColor={Theme.colors.textMuted}
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>
             </View>

             <View style={styles.inputGroup}>
                <Text style={styles.label}>Password / OTP</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
                  <TextInput 
                    style={styles.input}
                    placeholder="Enter secure PIN"
                    placeholderTextColor={Theme.colors.textMuted}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>
             </View>

             <TouchableOpacity style={styles.forgotBtn}>
               <Text style={styles.forgotText}>Forgot PIN?</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.8}>
                <LinearGradient 
                  colors={Theme.colors.gradientAccent} 
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.gradientBtn}
                >
                  <Text style={styles.loginBtnText}>Secure Login</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </LinearGradient>
             </TouchableOpacity>

             <View style={styles.registerWrap}>
                <Text style={styles.noAccount}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.replace('/onboarding')}>
                  <Text style={styles.registerLink}>Register Now</Text>
                </TouchableOpacity>
             </View>
          </View>

        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1, justifyContent: 'center', paddingHorizontal: Theme.spacing.lg },
  brandSection: { alignItems: 'center', marginBottom: 40, marginTop: -40 },
  brandTitle: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: 1 },
  brandSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 8 },
  
  loginCard: {
    backgroundColor: '#FFF',
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    paddingVertical: 32,
    ...Theme.colors.heavyShadow
  },
  welcomeText: { fontSize: 28, fontWeight: '800', color: Theme.colors.text, letterSpacing: -0.5 },
  promptText: { fontSize: 15, color: Theme.colors.textMuted, marginTop: 4, marginBottom: 30 },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: Theme.colors.primary, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 56, fontSize: 16, color: Theme.colors.text, fontWeight: '500' },
  
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotText: { color: Theme.colors.secondary, fontWeight: '600', fontSize: 14 },
  
  loginBtn: { borderRadius: Theme.borderRadius.md, overflow: 'hidden', ...Theme.colors.cardShadow },
  gradientBtn: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: '800', marginRight: 8, letterSpacing: 0.5 },
  
  registerWrap: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  noAccount: { color: Theme.colors.textMuted, fontSize: 15 },
  registerLink: { color: Theme.colors.primary, fontSize: 15, fontWeight: '800' }
});
