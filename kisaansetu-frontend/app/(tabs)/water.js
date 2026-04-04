import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Water() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Water Dashboard</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Deep Embedded Circular Gauge */}
        <View style={styles.gaugeRoot}>
          <View style={styles.gaugeOuter}>
             <View style={styles.gaugeTrack}>
                <View style={styles.gaugeInner}>
                   <Ionicons name="water" size={32} color={Theme.colors.gradientBlue[0]} style={{marginBottom: 8}} />
                   <Text style={styles.gaugeVal}>12.4k</Text>
                   <Text style={styles.gaugeUnit}>Litres Consumed</Text>
                </View>
             </View>
          </View>
        </View>

        {/* Tonal Comparison Cards */}
        <View style={styles.compRow}>
           <View style={styles.compCard}>
              <View style={styles.compIndicator} />
              <Text style={styles.compL}>Your Farm</Text>
              <Text style={styles.compV}>12,400 L</Text>
           </View>
           <View style={[styles.compCard, {backgroundColor: Theme.colors.errorLight}]}>
              <View style={[styles.compIndicator, {backgroundColor: Theme.colors.danger}]} />
              <Text style={styles.compL}>Avg Farm</Text>
              <Text style={[styles.compV, {color: Theme.colors.error}]}>45,000 L</Text>
           </View>
        </View>

        {/* Premium Action Banner */}
        <LinearGradient colors={Theme.colors.gradientBlue} start={{x:0,y:0}} end={{x:1,y:1}} style={styles.actionBanner}>
           <View style={styles.abLeft}>
              <Text style={styles.abTitle}>Save 40% Water</Text>
              <Text style={styles.abSub}>Install Drip Irrigation</Text>
           </View>
           <TouchableOpacity style={styles.abBtn} activeOpacity={0.8}>
              <Text style={styles.abBtnT}>Apply</Text>
           </TouchableOpacity>
        </LinearGradient>

        <Text style={styles.sectionHeading}>Recent Logs</Text>
        
        <View style={styles.logCard}>
           <View style={styles.logIconBox}><Ionicons name="water" size={20} color={Theme.colors.gradientBlue[0]}/></View>
           <View style={{flex: 1}}>
              <Text style={styles.logTitle}>Wheat Field - Sector A</Text>
              <Text style={styles.logDate}>Today, 08:00 AM</Text>
           </View>
           <Text style={styles.logAmount}>+1,200L</Text>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Floating Action Pill */}
      <View style={styles.fabWrap}>
        <TouchableOpacity style={styles.fabBtn} activeOpacity={0.8}>
           <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.fabInner}>
              <Ionicons name="add" size={24} color="#FFF" />
              <Text style={styles.fabT}>Log Water</Text>
           </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { paddingTop: Platform.OS === 'android' ? 64 : 24, paddingHorizontal: 24, paddingBottom: 16 },
  pageTitle: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary },
  scrollContent: { paddingHorizontal: 24 },

  gaugeRoot: { alignItems: 'center', marginBottom: 40, marginTop: 16 },
  gaugeOuter: { width: 260, height: 260, borderRadius: 130, backgroundColor: Theme.colors.layer1, justifyContent: 'center', alignItems: 'center', ...Theme.shadows.card },
  gaugeTrack: { width: 210, height: 210, borderRadius: 105, backgroundColor: Theme.colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  gaugeInner: { width: 180, height: 180, borderRadius: 90, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center', ...Theme.shadows.ambient },
  gaugeVal: { ...Theme.typography.h1, fontSize: 48, color: Theme.colors.textPrimary, lineHeight: 56 },
  gaugeUnit: { fontSize: 13, fontWeight: '700', color: Theme.colors.textSecondary, letterSpacing: 0.5, textTransform: 'uppercase' },

  compRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  compCard: { flex: 1, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl, padding: 20, ...Theme.shadows.ambient },
  compIndicator: { width: 32, height: 4, borderRadius: 2, backgroundColor: Theme.colors.primary, marginBottom: 12 },
  compL: { fontSize: 13, fontWeight: '700', color: Theme.colors.textSecondary, marginBottom: 8 },
  compV: { fontSize: 24, fontWeight: '800', color: Theme.colors.textPrimary },

  actionBanner: { borderRadius: Theme.borderRadius.xxl, padding: 24, flexDirection: 'row', alignItems: 'center', marginBottom: 32, ...Theme.shadows.ambient },
  abLeft: { flex: 1 },
  abTitle: { fontSize: 20, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  abSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  abBtn: { backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 16 },
  abBtnT: { color: Theme.colors.gradientBlue[0], fontWeight: '800', fontSize: 14 },

  sectionHeading: { fontSize: 20, fontWeight: '800', color: Theme.colors.textPrimary, marginBottom: 16 },
  logCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12, ...Theme.shadows.ambient },
  logIconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  logTitle: { fontSize: 16, fontWeight: '700', color: Theme.colors.textPrimary, marginBottom: 4 },
  logDate: { fontSize: 13, color: Theme.colors.textMuted, fontWeight: '600' },
  logAmount: { fontSize: 18, fontWeight: '800', color: Theme.colors.textPrimary },

  fabWrap: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' },
  fabBtn: { borderRadius: 32, overflow: 'hidden', ...Theme.shadows.float },
  fabInner: { paddingHorizontal: 32, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  fabT: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
