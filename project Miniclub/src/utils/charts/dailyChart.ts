import { AttendanceRecord } from '../../types/attendance';
import { parseDate } from '../dateHelpers';
import { processDailyAttendance } from '../attendance/attendanceProcessing';

export function getDailyChartData(attendanceHistory: AttendanceRecord[]) {
  const dailyAttendance = processDailyAttendance(attendanceHistory);
  const sortedDates = Object.keys(dailyAttendance).sort((a, b) => {
    const dateA = parseDate(a);
    const dateB = parseDate(b);
    return dateA.getTime() - dateB.getTime();
  });

  return {
    labels: sortedDates,
    datasets: [{
      label: 'Présences',
      data: sortedDates.map(date => dailyAttendance[date]),
      backgroundColor: 'rgb(54, 162, 235)',
      borderColor: 'rgb(54, 162, 235)',
    }]
  };
}