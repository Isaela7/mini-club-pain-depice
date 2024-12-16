import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../../contexts/animator/AuthContext';
import { savePlanning, getPlanning } from '../../../services/firebase/planning';

interface StaffSchedule {
  id: string;
  name: string;
  arrivalTime: string;
  breakTime: string;
  departureTime: string;
}

interface CanteenSchedule {
  id: string;
  post: string;
  time1130: string;
  time1200: string;
  time1300: string;
}

interface ChildrenSchedule {
  id: string;
  timeSlot: string;
  day1: string;
  day2: string;
  day3: string;
  day4: string;
  day5: string;
}

const DEFAULT_TIME_SLOTS = ['8h-8h30', '8h30-9h', '16h-17h', '17h-18h'];
const CANTEEN_POSTS = ['Pause', 'Cantine primaires', 'Cantine PK'];

export function PlanningTable() {
  const { currentUser } = useAuth();
  const [wednesdayStaff, setWednesdayStaff] = useState<StaffSchedule[]>([]);
  const [holidayStaff, setHolidayStaff] = useState<StaffSchedule[]>([]);
  const [canteenSchedule, setCanteenSchedule] = useState<CanteenSchedule[]>(
    CANTEEN_POSTS.map(post => ({
      id: `canteen_${post.toLowerCase().replace(/\s+/g, '_')}`,
      post,
      time1130: '',
      time1200: '',
      time1300: ''
    }))
  );
  const [childrenSchedule, setChildrenSchedule] = useState<ChildrenSchedule[]>(
    DEFAULT_TIME_SLOTS.map(slot => ({
      id: `children_${slot.replace(/[:-]/g, '_')}`,
      timeSlot: slot,
      day1: '',
      day2: '',
      day3: '',
      day4: '',
      day5: ''
    }))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlanning();
  }, []);

  const loadPlanning = async () => {
    try {
      const planning = await getPlanning();
      if (planning) {
        setWednesdayStaff(planning.wednesdayStaff);
        setHolidayStaff(planning.holidayStaff);
        setCanteenSchedule(planning.canteen);
        setChildrenSchedule(planning.childrenAccompaniment);
      }
    } catch (err) {
      setError("Erreur lors du chargement du planning");
    }
  };

  const handleAddStaff = (type: 'wednesday' | 'holiday') => {
    const newStaff: StaffSchedule = {
      id: `staff_${Date.now()}`,
      name: '',
      arrivalTime: '',
      breakTime: '',
      departureTime: ''
    };
    if (type === 'wednesday') {
      setWednesdayStaff(prev => [...prev, newStaff]);
    } else {
      setHolidayStaff(prev => [...prev, newStaff]);
    }
  };

  const handleUpdateStaff = (
    type: 'wednesday' | 'holiday',
    id: string,
    field: keyof StaffSchedule,
    value: string
  ) => {
    const setter = type === 'wednesday' ? setWednesdayStaff : setHolidayStaff;
    setter(prev => prev.map(staff => 
      staff.id === id ? { ...staff, [field]: value } : staff
    ));
  };

  const handleDeleteStaff = (type: 'wednesday' | 'holiday', id: string) => {
    const setter = type === 'wednesday' ? setWednesdayStaff : setHolidayStaff;
    setter(prev => prev.filter(staff => staff.id !== id));
  };

  const handleUpdateCanteen = (id: string, field: keyof CanteenSchedule, value: string) => {
    setCanteenSchedule(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const handleUpdateChildren = (id: string, field: keyof ChildrenSchedule, value: string) => {
    setChildrenSchedule(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await savePlanning({
        wednesdayStaff,
        holidayStaff,
        canteen: canteenSchedule,
        childrenAccompaniment: childrenSchedule
      }, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde du planning");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStaffTable = (type: 'wednesday' | 'holiday', title: string) => {
    const staff = type === 'wednesday' ? wednesdayStaff : holidayStaff;
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={() => handleAddStaff(type)}
            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pause</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={member.name}
                    onChange={(e) => handleUpdateStaff(type, member.id, 'name', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={member.arrivalTime}
                    onChange={(e) => handleUpdateStaff(type, member.id, 'arrivalTime', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={member.breakTime}
                    onChange={(e) => handleUpdateStaff(type, member.id, 'breakTime', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={member.departureTime}
                    onChange={(e) => handleUpdateStaff(type, member.id, 'departureTime', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteStaff(type, member.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
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

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {renderStaffTable('wednesday', 'Planning Mercredi')}
      {renderStaffTable('holiday', 'Planning Vacances')}

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Planning Cantine</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">11h30-12h</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">12h-13h</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">13h-14h</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {canteenSchedule.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {schedule.post}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.time1130}
                    onChange={(e) => handleUpdateCanteen(schedule.id, 'time1130', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.time1200}
                    onChange={(e) => handleUpdateCanteen(schedule.id, 'time1200', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.time1300}
                    onChange={(e) => handleUpdateCanteen(schedule.id, 'time1300', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Accompagnement enfants</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heures</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour 4</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jour 5</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {childrenSchedule.map((schedule) => (
              <tr key={schedule.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {schedule.timeSlot}
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.day1}
                    onChange={(e) => handleUpdateChildren(schedule.id, 'day1', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.day2}
                    onChange={(e) => handleUpdateChildren(schedule.id, 'day2', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.day3}
                    onChange={(e) => handleUpdateChildren(schedule.id, 'day3', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.day4}
                    onChange={(e) => handleUpdateChildren(schedule.id, 'day4', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={schedule.day5}
                    onChange={(e) => handleUpdateChildren(schedule.id, 'day5', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}