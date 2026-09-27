// RoadResQ Firebase Backend Configuration & Initialization
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD_1K4wbPrH4Fi4wEu57Jy1ru-rsKQ82zo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resq-app-f438e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resq-app-f438e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resq-app-f438e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987280672175",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:987280672175:web:34540692cb5c6d4d1b9b5a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HGV3HM2DH4",
};

// Initialize Firebase singleton
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log('✅ RoadResQ Firebase initialized for project:', firebaseConfig.projectId);
} catch (error) {
  console.warn('⚠️ Firebase initialization deferred:', error);
  // fallback init
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Authentication Helpers
export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Sync or save user profile to Firestore
    try {
      const userRef = doc(db, 'users', user.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName || 'RoadResQ User',
          email: user.email || '',
          phone: user.phoneNumber || '',
          avatarUrl: user.photoURL || '',
          role: 'CUSTOMER',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (firestoreErr) {
      console.warn('Firestore profile sync notice:', firestoreErr);
    }
    
    return user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign Out Error:', error);
    throw error;
  }
};

export { app, auth, db, storage, googleProvider, onAuthStateChanged };

export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  VEHICLES: 'vehicles',
  PROVIDERS: 'providers',
  SERVICES: 'services',
  ASSISTANCE_REQUESTS: 'assistanceRequests',
  REQUEST_EVENTS: 'requestEvents',
  PROVIDER_LOCATIONS: 'providerLocations',
  EMERGENCY_CONTACTS: 'emergencyContacts',
  PAYMENTS: 'payments',
  RATINGS: 'ratings',
  REVIEWS: 'reviews',
  NOTIFICATIONS: 'notifications',
  COMPLAINTS: 'complaints',
  AI_SESSIONS: 'aiSessions',
  AI_MESSAGES: 'aiMessages',
  ADMIN_SETTINGS: 'adminSettings',
} as const;
