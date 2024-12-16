import { useEffect } from 'react';
import { useAttendanceStore } from '../store/attendanceStore';

export function useHistoricalData() {
  const { loadHistoricalAttendance, isHistoricalDataLoaded, attendanceHistory } = useAttendanceStore();

  useEffect(() => {
    if (!isHistoricalDataLoaded || attendanceHistory.length === 0) {
      loadHistoricalAttendance();
    }
  }, [isHistoricalDataLoaded, attendanceHistory.length, loadHistoricalAttendance]);

  return { isHistoricalDataLoaded, attendanceHistory };
}