import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { getAuthData, logout as authServiceLogout, setAuthPersistence } from './authService';

export const login = async (email: string, password: string, rememberMe: boolean) => {
  try {
    // Importante: configura persistência ANTES do login
    await setAuthPersistence(rememberMe);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const authData = await getAuthData();

    console.log("Dados de autenticação no login:", authData);

    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: authData.role,
      token: authData.token,
      expiration: authData.expiration,
    };
  } catch (error: any) {
    console.error('Erro ao fazer login:', error.message);
    throw error;
  }
};

export const logout = async (navigation: any) => {
  try {
    await authServiceLogout(navigation);
  } catch (error: any) {
    console.error('Erro ao fazer logout no userService:', error.message);
    throw error;
  }
};
