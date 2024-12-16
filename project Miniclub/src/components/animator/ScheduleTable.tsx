import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface ScheduleEntry {
  group: string;
  period: string;
  content: string;
}

const GROUPS = ['CM/CE2', 'CE1/CP', 'PK3&4', 'PK1&2'];
const PERIODS = ['Matin 9h-11h30', 'APM 13h30-15h30'];

export function ScheduleTable() {
  const [schedule, setSchedule] = useState<Record<string, Record<string, string>>>(() => {
    const initialSchedule: Record<string, Record<string, string>> = {};
    GROUPS.forEach(group => {
      initialSchedule[group] = {};
      PERIODS.forEach(period => {
        initialSchedule[group][period] = '';
      });
    });
    return initialSchedule;
  });

  const handleChange = (group: string, period: string, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [period]: value
      }
    }));
  };

  const handleSave = () => {
    // TODO: Implémenter la sauvegarde dans Firebase
    console.log('Schedule to save:', schedule);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Planning des activités</h2>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groupes
                </th>
                {PERIODS.map(period => (
                  <th key={period} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {GROUPS.map(group => (
                <tr key={group}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {group}
                  </td>
                  {PERIODS.map(period => (
                    <td key={`${group}-${period}`} className="px-6 py-4 whitespace-nowrap">
                      <textarea
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Entrez l'activité..."
                        value={schedule[group][period]}
                        onChange={(e) => handleChange(group, period, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}