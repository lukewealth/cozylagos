import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin SDK not configured. Using client-side Firebase only.');
      return null;
    }

    try {
      const app = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      console.log('Firebase Admin SDK initialized successfully');
      return app;
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
      return null;
    }
  }

  return getApps()[0];
};

const adminApp = initializeFirebaseAdmin();

export const adminAuth = adminApp ? getAuth(adminApp) : null;
export const adminDb = adminApp ? getFirestore(adminApp) : null;

export const firebaseAdmin = {
  verifyIdToken: async (idToken: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.verifyIdToken(idToken);
  },

  getUser: async (uid: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.getUser(uid);
  },

  getUserByEmail: async (email: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.getUserByEmail(email);
  },

  createUser: async (email: string, password: string, displayName?: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.createUser({
      email,
      password,
      displayName,
      emailVerified: false,
    });
  },

  updateUser: async (uid: string, properties: Record<string, any>) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.updateUser(uid, properties);
  },

  setCustomUserClaims: async (uid: string, customClaims: Record<string, any>) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.setCustomUserClaims(uid, customClaims);
  },

  sendPasswordResetEmail: async (email: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.generatePasswordResetLink(email);
  },

  sendEmailVerification: async (email: string) => {
    if (!adminAuth) {
      throw new Error('Firebase Admin SDK not initialized');
    }
    return adminAuth.generateEmailVerificationLink(email);
  },
};
