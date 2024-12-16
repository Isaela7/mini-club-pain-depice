import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Menu {
  id: string;
  date: string;
  lunch: {
    starter: string;
    main: string;
    side: string;
    dessert: string;
  };
  snack: string;
}

const MENUS_COLLECTION = 'menus';

export async function getMenus(): Promise<Menu[]> {
  const menusRef = collection(db, MENUS_COLLECTION);
  const q = query(menusRef, orderBy('date', 'asc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Menu[];
}