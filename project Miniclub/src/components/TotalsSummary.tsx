import React from 'react';
import type { Class } from '../types/student';

interface TotalsSummaryProps {
  total: number;
  byClass: Record<Class, number>;
}

export function TotalsSummary({ total, byClass }: TotalsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Totaux</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm text-blue-600">Total</div>
          <div className="text-2xl font-semibold text-blue-900">{total}</div>
        </div>
        {Object.entries(byClass).map(([className, count]) => (
          <div key={className} className="bg-green-50 p-3 rounded-md">
            <div className="text-sm text-green-600">{className}</div>
            <div className="text-2xl font-semibold text-green-900">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}