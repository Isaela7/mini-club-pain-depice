import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  location: string;
  notes?: string;
}

const INVENTORY_COLLECTION = 'inventory';

export async function saveInventory(
  items: InventoryItem[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, INVENTORY_COLLECTION, 'current'), {
    items,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getInventory(): Promise<InventoryItem[]> {
  const docRef = doc(db, INVENTORY_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().items;
  }

  return [];
}