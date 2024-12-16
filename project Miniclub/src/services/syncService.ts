import { format } from 'date-fns';
import { AirtableService } from './airtableService';
import type { Student } from '../types/student';
import type { SyncItem, SyncQueue } from '../types/sync';

const SYNC_STORAGE_KEY = 'attendance-sync-v1';

export class SyncService {
  private static queue: SyncQueue = {
    pending: [],
    lastSync: Date.now()
  };

  static init() {
    this.loadQueue();
    this.startPeriodicSync();
  }

  private static loadQueue() {
    const stored = localStorage.getItem(SYNC_STORAGE_KEY);
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }

  private static saveQueue() {
    localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(this.queue));
  }

  static async queueAttendance(student: Student): Promise<void> {
    const today = format(new Date(), 'dd/MM/yy');
    
    const isDuplicate = this.queue.pending.some(
      item => item.student.id === student.id && item.date === today
    );

    if (!isDuplicate) {
      const syncItem: SyncItem = {
        student,
        date: today,
        timestamp: Date.now(),
        retryCount: 0
      };
      
      this.queue.pending.push(syncItem);
      this.saveQueue();
      await this.sync();
    }
  }

  private static async sync() {
    if (this.queue.pending.length === 0) return;

    for (const item of [...this.queue.pending]) {
      const record = await AirtableService.findStudent(item.student.id);
      
      if (record) {
        const success = await AirtableService.updateAttendance(record.id, item.date);
        
        if (success) {
          this.queue.pending = this.queue.pending.filter(
            queueItem => !(queueItem.student.id === item.student.id && queueItem.date === item.date)
          );
          console.log(`Présence synchronisée pour ${item.student.firstName} ${item.student.lastName}`);
        } else if (item.retryCount < 3) {
          item.retryCount++;
          console.log(`Tentative ${item.retryCount}/3 pour ${item.student.firstName} ${item.student.lastName}`);
        } else {
          console.error(`Échec de synchronisation après 3 tentatives pour ${item.student.firstName} ${item.student.lastName}`);
        }
      }
    }

    this.queue.lastSync = Date.now();
    this.saveQueue();
  }

  private static startPeriodicSync() {
    setInterval(() => this.sync(), 30000);
  }

  static getPendingCount(): number {
    return this.queue.pending.length;
  }
}