import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Theme } from '../../constants/theme';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Mandi() {
  const { farmer } = useContext(FarmerContext);
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const { data: mandiData, loading, execute } = useApiCall('/api/mandi/prices');

  useEffect(() => {
    execute('GET', null, `crop=${selectedCrop}&district=${farmer?.district || 'Ludhiana'}`);
  }, [selectedCrop]);

  const crops = [
    { id: 'wheat', icon: '🌾', label: 'Wheat' },
    { id: 'paddy', icon: '🌾', label: 'Paddy' },
    { id: 'maize', icon: '🌽', label: 'Maize' },
    { id: 'cotton', icon: '🌿', label: 'Cotton' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Mandi Rates</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, marginHorizontal: -24, paddingHorizontal: 24 }} contentContainerStyle={{paddingRight:48}}>
          {crops.map(c => (
            <TouchableOpacity key={c.id} style={[styles.cropTab, selectedCrop === c.id && styles.cropTabAct]} onPress={() => setSelectedCrop(c.id)} activeOpacity={0.8}>
               <Text style={styles.cropTabEmoji}>{c.icon}</Text>
               <Text style={[styles.cropTabT, selectedCrop === c.id && styles.cropTabTAct]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <LinearGradient colors={Theme.colors.gradientAccent} style={styles.alertCard}>
           <View style={styles.alertIconBg}>
              <Ionicons name="trending-up" size={24} color={Theme.colors.secondary} />
           </View>
           <View style={{flex: 1}}>
              <Text style={styles.alertTitle}>Market Insight</Text>
              <Text style={styles.alertDesc}>{mandiData?.bestSellWindow?.recommendation || 'Prices are expected to rise. Hold stock if possible.'}</Text>
           </View>
        </LinearGradient>

        <Text style={styles.sectionHeading}>Nearby Markets</Text>

        {loading ? <ActivityIndicator size="large" color={Theme.colors.primary} /> : 
          (mandiData?.mandis || [
            {name: 'Ludhiana Main', distance: '4km', todayPrice: 2125, yesterdayPrice: 2100, trend: 'up'},
            {name: 'Sahnewal Mandi', distance: '12km', todayPrice: 2110, yesterdayPrice: 2130, trend: 'down'}
          ]).map((m, i) => {
            const isUp = m.trend === 'up';
            return (
              <View key={i} style={styles.marketCard}>
                 <View style={{flex: 1}}>
                    <Text style={styles.mName}>{m.name}</Text>
                    <View style={styles.mDistWrap}>
                       <Ionicons name="location" size={14} color={Theme.colors.textMuted} />
                       <Text style={styles.mDistT}>{m.distance}</Text>
                    </View>
                 </View>
                 <View style={{alignItems: 'flex-end'}}>
                    <Text style={styles.mPrice}>₹{m.todayPrice}</Text>
                    <View style={[styles.trendPill, {backgroundColor: isUp ? Theme.colors.successLight : Theme.colors.errorLight}]}>
                       <Ionicons name={isUp ? "arrow-up" : "arrow-down"} size={12} color={isUp ? Theme.colors.primaryDark : Theme.colors.danger} />
                       <Text style={[styles.trendT, {color: isUp ? Theme.colors.primaryDark : Theme.colors.danger}]}>₹{Math.abs(m.todayPrice - m.yesterdayPrice)}</Text>
                    </View>
                 </View>
              </View>
            )
        })}

        <View style={{height: 120}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { paddingTop: Platform.OS === 'android' ? 64 : 24, paddingHorizontal: 24, paddingBottom: 16 },
  pageTitle: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary },
  scrollContent: { paddingHorizontal: 24 },
  
  cropTab: { backgroundColor: Theme.colors.surfaceContainerHigh, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 24, marginRight: 12, flexDirection: 'row', alignItems: 'center' },
  cropTabAct: { backgroundColor: Theme.colors.primaryLight },
  cropTabEmoji: { fontSize: 20, marginRight: 8 },
  cropTabT: { fontSize: 16, fontWeight: '700', color: Theme.colors.textSecondary },
  cropTabTAct: { color: Theme.colors.primaryDark, fontWeight: '800' },

  alertCard: { borderRadius: Theme.borderRadius.xxl, padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 32, ...Theme.shadows.ambient },
  alertIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  alertTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  alertDesc: { fontSize: 14, color: 'rgba(255,255,255,0.9)', lineHeight: 20, fontWeight: '600' },

  sectionHeading: { fontSize: 20, fontWeight: '800', color: Theme.colors.textPrimary, marginBottom: 16 },
  marketCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl, padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 16, ...Theme.shadows.card },
  mName: { fontSize: 18, fontWeight: '800', color: Theme.colors.textPrimary, marginBottom: 6 },
  mDistWrap: { flexDirection: 'row', alignItems: 'center' },
  mDistT: { marginLeft: 4, fontSize: 14, color: Theme.colors.textSecondary, fontWeight: '600' },
  mPrice: { fontSize: 24, fontWeight: '800', color: Theme.colors.textPrimary, marginBottom: 6 },
  trendPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  trendT: { fontSize: 13, fontWeight: '800', marginLeft: 4 }
});
