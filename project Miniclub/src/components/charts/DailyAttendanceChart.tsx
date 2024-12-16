import React from 'react';
import { Bar } from 'react-chartjs-2';
import { getDailyChartData } from '../../utils/charts/dailyChart';
import { chartOptions } from '../../utils/charts/chartOptions';
import type { AttendanceRecord } from '../../types/attendance';

interface DailyAttendanceChartProps {
  attendanceHistory: AttendanceRecord[];
}

export function DailyAttendanceChart({ attendanceHistory }: DailyAttendanceChartProps) {
  const chartData = getDailyChartData(attendanceHistory);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Présences journalières</h2>
      <div className="h-[400px]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}