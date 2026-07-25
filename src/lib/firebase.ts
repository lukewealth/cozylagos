// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVB6mwWVmmVvII4E73i8zNvrkXTUIW-kk",
  authDomain: "cozylagos-90da0.firebaseapp.com",
  projectId: "cozylagos-90da0",
  storageBucket: "cozylagos-90da0.firebasestorage.app",
  messagingSenderId: "6332475718",
  appId: "1:6332475718:web:49ce3f407bae3799fb9d47",
  measurementId: "G-N8KTEPJ7SC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Auth with persistence
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Auth persistence error:', error);
});

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
