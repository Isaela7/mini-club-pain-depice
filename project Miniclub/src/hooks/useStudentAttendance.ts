import { useMemo } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';
import type { Student } from '../types/student';

export function useStudentAttendance(students: Student[]) {
  const getStudentAttendanceDates = useAttendanceStore(state => state.getStudentAttendanceDates);

  return useMemo(() => 
    students
      .map(student => ({
        ...student,
        attendanceDates: getStudentAttendanceDates(student.id)
      }))
      .sort((a, b) => a.lastName.localeCompare(b.lastName)),
    [students, getStudentAttendanceDates]
  );
}