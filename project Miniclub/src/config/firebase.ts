import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBMitpSeC6I0N1ta1OpYLdo9ZxGwIcfYvc",
  authDomain: "pointages-pain-d-epice.firebaseapp.com",
  projectId: "pointages-pain-d-epice",
  storageBucket: "pointages-pain-d-epice.firebasestorage.app",
  messagingSenderId: "411490760404",
  appId: "1:411490760404:web:aa82f726be397d4920ed41",
  measurementId: "G-46DQ2DP28V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export app instance
export default app;