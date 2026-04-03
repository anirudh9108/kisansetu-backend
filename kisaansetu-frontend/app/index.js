import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FarmerContext } from '../contexts/FarmerContext';

export default function Onboarding() {
  const { farmer, updateFarmer, language, setLanguage, t, loading } = useContext(FarmerContext);
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    district: '',
    landInAcres: '',
    soilType: 'Loamy',
    waterSource: 'Tubewell',
    category: 'General',
    primaryCrops: []
  });

  useEffect(() => {
    if (!loading && farmer && farmer.name) {
      router.replace('/home');
    }
  }, [farmer, loading]);

  const handleSave = async () => {
    if (!form.name || !form.district) {
      alert('Please fill name and district!');
      return;
    }
    await updateFarmer(form);
    router.replace('/home');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pa' ? 'hi' : 'pa');
  };

  if (loading || (farmer && farmer.name)) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.welcome}</Text>
        <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
          <Text style={styles.langText}>{language === 'pa' ? 'A/अ' : 'Punjabi'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>{t.setupProfile}</Text>

      <Text style={styles.label}>{t.fullName}</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, name: text})} value={form.name} placeholder={t.fullName} />

      <Text style={styles.label}>{t.district}</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, district: text})} value={form.district} placeholder={t.district} />

      <Text style={styles.label}>{t.landInAcres}</Text>
      <TextInput style={styles.input} keyboardType="numeric" onChangeText={(text) => setForm({...form, landInAcres: text})} value={form.landInAcres} placeholder="Ex: 5" />

      <Text style={styles.label}>{t.soilType}</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, soilType: text})} value={form.soilType} placeholder={t.soilType} />
      
      <Text style={styles.label}>{t.waterSource}</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, waterSource: text})} value={form.waterSource} placeholder={t.waterSource} />
      
      <Text style={styles.label}>{t.category}</Text>
      <TextInput style={styles.input} onChangeText={(text) => setForm({...form, category: text})} value={form.category} placeholder={t.category} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{t.saveProfile}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' },
  subtitle: { fontSize: 18, color: '#1D9E75', marginBottom: 20 },
  langBtn: { padding: 8, backgroundColor: '#e0e0e0', borderRadius: 8 },
  langText: { fontSize: 14, fontWeight: 'bold' },
  label: { fontSize: 16, marginTop: 15, marginBottom: 5, color: '#1A1A2E' },
  input: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', fontSize: 16 },
  button: { backgroundColor: '#1D9E75', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 40 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
