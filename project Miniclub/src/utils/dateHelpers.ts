import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { AttendanceRecord } from '../types/attendance';

export function formatDateString(date: Date): string {
  return format(date, 'dd/MM/yy', { locale: fr });
}

export function isValidDateFormat(dateStr: string): boolean {
  if (!dateStr) return false;
  const regex = /^(\d{2})\/(\d{2})\/(\d{2})$/;
  if (!regex.test(dateStr)) return false;
  
  const [, day, month, year] = dateStr.match(regex) || [];
  const numDay = parseInt(day, 10);
  const numMonth = parseInt(month, 10);
  const numYear = parseInt(year, 10);
  
  if (numMonth < 1 || numMonth > 12) return false;
  if (numDay < 1 || numDay > 31) return false;
  
  // Vérification plus précise des jours selon le mois
  const daysInMonth = new Date(2000 + numYear, numMonth, 0).getDate();
  return numDay <= daysInMonth;
}

export function parseDate(dateStr: string): Date {
  if (!isValidDateFormat(dateStr)) {
    throw new Error('Invalid date format');
  }
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(2000 + year, month - 1, day);
}

export function getUniqueDatesFromAttendance(attendanceRecords: AttendanceRecord[]): string[] {
  if (!Array.isArray(attendanceRecords)) return [];
  
  return [...new Set(
    attendanceRecords
      .filter(record => record?.date && isValidDateFormat(record.date))
      .map(record => record.date)
  )].sort((a, b) => {
    try {
      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateB.getTime() - dateA.getTime();
    } catch (error) {
      console.error('Error sorting dates:', error);
      return 0;
    }
  });
}

export function groupAttendanceByDate(records: AttendanceRecord[]): Record<string, string[]> {
  if (!Array.isArray(records)) return {};
  
  return records.reduce((acc, record) => {
    try {
      if (!record?.date || !isValidDateFormat(record.date) || !record.studentId) {
        return acc;
      }
      
      if (!acc[record.date]) {
        acc[record.date] = [];
      }
      acc[record.date].push(record.studentId);
      return acc;
    } catch (error) {
      console.error('Error grouping attendance:', error);
      return acc;
    }
  }, {} as Record<string, string[]>);
}