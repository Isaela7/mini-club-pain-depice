import { format } from 'date-fns';
import { markAttendance } from './airtable';
import type { Student } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

const SYNC_STORAGE_KEY = 'attendance-sync-v1';
const SYNC_INTERVAL = 30000; // 30 secondes

interface SyncQueue {
  pending: Array<{
    student: Student;
    date: string;
    timestamp: number;
  }>;
  lastSync: number;
}

// Initialiser la file d'attente de synchronisation
const initSyncQueue = (): SyncQueue => ({
  pending: [],
  lastSync: Date.now()
});

// Obtenir la file d'attente actuelle
export const getSyncQueue = (): SyncQueue => {
  const stored = localStorage.getItem(SYNC_STORAGE_KEY);
  return stored ? JSON.parse(stored) : initSyncQueue();
};

// Sauvegarder la file d'attente
const saveSyncQueue = (queue: SyncQueue) => {
  localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(queue));
};

// Ajouter une présence à la file d'attente
export const queueAttendance = async (student: Student): Promise<void> => {
  const queue = getSyncQueue();
  const today = format(new Date(), 'dd/MM/yy');

  // Vérifier si l'élève n'est pas déjà dans la file d'attente pour aujourd'hui
  const isDuplicate = queue.pending.some(
    item => item.student.id === student.id && item.date === today
  );

  if (!isDuplicate) {
    queue.pending.push({
      student,
      date: today,
      timestamp: Date.now()
    });
    saveSyncQueue(queue);
  }

  // Déclencher une synchronisation immédiate
  await syncWithAirtable();
};

// Synchroniser avec Airtable
export const syncWithAirtable = async (): Promise<void> => {
  const queue = getSyncQueue();
  
  if (queue.pending.length === 0) {
    return;
  }

  // Copier la file d'attente pour le traitement
  const pendingItems = [...queue.pending];
  
  try {
    // Traiter chaque élément de la file d'attente
    for (const item of pendingItems) {
      const success = await markAttendance(item.student);
      
      if (success) {
        // Retirer l'élément traité de la file d'attente
        queue.pending = queue.pending.filter(
          queueItem => !(queueItem.student.id === item.student.id && queueItem.date === item.date)
        );
      }
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation avec Airtable:', error);
  }

  queue.lastSync = Date.now();
  saveSyncQueue(queue);
};

// Démarrer la synchronisation périodique
export const startPeriodicSync = () => {
  setInterval(syncWithAirtable, SYNC_INTERVAL);
};

// Obtenir les enregistrements en attente de synchronisation
export const getPendingRecords = (): AttendanceRecord[] => {
  const queue = getSyncQueue();
  return queue.pending.map(item => ({
    date: item.date,
    studentId: item.student.id
  }));
};