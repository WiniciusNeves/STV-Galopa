// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../service/firebaseConfig';
import { getAuthData, clearAuthStorage } from '../service/authService';

const ASYNC_STORAGE_ROLE_KEY = '@userRole';

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
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const { token, role, expiration } = await getAuthData();

      if (!token || !role) {
        throw new Error('Token ou role ausente');
      }

      const userData: UserData = {
        uid: cred.user.uid,
        email: cred.user.email ?? undefined,
        token,
        role,
        expiration,
      };

      setUser(userData);
      setUserRole(role);

      await AsyncStorage.setItem(ASYNC_STORAGE_ROLE_KEY, role);
      await AsyncStorage.setItem('@rememberMe', rememberMe ? 'true' : 'false');

      console.log('[AUTH] Login realizado e role salva.');
      return userData;
    } catch (error) {
      console.error("[AUTH] Erro no login:", error);
      Alert.alert("Erro", "Usuário ou senha inválidos.");
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(ASYNC_STORAGE_ROLE_KEY);
      await clearAuthStorage();

      setUser(null);
      setUserRole(null);
      console.log('[AUTH] Logout concluído.');
    } catch (error) {
      console.error("Erro no logout:", error);
      Alert.alert("Erro", "Erro ao realizar logout.");
    }
  };

  useEffect(() => {
    const checkRememberMe = async () => {
      const rememberMe = await AsyncStorage.getItem('@rememberMe');
      if (rememberMe !== 'true') {
        // Se não for para lembrar, faz logout automático
        await signOut(auth);
        await clearAuthStorage();
        setUser(null);
        setUserRole(null);
        setIsLoadingAuth(false);
        return;
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const { token, role, expiration } = await getAuthData();
            const storedRole = await AsyncStorage.getItem(ASYNC_STORAGE_ROLE_KEY);

            const userData: UserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? undefined,
              token,
              role: storedRole || role,
              expiration,
            };

            setUser(userData);
            setUserRole(storedRole || role);
            console.log('[AUTH] Sessão restaurada pelo Firebase.');
          } catch (err) {
            console.error("[AUTH] Erro ao obter dados no restore:", err);
            await logout();
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
        setIsLoadingAuth(false);
      });

      return () => unsubscribe();
    };

    checkRememberMe();
  }, []);

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
