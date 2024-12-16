import { historicalAttendance } from '../data/historicalAttendance';
import type { Student } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

export class AttendanceService {
  static async markAttendance(student: Student): Promise<boolean> {
    try {
      const today = new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });

      historicalAttendance.push({
        date: today,
        studentId: student.id
      });

      return true;
    } catch (error) {
      console.error('Error marking attendance:', error);
      return false;
    }
  }

  static async getAttendanceHistory(): Promise<AttendanceRecord[]> {
    try {
      return Promise.resolve([...historicalAttendance]);
    } catch (error) {
      console.error('Error getting attendance history:', error);
      return [];
    }
  }

  static async getStudentAttendance(studentId: string): Promise<string[]> {
    try {
      return Promise.resolve(
        historicalAttendance
          .filter(record => record.studentId === studentId)
          .map(record => record.date)
      );
    } catch (error) {
      console.error('Error getting student attendance:', error);
      return [];
    }
  }
}