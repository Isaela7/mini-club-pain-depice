import React, { useState, useEffect } from 'react';
import { Save, Download, Send } from 'lucide-react';
import { useAuth } from '../../contexts/animator/AuthContext';
import { saveActivitySchedule, getActivitySchedule, publishActivitySchedule, type ActivitySchedule } from '../../services/firebase/activities';
import { downloadScheduleAsExcel } from '../../utils/excel';
import { groupActivitiesByName } from '../../utils/scheduleHelpers';
import { GROUPS } from '../../constants/groups';

interface ScheduleEntry {
  content: string;
}

export function ActivityScheduleTable() {
  const { currentUser } = useAuth();
  const [schedule, setSchedule] = useState<Record<string, Record<number, ScheduleEntry>>>({});
  const [dates, setDates] = useState<string[]>(['', '', '', '', '']);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      const savedSchedule = await getActivitySchedule();
      if (savedSchedule) {
        setSchedule(savedSchedule.schedule);
        setDates(savedSchedule.dates || ['', '', '', '', '']);
      } else {
        // Initialiser un planning vide
        const initialSchedule: Record<string, Record<number, ScheduleEntry>> = {};
        GROUPS.forEach(group => {
          initialSchedule[group.id] = {
            1: { content: '' },
            2: { content: '' },
            3: { content: '' },
            4: { content: '' },
            5: { content: '' }
          };
        });
        setSchedule(initialSchedule);
      }
    } catch (err) {
      setError("Erreur lors du chargement du planning");
    }
  };

  const handleContentChange = (groupId: string, dateIndex: number, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        [dateIndex]: { content: value }
      }
    }));
  };

  const handleDateChange = (index: number, value: string) => {
    setDates(prev => {
      const newDates = [...prev];
      newDates[index] = value;
      return newDates;
    });
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveActivitySchedule({ schedule, dates }, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde du planning");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour publier");
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      await publishActivitySchedule(currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la publication du planning");
    } finally {
      setIsPublishing(false);
    }
  };

  const groupedActivities = groupActivitiesByName(GROUPS);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Planning des activités</h2>
          <div className="flex gap-4">
            <button
              onClick={() => downloadScheduleAsExcel(schedule, dates, GROUPS)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isPublishing 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'}`}
            >
              <Send className="h-4 w-4 mr-2" />
              {isPublishing ? 'Publication...' : 'Publier'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${isSaving 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groupe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <th key={index} scope="col" className="px-6 py-3">
                    <input
                      type="text"
                      placeholder="JJ/MM/AA"
                      className="w-full text-xs font-medium text-gray-500 uppercase bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0"
                      value={dates[index]}
                      onChange={(e) => handleDateChange(index, e.target.value)}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(groupedActivities).map(([groupName, periods]) => (
                periods.map((group, index) => (
                  <tr key={group.id}>
                    {index === 0 && (
                      <td rowSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {groupName}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group.period}
                    </td>
                    {[1, 2, 3, 4, 5].map(dateIndex => (
                      <td key={dateIndex} className="px-6 py-4">
                        <textarea
                          rows={3}
                          className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Activité..."
                          value={schedule[group.id]?.[dateIndex]?.content || ''}
                          onChange={(e) => handleContentChange(group.id, dateIndex, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}