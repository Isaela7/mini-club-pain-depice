import { collection, doc, setDoc, getDoc, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ScheduleEntry {
  content: string;
}

export interface ActivitySchedule {
  schedule: Record<string, Record<number, ScheduleEntry>>;
  dates: string[];
  updatedAt: string;
  updatedBy: string;
  isPublished: boolean;
}

const ACTIVITIES_COLLECTION = 'activities';

export async function saveActivitySchedule(
  data: { schedule: Record<string, Record<number, ScheduleEntry>>; dates: string[] },
  userId: string,
  isPublished: boolean = false
): Promise<void> {
  const scheduleData: ActivitySchedule = {
    schedule: data.schedule,
    dates: data.dates,
    updatedAt: new Date().toISOString(),
    updatedBy: userId,
    isPublished
  };

  await setDoc(doc(db, ACTIVITIES_COLLECTION, 'current'), scheduleData);
}

export async function getActivitySchedule(): Promise<ActivitySchedule | null> {
  const docRef = doc(db, ACTIVITIES_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as ActivitySchedule;
  }

  return null;
}

export async function publishActivitySchedule(userId: string): Promise<void> {
  const docRef = doc(db, ACTIVITIES_COLLECTION, 'current');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentData = docSnap.data() as ActivitySchedule;
    await setDoc(docRef, {
      ...currentData,
      isPublished: true,
      updatedAt: new Date().toISOString(),
      updatedBy: userId
    });
  }
}