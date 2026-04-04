import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, Image } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Theme } from '../../constants/theme';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function Home() {
  const { farmer, t, language, setLanguage } = useContext(FarmerContext);
  const { data: weatherData, execute: fetchWeather } = useApiCall('/api/weather/current');

  useEffect(() => {
    fetchWeather('GET', null, farmer?.district || 'Ludhiana');
  }, []);

  const modules = [
    { id: 'schemes', icon: '📋', name: t.mod_schemes, sub: t.sub_schemes, gradient: Theme.colors.gradientPrimary },
    { id: 'crops', icon: '🌱', name: t.mod_crops, sub: t.sub_crops, gradient: Theme.colors.gradientAccent },
    { id: 'disease', icon: '🔬', name: t.mod_disease, sub: t.sub_disease, gradient: ['#EF4444', '#B91C1C'] },
    { id: 'mandi', icon: '📊', name: t.mod_mandi, sub: t.sub_mandi, gradient: Theme.colors.gradientBlue },
    { id: 'water', icon: '💧', name: t.mod_water, sub: t.sub_water, gradient: ['#06B6D4', '#0891B2'] }
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header - Editorial Style */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarInner}>
              <Ionicons name="person" size={24} color={Theme.colors.primaryDark} />
            </View>
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.greetingTitle}>Namaste, {farmer?.name || 'Suresh'}!</Text>
            <Text style={styles.dateSub}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>
          <View style={styles.langSwitch}>
            <TouchableOpacity onPress={() => setLanguage('pa')} style={language==='pa'?styles.langAct:styles.langDef}><Text style={language==='pa'?styles.langTAct:styles.langTDef}>ਪੰ</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setLanguage('hi')} style={language==='hi'?styles.langAct:styles.langDef}><Text style={language==='hi'?styles.langTAct:styles.langTDef}>हि</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setLanguage('en')} style={language==='en'?styles.langAct:styles.langDef}><Text style={language==='en'?styles.langTAct:styles.langTDef}>EN</Text></TouchableOpacity>
          </View>
        </View>

        {/* Premium Weather Overlay */}
        <View style={styles.weatherWrapper}>
          <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.weatherCard}>
             <View style={styles.weatherContent}>
               <View>
                 <Text style={styles.weatherTemp}>{weatherData?.temp || 28}°C</Text>
                 <Text style={styles.weatherCond}>{weatherData?.condition || 'Haze'}</Text>
                 <View style={styles.weatherPill}>
                    <Text style={styles.weatherPillText}>Rain likely by 4 PM</Text>
                 </View>
               </View>
               <View style={styles.weatherIconHuge}>
                  <Text style={{fontSize: 64}}>{weatherData?.condition === 'Rain' ? '🌧️' : '☀️'}</Text>
               </View>
             </View>
          </LinearGradient>
        </View>

        {/* Floating Quick Stats - Off-white Glassmorphism */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: Theme.colors.primaryLight }]}>
              <Ionicons name="document-text" size={24} color={Theme.colors.primary} />
            </View>
            <Text style={styles.statVal}>05 New</Text>
            <Text style={styles.statLabel}>Eligible Schemes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBg, { backgroundColor: Theme.colors.secondaryLight }]}>
              <Ionicons name="trending-up" size={24} color={Theme.colors.secondary} />
            </View>
            <Text style={styles.statVal}>₹2,125/qtl</Text>
            <Text style={styles.statLabel}>Wheat Mandi Price</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>Agricultural Tools</Text>

        {/* Highly Padded Service Grid */}
        <View style={styles.grid}>
          {modules.map(mod => (
            <TouchableOpacity 
              key={mod.id} 
              style={styles.modItem}
              onPress={() => router.push(`/(tabs)/${mod.id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.modIconContainer}>
                <LinearGradient colors={mod.gradient} style={styles.modIconGrad}>
                  <Text style={styles.modIconEmoji}>{mod.icon}</Text>
                </LinearGradient>
              </View>
              <Text style={styles.modName}>{mod.name}</Text>
              <Text style={styles.modSub} numberOfLines={2}>{mod.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Smart Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipLeft}>
             <Ionicons name="bulb" size={28} color={Theme.colors.secondary} />
          </View>
          <View style={{flex:1}}>
             <Text style={styles.tipTitle}>Smart Advisory</Text>
             <Text style={styles.tipBody}>Due to high humidity today, hold off on pesticide spray until tomorrow morning.</Text>
          </View>
        </View>
        
        <View style={{height: 120}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Theme.colors.background },
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 64 : 24, paddingBottom: 24, flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: Theme.colors.surfaceContainerHigh, padding: 4 },
  avatarInner: { flex: 1, borderRadius: 24, backgroundColor: Theme.colors.primaryLight, justifyContent: 'center', alignItems: 'center' },
  headerTextWrap: { flex: 1, marginLeft: 16 },
  greetingTitle: { ...Theme.typography.h1, fontSize: 24, color: Theme.colors.textPrimary },
  dateSub: { fontSize: 14, color: Theme.colors.textSecondary, fontWeight: '600', marginTop: 2 },
  langSwitch: { flexDirection: 'row', backgroundColor: Theme.colors.surfaceContainerLow, borderRadius: 32, padding: 4 },
  langDef: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  langAct: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Theme.colors.surfaceContainerHighest },
  langTDef: { color: Theme.colors.textMuted, fontWeight: '800', fontSize: 12 },
  langTAct: { color: Theme.colors.primaryDark, fontWeight: '800', fontSize: 12 },
  
  weatherWrapper: { paddingHorizontal: 24, marginBottom: 16 },
  weatherCard: { borderRadius: Theme.borderRadius.xxl, padding: 32, ...Theme.shadows.float },
  weatherContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  weatherTemp: { ...Theme.typography.h1, fontSize: 48, color: '#FFF' },
  weatherCond: { fontSize: 20, color: 'rgba(255,255,255,0.9)', fontWeight: '700', marginTop: 4, marginBottom: 16 },
  weatherPill: { backgroundColor: 'rgba(0,0,0,0.15)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  weatherPillText: { color: '#FFF', fontWeight: '800', fontSize: 13 },
  weatherIconHuge: { right: -10 },

  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 32 },
  statCard: { flex: 1, marginHorizontal: 8, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl, padding: 20, ...Theme.shadows.card },
  statIconBg: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statVal: { ...Theme.typography.h2, fontSize: 20, color: Theme.colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 13, color: Theme.colors.textSecondary, fontWeight: '600' },

  sectionHeading: { ...Theme.typography.h2, fontSize: 22, color: Theme.colors.textPrimary, marginHorizontal: 24, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginBottom: 16 },
  modItem: { width: '45%', marginHorizontal: '2.5%', marginBottom: 24, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl, padding: 24, alignItems: 'flex-start', ...Theme.shadows.ambient },
  modIconContainer: { width: 56, height: 56, borderRadius: 20, marginBottom: 16, overflow: 'hidden' },
  modIconGrad: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modIconEmoji: { fontSize: 28 },
  modName: { ...Theme.typography.h3, fontSize: 16, color: Theme.colors.textPrimary, marginBottom: 6 },
  modSub: { fontSize: 13, color: Theme.colors.textSecondary, lineHeight: 18, fontWeight: '500' },
  
  tipCard: { marginHorizontal: 24, backgroundColor: Theme.colors.surfaceContainerLow, borderRadius: Theme.borderRadius.xl, padding: 24, flexDirection: 'row', alignItems: 'center', ...Theme.shadows.ambient },
  tipLeft: { width: 56, height: 56, borderRadius: 28, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: 16, ...Theme.shadows.card },
  tipTitle: { fontSize: 15, fontWeight: '800', color: Theme.colors.secondary, marginBottom: 4 },
  tipBody: { fontSize: 14, color: Theme.colors.textSecondary, lineHeight: 22, fontWeight: '600' }
});
