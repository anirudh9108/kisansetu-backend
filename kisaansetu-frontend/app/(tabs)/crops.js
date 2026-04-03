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
  const { data, loading, error, execute } = useApiCall('/api/crops/recommend');

  useEffect(() => { 
    if (farmer) {
      // Send necessary context for recommendation
      execute('POST', {
        uid: farmer.uid,
        soilType: farmer.soilType || 'Loamy',
        waterSource: farmer.waterSource || 'Tube Well',
        month: new Date().getMonth() + 1
      }, 'crops'); 
    } 
  }, [farmer]);

  const crops = data?.recommendations || [];

  useEffect(() => {
    if (crops && crops.length > 0) {
      Speech.speak(`${t.recommendCrop || 'We recommend'} ${crops[0].crop}. ${crops[0].rationale}`, { 
        language: t.language === 'hi' ? 'hi-IN' : 'pa-IN' 
      });
    }
  }, [crops]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#1D9E75" />
      <Text style={styles.loadingText}>Analyzing soil and weather...</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {error && <Text style={styles.error}>{t.error || 'Failed to get recommendations'}</Text>}
      {crops.length > 0 ? crops.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="leaf" size={24} color="#1D9E75" />
            <Text style={styles.cropName}>{item.crop}</Text>
          </View>
          
          <Text style={styles.rationale}>{item.rationale}</Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.statLabel}>Profit Potential:</Text>
            <View style={styles.barContainer}>
              <View style={[styles.barFill, { width: `${item.profitScore}%`, backgroundColor: '#1D9E75' }]} />
            </View>
            <Text style={styles.statValue}>{item.profitScore}%</Text>
          </View>

          <TouchableOpacity 
            style={styles.btn} 
            onPress={() => router.push(`/(tabs)/mandi?crop=${item.crop}`)}
          >
            <Text style={styles.btnText}>{t.seeMandiPrice || 'Check Mandi Prices'}</Text>
          </TouchableOpacity>
        </View>
      )) : !loading && (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={50} color="#666" />
          <Text style={styles.emptyText}>No recommendations found for current settings.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAF5' },
  loadingText: { marginTop: 15, color: '#1D9E75', fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  cropName: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginLeft: 10 },
  rationale: { fontSize: 15, color: '#555', marginBottom: 20, lineHeight: 22, fontStyle: 'italic' },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statLabel: { width: 100, fontSize: 13, color: '#333', fontWeight: '600' },
  barContainer: { flex: 1, height: 12, backgroundColor: '#E0E0E0', borderRadius: 6, overflow: 'hidden', marginHorizontal: 10 },
  barFill: { height: '100%' },
  statValue: { width: 35, fontSize: 13, fontWeight: 'bold', color: '#1A1A2E' },
  btn: { backgroundColor: '#1D9E75', padding: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  error: { color: '#E24B4A', textAlign: 'center', marginTop: 20 },
  emptyState: { padding: 50, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#666', marginTop: 10, fontSize: 16 }
});
