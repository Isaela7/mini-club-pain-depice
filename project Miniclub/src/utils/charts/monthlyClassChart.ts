import { AttendanceRecord } from '../../types/attendance';
import { Class } from '../../types/student';
import { classes } from '../../data/students';
import { processMonthlyClassAttendance } from '../attendance/attendanceProcessing';

interface ChartResult {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }>;
  error?: string;
}

export function getMonthlyClassChartData(attendanceHistory: AttendanceRecord[]): ChartResult {
  if (!Array.isArray(attendanceHistory)) {
    return {
      labels: [],
      datasets: [],
      error: 'Données d\'historique invalides'
    };
  }

  try {
    const monthlyAttendance = processMonthlyClassAttendance(attendanceHistory);
    const sortedMonths = Object.keys(monthlyAttendance).sort();

    if (sortedMonths.length === 0) {
      return {
        labels: [],
        datasets: [],
        error: 'Aucune donnée de présence disponible'
      };
    }

    return {
      labels: sortedMonths.map(monthYear => {
        const [month, year] = monthYear.split('/');
        return `${new Date(2000, parseInt(month) - 1).toLocaleString('fr-FR', { month: 'long' })} 20${year}`;
      }),
      datasets: classes.map((className, index) => ({
        label: className,
        data: sortedMonths.map(month => monthlyAttendance[month]?.byClass[className] || 0),
        backgroundColor: `hsl(${index * 360 / classes.length}, 70%, 50%)`,
        borderColor: `hsl(${index * 360 / classes.length}, 70%, 50%)`,
      }))
    };
  } catch (error) {
    console.error('Error generating monthly class chart data:', error);
    return {
      labels: [],
      datasets: [],
      error: 'Erreur lors de la génération des données du graphique'
    };
  }
}