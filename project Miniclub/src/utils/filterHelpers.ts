import type { Student } from '../types/student';
import type { Class } from '../types/student';

export function filterStudentsBySearchTerm(students: Student[], searchTerm: string): Student[] {
  return students.filter(student => 
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

export function filterStudentsByClass(students: Student[], selectedClass: Class | ''): Student[] {
  if (!selectedClass) return students;
  return students.filter(student => student.class === selectedClass);
}

export function filterStudentsByDate(
  students: Student[], 
  selectedDate: string,
  attendanceByDate: Record<string, string[]>
): Student[] {
  if (!selectedDate) return students;
  const presentStudentIds = attendanceByDate[selectedDate] || [];
  return students.filter(student => presentStudentIds.includes(student.id));
}

export function calculateTotals(students: Student[]) {
  const total = students.length;
  const byClass = students.reduce((acc, student) => {
    acc[student.class] = (acc[student.class] || 0) + 1;
    return acc;
  }, {} as Record<Class, number>);
  return { total, byClass };
}