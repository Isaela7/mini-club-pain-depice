import React from 'react';

interface AttendanceDatesProps {
  dates: string[];
}

export function AttendanceDates({ dates }: AttendanceDatesProps) {
  const groupedDates = dates.reduce((acc, date) => {
    const [day, month, year] = date.split('/');
    const key = `${month}/${year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(day);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="pl-6 border-l-2 border-gray-200">
      {Object.entries(groupedDates).map(([monthYear, days]) => {
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
  );
}