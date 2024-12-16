import React from 'react';
import { students } from '../../data/students';
import { ClassAttendanceView } from '../../components/ClassAttendanceView';

export function CE2Page() {
  const ce2Students = students.filter(student => student.class === 'CE2');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Présences CE2</h1>
      <ClassAttendanceView students={ce2Students} />
    </div>
  );
}