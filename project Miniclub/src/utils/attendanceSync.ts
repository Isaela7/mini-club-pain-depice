import { format } from 'date-fns';
import type { Student } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

// Clé pour le stockage local
const ATTENDANCE_STORAGE_KEY = 'attendance-records';

interface SyncedAttendance {
  records: AttendanceRecord[];
  lastSync: string;
}

// Sauvegarder une présence
export async function saveAttendance(student: Student): Promise<void> {
  const today = format(new Date(), 'dd/MM/yy');
  const record: AttendanceRecord = {
    date: today,
    studentId: student.id
  };

  // Récupérer les enregistrements existants
  const currentStorage = getStoredAttendance();
  
  // Ajouter le nouvel enregistrement
  currentStorage.records.push(record);
  currentStorage.lastSync = new Date().toISOString();
  
  // Sauvegarder dans le stockage local
  localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(currentStorage));
}

// Récupérer les présences stockées
export function getStoredAttendance(): SyncedAttendance {
  const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (!stored) {
    return {
      records: [],
      lastSync: new Date().toISOString()
    };
  }
  return JSON.parse(stored);
}

// Nettoyer le stockage
export function clearStoredAttendance(): void {
  localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
}