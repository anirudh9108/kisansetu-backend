
import { useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config/api';

export const useApiCall = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (method = 'GET', payload = null, cacheKey = 'default') => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        method,
        url: `${API_BASE}${endpoint}`,
        data: payload,
        timeout: 10000,
      };

      const response = await axios(config);
      setData(response.data);
      await AsyncStorage.setItem(`@cache_${endpoint}_${cacheKey}`, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.warn(`API Error ${endpoint}:`, err.message);
      const cached = await AsyncStorage.getItem(`@cache_${endpoint}_${cacheKey}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setError('OFFLINE_DATA');
        return parsed;
      }
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, loading, error, execute };
};
