import React from 'react';
import { ChartContainer } from './ChartContainer';
import { getMonthlyClassChartData } from '../../utils/charts/monthlyClassChart';
import type { AttendanceRecord } from '../../types/attendance';

interface MonthlyClassChartProps {
  attendanceHistory: AttendanceRecord[];
}

export function MonthlyClassChart({ attendanceHistory }: MonthlyClassChartProps) {
  const chartData = getMonthlyClassChartData(attendanceHistory);

  return (
    <ChartContainer
      title="Présences mensuelles par classe"
      data={chartData}
      error={chartData.error}
    />
  );
}