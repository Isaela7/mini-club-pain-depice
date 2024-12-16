import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  class: string;
  activities: string[];
}

interface Registration {
  id: string;
  month: string;
  child: Child;
  activities: string[];
}

const REGISTRATIONS_COLLECTION = 'registrations';

export async function saveRegistration(
  registrations: Registration[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, REGISTRATIONS_COLLECTION, userId), {
    registrations,
    updatedAt: new Date().toISOString()
  });
}

export async function getRegistrations(userId: string): Promise<Registration[]> {
  const docRef = doc(db, REGISTRATIONS_COLLECTION, userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().registrations;
  }

  return [];
}