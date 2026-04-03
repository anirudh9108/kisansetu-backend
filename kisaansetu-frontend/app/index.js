import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FarmerContext } from '../contexts/FarmerContext';
import { Theme } from '../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const { farmer, updateFarmer, language, setLanguage, t, loading } = useContext(FarmerContext);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    district: '',
    landAcres: '',
    soilType: 'Loamy',
    waterSource: 'Tubewell',
    category: 'General',
    crops: []
  });

  useEffect(() => {
    if (!loading && farmer && farmer.name && farmer.name !== "New Farmer") {
      router.replace('/home');
    }
  }, [farmer, loading]);

  const handleSave = async () => {
    if (!form.name || !form.district) {
      alert('Please fill at least your name and district to get started!');
      return;
    }
    await updateFarmer(form);
    router.replace('/home');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pa' ? 'hi' : 'pa');
  };

  if (loading || (farmer && farmer.name && farmer.name !== "New Farmer")) return null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroOverlay}>
            <View style={styles.headerRow}>
               <Text style={styles.brand}>KisaanSetu</Text>
               <TouchableOpacity style={styles.langBadge} onPress={toggleLanguage}>
                 <Text style={styles.langText}>{language === 'pa' ? 'ਪੰਜਾਬੀ' : 'हिन्दी'}</Text>
               </TouchableOpacity>
            </View>
            <Text style={styles.heroTitle}>{t.welcome || "Welcome to KisaanSetu"}</Text>
            <Text style={styles.heroSubtitle}>Empowering farmers with AI-driven insights for a sustainable future.</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>{t.setupProfile || "Setup Your Profile"}</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.fullName || "Full Name"}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                onChangeText={(text) => setForm({...form, name: text})} 
                value={form.name} 
                placeholder="Enter your name"
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t.district || "District"}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color={Theme.colors.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                onChangeText={(text) => setForm({...form, district: text})} 
                value={form.district} 
                placeholder="E.g. Ludhiana"
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>{t.landInAcres || "Land (Acres)"}</Text>
              <TextInput 
                style={styles.inputSmall} 
                keyboardType="numeric" 
                onChangeText={(text) => setForm({...form, landAcres: text})} 
                value={form.landAcres} 
                placeholder="5"
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>{t.soilType || "Soil Type"}</Text>
              <TextInput 
                style={styles.inputSmall} 
                onChangeText={(text) => setForm({...form, soilType: text})} 
                value={form.soilType} 
                placeholder="Loamy"
                placeholderTextColor={Theme.colors.textMuted}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <Text style={styles.buttonText}>{t.saveProfile || "Create Account"}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.footerNote}>Your data is securely stored in our encrypted database.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { flexGrow: 1 },
  hero: { 
    height: 280, 
    backgroundColor: Theme.colors.primary,
    justifyContent: 'flex-end'
  },
  heroOverlay: {
    padding: Theme.spacing.lg,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  brand: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1
  },
  langBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Theme.borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  langText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  heroTitle: { 
    color: '#FFF', 
    fontSize: Theme.typography.h1.fontSize, 
    fontWeight: Theme.typography.h1.fontWeight,
    marginBottom: 8
  },
  heroSubtitle: { 
    color: 'rgba(255,255,255,0.7)', 
    fontSize: 14, 
    lineHeight: 20,
    maxWidth: '80%'
  },
  formCard: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    marginTop: -30,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.h2.fontSize,
    fontWeight: Theme.typography.h2.fontWeight,
    color: Theme.colors.text,
    marginBottom: Theme.spacing.lg
  },
  inputGroup: { marginBottom: 20 },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Theme.colors.text, 
    marginBottom: 8,
    marginLeft: 4
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 16,
    ...Theme.colors.cardShadow
  },
  inputIcon: { marginRight: 12 },
  input: { 
    flex: 1, 
    height: 54, 
    fontSize: 16, 
    color: Theme.colors.text 
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  inputSmall: {
    backgroundColor: '#FFF',
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 16,
    color: Theme.colors.text,
    ...Theme.colors.cardShadow
  },
  primaryButton: {
    backgroundColor: Theme.colors.primary,
    height: 60,
    borderRadius: Theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    ...Theme.colors.cardShadow
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '700',
    marginRight: 10
  },
  footerNote: {
    textAlign: 'center',
    color: Theme.colors.textMuted,
    fontSize: 12,
    marginTop: 30,
    marginBottom: 40
  }
});
