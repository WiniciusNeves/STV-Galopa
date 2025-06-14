import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import { app } from './firebaseConfig';
import { Alert } from 'react-native';

const auth = getAuth(app);


// Definindo chaves constantes para o AsyncStorage
const ASYNC_STORAGE_ROLE_KEY = '@userRole'; // Chave consistente com AuthContext
const ASYNC_STORAGE_TOKEN_KEY = '@token';   // Chave consistente com AuthContext
const ASYNC_STORAGE_USER_DATA_KEY = '@user'; // Para o objeto completo do usuário

// Função para obter os dados de autenticação (token, role, expiration) e armazená-los
export const getAuthData = async () => {
    const user = auth.currentUser;

    if (!user) {
        console.warn('[AUTH SERVICE] Usuário não autenticado. Limpando dados de autenticação.');
        // Limpar AsyncStorage se não houver usuário autenticado
        await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
        return { token: null, role: null, expiration: null };
    }

    try {
        // Obtém o ID Token com os claims (forçando a renovação)
        const idTokenResult = await user.getIdTokenResult(true);

        const token = idTokenResult.token;
        const role = (idTokenResult.claims.role as string) || 'user'; // Assumindo que 'role' é um claim
        const expiration = idTokenResult.expirationTime ? new Date(idTokenResult.expirationTime).getTime() : null;

        // 🎉 CORREÇÃO: ARMAZENAR ROLE E TOKEN AQUI E AGUARDAR ANTES DE RETORNAR 🎉
        await AsyncStorage.setItem(ASYNC_STORAGE_TOKEN_KEY, token);
        await AsyncStorage.setItem(ASYNC_STORAGE_ROLE_KEY, role);
        // Opcional: Armazenar um objeto de usuário mais completo
        await AsyncStorage.setItem(ASYNC_STORAGE_USER_DATA_KEY, JSON.stringify({ uid: user.uid, email: user.email, role: role }));

        console.log('[AUTH SERVICE] Token renovado e role armazenado:', role);
        return { token, role, expiration };
    } catch (error: any) {
        console.error('[AUTH SERVICE] Erro ao obter dados de autenticação:', error.message);
        // Em caso de erro, garantir que os dados inconsistentes sejam removidos
        await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
        return { token: null, role: null, expiration: null };
    }
};

// Nova função de logout centralizada para limpar o AsyncStorage
export const clearAuthStorage = async () => {
    try {
        await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
        await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
        console.log('[AUTH SERVICE] Dados de autenticação limpos do AsyncStorage.');
    } catch (error) {
        console.error('[AUTH SERVICE] Erro ao limpar AsyncStorage:', error);
    }
};


// Função para fazer logout
export const logout = async (navigation: any): Promise<void> => {
    try {
        await auth.signOut();
        await clearAuthStorage(); // Chama a função centralizada de limpeza
        console.log('[AUTH SERVICE] Logout realizado com sucesso.');
        navigation.replace('Auth');
    } catch (error: any) {
        console.error('[AUTH SERVICE] Erro ao fazer logout:', error.message);
        Alert.alert('Erro', 'Erro ao realizar logout.');
        throw error; // Propagar erro
    }
};

