import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { students } from '../data/students';
import { useAttendanceStore } from './attendanceStore';
import type { ClassData } from '../types/classData';
import type { Class } from '../types/student';

const processAttendanceData = () => {
  const classesData: ClassData[] = [];
  const { attendanceHistory } = useAttendanceStore.getState();
  
  const studentsByClass = students.reduce((acc, student) => {
    if (!acc[student.class]) {
      acc[student.class] = [];
    }
    acc[student.class].push(student);
    return acc;
  }, {} as Record<Class, typeof students>);

  const attendanceMap = attendanceHistory.reduce((acc, record) => {
    if (!acc[record.studentId]) {
      acc[record.studentId] = [];
    }
    if (!acc[record.studentId].includes(record.date)) {
      acc[record.studentId].push(record.date);
    }
    return acc;
  }, {} as Record<string, string[]>);
  
  Object.entries(studentsByClass).forEach(([classId, classStudents]) => {
    const studentsWithAttendance = classStudents.map(student => ({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      attendance: (attendanceMap[student.id] || []).sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('/').map(Number);
        const [dayB, monthB, yearB] = b.split('/').map(Number);
        const dateA = new Date(2000 + yearA, monthA - 1, dayA);
        const dateB = new Date(2000 + yearB, monthB - 1, dayB);
        return dateB.getTime() - dateA.getTime();
      })
    }));

    classesData.push({
      classId: classId as Class,
      students: studentsWithAttendance.sort((a, b) => a.lastName.localeCompare(b.lastName))
    });
  });

  return classesData;
};

export const useClassAttendanceStore = create<{
  classesData: ClassData[];
  getClassData: (classId: Class) => ClassData | undefined;
  updateClassData: () => void;
}>()(
  persist(
    (set, get) => ({
      classesData: processAttendanceData(),

      getClassData: (classId) => {
        return get().classesData.find(data => data.classId === classId);
      },

      updateClassData: () => {
        set({ classesData: processAttendanceData() });
      }
    }),
    {
      name: 'class-attendance-storage-v10'
    }
  )
);

useAttendanceStore.subscribe((state, prevState) => {
  if (state.attendanceHistory !== prevState.attendanceHistory) {
    useClassAttendanceStore.getState().updateClassData();
  }
});