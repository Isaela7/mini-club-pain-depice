import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';
import { AttendanceService } from '../services/attendanceService';
import type { Student } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

interface AttendanceState {
  presentStudents: Student[];
  attendanceHistory: AttendanceRecord[];
  markedStudents: string[];
  isHistoricalDataLoaded: boolean;
  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  getStudentAttendanceDates: (studentId: string) => string[];
  isStudentPresent: (studentId: string) => boolean;
  loadHistoricalAttendance: () => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      presentStudents: [],
      attendanceHistory: [],
      markedStudents: [],
      isHistoricalDataLoaded: false,

      addStudent: async (student) => {
        const { markedStudents } = get();
        if (markedStudents.includes(student.id)) {
          return;
        }

        const today = format(new Date(), 'dd/MM/yy');
        const success = await AttendanceService.markAttendance(student);

        if (success) {
          set(state => ({
            presentStudents: [...state.presentStudents, student],
            attendanceHistory: [...state.attendanceHistory, { date: today, studentId: student.id }],
            markedStudents: [...state.markedStudents, student.id]
          }));
        }
      },

      removeStudent: (studentId) => {
        set(state => ({
          presentStudents: state.presentStudents.filter(s => s.id !== studentId),
          markedStudents: state.markedStudents.filter(id => id !== studentId)
        }));
      },

      getStudentAttendanceDates: (studentId) => {
        const { attendanceHistory } = get();
        return [...new Set(
          attendanceHistory
            .filter(record => record.studentId === studentId)
            .map(record => record.date)
        )].sort((a, b) => {
          const [dayA, monthA, yearA] = a.split('/').map(Number);
          const [dayB, monthB, yearB] = b.split('/').map(Number);
          const dateA = new Date(2000 + yearA, monthA - 1, dayA);
          const dateB = new Date(2000 + yearB, monthB - 1, dayB);
          return dateB.getTime() - dateA.getTime();
        });
      },

      isStudentPresent: (studentId) => {
        return get().markedStudents.includes(studentId);
      },

      loadHistoricalAttendance: async () => {
        try {
          const history = await AttendanceService.getAttendanceHistory();
          set({ 
            attendanceHistory: history,
            isHistoricalDataLoaded: true 
          });
        } catch (error) {
          console.error('Error loading historical attendance:', error);
        }
      }
    }),
    {
      name: 'attendance-storage-v32',
      partialize: (state) => ({
        presentStudents: state.presentStudents,
        attendanceHistory: state.attendanceHistory,
        markedStudents: state.markedStudents
      })
    }
  )
);