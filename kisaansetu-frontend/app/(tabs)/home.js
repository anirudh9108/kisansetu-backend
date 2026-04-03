import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Ionicons } from '@expo/vector-icons';
import { useApiCall } from '../../hooks/useApiCall';

export default function Home() {
  const { farmer, t, loading } = useContext(FarmerContext);
  const router = useRouter();
  const weatherApi = useApiCall('/api/weather/current');

  useEffect(() => {
    if (farmer?.district) weatherApi.execute('GET', null, `weather_${farmer.district}`);
  }, [farmer?.district]);

  const navigateTo = (path) => router.push(`/(tabs)/${path}`);

  if (loading || !farmer) return null;

  const today = new Date().toLocaleDateString(t.language === 'hi' ? 'hi-IN' : 'pa-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const weather = weatherApi.data;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>{t.greeting?.replace('%{name}', farmer.name) || ''}</Text>
      <Text style={styles.date}>{today}</Text>

      {weather && (
        <View style={styles.weatherCard}>
          <Ionicons name="partly-sunny" size={32} color="#EF9F27" />
          <View style={{ marginLeft: 15, flex: 1 }}>
            <Text style={styles.temp}>{weather.temperature_celsius}°C - {weather.condition}</Text>
            <Text style={styles.tip}>{weather.farming_tip}</Text>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        <TouchableOpacity style={[styles.card, { backgroundColor: '#e9f7ea' }]} onPress={() => navigateTo('schemes')}>
          <Ionicons name="document-text" size={40} color="#1D9E75" />
          <Text style={styles.cardText}>{t.schemes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#fff3e0' }]} onPress={() => navigateTo('crops')}>
          <Ionicons name="leaf" size={40} color="#EF9F27" />
          <Text style={styles.cardText}>{t.cropPlan}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#ffebee' }]} onPress={() => navigateTo('disease')}>
          <Ionicons name="scan-circle" size={40} color="#E24B4A" />
          <Text style={styles.cardText}>{t.disease}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#e3f2fd' }]} onPress={() => navigateTo('mandi')}>
          <Ionicons name="stats-chart" size={40} color="#378ADD" />
          <Text style={styles.cardText}>{t.mandi}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: '#e0f2f1' }]} onPress={() => navigateTo('water')}>
          <Ionicons name="water" size={40} color="#00897B" />
          <Text style={styles.cardText}>{t.water}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E', marginTop: 10 },
  date: { fontSize: 16, color: '#666', marginBottom: 20 },
  weatherCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 20, borderRadius: 12, marginBottom: 25, elevation: 2, alignItems: 'center' },
  temp: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  tip: { fontSize: 14, color: '#1D9E75', marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, elevation: 1 },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#1A1A2E', textAlign: 'center' }
});
