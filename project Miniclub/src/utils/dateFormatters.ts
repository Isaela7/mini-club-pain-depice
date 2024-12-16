export function formatMonthYear(month: string, year: string): string {
  const monthName = new Date(2000, parseInt(month) - 1).toLocaleString('fr-FR', { month: 'long' });
  return `${monthName} 20${year}`;
}

export function groupDatesByMonth(dates: string[]): Record<string, string[]> {
  return dates.reduce((acc, date) => {
    const [day, month, year] = date.split('/');
    const key = `${month}/${year}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(day);
    return acc;
  }, {} as Record<string, string[]>);
}

export function formatAttendanceDates(dates: string[], isExpanded: boolean) {
  if (dates.length === 0) return "Aucune présence";
  
  if (!isExpanded) {
    return `${dates.length} jour${dates.length > 1 ? 's' : ''} de présence`;
  }

  const groupedDates = groupDatesByMonth(dates);

  return Object.entries(groupedDates).map(([monthYear, days]) => {
    const [month, year] = monthYear.split('/');
    return {
      monthYear: formatMonthYear(month, year),
      days: days.sort((a, b) => parseInt(a) - parseInt(b))
    };
  });
}