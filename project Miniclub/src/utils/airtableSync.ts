import Airtable from 'airtable';
import { format } from 'date-fns';
import type { Student } from '../types/student';

const AIRTABLE_API_KEY = 'patOtSXRwHnBlbmvN.5a3562325398f121c04ef20bdce08866d960d83c6b38484d063ea3cf6b966072';
const BASE_ID = 'appcCfYyjYopeJz6l';
const TABLE_NAME = 'Eff. M';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID);

export async function syncAttendance(student: Student): Promise<boolean> {
  try {
    const today = format(new Date(), 'dd/MM/yy');
    
    // Rechercher l'enregistrement de l'élève
    const records = await base(TABLE_NAME).select({
      filterByFormula: `{ID} = '${student.id}'`
    }).firstPage();

    if (records.length === 0) {
      console.error(`Élève non trouvé: ${student.id}`);
      return false;
    }

    // Mettre à jour la présence
    await base(TABLE_NAME).update([{
      id: records[0].id,
      fields: {
        [today]: true
      }
    }]);

    console.log(`Présence synchronisée pour ${student.firstName} ${student.lastName}`);
    return true;
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
    return false;
  }
}