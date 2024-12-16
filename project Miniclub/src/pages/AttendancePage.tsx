import React from 'react';
import { AttendanceList } from '../components/AttendanceList';

export function AttendancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Pointage</h1>
      <AttendanceList />
    </div>
  );
}