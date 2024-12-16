import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { Animator } from '../../types/animator';

interface AuthContextType {
  currentUser: User | null;
  animator: Animator | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AnimatorAuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [animator, setAnimator] = useState<Animator | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const animatorDoc = await getDoc(doc(db, 'animators', user.uid));
        if (animatorDoc.exists()) {
          setAnimator({ id: animatorDoc.id, ...animatorDoc.data() } as Animator);
        }
      } else {
        setAnimator(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Créer le document de l'animateur
    await setDoc(doc(db, 'animators', userCredential.user.uid), {
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      isActive: true
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    animator,
    login,
    register,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AnimatorAuthProvider');
  }
  return context;
}