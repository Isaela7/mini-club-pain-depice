import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ActivityPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

const PHOTOS_COLLECTION = 'activityPhotos';

export async function getActivityPhotos(): Promise<ActivityPhoto[]> {
  const photosRef = collection(db, PHOTOS_COLLECTION);
  const q = query(photosRef, orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ActivityPhoto[];
}