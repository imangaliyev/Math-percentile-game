// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC2x853gJX_mnUycOErz7K4kMDjoK62Ww",
  authDomain: "math-percentile-game.firebaseapp.com",
  projectId: "math-percentile-game",
  storageBucket: "math-percentile-game.firebasestorage.app",
  messagingSenderId: "381077366877",
  appId: "1:381077366877:web:6c8c416bd523b5386145b4"
};

let db: ReturnType<typeof getFirestore>;

/**
 * Implements a lazy initialization pattern for Firestore.
 * This ensures that the Firestore service is only requested *after* all necessary
 * Firebase modules have been loaded, permanently fixing the "Service not available"
 * race condition that can occur during the initial module loading phase.
 *
 * @returns The singleton Firestore database instance.
 */
export const getDb = () => {
  if (!db) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  }
  return db;
};
