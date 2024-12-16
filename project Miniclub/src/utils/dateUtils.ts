export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });
};

export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

export const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(2000 + year, month - 1, day);
};

export const compareDates = (dateA: string, dateB: string): number => {
  const dateObjA = parseDateString(dateA);
  const dateObjB = parseDateString(dateB);
  return dateObjB.getTime() - dateObjA.getTime();
};