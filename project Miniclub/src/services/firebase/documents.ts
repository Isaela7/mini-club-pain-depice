import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Document {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  uploadDate: string;
}

const DOCUMENTS_COLLECTION = 'documents';

export async function saveDocuments(
  documents: Document[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, DOCUMENTS_COLLECTION, 'current'), {
    documents,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getDocuments(): Promise<Document[]> {
  const docRef = doc(db, DOCUMENTS_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().documents;
  }

  return [];
}