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
    if (farmer?.uid) {
        summaryApi.execute('GET', null, `waterSummary_${farmer.uid}`);
    }
  }, [farmer?.uid]);

  const sum = summaryApi.data;
  
  // Alignment with backend response:
  // sum.totalSeason
  // sum.sustainabilityScore
  // sum.vsNeighborPercent
  // sum.monthlyUsage: [{month, litres}]

  const totalLitres = sum?.totalSeason || 0;
  const isSustainable = (sum?.sustainabilityScore || 50) > 60;
  
  const chartData = sum?.monthlyUsage?.map((m, i) => ({
    x: m.month.split('-')[1], // Just the month number
    y: m.litres
  })) || [{ x: 'Now', y: totalLitres }];

  return (
    <View style={styles.container}>
      <ScrollView>
        {summaryApi.loading ? (
          <ActivityIndicator size="large" color="#378ADD" style={{marginTop: 50}}/>
        ) : (
          <>
            <View style={[styles.cardHeader, { backgroundColor: isSustainable ? '#1D9E75' : '#378ADD' }]}>
              <Text style={styles.title}>Season Total Usage</Text>
              <Text style={styles.amount}>{totalLitres.toLocaleString()} L</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>Sustainability Score: {sum?.sustainabilityScore || 50}/100</Text>
              </View>
            </View>

            {sum?.vsNeighborPercent > 0 ? (
              <View style={styles.savedCard}>
                <Ionicons name="leaf" size={24} color="#1D9E75" />
                <Text style={styles.savedText}>
                  You are using {sum.vsNeighborPercent}% less water than the regional average for your crops!
                </Text>
              </View>
            ) : !isSustainable ? (
              <TouchableOpacity style={styles.overuserCard} onPress={() => router.push('/schemes')}>
                <Ionicons name="alert-circle" size={24} color="#E24B4A" />
                <View style={{flex: 1, marginLeft: 10}}>
                  <Text style={styles.overuserTitle}>Efficiency Tip</Text>
                  <Text style={styles.overuserText}>
                    Your usage is above average. Check out available subsidies for Drip Irrigation.
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}

            <View style={styles.chartCard} pointerEvents="none">
              <Text style={styles.chartTitle}>Monthly Water Consumption</Text>
              {chartData.length > 0 ? (
                <VictoryChart domainPadding={20} height={200}>
                    <VictoryAxis label="Month" style={{ axisLabel: { padding: 30 } }} />
                    <VictoryAxis dependentAxis tickFormat={(x) => `${x/1000}k`} />
                    <VictoryBar data={chartData} style={{ data: { fill: isSustainable ? "#1D9E75" : "#378ADD" } }} />
                </VictoryChart>
              ) : (
                <Text style={{ marginVertical: 20, color: '#666' }}>No usage data recorded yet.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
  cardHeader: { padding: 30, alignItems: 'center', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  title: { color: '#E3F2FD', fontSize: 18, fontWeight: 'bold' },
  amount: { color: '#FFF', fontSize: 40, fontWeight: 'bold', marginTop: 10 },
  scoreBadge: { marginTop: 10, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  scoreText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  savedCard: { flexDirection: 'row', backgroundColor: '#E8F5E9', padding: 18, margin: 15, borderRadius: 15, alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#1D9E75' },
  savedText: { color: '#2E7D32', fontWeight: 'bold', marginLeft: 12, flex: 1, lineHeight: 20 },
  overuserCard: { flexDirection: 'row', backgroundColor: '#FFF5F5', padding: 18, margin: 15, borderRadius: 15, alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#E24B4A' },
  overuserTitle: { color: '#E24B4A', fontWeight: 'bold', fontSize: 16 },
  overuserText: { color: '#C62828', marginTop: 5, fontSize: 14 },
  chartCard: { backgroundColor: '#FFF', margin: 15, padding: 20, borderRadius: 15, elevation: 3, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', alignSelf: 'flex-start', marginBottom: 10 }
});
