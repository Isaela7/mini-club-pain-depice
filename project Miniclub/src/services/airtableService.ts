import Airtable from 'airtable';
import { AIRTABLE_CONFIG } from '../config/airtable';
import type { Student } from '../types/student';

const base = new Airtable({ apiKey: AIRTABLE_CONFIG.API_KEY }).base(AIRTABLE_CONFIG.BASE_ID);

export class AirtableService {
  static async findStudent(studentId: string) {
    try {
      const records = await base(AIRTABLE_CONFIG.TABLE_NAME).select({
        filterByFormula: `{ID} = '${studentId}'`
      }).firstPage();
      
      return records[0];
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'élève:', error);
      return null;
    }
  }

  static async updateAttendance(recordId: string, date: string) {
    try {
      await base(AIRTABLE_CONFIG.TABLE_NAME).update([{
        id: recordId,
        fields: {
          [date]: true
        }
      }]);
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la présence:', error);
      return false;
    }
  }
}