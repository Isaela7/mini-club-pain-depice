import { AttendanceRecord } from '../../types/attendance';
import { classes } from '../../data/students';
import { processMonthlyClassAttendance } from '../attendance/attendanceProcessing';

export function getAnnualClassChartData(attendanceHistory: AttendanceRecord[]) {
  const monthlyAttendance = processMonthlyClassAttendance(attendanceHistory);
  
  const totalsByClass = classes.reduce((acc, className) => {
    acc[className] = Object.values(monthlyAttendance).reduce(
      (sum, month) => sum + (month.byClass[className] || 0),
      0
    );
    return acc;
  }, {} as Record<string, number>);

  return {
    labels: classes,
    datasets: [{
      label: 'Total des présences',
      data: classes.map(className => totalsByClass[className]),
      backgroundColor: classes.map((_, index) => 
        `hsl(${index * 360 / classes.length}, 70%, 50%)`
      ),
    }]
  };
}