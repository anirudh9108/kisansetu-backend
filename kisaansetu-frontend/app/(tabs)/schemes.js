import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Linking, ActivityIndicator, Platform } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Theme } from '../../constants/theme';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Schemes() {
  const { t, farmer } = useContext(FarmerContext);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: schemesData, loading, execute } = useApiCall('/api/schemes/eligible');

  useEffect(() => {
    execute('POST', { category: farmer?.category || 'General', landAcres: 5.0, state: 'Punjab' });
  }, [farmer]);

  const filters = [
    { id: 'all', label: 'All Schemes' },
    { id: 'central', label: 'Central Govt' },
    { id: 'state', label: 'State Govt' },
    { id: 'insurance', label: 'Insurance' }
  ];

  const visibleSchemes = schemesData?.schemes || Array(4).fill({name:"PM-Kisan Samman Nidhi", state:"Central", description:"Financial support of ₹6000 per year.", benefit:"₹6000/yr"});

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Government Schemes</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Theme.colors.textMuted} style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search policies and subsidies..." placeholderTextColor={Theme.colors.textMuted} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity key={f.id} style={[styles.filterPill, filter === f.id && styles.activePill]} onPress={() => setFilter(f.id)}>
              <Text style={[styles.filterT, filter === f.id && styles.activePillT]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {visibleSchemes.map((s, i) => (
          <View key={i} style={styles.card}>
             <View style={styles.cardTop}>
                <View style={[styles.tag, {backgroundColor: s.state==='Central' ? Theme.colors.layer2 : Theme.colors.primaryLight}]}>
                   <Text style={[styles.tagT, {color: s.state==='Central' ? Theme.colors.textSecondary : Theme.colors.primaryDark}]}>{s.state} Govt</Text>
                </View>
                <TouchableOpacity><Ionicons name="bookmark-outline" size={22} color={Theme.colors.textMuted}/></TouchableOpacity>
             </View>
             <Text style={styles.sTitle}>{s.name}</Text>
             <Text style={styles.sDesc}>{s.description}</Text>
             <View style={styles.benefitContainer}>
                <Ionicons name="leaf" size={18} color={Theme.colors.primary} />
                <Text style={styles.benefitT}>{s.benefit}</Text>
             </View>
             <TouchableOpacity style={styles.applyBtnWrap} activeOpacity={0.8}>
                <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.applyBtn}>
                   <Text style={styles.applyBtnT}>Apply Now</Text>
                   <Ionicons name="arrow-forward" size={18} color="#FFF" />
                </LinearGradient>
             </TouchableOpacity>
          </View>
        ))}
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { paddingTop: Platform.OS === 'android' ? 64 : 24, backgroundColor: Theme.colors.background, paddingBottom: 16 },
  pageTitle: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary, marginHorizontal: 24, marginBottom: 20 },
  searchBar: { marginHorizontal: 24, backgroundColor: Theme.colors.surfaceContainerHigh, borderRadius: 20, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, marginBottom: 20, ...Theme.shadows.ambient },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: Theme.colors.textPrimary, fontWeight: '600', height: '100%' },
  filterRow: { paddingHorizontal: 24, gap: 12 },
  filterPill: { backgroundColor: Theme.colors.surfaceContainerLow, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  activePill: { backgroundColor: Theme.colors.primary },
  filterT: { fontSize: 14, fontWeight: '700', color: Theme.colors.textSecondary },
  activePillT: { color: '#FFF' },
  scrollContent: { padding: 24 },
  card: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xxl, padding: 24, marginBottom: 24, ...Theme.shadows.card },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  tagT: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' },
  sTitle: { ...Theme.typography.h2, fontSize: 22, color: Theme.colors.textPrimary, marginBottom: 12, lineHeight: 30 },
  sDesc: { fontSize: 15, color: Theme.colors.textSecondary, lineHeight: 24, fontWeight: '500', marginBottom: 20 },
  benefitContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surfaceContainerLow, padding: 16, borderRadius: 16, marginBottom: 24 },
  benefitT: { marginLeft: 12, fontSize: 15, fontWeight: '800', color: Theme.colors.primaryDark },
  applyBtnWrap: { borderRadius: 24, overflow: 'hidden' },
  applyBtn: { paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  applyBtnT: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
