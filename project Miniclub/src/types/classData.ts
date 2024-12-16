export interface AttendanceDate {
  date: string;
}

export interface StudentWithAttendance {
  id: string;
  firstName: string;
  lastName: string;
  attendance: string[];
}

export interface ClassData {
  classId: string;
  students: StudentWithAttendance[];
}