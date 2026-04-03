import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function Mandi() {
  const { farmer, t } = useContext(FarmerContext);
  const params = useLocalSearchParams();
  const { data: mandiData, loading, error, execute } = useApiCall('/api/mandi/prices');
  
  const [selectedCrop, setSelectedCrop] = useState(params.crop || 'Wheat');

  useEffect(() => { if (farmer?.district) execute('GET', null, `mandi_${selectedCrop}`); }, [farmer, selectedCrop]);

  const handleAlert = () => alert(t.alertSet);
  const crops = ['Wheat', 'Paddy', 'Maize', 'Cotton', 'Mustard'];
  const trendData = [{ x: 1, y: 2100 }, { x: 2, y: 2150 }, { x: 3, y: 2140 }, { x: 4, y: 2180 }, { x: 5, y: 2200 }, { x: 6, y: 2250 }, { x: 7, y: 2275 }];

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipContainer}>
        {crops.map(c => (
           <TouchableOpacity key={c} style={[styles.chip, selectedCrop === c && styles.chipActive]} onPress={() => setSelectedCrop(c)}>
             <Text style={[styles.chipText, selectedCrop === c && styles.chipTextActive]}>{c}</Text>
           </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? <ActivityIndicator size="large" color="#378ADD" style={{marginTop: 50}}/> : error ? <Text style={styles.error}>{t.error}</Text> : (
        <>
          {mandiData && Array.isArray(mandiData) && mandiData.length > 0 ? mandiData.slice(0,3).map((mandi, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.mandiName}>{mandi.mandi || mandi.market}</Text>
                <Ionicons name="arrow-up" size={24} color="#1D9E75" />
              </View>
              <Text style={styles.priceLabel}>{t.todayPrice}</Text>
              <Text style={styles.price}>₹{mandi.modal_price || mandi.price || 2275}</Text>
            </View>
          )) : (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.mandiName}>{farmer?.district || 'Local'} Mandi</Text>
                <Ionicons name="arrow-up" size={24} color="#1D9E75" />
              </View>
              <Text style={styles.priceLabel}>{t.todayPrice}</Text>
              <Text style={styles.price}>₹2275</Text>
            </View>
          )}

          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>7-Day Trend ({selectedCrop})</Text>
            <View pointerEvents="none" style={{alignItems: 'center', marginLeft: -20}}>
              <VictoryChart theme={VictoryTheme.material} height={200} padding={{ top: 20, bottom: 40, left: 60, right: 20 }}>
                <VictoryAxis tickFormat={(t) => `Day ${Math.floor(t)}`} style={{tickLabels: {fontSize: 10}}} />
                <VictoryAxis dependentAxis tickFormat={(x) => `₹${x}`} style={{tickLabels: {fontSize: 10}}}/>
                <VictoryLine data={trendData} style={{ data: { stroke: "#378ADD", strokeWidth: 3 } }} />
              </VictoryChart>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 15 },
  chipContainer: { flexDirection: 'row', marginBottom: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#E0E0E0', borderRadius: 20, marginRight: 10 },
  chipActive: { backgroundColor: '#378ADD' },
  chipText: { color: '#333', fontWeight: 'bold' },
  chipTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mandiName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  priceLabel: { fontSize: 14, color: '#666', marginTop: 10 },
  price: { fontSize: 32, fontWeight: 'bold', color: '#1D9E75', marginTop: 5 },
  chartCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 10 },
  error: { color: '#E24B4A', textAlign: 'center', marginTop: 20 }
});
