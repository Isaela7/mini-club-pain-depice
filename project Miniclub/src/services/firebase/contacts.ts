import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  diplomas: string;
  wednesdayTime: string;
  holidayTime: string;
}

const CONTACTS_COLLECTION = 'contacts';

export async function saveContacts(
  contacts: Contact[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, CONTACTS_COLLECTION, 'current'), {
    contacts,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getContacts(): Promise<Contact[]> {
  const docRef = doc(db, CONTACTS_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().contacts;
  }

  return [];
}