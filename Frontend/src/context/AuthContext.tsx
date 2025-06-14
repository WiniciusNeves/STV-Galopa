// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../service/firebaseConfig'; // ajuste conforme seu caminho
import { getAuthData, clearAuthStorage } from '../service/authService'; // já com getIdTokenResult
import { login as loginService, logout as logoutService } from '../service/userService';

// Chaves consistentes
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
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const auth = getAuth(app);

  const login = async (email: string, password: string) => {
    try {
      const loggedUser = await loginService(email, password);
      if (loggedUser && loggedUser.token && loggedUser.role) {
        // Ensure email is string or undefined, not null
        const userData: UserData = {
          ...loggedUser,
          email: loggedUser.email ?? undefined,
        };
        setUser(userData);
        setUserRole(userData.role);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Erro no login do AuthContext:", error);
      Alert.alert("Erro", "Erro ao realizar login.");
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutService(navigator); // Firebase signOut + limpeza
      setUser(null);
      setUserRole(null);
      await clearAuthStorage();
    } catch (error) {
      console.error("Erro no logout do AuthContext:", error);
      Alert.alert("Erro", "Erro ao realizar logout.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { token, role, expiration } = await getAuthData();

          if (!token) {
            console.warn('Token ausente. Realizando logout.');
            await logout();
            return;
          }

          const userData: UserData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            token,
            role,
            expiration,
          };

          setUser(userData);
          setUserRole(role);
        } catch (err) {
          console.error("Erro ao obter dados do usuário:", err);
          await logout();
        }
      } else {
        // Usuário deslogado
        await clearAuthStorage();
        setUser(null);
        setUserRole(null);
      }

      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
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
