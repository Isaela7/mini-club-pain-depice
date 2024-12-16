import { AttendanceRecord } from '../../types/attendance';
import { Class } from '../../types/student';
import { classes } from '../../data/students';
import { parseDate, isValidDateFormat } from '../dateHelpers';

interface MonthlyAttendance {
  byClass: Record<Class, number>;
  total: number;
}

function getStudentClassFromId(studentId: string): Class | null {
  const parts = studentId.split('-');
  return parts.length >= 2 && classes.includes(parts[1] as Class) ? parts[1] as Class : null;
}

export function processMonthlyClassAttendance(attendanceHistory: AttendanceRecord[]): Record<string, MonthlyAttendance> {
  if (!Array.isArray(attendanceHistory)) {
    console.warn('Invalid attendance history provided');
    return {};
  }

  return attendanceHistory.reduce((acc, record) => {
    try {
      if (!record?.date || !record?.studentId || !isValidDateFormat(record.date)) {
        return acc;
      }

      const [, month, year] = record.date.split('/');
      const monthYear = `${month}/${year}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          byClass: Object.fromEntries(classes.map(c => [c, 0])) as Record<Class, number>,
          total: 0
        };
      }
      
      const studentClass = getStudentClassFromId(record.studentId);
      if (studentClass) {
        acc[monthYear].byClass[studentClass]++;
        acc[monthYear].total++;
      }
      
      return acc;
    } catch (error) {
      console.error('Error processing attendance record:', error);
      return acc;
    }
  }, {} as Record<string, MonthlyAttendance>);
}

export function processDailyAttendance(attendanceHistory: AttendanceRecord[]): Record<string, number> {
  if (!Array.isArray(attendanceHistory)) {
    console.warn('Invalid attendance history provided');
    return {};
  }

  return attendanceHistory.reduce((acc, record) => {
    try {
      if (!record?.date || !isValidDateFormat(record.date)) {
        return acc;
      }
      
      acc[record.date] = (acc[record.date] || 0) + 1;
      return acc;
    } catch (error) {
      console.error('Error processing daily attendance:', error);
      return acc;
    }
  }, {} as Record<string, number>);
}