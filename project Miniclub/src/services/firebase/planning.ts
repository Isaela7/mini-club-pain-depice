import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface StaffSchedule {
  id: string;
  name: string;
  arrivalTime: string;
  breakTime: string;
  departureTime: string;
}

interface CanteenSchedule {
  id: string;
  post: string;
  time1130: string;
  time1200: string;
  time1300: string;
}

interface ChildrenSchedule {
  id: string;
  timeSlot: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
}

interface PlanningData {
  wednesdayStaff: StaffSchedule[];
  holidayStaff: StaffSchedule[];
  canteen: CanteenSchedule[];
  childrenAccompaniment: ChildrenSchedule[];
}

const PLANNING_COLLECTION = 'planning';

export async function savePlanning(
  data: PlanningData,
  userId: string
): Promise<void> {
  await setDoc(doc(db, PLANNING_COLLECTION, 'current'), {
    ...data,
    updatedAt: new Date().toISOString(),
    updatedBy: userId
  });
}

export async function getPlanning(): Promise<PlanningData | null> {
  const docRef = doc(db, PLANNING_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      wednesdayStaff: data.wednesdayStaff || [],
      holidayStaff: data.holidayStaff || [],
      canteen: data.canteen || [],
      childrenAccompaniment: data.childrenAccompaniment || []
    };
  }

  return null;
}