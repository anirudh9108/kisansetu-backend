import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import * as Speech from 'expo-speech';
import * as WebBrowser from 'expo-web-browser';

export default function Schemes() {
  const { farmer, t } = useContext(FarmerContext);
  const { data: schemes, loading, error, execute } = useApiCall('/api/schemes/eligible');
  const [filter, setFilter] = useState('All');

  useEffect(() => { if (farmer) execute('POST', farmer, 'schemes'); }, [farmer]);
  useEffect(() => { if (schemes && schemes.length > 0) Speech.speak(t.schemesFound, { language: t.language === 'hi' ? 'hi-IN' : 'pa-IN' }); }, [schemes]);

  const openLink = async (url) => await WebBrowser.openBrowserAsync(url || 'https://agricoop.nic.in/');
  const filtered = schemes ? schemes.filter(s => filter === 'All' || s.type === filter) : [];

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#1D9E75" />;

  return (
    <View style={styles.container}>
      <View style={styles.chips}>
        {['All', 'Central', 'Punjab', 'Subsidy'].map(f => (
          <TouchableOpacity key={f} style={[styles.chip, filter === f && styles.chipActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView>
        {error && <Text style={styles.error}>{t.error}</Text>}
        {filtered.length === 0 && !error ? <Text style={styles.empty}>{t.noSchemes}</Text> : (
          filtered.map((scheme, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.title}>{scheme.name}</Text>
              <Text style={styles.benefit}>{scheme.benefit_amount}</Text>
              <Text style={styles.desc} numberOfLines={2}>{scheme.description}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => openLink(scheme.apply_url)}>
                <Text style={styles.btnText}>{t.apply}</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 15 },
  chips: { flexDirection: 'row', marginBottom: 15 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E0E0E0', marginRight: 10 },
  chipActive: { backgroundColor: '#1D9E75' },
  chipText: { color: '#333' },
  chipTextActive: { color: '#FFF' },
  card: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#1A1A2E' },
  benefit: { color: '#1D9E75', fontWeight: 'bold', marginVertical: 5 },
  desc: { color: '#666', marginBottom: 10 },
  btn: { backgroundColor: '#EF9F27', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' },
  error: { textAlign: 'center', color: '#E24B4A', marginTop: 20 }
});
