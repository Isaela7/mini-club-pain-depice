import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Provider {
  id: string;
  activityType: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  information: string;
}

const PROVIDERS_COLLECTION = 'providers';

export async function saveProviders(
  providers: Provider[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, PROVIDERS_COLLECTION, 'current'), {
    providers,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getProviders(): Promise<Provider[]> {
  const docRef = doc(db, PROVIDERS_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().providers;
  }

  return [];
}