
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FarmerContext } from '../contexts/FarmerContext';
import { router } from 'expo-router';
import { Theme } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding() {
  const { t, language, setLanguage, updateFarmer } = useContext(FarmerContext);
  const [form, setForm] = useState({
    name: '',
    district: '',
    landSize: '',
    soilType: '',
    waterSource: '',
    crops: []
  });

  const handleStart = async () => {
    await updateFarmer(form);
    router.replace('/(tabs)/home');
  };

  const selectSoil = (type) => setForm({...form, soilType: type});
  const toggleCrop = (crop) => {
    const crops = form.crops.includes(crop) 
      ? form.crops.filter(c => c !== crop)
      : [...form.crops, crop];
    setForm({...form, crops});
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={[Theme.colors.primary, Theme.colors.primaryDark]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logoText}>{t.onboarding_title}</Text>
          <TouchableOpacity style={styles.langPill} onPress={() => setLanguage(language === 'pa' ? 'hi' : 'pa')}>
            <Text style={styles.langText}>{language === 'pa' ? 'ਪੰਜਾਬੀ' : 'हिंदी'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.tagline}>{t.onboarding_tagline}</Text>
        <Text style={styles.emojiRow}>🌾 🚜 🌿</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.your_info}</Text>
        <TextInput 
          style={styles.input} 
          placeholder={t.full_name} 
          value={form.name} 
          onChangeText={v => setForm({...form, name: v})}
        />
        <TextInput 
          style={styles.input} 
          placeholder={t.district} 
          value={form.district} 
          onChangeText={v => setForm({...form, district: v})}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t.land_soil}</Text>
        <TextInput 
          style={styles.input} 
          placeholder={t.land_acres} 
          keyboardType="numeric"
          value={form.landSize}
          onChangeText={v => setForm({...form, landSize: v})}
        />
        <Text style={styles.label}>{t.soil_type}</Text>
        <View style={styles.grid}>
          {['loamy', 'sandy', 'clay'].map(type => (
            <TouchableOpacity 
              key={type} 
              style={[styles.soilCard, form.soilType === type && styles.selected]}
              onPress={() => selectSoil(type)}
            >
              <Text>{t[`soil_${type}`]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
        <Text style={styles.btnText}>{t.get_started}</Text>
      </TouchableOpacity>
      <View style={{height: 100}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { padding: 40, paddingTop: 60, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoText: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },
  tagline: { color: '#FFF', fontSize: 16, marginTop: 8 },
  emojiRow: { fontSize: 32, marginTop: 20 },
  langPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  langText: { color: '#FFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', margin: 20, padding: 20, borderRadius: 20, ...Theme.shadows.card },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: Theme.colors.primaryDark },
  input: { height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 10 },
  grid: { flexDirection: 'row', gap: 10 },
  soilCard: { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', alignItems: 'center' },
  selected: { borderColor: Theme.colors.primary, backgroundColor: '#E8F5E9' },
  primaryBtn: { backgroundColor: Theme.colors.primary, margin: 20, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});
