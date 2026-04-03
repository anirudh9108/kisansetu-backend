import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';
import pa from '../translations/pa';
import hi from '../translations/hi';

export const FarmerContext = createContext({
  farmer: null,
  updateFarmer: () => {},
  language: 'pa',
  setLanguage: () => {},
  t: {},
  loading: true,
});

export const FarmerProvider = ({ children, uid }) => {
  const [farmer, setFarmer] = useState(null);
  const [language, setLanguage] = useState('pa');
  const [loading, setLoading] = useState(true);

  // t maps to the active translation dictionary
  const t = language === 'hi' ? hi : pa;

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchFarmer = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/farmer/profile/${uid}`);
        if (response.data) {
          const data = response.data;
          setFarmer(data);
          if (data.preferredLanguage) {
            setLanguage(data.preferredLanguage);
          }
        }
      } catch (err) {
        console.warn("API Fetch Error:", err.message);
        // We could add local storage fallback here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [uid]);

  const updateFarmer = async (newData) => {
    if (!uid) return;
    try {
      // Ensure specific field alignment with MongoDB schema
      const updatedProfile = { 
        ...farmer, 
        ...newData, 
        uid,
        preferredLanguage: newData.preferredLanguage || language
      };

      // Remove any client-side only fields before sending to API
      const { isNewUser, ...payload } = updatedProfile;
      
      await axios.post(`${API_BASE}/api/farmer/profile`, payload);
      
      setFarmer(updatedProfile);
      if (newData.preferredLanguage) {
        setLanguage(newData.preferredLanguage);
      }
    } catch (err) {
      console.error("API Update Error:", err.message);
    }
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    if (uid) {
      try {
        await axios.post(`${API_BASE}/api/farmer/profile`, { 
            ...farmer,
            uid,
            preferredLanguage: newLang 
        });
        setFarmer(prev => prev ? { ...prev, preferredLanguage: newLang } : null);
      } catch (err) {
        console.error("API Language Update Error:", err.message);
      }
    }
  };

  return (
    <FarmerContext.Provider value={{ farmer, updateFarmer, language, setLanguage: changeLanguage, t, loading }}>
      {children}
    </FarmerContext.Provider>
  );
};
