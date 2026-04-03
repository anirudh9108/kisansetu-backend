import { useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../config/api';

export const useApiCall = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (method = 'GET', payload = null, id = 'default') => {
    setLoading(true);
    setError(null);
    try {
      const url = \\\\;
      const config = { method, url, data: payload };
      
      if (payload instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
      }

      const response = await axios(config);
      setData(response.data);
      
      await AsyncStorage.setItem(\@cache_\_\\, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      console.error(\Error with API \:\, err);
      const cached = await AsyncStorage.getItem(\@cache_\_\\);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        setError('OFFLINE_FALLBACK');
        return parsed;
      } else {
        setError(err.message || 'NetworkError');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, loading, error, execute };
};
