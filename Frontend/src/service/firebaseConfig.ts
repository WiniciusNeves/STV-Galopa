// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBK9n2sypkO-YamiHtFBoGg3ux5WNHNVAU",
  authDomain: "stv-galope-f2eb4.firebaseapp.com",
  projectId: "stv-galope-f2eb4",
  storageBucket: "stv-galope-f2eb4.firebasestorage.app", 
  messagingSenderId: "312566559806",
  appId: "1:312566559806:web:b32c165c147e9a524e4d6f",
  measurementId: "G-FW940G1068"
};

// Inicializa o Firebase e o Storage
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const storage = getStorage(app);

export { app, storage };
