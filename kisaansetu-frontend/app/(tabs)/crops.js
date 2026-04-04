import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { FarmerContext } from '../../contexts/FarmerContext';
import { Theme } from '../../constants/theme';
import { useApiCall } from '../../hooks/useApiCall';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function Crops() {
  const { t, language } = useContext(FarmerContext);
  const [form, setForm] = useState({ 
    temperature: '', rainfall: '', humidity: '', landAcres: '',
    n: '', p: '', k: '', ph: ''
  });
  
  const { data: recommendations, loading, execute } = useApiCall('/api/crops/recommend');
  const { execute: fetchAutoData, loading: autoLoading } = useApiCall('/api/weather/details');

  const detectLocationAndFill = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert(t.loc_error); return; }
    let location = await Location.getCurrentPositionAsync({});
    const res = await fetchAutoData('GET', null, `lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
    if (res) {
      setForm({ ...form, ...res });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Crop Intelligence</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.autoDetectBox}>
          <View style={styles.autoDetectContent}>
            <View style={styles.adLeft}>
               <Ionicons name="location" size={24} color={Theme.colors.primaryDark} />
            </View>
            <View style={styles.adMid}>
               <Text style={styles.adTitle}>Fetch Live Data</Text>
               <Text style={styles.adSub}>Auto-detect climate & soil using GPS</Text>
            </View>
            <TouchableOpacity style={styles.adBtn} onPress={detectLocationAndFill} disabled={autoLoading}>
               {autoLoading ? <ActivityIndicator color="#FFF" /> : <Ionicons name="refresh" size={20} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.glassForm}>
           <Text style={styles.sectionHeading}>Climate Metrics</Text>
           <View style={styles.inputGroupRow}>
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Temperature (°C)</Text>
                 <TextInput style={styles.inputStyled} value={form.temperature} onChangeText={v=>setForm({...form, temperature:v})} keyboardType="numeric" placeholder="28" placeholderTextColor={Theme.colors.textMuted}/>
              </View>
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Rainfall (mm)</Text>
                 <TextInput style={styles.inputStyled} value={form.rainfall} onChangeText={v=>setForm({...form, rainfall:v})} keyboardType="numeric" placeholder="120" placeholderTextColor={Theme.colors.textMuted}/>
              </View>
           </View>
           
           <View style={styles.divider} />
           
           <Text style={styles.sectionHeading}>Soil Nutrients</Text>
           <View style={styles.inputGroupRow}>
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Nitrogen (N)</Text>
                 <TextInput style={styles.inputStyled} value={form.n} onChangeText={v=>setForm({...form, n:v})} keyboardType="numeric" placeholder="90" placeholderTextColor={Theme.colors.textMuted}/>
              </View>
              <View style={styles.inputWrap}>
                 <Text style={styles.label}>Phosphorus (P)</Text>
                 <TextInput style={styles.inputStyled} value={form.p} onChangeText={v=>setForm({...form, p:v})} keyboardType="numeric" placeholder="42" placeholderTextColor={Theme.colors.textMuted}/>
              </View>
           </View>

           <TouchableOpacity style={styles.submitWrap} onPress={() => execute('POST', { ...form, lang: language })} disabled={loading}>
              <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.submitBtn}>
                 {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitBtnT}>Analyze Field Data</Text>}
              </LinearGradient>
           </TouchableOpacity>
        </View>

        {recommendations?.map((item, idx) => (
          <View key={idx} style={styles.recoCard}>
            <View style={styles.recoTop}>
               <Text style={styles.recoRank}>Top Pick</Text>
               <View style={styles.recoPricePill}><Text style={styles.recoPriceT}>{item.price}</Text></View>
            </View>
            <Text style={styles.recoCrop}>{item.crop}</Text>
            <View style={styles.recoDataBox}>
               <Text style={styles.recoDataL}>Expected Yield</Text>
               <Text style={styles.recoDataV}>{item.yield}</Text>
            </View>
          </View>
        ))}

        <View style={{height: 120}}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  header: { paddingTop: Platform.OS === 'android' ? 64 : 24, paddingHorizontal: 24, paddingBottom: 16 },
  pageTitle: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary },
  scrollContent: { paddingHorizontal: 24, paddingTop: 8 },
  
  autoDetectBox: { backgroundColor: Theme.colors.layer1, borderRadius: Theme.borderRadius.xl, padding: 20, marginBottom: 24 },
  autoDetectContent: { flexDirection: 'row', alignItems: 'center' },
  adLeft: { width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center' },
  adMid: { flex: 1, marginLeft: 16 },
  adTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.textPrimary },
  adSub: { fontSize: 13, color: Theme.colors.textSecondary, fontWeight: '500', marginTop: 2 },
  adBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
  
  glassForm: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xxl, padding: 24, marginBottom: 24, ...Theme.shadows.card },
  sectionHeading: { fontSize: 18, fontWeight: '800', color: Theme.colors.textPrimary, marginBottom: 16 },
  inputGroupRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  inputWrap: { flex: 1 },
  label: { fontSize: 13, fontWeight: '700', color: Theme.colors.textSecondary, marginBottom: 8 },
  inputStyled: { backgroundColor: Theme.colors.surfaceContainerHigh, height: 56, borderRadius: Theme.borderRadius.lg, paddingHorizontal: 16, fontSize: 16, fontWeight: '600', color: Theme.colors.textPrimary },
  divider: { height: 1, backgroundColor: Theme.colors.surfaceContainerHigh, marginVertical: 24 },
  
  submitWrap: { marginTop: 16, borderRadius: Theme.borderRadius.xl, overflow: 'hidden' },
  submitBtn: { height: 60, justifyContent: 'center', alignItems: 'center' },
  submitBtnT: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  recoCard: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xxl, padding: 24, marginBottom: 16, ...Theme.shadows.ambient },
  recoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  recoRank: { fontSize: 14, fontWeight: '800', color: Theme.colors.primaryDark, textTransform: 'uppercase', letterSpacing: 1 },
  recoPricePill: { backgroundColor: Theme.colors.surfaceContainerHigh, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  recoPriceT: { fontSize: 14, fontWeight: '800', color: Theme.colors.textPrimary },
  recoCrop: { ...Theme.typography.h2, fontSize: 28, marginBottom: 16 },
  recoDataBox: { backgroundColor: Theme.colors.surfaceContainerLow, padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recoDataL: { fontSize: 14, color: Theme.colors.textSecondary, fontWeight: '600' },
  recoDataV: { fontSize: 16, color: Theme.colors.textPrimary, fontWeight: '800' }
});
