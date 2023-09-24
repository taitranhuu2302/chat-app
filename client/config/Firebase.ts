import { getApps, initializeApp } from '@firebase/app';
import { getDatabase } from '@firebase/database';
import { getFirestore } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let firebaseApp = initializeApp(firebaseConfig);
export const firebaseStore = getFirestore(firebaseApp);
export const database = getDatabase(firebaseApp);

export default firebaseApp;
