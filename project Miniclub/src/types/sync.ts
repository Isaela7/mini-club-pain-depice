import type { Student } from './student';

export interface SyncItem {
  student: Student;
  date: string;
  timestamp: number;
  retryCount: number;
}

export interface SyncQueue {
  pending: SyncItem[];
  lastSync: number;
}