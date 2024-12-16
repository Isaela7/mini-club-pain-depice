import React from 'react';
import { Search } from 'lucide-react';
import type { Class } from '../types/student';

interface AttendanceFiltersProps {
  searchTerm: string;
  selectedClass: Class | '';
  selectedDate: string;
  uniqueDates: string[];
  classes: readonly Class[];
  onSearchChange: (value: string) => void;
  onClassChange: (value: Class | '') => void;
  onDateChange: (value: string) => void;
}

export function AttendanceFilters({
  searchTerm,
  selectedClass,
  selectedDate,
  uniqueDates,
  classes,
  onSearchChange,
  onClassChange,
  onDateChange
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Rechercher par nom..."
          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <select
        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={selectedClass}
        onChange={(e) => onClassChange(e.target.value as Class)}
      >
        <option value="">Toutes les classes</option>
        {classes.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>
      <select
        className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      >
        <option value="">Toutes les dates</option>
        {uniqueDates.map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>
    </div>
  );
}