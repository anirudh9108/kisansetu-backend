
import { Platform } from 'react-native';

// 10.0.2.2 is the special IP for Android Emulator to reach localhost on host machine
// 127.0.0.1 is for Web browser testing
export const API_BASE = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';
