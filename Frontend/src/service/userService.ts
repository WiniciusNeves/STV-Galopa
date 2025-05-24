import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import app from './firebaseConfig';
import { getAuthData } from './authService'; // Importe a função que agora cuida do token e dos dados do usuário

const auth = getAuth(app);

export const login = async (email: string, password: string) => {
    try {
        // Realiza o login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Obtenha os dados de autenticação (token, role, expiration)
        const authData = await getAuthData();
        console.log("Dados de autenticação no login:", authData);

        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            role: authData.role || 'user',
            token: authData.token,
            expiration: authData.expiration,
        };
    } catch (error: any) {
        console.error('Erro ao fazer login:', error.message);
        return null;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
        // O logout da limpeza do AsyncStorage agora está no authService
    } catch (error: any) {
        console.error('Erro ao fazer logout:', error.message);
    }
};