import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      role: (await userCredential.user.getIdTokenResult()).claims.role || "user",
    };
  } catch (error: any) {
    console.error("Erro ao fazer login:", error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Erro ao fazer logout:", error.message);
  }
};
