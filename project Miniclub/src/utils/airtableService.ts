import { airtableBase, AIRTABLE_CONFIG } from './airtableConfig';
import { isDateField } from './dateHelpers';
import { historicalAttendance } from '../data/historicalAttendance';
import type { Student, Class } from '../types/student';
import type { AttendanceRecord } from '../types/attendance';

const validateRecord = (record: any): boolean => {
  try {
    return !!(
      record.get('Record_ID') &&
      record.get('NOM') &&
      record.get('Prenom') &&
      record.get('Classe')
    );
  } catch (error) {
    console.error('Error validating record:', error);
    return false;
  }
};

export async function getAllStudents(): Promise<Student[]> {
  try {
    const records = await airtableBase(AIRTABLE_CONFIG.TABLE_NAME)
      .select({
        view: AIRTABLE_CONFIG.VIEW_NAME,
        fields: ['Record_ID', 'NOM', 'Prenom', 'Classe']
      })
      .all();

    return records
      .filter(validateRecord)
      .map(record => ({
        id: String(record.get('Record_ID')),
        lastName: String(record.get('NOM')),
        firstName: String(record.get('Prenom')),
        class: String(record.get('Classe')) as Class
      }));
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
}

export async function getHistoricalAttendance(): Promise<AttendanceRecord[]> {
  try {
    // Temporarily return static data while fixing Airtable authentication
    return historicalAttendance;
    
    /* Commented out until Airtable auth is fixed
    const records = await airtableBase(AIRTABLE_CONFIG.TABLE_NAME)
      .select({
        view: AIRTABLE_CONFIG.VIEW_NAME
      })
      .all();

    const attendance: AttendanceRecord[] = [];

    for (const record of records) {
      const studentId = String(record.get('Record_ID'));
      if (!studentId) continue;

      const fields = record.fields;
      
      Object.entries(fields).forEach(([fieldName, value]) => {
        if (isDateField(fieldName) && value === true) {
          attendance.push({
            date: fieldName,
            studentId: studentId
          });
        }
      });
    }

    return attendance;
    */
  } catch (error) {
    console.error('Error fetching historical attendance:', error);
    return historicalAttendance;
  }
}