import { useState, useContext, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function Disease() {
  const { farmer, t } = useContext(FarmerContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const { data: result, loading, error, execute } = useApiCall('/api/disease/detect');

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.containerLight}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && farmer) {
      const p = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      setPhoto(p.uri);
      
      const formData = new FormData();
      formData.append('uid', farmer.uid);
      formData.append('image', { uri: p.uri, type: 'image/jpeg', name: 'crop.jpg' });
      
      const res = await execute('POST', formData);
      if (res && res.disease) {
        const speechText = `${res.disease.name}. ${res.disease.diagnosis}. Recommended treatment: ${res.treatment ? res.treatment[0] : ''}`;
        Speech.speak(speechText, { language: t.language === 'en' ? 'en' : 'hi' });
      }
    }
  };

  return (
    <View style={styles.container}>
      {!photo ? (
        <CameraView style={styles.camera} facing="back" ref={cameraRef}>
          <View style={styles.cameraFrame}>
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <Ionicons name="camera" size={40} color="#FFF" />
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <ScrollView style={styles.resultContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <TouchableOpacity style={styles.resetBtn} onPress={() => setPhoto(null)}>
             <Ionicons name="close-circle" size={40} color="#E24B4A"/>
          </TouchableOpacity>
          {loading ? (
             <View style={styles.loader}>
               <ActivityIndicator size="large" color="#1D9E75" />
               <Text style={{ marginTop: 10 }}>{t.loading || 'Analyzing...'}</Text>
             </View>
          ) : error ? (
            <Text style={styles.error}>{t.error || 'Failed to analyze leaf'}</Text>
          ) : result ? (
            <View style={styles.card}>
              <Text style={styles.diseaseName}>{result.disease?.name}</Text>
              <View style={[styles.badge, { backgroundColor: result.disease?.isHealthy ? '#C8E6C9' : '#FFCDD2' }]}>
                <Text style={[styles.badgeText, { color: result.disease?.isHealthy ? '#2E7D32' : '#E24B4A' }]}>
                  {result.disease?.isHealthy ? 'Healthy' : `${result.disease?.severity} Severity`}
                </Text>
              </View>
              
              <Text style={styles.diagnosisText}>{result.disease?.diagnosis}</Text>

              <Text style={styles.sectionTitle}>Treatment Plan:</Text>
              {result.treatment && result.treatment.length > 0 ? (
                result.treatment.map((step, i) => (
                  <View key={i} style={styles.stepRow}>
                    <Text style={styles.stepNumber}>{i+1}.</Text>
                    <Text style={styles.text}>{step}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.text}>No specific treatment steps provided.</Text>
              )}

              {result.relatedScheme && (
                <View style={styles.schemeCard}>
                  <Text style={styles.schemeTitle}>Government Scheme Support:</Text>
                  <Text style={styles.text}>{result.relatedScheme.name}</Text>
                  <Text style={styles.benefitText}>Benefit: {result.relatedScheme.benefit}</Text>
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerLight: { flex: 1, backgroundColor: '#FAFAF5' },
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  cameraFrame: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 40 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1D9E75', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF' },
  resultContainer: { flex: 1, backgroundColor: '#FAFAF5' },
  preview: { width: '100%', height: 350 },
  resetBtn: { position: 'absolute', top: 20, right: 20 },
  loader: { padding: 40, alignItems: 'center' },
  card: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20, minHeight: 400 },
  diseaseName: { fontSize: 24, fontWeight: 'bold', color: '#1A1A2E' },
  badge: { alignSelf: 'flex-start', padding: 5, paddingHorizontal: 10, borderRadius: 15, marginVertical: 10 },
  badgeText: { fontWeight: 'bold' },
  diagnosisText: { fontSize: 16, color: '#555', fontStyle: 'italic', marginBottom: 15 },
  sectionTitle: { fontSize: 18, color: '#1D9E75', marginTop: 15, marginBottom: 10, fontWeight: 'bold' },
  stepRow: { flexDirection: 'row', marginBottom: 8, paddingRight: 15 },
  stepNumber: { width: 25, fontWeight: 'bold', color: '#1D9E75' },
  text: { fontSize: 16, color: '#333' },
  schemeCard: { marginTop: 25, padding: 15, backgroundColor: '#F1F8E9', borderRadius: 10, borderLeftWidth: 5, borderLeftColor: '#1D9E75' },
  schemeTitle: { fontWeight: 'bold', color: '#2E7D32', marginBottom: 5 },
  benefitText: { color: '#1D9E75', fontWeight: 'bold', marginTop: 5 },
  error: { color: '#E24B4A', textAlign: 'center', marginTop: 20, padding: 20 },
  btn: { backgroundColor: '#1D9E75', padding: 10, margin: 20, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold' }
});
