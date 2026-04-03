import { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Speech from 'expo-speech';

export default function Crops() {
  const { farmer, t } = useContext(FarmerContext);
  const router = useRouter();
  const { data: crops, loading, error, execute } = useApiCall('/api/crops/recommend');

  useEffect(() => { if (farmer) execute('POST', farmer, 'crops'); }, [farmer]);
  useEffect(() => {
    if (crops && crops.length > 0) {
      Speech.speak(`${t.recommendCrop} ${crops[0].name}. ${crops[0].rationale}`, { language: t.language === 'hi' ? 'hi-IN' : 'pa-IN' });
    }
  }, [crops]);

  if (loading) return <ActivityIndicator style={{flex: 1}} size="large" color="#EF9F27" />;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <ScrollView style={styles.container}>
      {error && <Text style={styles.error}>{t.error}</Text>}
      {crops && crops.map((crop, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={24} color="#1D9E75" />
            <Text style={styles.cropName}>{crop.name}</Text>
          </View>
          <Text style={styles.rationale}>{crop.rationale}</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Profitability:</Text>
            <View style={styles.barContainer}><View style={[styles.barFill, { width: `${crop.profit_score * 10}%`, backgroundColor: '#1D9E75' }]} /></View>
          </View>
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Water Efficiency:</Text>
            <View style={styles.barContainer}><View style={[styles.barFill, { width: `${crop.water_score * 10}%`, backgroundColor: '#378ADD' }]} /></View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendar}>
            {months.map((m, i) => {
              let isActive = crop.sowing_months?.includes(i+1) || crop.harvest_months?.includes(i+1) || false;
              return <View key={i} style={[styles.monthBox, isActive && styles.monthBoxActive]}><Text style={[styles.monthText, isActive && styles.monthTextActive]}>{m}</Text></View>;
            })}
          </ScrollView>
          <TouchableOpacity style={styles.btn} onPress={() => router.push(`/(tabs)/mandi?crop=${crop.name}`)}>
            <Text style={styles.btnText}>{t.seeMandiPrice}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 15 },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 20, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cropName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A2E', marginLeft: 10 },
  rationale: { fontSize: 14, color: '#666', marginBottom: 15 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statLabel: { width: 120, fontSize: 12, color: '#333' },
  barContainer: { flex: 1, height: 10, backgroundColor: '#E0E0E0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%' },
  calendar: { flexDirection: 'row', marginTop: 15, marginBottom: 15 },
  monthBox: { padding: 5, paddingHorizontal: 10, backgroundColor: '#eee', marginRight: 5, borderRadius: 5 },
  monthBoxActive: { backgroundColor: '#EF9F27' },
  monthText: { fontSize: 12, color: '#666' },
  monthTextActive: { color: '#FFF', fontWeight: 'bold' },
  btn: { backgroundColor: '#1D9E75', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  error: { color: '#E24B4A', textAlign: 'center', marginTop: 20 }
});
