import React, { useState, useEffect } from 'react';
import { getActivitySchedule } from '../../services/firebase/activities';
import { getActivityPhotos } from '../../services/firebase/photos';
import { GROUPS } from '../../constants/groups';
import { groupActivitiesByName } from '../../utils/scheduleHelpers';

interface ActivityPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export function ParentActivitiesPage() {
  const [schedule, setSchedule] = useState<any>(null);
  const [photos, setPhotos] = useState<ActivityPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [scheduleData, photosData] = await Promise.all([
        getActivitySchedule(),
        getActivityPhotos()
      ]);

      setSchedule(scheduleData);
      setPhotos(photosData);
    } catch (err) {
      setError("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const groupedActivities = groupActivitiesByName(GROUPS);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Activités</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Planning des activités */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Planning des activités</h2>
          {schedule?.isPublished ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Groupe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Période
                    </th>
                    {schedule.dates.map((date: string, index: number) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {date}
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
                        {[1, 2, 3, 4, 5].map(index => (
                          <td key={index} className="px-6 py-4 text-sm text-gray-900">
                            {schedule.schedule[group.id]?.[index]?.content || ''}
                          </td>
                        ))}
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Aucun planning disponible pour le moment</p>
          )}
        </div>

        {/* Photos des activités */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Photos des activités</h2>
          {photos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map(photo => (
                <div key={photo.id} className="relative">
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-sm">{photo.caption}</p>
                    <p className="text-xs">{photo.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucune photo disponible pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}