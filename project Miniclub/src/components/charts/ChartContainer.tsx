import React from 'react';
import { Bar } from 'react-chartjs-2';
import { chartOptions } from '../../utils/charts/chartOptions';

interface ChartContainerProps {
  title: string;
  data: any;
  isLoading?: boolean;
  error?: string;
}

export function ChartContainer({ title, data, isLoading, error }: ChartContainerProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Chargement des données...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!data || !data.datasets || data.datasets.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Aucune donnée disponible</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <div className="h-[400px]">
        <Bar data={data} options={chartOptions} />
      </div>
    </div>
  );
}