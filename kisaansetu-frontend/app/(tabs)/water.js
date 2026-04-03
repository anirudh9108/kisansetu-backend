import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function Water() {
  const { farmer, t } = useContext(FarmerContext);
  const router = useRouter();
  const summaryApi = useApiCall('/api/water/summary');

  useEffect(() => {
    if (farmer?.uid) summaryApi.execute('GET', null, `waterSummary_${farmer.uid}`);
  }, [farmer?.uid]);

  const sum = summaryApi.data;
  const isOveruser = sum && !sum.is_sustainable;
  const weeklyData = [{ x: 'W1', y: 4000 }, { x: 'W2', y: 3000 }, { x: 'W3', y: 5500 }, { x: 'W4', y: sum ? sum.total_litres_this_month / 4 : 2000 }];

  return (
    <View style={styles.container}>
      <ScrollView>
        {summaryApi.loading ? <ActivityIndicator size="large" color="#378ADD" style={{marginTop: 50}}/> : (
          <>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>This Month Total</Text>
              <Text style={styles.amount}>{sum ? sum.total_litres_this_month.toLocaleString() : 0} L</Text>
            </View>

            {sum && sum.saving_litres_vs_benchmark > 0 ? (
              <View style={styles.savedCard}>
                <Ionicons name="checkmark-circle" size={24} color="#1D9E75" />
                <Text style={styles.savedText}>{t.waterSaved} ({(sum.saving_litres_vs_benchmark/1000).toFixed(0)}k L saved vs baseline)</Text>
              </View>
            ) : isOveruser ? (
              <TouchableOpacity style={styles.overuserCard} onPress={() => router.push('/schemes')}>
                <Ionicons name="alert-circle" size={24} color="#E24B4A" />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.overuserTitle}>Over-irrigation Detected</Text>
                  <Text style={styles.overuserText}>{t.dripSubsidy}</Text>
                </View>
              </TouchableOpacity>
            ) : null}

            <View style={styles.chartCard} pointerEvents="none">
              <Text style={styles.chartTitle}>Weekly Usage</Text>
              <VictoryChart theme={VictoryTheme.material} domainPadding={20} height={200}>
                <VictoryAxis />
                <VictoryAxis dependentAxis tickFormat={(x) => `${x/1000}k`} />
                <VictoryBar data={weeklyData} style={{ data: { fill: "#378ADD" } }} />
              </VictoryChart>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
  cardHeader: { backgroundColor: '#378ADD', padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { color: '#E3F2FD', fontSize: 18, fontWeight: 'bold' },
  amount: { color: '#FFF', fontSize: 40, fontWeight: 'bold', marginTop: 10 },
  savedCard: { flexDirection: 'row', backgroundColor: '#E9F7EA', padding: 15, margin: 15, borderRadius: 12, alignItems: 'center' },
  savedText: { color: '#1D9E75', fontWeight: 'bold', marginLeft: 10, flex: 1 },
  overuserCard: { flexDirection: 'row', backgroundColor: '#FFCDD2', padding: 15, margin: 15, borderRadius: 12, alignItems: 'center' },
  overuserTitle: { color: '#E24B4A', fontWeight: 'bold', fontSize: 16 },
  overuserText: { color: '#E24B4A', marginTop: 5 },
  chartCard: { backgroundColor: '#FFF', margin: 15, padding: 15, borderRadius: 12, elevation: 2, alignItems: 'center' },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', alignSelf: 'flex-start' }
});
