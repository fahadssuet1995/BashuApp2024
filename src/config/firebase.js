import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
//import { API_KEY, APP_ID, AUTH_D, MEASUREMNT_ID, MSG_ID, PRO_ID, ST_BUCKET } from "@env";

// fb config
const firebaseConfig = {
  apiKey: "AIzaSyCdcXlN4QkfB5s9gjfR_vQ4cb_UajymB-0",
  authDomain: "bashuapp-ae9c2.firebaseapp.com",
  projectId: "bashuapp-ae9c2",
  storageBucket: "bashuapp-ae9c2.appspot.com",
  messagingSenderId: "884494554169",
  appId: "1:884494554169:web:54797d5884e51fa39fe9e8",
  measurementId: "G-PVZBNC30NS"
  }
// Initialize Firebase 
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

// exporting the database
export const database = getFirestore(app)
export const storage = getStorage();
export { auth }