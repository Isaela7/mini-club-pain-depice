import { AttendanceRecord } from '../types/attendance';
import { Class } from '../types/student';
import { classes } from '../data/students';

interface MonthlyAttendance {
  byClass: Record<string, number>;
  total: number;
}

export function processMonthlyClassAttendance(attendanceHistory: AttendanceRecord[]): Record<string, MonthlyAttendance> {
  if (!Array.isArray(attendanceHistory)) {
    return {};
  }

  return attendanceHistory.reduce((acc, record) => {
    if (!record || typeof record.date !== 'string' || !record.studentId) {
      return acc;
    }

    const dateParts = record.date.split('/');
    if (dateParts.length !== 3) {
      return acc;
    }

    const [, month, year] = dateParts;
    const monthYear = `${month}/${year}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        byClass: Object.fromEntries(classes.map(c => [c, 0])),
        total: 0
      };
    }
    
    const studentIdParts = record.studentId.split('-');
    if (studentIdParts.length < 2) {
      return acc;
    }

    const studentClass = studentIdParts[1];
    if (classes.includes(studentClass as Class)) {
      acc[monthYear].byClass[studentClass] = (acc[monthYear].byClass[studentClass] || 0) + 1;
      acc[monthYear].total++;
    }
    
    return acc;
  }, {} as Record<string, MonthlyAttendance>);
}

export function processDailyAttendance(attendanceHistory: AttendanceRecord[]): Record<string, number> {
  if (!Array.isArray(attendanceHistory)) {
    return {};
  }

  return attendanceHistory.reduce((acc, record) => {
    if (!record || typeof record.date !== 'string') {
      return acc;
    }
    
    acc[record.date] = (acc[record.date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function getMonthlyClassChartData(monthlyAttendance: Record<string, MonthlyAttendance>) {
  const sortedMonths = Object.keys(monthlyAttendance).sort();

  return {
    labels: sortedMonths.map(monthYear => {
      const [month, year] = monthYear.split('/');
      if (!month || !year) return monthYear;
      return `${new Date(2000, parseInt(month) - 1).toLocaleString('fr-FR', { month: 'long' })} ${year}`;
    }),
    datasets: classes.map((className, index) => ({
      label: className,
      data: sortedMonths.map(month => 
        monthlyAttendance[month]?.byClass[className] || 0
      ),
      backgroundColor: `hsl(${index * 360 / classes.length}, 70%, 50%)`,
      borderColor: `hsl(${index * 360 / classes.length}, 70%, 50%)`,
    }))
  };
}

export function getAnnualClassChartData(monthlyAttendance: Record<string, MonthlyAttendance>) {
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

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    datalabels: {
      color: '#fff',
      font: {
        weight: 'bold'
      },
      formatter: (value: number) => value || ''
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
};