import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAuthData } from './authService';
import { t } from 'i18next';

if (!API_URL) {
  throw new Error('API_URL is not defined in .env');
}

const apiRouter = axios.create({
  baseURL: API_URL,
});

apiRouter.interceptors.request.use(
  async (config) => {
   
    const authData = await getAuthData();
    const token = authData.token; 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.info('[API Router] Token enviado:', token);
    } else {
      console.warn('[API Router] Token não disponível.');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiRouter.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na resposta da API:', error);
    return Promise.reject(error);
  }
);

export default apiRouter;
