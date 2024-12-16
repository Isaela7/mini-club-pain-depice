import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getAnnualClassChartData } from '../../utils/charts/annualClassChart';
import { chartOptions } from '../../utils/charts/chartOptions';
import type { AttendanceRecord } from '../../types/attendance';

interface AnnualClassChartProps {
  attendanceHistory: AttendanceRecord[];
}

export function AnnualClassChart({ attendanceHistory }: AnnualClassChartProps) {
  const chartData = getAnnualClassChartData(attendanceHistory);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Répartition annuelle par classe</h2>
      <div className="h-[400px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}