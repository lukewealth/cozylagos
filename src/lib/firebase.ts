import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence, indexedDBLocalPersistence } from "firebase/auth";
import { getFirestore, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVB6mwWVmmVvII4E73i8zNvrkXTUIW-kk",
  authDomain: "cozylagos-90da0.firebaseapp.com",
  projectId: "cozylagos-90da0",
  storageBucket: "cozylagos-90da0.firebasestorage.app",
  messagingSenderId: "6332475718",
  appId: "1:6332475718:web:49ce3f407bae3799fb9d47",
  measurementId: "G-N8KTEPJ7SC"
};

const app = initializeApp(firebaseConfig);

let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
      analytics.logEvent('app_initialized');
    }
  }).catch(() => {});
}

const auth = getAuth(app);
setPersistence(auth, indexedDBLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence set to IndexedDB');
  })
  .catch((error) => {
    console.warn('IndexedDB persistence not available, falling back to local storage:', error);
    setPersistence(auth, browserLocalPersistence).catch(() => {});
  });

const db = getFirestore(app);
if (typeof window !== 'undefined') {
  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence: multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence: browser doesn\'t support IndexedDB.');
    }
  });
}

const storage = getStorage(app);

export { app, analytics, auth, db, storage };
