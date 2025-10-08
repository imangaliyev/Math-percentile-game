// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// This is a side-effect import. It ensures the Firestore service is registered
// with the Firebase app instance, preventing the "Service not available" error.
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// SECURITY WARNING: Hardcoding Firebase config like this is common for tutorials
// and prototypes, but it's not recommended for production applications.
// In a production environment, you should use environment variables to store
// sensitive information like the apiKey. Additionally, consider implementing
// Firebase App Check to ensure that requests to your Firebase backend are
// coming from your authentic app, preventing abuse of your project resources.
const firebaseConfig = {
  apiKey: "AIzaSyCC2x853gJX_mnUycOErz7K4kMDjoK62Ww",
  authDomain: "math-percentile-game.firebaseapp.com",
  projectId: "math-percentile-game",
  storageBucket: "math-percentile-game.firebasestorage.app",
  messagingSenderId: "381077366877",
  appId: "1:381077366877:web:6c8c416bd523b5386145b4"
};

// Initialize Firebase App in a robust, singleton pattern
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore eagerly and export the instance directly.
// The side-effect import above guarantees that getFirestore() will succeed.
export const db = getFirestore(app);