import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useAttendanceStore } from '../store/attendanceStore';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { MonthlyClassChart } from '../components/charts/MonthlyClassChart';
import { DailyAttendanceChart } from '../components/charts/DailyAttendanceChart';
import { AnnualClassChart } from '../components/charts/AnnualClassChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export function StatisticsPage() {
  const { loadHistoricalAttendance } = useAttendanceStore();
  const { attendanceHistory, isHistoricalDataLoaded } = useHistoricalData();

  useEffect(() => {
    loadHistoricalAttendance();
  }, [loadHistoricalAttendance]);

  if (!isHistoricalDataLoaded || !Array.isArray(attendanceHistory)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Statistiques de présence</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <MonthlyClassChart attendanceHistory={attendanceHistory} />
        <DailyAttendanceChart attendanceHistory={attendanceHistory} />
        <AnnualClassChart attendanceHistory={attendanceHistory} />
      </div>
    </div>
  );
}