import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
  orderBy 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import type { InviteCode } from '../../types/animator';

const INVITE_CODES_COLLECTION = 'inviteCodes';

export async function createInviteCode(email: string): Promise<InviteCode> {
  // Générer un code unique de 8 caractères
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  // Date d'expiration (7 jours)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const inviteCode: Omit<InviteCode, 'id'> = {
    code,
    email,
    expiresAt: expiresAt.toISOString(),
    used: false,
    createdAt: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, INVITE_CODES_COLLECTION), inviteCode);
  
  return {
    ...inviteCode,
    id: docRef.id
  };
}

export async function validateInviteCode(code: string, email: string): Promise<boolean> {
  const inviteCodesRef = collection(db, INVITE_CODES_COLLECTION);
  const q = query(
    inviteCodesRef,
    where('code', '==', code),
    where('email', '==', email),
    where('used', '==', false)
  );

  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return false;
  }

  const inviteCode = querySnapshot.docs[0].data();
  const expiresAt = new Date(inviteCode.expiresAt);
  
  if (expiresAt < new Date()) {
    return false;
  }

  // Marquer le code comme utilisé
  await updateDoc(querySnapshot.docs[0].ref, {
    used: true,
    usedAt: new Date().toISOString()
  });

  return true;
}

export async function getInviteCodes(): Promise<InviteCode[]> {
  const inviteCodesRef = collection(db, INVITE_CODES_COLLECTION);
  const q = query(inviteCodesRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as InviteCode[];
}

export async function deleteInviteCode(codeId: string): Promise<void> {
  await deleteDoc(doc(db, INVITE_CODES_COLLECTION, codeId));
}