// userService.ts (sem grandes mudanças, pois já chamava getAuthData)
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebaseConfig';
import { getAuthData, clearAuthStorage, logout as authServiceLogout } from './authService'; // Importe o logout do authService, se ele lida com navegação

const auth = getAuth(app);

export const login = async (email: string, password: string) => {
    try {
        // Realiza o login no Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Obtenha os dados de autenticação (token, role, expiration)
        // Esta chamada agora garante que os dados estão salvos no AsyncStorage *antes* de serem retornados.
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
        throw error; // Propagar o erro para o AuthContext lidar
    }
};


export const logout = async (navigation: any) => {
    try {
       
        await authServiceLogout(navigation); // Chamando a função de logout do authService
    } catch (error: any) {
        console.error('Erro ao fazer logout no userService:', error.message);
        throw error; // Propagar erro
    }
};