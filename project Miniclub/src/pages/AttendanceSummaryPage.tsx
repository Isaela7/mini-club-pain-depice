import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { students, classes } from '../data/students';
import { useAttendanceStore } from '../store/attendanceStore';
import { getUniqueDatesFromAttendance, groupAttendanceByDate } from '../utils/dateHelpers';
import { AttendanceFilters } from '../components/AttendanceFilters';
import { TotalsSummary } from '../components/TotalsSummary';
import type { Class } from '../types/student';

export function AttendanceSummaryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<Class | ''>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  
  const { 
    getStudentAttendanceDates, 
    attendanceHistory,
    loadHistoricalAttendance 
  } = useAttendanceStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadHistoricalAttendance();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [loadHistoricalAttendance]);

  const uniqueDates = useMemo(() => 
    getUniqueDatesFromAttendance(attendanceHistory),
    [attendanceHistory]
  );

  const attendanceByDate = useMemo(() => 
    groupAttendanceByDate(attendanceHistory),
    [attendanceHistory]
  );

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Filtre par recherche
      const matchesSearch = 
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre par classe
      const matchesClass = !selectedClass || student.class === selectedClass;

      // Filtre par date
      const studentDates = getStudentAttendanceDates(student.id);
      const matchesDate = !selectedDate || studentDates.includes(selectedDate);

      // Un étudiant doit avoir au moins une présence pour apparaître dans la liste
      const hasAttendance = studentDates.length > 0;

      return matchesSearch && matchesClass && matchesDate && hasAttendance;
    });
  }, [searchTerm, selectedClass, selectedDate, getStudentAttendanceDates, attendanceHistory]);

  const totals = useMemo(() => {
    const total = filteredStudents.length;
    const byClass = filteredStudents.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {} as Record<Class, number>);
    return { total, byClass };
  }, [filteredStudents]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Récapitulatif des présences</h1>
      
      <div className="space-y-6">
        <AttendanceFilters
          searchTerm={searchTerm}
          selectedClass={selectedClass}
          selectedDate={selectedDate}
          uniqueDates={uniqueDates}
          classes={classes}
          onSearchChange={setSearchTerm}
          onClassChange={setSelectedClass}
          onDateChange={setSelectedDate}
        />

        <TotalsSummary total={totals.total} byClass={totals.byClass} />

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Classe
                </th>
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
              {filteredStudents.map((student) => {
                const attendanceDates = getStudentAttendanceDates(student.id);
                const isExpanded = expandedStudents.has(student.id);
                
                return (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.class}
                    </td>
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
                            {`${attendanceDates.length} jour${attendanceDates.length > 1 ? 's' : ''} de présence`}
                          </span>
                        </button>
                      </div>
                      {isExpanded && (
                        <div className="pl-6 border-l-2 border-gray-200">
                          {Object.entries(
                            attendanceDates.reduce((acc, date) => {
                              const [day, month, year] = date.split('/');
                              const key = `${month}/${year}`;
                              if (!acc[key]) acc[key] = [];
                              acc[key].push(day);
                              return acc;
                            }, {} as Record<string, string[]>)
                          ).map(([monthYear, days]) => {
                            const [month, year] = monthYear.split('/');
                            const monthName = new Date(2000, parseInt(month) - 1).toLocaleString('fr-FR', { month: 'long' });
                            return (
                              <div key={monthYear} className="mb-2">
                                <div className="font-medium text-gray-700">{`${monthName} 20${year}`}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {days
                                    .sort((a, b) => parseInt(a) - parseInt(b))
                                    .map(day => (
                                      <span
                                        key={`${day}-${monthYear}`}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                                      >
                                        {day}
                                      </span>
                                    ))
                                  }
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}