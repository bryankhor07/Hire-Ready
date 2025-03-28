// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const FIREBASE_CLIENT_API_KEY = process.env.FIREBASE_CLIENT_API_KEY;

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_CLIENT_API_KEY,
  authDomain: "hire-ready.firebaseapp.com",
  projectId: "hire-ready",
  storageBucket: "hire-ready.firebasestorage.app",
  messagingSenderId: "961204686737",
  appId: "1:961204686737:web:5f4339e7b2fc89d4871430",
  measurementId: "G-W3QDQJ63VH",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
