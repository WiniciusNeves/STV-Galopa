import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebaseConfig';
import { Alert } from 'react-native';

import { 
  setPersistence, 
  getReactNativePersistence, 
  inMemoryPersistence 
} from 'firebase/auth';

const ASYNC_STORAGE_ROLE_KEY = '@userRole';
const ASYNC_STORAGE_TOKEN_KEY = '@token';
const ASYNC_STORAGE_USER_DATA_KEY = '@user';
const ASYNC_STORAGE_REMEMBER_ME_KEY = '@rememberMe';

export const setAuthPersistence = async (remember: boolean) => {
  try {
    if (remember) {
      await setPersistence(auth, getReactNativePersistence(AsyncStorage));
      await AsyncStorage.setItem(ASYNC_STORAGE_REMEMBER_ME_KEY, 'true');
      console.log('[AUTH SERVICE] Persistência LOCAL ativada (salva sessão).');
    } else {
      await setPersistence(auth, inMemoryPersistence);
      await AsyncStorage.removeItem(ASYNC_STORAGE_REMEMBER_ME_KEY);
      console.log('[AUTH SERVICE] Persistência em MEMÓRIA ativada (não salva sessão).');
    }
  } catch (error: any) {
    console.error('[AUTH SERVICE] Erro ao definir persistência:', error.message);
  }
};

export const getAuthData = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('[AUTH SERVICE] Usuário não autenticado. Retornando dados nulos.');
    return { token: null, role: null, expiration: null };
  }

  try {
    const idTokenResult = await user.getIdTokenResult(true);
    const token = idTokenResult.token;
    const role = (idTokenResult.claims.role as string) || 'user';
    const expiration = idTokenResult.expirationTime ? new Date(idTokenResult.expirationTime).getTime() : null;

    const rememberMeStored = await AsyncStorage.getItem(ASYNC_STORAGE_REMEMBER_ME_KEY);
    const rememberMe = rememberMeStored === 'true';

    await AsyncStorage.setItem(ASYNC_STORAGE_TOKEN_KEY, token);
    await AsyncStorage.setItem(ASYNC_STORAGE_ROLE_KEY, role);
    await AsyncStorage.setItem(ASYNC_STORAGE_USER_DATA_KEY, JSON.stringify({ uid: user.uid, email: user.email, role }));
    if (rememberMe) {
      await AsyncStorage.setItem(ASYNC_STORAGE_REMEMBER_ME_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(ASYNC_STORAGE_REMEMBER_ME_KEY);
    }

    console.log('[AUTH SERVICE] Token renovado e role armazenado:', role, 'Lembrar de mim:', rememberMe);
    return { token, role, expiration };
  } catch (error: any) {
    console.error('[AUTH SERVICE] Erro ao obter dados de autenticação:', error.message);
    await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_REMEMBER_ME_KEY);
    return { token: null, role: null, expiration: null };
  }
};

export const clearAuthStorage = async () => {
  try {
    await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
    await AsyncStorage.removeItem(ASYNC_STORAGE_REMEMBER_ME_KEY);
    console.log('[AUTH SERVICE] Dados de autenticação limpos do AsyncStorage.');
  } catch (error) {
    console.error('[AUTH SERVICE] Erro ao limpar AsyncStorage:', error);
  }
};

export const logout = async (navigation: any): Promise<void> => {
  try {
    await auth.signOut();
    await clearAuthStorage();
    console.log('[AUTH SERVICE] Logout realizado com sucesso.');
    if (navigation && navigation.replace) {
      navigation.replace('Auth');
    } else {
      console.warn('[AUTH SERVICE] Objeto de navegação não fornecido ou inválido para logout.');
    }
  } catch (error: any) {
    console.error('[AUTH SERVICE] Erro ao fazer logout:', error.message);
    Alert.alert('Erro', 'Erro ao realizar logout.');
    throw error;
  }
};
