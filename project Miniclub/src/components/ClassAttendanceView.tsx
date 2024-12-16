import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useClassAttendanceStore } from '../store/classAttendanceStore';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { AttendanceDates } from './AttendanceDates';
import type { Student } from '../types/student';

interface ClassAttendanceViewProps {
  students: Student[];
}

export function ClassAttendanceView({ students }: ClassAttendanceViewProps) {
  const [expandedStudents, setExpandedStudents] = React.useState<Set<string>>(new Set());
  const { getClassData, updateClassData } = useClassAttendanceStore();
  const { isHistoricalDataLoaded } = useHistoricalData();
  const classId = students[0]?.class;

  useEffect(() => {
    if (isHistoricalDataLoaded) {
      updateClassData();
    }
  }, [isHistoricalDataLoaded, updateClassData]);

  const classData = classId ? getClassData(classId) : undefined;

  const toggleExpand = (studentId: string) => {
    setExpandedStudents(prev => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  if (!isHistoricalDataLoaded || !classData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Présences
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classData.students.map((student) => {
              const isExpanded = expandedStudents.has(student.id);
              
              return (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.firstName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => toggleExpand(student.id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                        <span className="ml-1">
                          {`${student.attendance.length} jour${student.attendance.length > 1 ? 's' : ''} de présence`}
                        </span>
                      </button>
                    </div>
                    {isExpanded && student.attendance.length > 0 && (
                      <AttendanceDates dates={student.attendance} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}