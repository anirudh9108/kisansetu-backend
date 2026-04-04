import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Theme } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { FarmerContext } from '../../contexts/FarmerContext';
import { useApiCall } from '../../hooks/useApiCall';
import { LinearGradient } from 'expo-linear-gradient';

export default function Disease() {
  const { t, language } = useContext(FarmerContext);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const { data: result, loading, execute } = useApiCall('/api/disease/detect');

  const analyze = async (uri) => {
    setPhoto(uri);
    // Call the original backend...
  };

  const pickImage = async () => {
    let res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!res.canceled) analyze(res.assets[0].uri);
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Ionicons name="camera" size={64} color={Theme.colors.primary} style={{ marginBottom: 24 }} />
        <Text style={styles.pText}>Camera Access</Text>
        <Text style={styles.pSub}>We need your camera to detect crop diseases instantly.</Text>
        <TouchableOpacity onPress={requestPermission} activeOpacity={0.8} style={styles.permBtnWrap}>
          <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.permBtn}>
            <Text style={styles.btnT}>Enable Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!photo ? (
        <View style={styles.cameraWrap}>
           <CameraView style={styles.camera} facing="back">
             <View style={styles.cameraInner}>
               <View style={styles.frame}>
                  <View style={styles.cornerTL}/>
                  <View style={styles.cornerTR}/>
                  <View style={styles.cornerBL}/>
                  <View style={styles.cornerBR}/>
               </View>
               <View style={styles.scannerBadge}>
                 <Text style={styles.scannerText}>Align leaf within frame</Text>
               </View>
             </View>
             
             {/* Bottom Controls Float */}
             <View style={styles.controlsDock}>
               <TouchableOpacity onPress={pickImage} style={styles.dockSideBtn}>
                  <Ionicons name="images" size={28} color={Theme.colors.textPrimary}/>
               </TouchableOpacity>
               <TouchableOpacity style={styles.shutterBtn} onPress={() => {}}>
                  <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.shutterInner} />
               </TouchableOpacity>
               <View style={styles.dockSideBtn} />
             </View>
           </CameraView>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <View style={styles.photoWrap}>
             <Image source={{ uri: photo }} style={styles.photo} />
             <TouchableOpacity style={styles.backBtn} onPress={() => setPhoto(null)}>
                <Ionicons name="arrow-back" size={24} color={Theme.colors.textPrimary} />
             </TouchableOpacity>
          </View>
          
          <View style={styles.bottomSheet}>
             {loading ? (
                <View style={styles.loadingBox}>
                   <ActivityIndicator size="large" color={Theme.colors.primary} />
                   <Text style={styles.loadT}>Analyzing Leaf Structure...</Text>
                </View>
             ) : (
                <View>
                   <Text style={styles.resDiseaseTitle}>{result?.disease || 'Healthy Crop'}</Text>
                   
                   <View style={styles.treatmentCard}>
                      <View style={styles.treatmentIconBox}>
                         <Ionicons name="medical" size={20} color={Theme.colors.primaryDark} />
                      </View>
                      <View style={{flex:1}}>
                         <Text style={styles.treatTitle}>Treatment Recommendation</Text>
                         <Text style={styles.treatDesc}>{result?.treatment?.[0] || 'No treatment needed. Maintain regular watering schedule.'}</Text>
                      </View>
                   </View>

                   <TouchableOpacity activeOpacity={0.8} onPress={() => setPhoto(null)} style={styles.retakeWrap}>
                      <LinearGradient colors={Theme.colors.gradientPrimary} style={styles.retakeBtn}>
                         <Ionicons name="scan" size={20} color="#FFF" />
                         <Text style={styles.retakeT}>Scan New Crop</Text>
                      </LinearGradient>
                   </TouchableOpacity>
                </View>
             )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  pText: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  pSub: { fontSize: 16, color: Theme.colors.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 24, fontWeight: '500' },
  permBtnWrap: { borderRadius: Theme.borderRadius.xl, overflow: 'hidden', width: '100%' },
  permBtn: { paddingVertical: 18, alignItems: 'center' },
  btnT: { color: '#FFF', fontSize: 16, fontWeight: '800' },

  cameraWrap: { flex: 1, padding: 16, paddingTop: Platform.OS === 'android' ? 64 : 24, paddingBottom: 100 },
  camera: { flex: 1, borderRadius: Theme.borderRadius.xxl, overflow: 'hidden' },
  cameraInner: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 280, height: 280, justifyContent: 'space-between' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#FFF', borderTopLeftRadius: 24 },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#FFF', borderTopRightRadius: 24 },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#FFF', borderBottomLeftRadius: 24 },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#FFF', borderBottomRightRadius: 24 },
  scannerBadge: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 40 },
  scannerText: { color: '#FFF', fontWeight: '800', fontSize: 14, letterSpacing: 0.5 },
  
  controlsDock: { position: 'absolute', bottom: 24, left: 24, right: 24, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: Theme.borderRadius.full, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dockSideBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: Theme.colors.surfaceContainerHigh, justifyContent: 'center', alignItems: 'center' },
  shutterBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF', padding: 6, ...Theme.shadows.card },
  shutterInner: { flex: 1, borderRadius: 30 },

  resultContainer: { flex: 1, padding: 16, paddingTop: Platform.OS === 'android' ? 64 : 24 },
  photoWrap: { height: '50%', borderRadius: Theme.borderRadius.xxl, overflow: 'hidden', marginBottom: 24 },
  photo: { flex: 1 },
  backBtn: { position: 'absolute', top: 24, left: 24, width: 48, height: 48, borderRadius: 24, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center', ...Theme.shadows.card },
  
  bottomSheet: { flex: 1, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xxl, padding: 32, ...Theme.shadows.ambient },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadT: { marginTop: 16, fontSize: 16, fontWeight: '700', color: Theme.colors.textSecondary },
  
  resDiseaseTitle: { ...Theme.typography.h1, fontSize: 32, color: Theme.colors.textPrimary, marginBottom: 24 },
  treatmentCard: { backgroundColor: Theme.colors.primaryLight, borderRadius: Theme.borderRadius.xl, padding: 20, flexDirection: 'row', marginBottom: 32 },
  treatmentIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.surface, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  treatTitle: { fontSize: 14, fontWeight: '800', color: Theme.colors.primaryDark, marginBottom: 6 },
  treatDesc: { fontSize: 15, color: Theme.colors.textPrimary, lineHeight: 22, fontWeight: '500' },
  
  retakeWrap: { borderRadius: Theme.borderRadius.xl, overflow: 'hidden' },
  retakeBtn: { paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  retakeT: { color: '#FFF', fontSize: 16, fontWeight: '800' }
});
