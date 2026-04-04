
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pa from '../translations/pa';
import hi from '../translations/hi';
import en from '../translations/en';

export const FarmerContext = createContext();

export const FarmerProvider = ({ children }) => {
  const [farmer, setFarmer] = useState(null);
  const [language, setLanguage] = useState('pa'); // Default to Punjabi
  const [loading, setLoading] = useState(true);

  const t = language === 'en' ? en : (language === 'hi' ? hi : pa);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@language');
      if (savedLang) setLanguage(savedLang);
      
      const stored = await AsyncStorage.getItem('@farmer_profile');
      if (stored) {
        setFarmer(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateFarmer = async (data) => {
    const updated = { ...farmer, ...data };
    setFarmer(updated);
    await AsyncStorage.setItem('@farmer_profile', JSON.stringify(updated));
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('@language', lang);
  };

  return (
    <FarmerContext.Provider value={{ 
      farmer, updateFarmer, language, setLanguage: changeLanguage, 
      t, loading 
    }}>
      {children}
    </FarmerContext.Provider>
  );
};
