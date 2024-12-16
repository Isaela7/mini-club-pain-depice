export interface AttendanceRecord {
  date: string;
  studentId: string;
}

export interface AttendanceData {
  records: AttendanceRecord[];
}

export interface StudentAttendance {
  studentId: string;
  dates: string[];
}