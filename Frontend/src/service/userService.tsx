import auth from '@react-native-firebase/auth';

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        return null;
    }
};

export const logout = async () => {
    try {
        await auth().signOut();
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}
