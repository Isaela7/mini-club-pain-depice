import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import type { Animator } from '../../types/animator';

export async function loginAnimator(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function registerAnimator(
  email: string, 
  password: string, 
  animatorData: Omit<Animator, 'id'>
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Create animator document
  await setDoc(doc(db, 'animators', userCredential.user.uid), {
    ...animatorData,
    createdAt: new Date().toISOString(),
    isActive: true
  });

  return userCredential.user;
}

export async function logoutAnimator(): Promise<void> {
  await signOut(auth);
}

export async function getAnimatorData(userId: string): Promise<Animator | null> {
  const docRef = doc(db, 'animators', userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Animator;
  }
  
  return null;
}