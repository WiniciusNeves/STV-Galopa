// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// @ts-ignore
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env';


const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Inicializa o Firebase e o Storage
const app = getApps().length === 0 ? initializeApp(firebaseConfig as any) : getApp();
const storage = getStorage(app);

export { app, storage };