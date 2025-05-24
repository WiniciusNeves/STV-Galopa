import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import app from './firebaseConfig';
import { Alert } from 'react-native';

const auth = getAuth(app);

interface UserData {
  role: string | null;
}

const USER_DATA_KEY = 'userData';

// Salva o role do usuário localmente (opcional)
const saveUserRole = async (role: string | null) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify({ role }));
  } catch (error) {
    console.error('[AUTH SERVICE] Erro ao salvar role no AsyncStorage:', error);
  }
};

// Busca o role salvo localmente
export const getCurrentRole = async (): Promise<string | null> => {
  try {
    const storedData = await AsyncStorage.getItem(USER_DATA_KEY);
    if (storedData) {
      const { role } = JSON.parse(storedData) as UserData;
      return role;
    }
  } catch (error) {
    console.error('[AUTH SERVICE] Erro ao obter role:', error);
  }
  return null;
};

// Função para obter token válido (sempre renovado) e atualizar o role localmente
export const getValidToken = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (!user) {
    console.warn('[AUTH SERVICE] Usuário não autenticado');
    return null;
  }

  try {
    // Força a renovação do token para evitar usar token expirado
    const token = await user.getIdToken(true);

    // Pega os claims para extrair o role
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role || 'user';

    // Salva role localmente para uso rápido (não salva token)
    await saveUserRole(role);

    console.log('[AUTH SERVICE] Token renovado e role armazenado:', role);
    return token;
  } catch (error: any) {
    console.error('[AUTH SERVICE] Erro ao obter token válido:', error.message);
    return null;
  }
};

// Função para fazer login automático (navegação baseada no role)
export const checkAutoLogin = async (navigation: any): Promise<void> => {
  try {
    const token = await getValidToken();

    if (token) {
      const role = await getCurrentRole();

      console.log('[AUTH SERVICE] Login automático bem-sucedido. Role:', role);

      if (role === 'admin') {
        navigation.replace('ReportListScreen');
      } else {
        navigation.replace('ChecklistScreen');
      }
      return;
    }

    // Se não tiver token válido, navega para tela de login
    navigation.replace('Auth');
  } catch (error) {
    console.error('[AUTH SERVICE] Erro ao verificar login automático:', error);
    navigation.replace('Auth');
  }
};

// Função para obter os dados de autenticação (token, role, expiration)
export const getAuthData = async () => {
  const token = await getValidToken();
  const role = await getCurrentRole();

  if (!token || !role) {
    throw new Error('Usuário não autenticado ou dados incompletos');
  }

  // Simulando tempo de expiração para fins de demonstração
  const expiration = Date.now() + 3600 * 1000; // 1h

  return {
    token,
    role,
    expiration,
  };
};

// Função para fazer logout
export const logout = async (navigation: any): Promise<void> => {
  try {
    await auth.signOut();
    await AsyncStorage.removeItem(USER_DATA_KEY);
    console.log('[AUTH SERVICE] Logout realizado com sucesso.');
    navigation.replace('Auth');
  } catch (error: any) {
    console.error('[AUTH SERVICE] Erro ao fazer logout:', error.message);
    Alert.alert('Erro', 'Erro ao realizar logout.');
  }
};

