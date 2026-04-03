import React, { createContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
        const ref = doc(db, 'farmers', uid);
        const snapshot = await getDoc(ref, { source: 'default' });
        
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFarmer(data);
          if (data.preferredLanguage) {
            setLanguage(data.preferredLanguage);
          }
        }
      } catch (err) {
        console.warn("Falling back to cache:", err);
        try {
          const ref = doc(db, 'farmers', uid);
          const cachedSnap = await getDoc(ref, { source: 'cache' });
          if (cachedSnap.exists()) {
             setFarmer(cachedSnap.data());
             if (cachedSnap.data().preferredLanguage) {
               setLanguage(cachedSnap.data().preferredLanguage);
             }
          }
        } catch(e) {}
      } finally {
        setLoading(false);
      }
    };

    fetchFarmer();
  }, [uid]);

  const updateFarmer = async (newData) => {
    if (!uid) return;
    const ref = doc(db, 'farmers', uid);
    await setDoc(ref, newData, { merge: true });
    setFarmer(prev => ({ ...prev, ...newData }));
    if (newData.preferredLanguage) {
      setLanguage(newData.preferredLanguage);
    }
  };

  const changeLanguage = async (newLang) => {
    setLanguage(newLang);
    if (uid) {
      const ref = doc(db, 'farmers', uid);
      await setDoc(ref, { preferredLanguage: newLang }, { merge: true });
      setFarmer(prev => prev ? { ...prev, preferredLanguage: newLang } : null);
    }
  };

  return (
    <FarmerContext.Provider value={{ farmer, updateFarmer, language, setLanguage: changeLanguage, t, loading }}>
      {children}
    </FarmerContext.Provider>
  );
};
