import { format } from 'date-fns';
import type { Student } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

// Stockage local temporaire
const TEMP_STORAGE_KEY = 'temp-attendance';

// Fonction pour sauvegarder temporairement les présences
export function saveTempAttendance(student: Student): void {
  const today = format(new Date(), 'dd/MM/yy');
  const tempStorage = getTempAttendance();
  
  tempStorage.push({
    date: today,
    studentId: student.id
  });
  
  localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(tempStorage));
}

// Fonction pour récupérer les présences temporaires
export function getTempAttendance(): AttendanceRecord[] {
  const stored = localStorage.getItem(TEMP_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Fonction pour nettoyer le stockage temporaire
export function clearTempAttendance(): void {
  localStorage.removeItem(TEMP_STORAGE_KEY);
}