// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as loginService } from '../service/userService';
import { logout as logoutService } from '../service/userService';

// Definindo chaves consistentes (sempre bom tê-las em um arquivo de constantes ou no próprio contexto)
const ASYNC_STORAGE_ROLE_KEY = '@userRole';
const ASYNC_STORAGE_TOKEN_KEY = '@token';
const ASYNC_STORAGE_USER_DATA_KEY = '@user';

interface UserData {
  uid?: string;
  email?: string;
  token: string | null;
  role: string | null;
  expiration: number | null;
}

interface AuthContextType {
  user: UserData | null;
  login: (email: string, password: string) => Promise<UserData | null>;
  logout: () => Promise<void>;
  userRole: string | null;
  isLoadingAuth: boolean; // 🎉 NOVO: Adicionado isLoadingAuth ao tipo 🎉
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // 🎉 NOVO ESTADO: Começa como true 🎉

  const login = async (email, password) => {
    try {
      const loggedUser = await loginService(email, password);
      if (loggedUser && loggedUser.token && loggedUser.role) {
        setUser(loggedUser);
        setUserRole(loggedUser.role);
        // O armazenamento no AsyncStorage já é feito por getAuthData (chamado por loginService).
      }
      return loggedUser;
    } catch (error) {
      console.error("Erro no login do AuthContext:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutService(); // Chama o logout do userService
      setUser(null);
      setUserRole(null);
      // A limpeza do AsyncStorage já deve estar em logoutService (que chama clearAuthStorage).
      // Se não, adicione aqui as remoções diretas para garantir:
      await AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
      await AsyncStorage.removeItem(ASYNC_STORAGE_TOKEN_KEY);
      await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
    } catch (error) {
      console.error("Erro no logout do AuthContext:", error);
    }
  };

  // Carrega user e role salvos ao iniciar app
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA_KEY);
        const userRoleString = await AsyncStorage.getItem(ASYNC_STORAGE_ROLE_KEY);
        const userTokenString = await AsyncStorage.getItem(ASYNC_STORAGE_TOKEN_KEY);

        if (userDataString) {
          const loadedUser: UserData = JSON.parse(userDataString);
          setUser(loadedUser);
          setUserRole(loadedUser.role);
        } else if (userRoleString) { // Fallback, caso o objeto user não tenha sido salvo
          setUserRole(userRoleString);
          if (userTokenString) {
            // Recria um objeto user básico se apenas o role e token estiverem disponíveis
            setUser({ token: userTokenString, role: userRoleString, expiration: null });
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados do usuário do AsyncStorage:", error);
        setUser(null);
        setUserRole(null);
      } finally {
        setIsLoadingAuth(false); // 🎉 IMPORTANTE: Define como false QUANDO O CARREGAMENTO TERMINA 🎉
      }
    };
    loadUserData();
  }, []); // Executa apenas na montagem

 return (
   <AuthContext.Provider value={{ user, login, logout, userRole, isLoadingAuth }}>
     {children}
   </AuthContext.Provider>
 );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};