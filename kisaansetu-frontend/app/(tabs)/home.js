import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';
import { useApiCall } from '../../hooks/useApiCall';

const { width } = Dimensions.get('window');

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Dynamic Greeting */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t.greeting?.replace('%{name}', farmer.name) || `Sat Sri Akal, ${farmer.name}`}</Text>
          <Text style={styles.date}>{today}</Text>
        </View>
        <TouchableOpacity style={styles.profileCircle}>
          <Ionicons name="person" size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Weather & Tip Widget */}
      {weather ? (
        <View style={styles.weatherWidget}>
          <View style={styles.weatherMain}>
            <Ionicons name="partly-sunny" size={48} color={Theme.colors.accent} />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.temp}>{weather.temperature_celsius}°C</Text>
              <Text style={styles.weatherCond}>{weather.condition}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Text style={styles.weatherTip}>{weather.farming_tip}</Text>
        </View>
      ) : (
        <View style={[styles.weatherWidget, { height: 100, justifyContent: 'center' }]}>
          <Text style={{ textAlign: 'center', color: '#666' }}>Fetching local weather...</Text>
        </View>
      )}

      {/* Critical Actions */}
      <Text style={styles.sectionTitle}>Smart Insights</Text>
      <View style={styles.grid}>
        <TouchableOpacity 
          style={[styles.bigCard, { backgroundColor: Theme.colors.primary }]} 
          onPress={() => navigateTo('disease')}
        >
          <Ionicons name="scan-circle" size={42} color="#FFF" />
          <View style={styles.bigCardText}>
            <Text style={styles.bigCardTitle}>{t.disease || "AI Scan"}</Text>
            <Text style={styles.bigCardSub}>Detect leaf diseases instantly</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>

        <View style={styles.row}>
           <TouchableOpacity style={[styles.smallCard, { backgroundColor: '#FFF' }]} onPress={() => navigateTo('mandi')}>
              <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="bar-chart" size={24} color="#378ADD" />
              </View>
              <Text style={styles.smallCardTitle}>{t.mandi || "Mandi Prices"}</Text>
              <Text style={styles.smallCardSub}>Daily updates</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.smallCard, { backgroundColor: '#FFF' }]} onPress={() => navigateTo('crops')}>
              <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="leaf" size={24} color="#EF9F27" />
              </View>
              <Text style={styles.smallCardTitle}>{t.cropPlan || "Crop Plan"}</Text>
              <Text style={styles.smallCardSub}>Recommendations</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.row}>
           <TouchableOpacity style={[styles.smallCard, { backgroundColor: '#FFF' }]} onPress={() => navigateTo('schemes')}>
              <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="document-text" size={24} color="#1D9E75" />
              </View>
              <Text style={styles.smallCardTitle}>{t.schemes || "Govt Schemes"}</Text>
              <Text style={styles.smallCardSub}>Check eligibility</Text>
           </TouchableOpacity>

           <TouchableOpacity style={[styles.smallCard, { backgroundColor: '#FFF' }]} onPress={() => navigateTo('water')}>
              <View style={[styles.iconBox, { backgroundColor: '#E0F2F1' }]}>
                <Ionicons name="water" size={24} color="#00897B" />
              </View>
              <Text style={styles.smallCardTitle}>{t.water || "Water Usage"}</Text>
              <Text style={styles.smallCardSub}>Smart track</Text>
           </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} /> 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, padding: Theme.spacing.lg },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 60,
    marginBottom: 24
  },
  greeting: { 
    fontSize: Theme.typography.h2.fontSize, 
    fontWeight: '800', 
    color: Theme.colors.text 
  },
  date: { 
    fontSize: 14, 
    color: Theme.colors.textMuted, 
    marginTop: 4 
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.colors.cardShadow
  },
  weatherWidget: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: 20,
    marginBottom: 24,
    ...Theme.colors.cardShadow,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  weatherMain: { flexDirection: 'row', alignItems: 'center' },
  temp: { fontSize: 28, fontWeight: '800', color: Theme.colors.text },
  weatherCond: { fontSize: 16, color: Theme.colors.textMuted, marginTop: -4 },
  divider: { height: 1, backgroundColor: Theme.colors.border, marginVertical: 15 },
  weatherTip: { fontSize: 15, lineHeight: 22, color: Theme.colors.text, fontStyle: 'italic' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Theme.colors.text,
    marginBottom: 16
  },
  grid: { gap: 12 },
  bigCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: 8,
    ...Theme.colors.cardShadow
  },
  bigCardText: { flex: 1, marginLeft: 16 },
  bigCardTitle: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  bigCardSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 2 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  smallCard: {
    flex: 1,
    padding: 16,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: '#FFF',
    ...Theme.colors.cardShadow,
    borderWidth: 1,
    borderColor: Theme.colors.border
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  smallCardTitle: { fontSize: 15, fontWeight: '700', color: Theme.colors.text },
  smallCardSub: { fontSize: 12, color: Theme.colors.textMuted, marginTop: 2 }
});
