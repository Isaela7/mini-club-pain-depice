import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface OrderItem {
  id: string;
  supplier: string;
  reference: string;
  name: string;
  quantity: number;
  price: number;
}

const ORDERS_COLLECTION = 'orders';

export async function saveOrder(
  items: OrderItem[],
  userId: string
): Promise<void> {
  await setDoc(doc(db, ORDERS_COLLECTION, 'current'), {
    items,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getOrder(): Promise<OrderItem[]> {
  const docRef = doc(db, ORDERS_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().items;
  }

  return [];
}