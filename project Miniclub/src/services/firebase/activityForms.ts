import { collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ActivityFormData {
  title: string;
  date: string;
  duration: string;
  targetAudience: string;
  location: string;
  objectives: string;
  materials: string;
  procedure: string;
  evaluation: string;
}

interface ActivityForm extends ActivityFormData {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

const ACTIVITY_FORMS_COLLECTION = 'activityForms';

export async function saveActivityForm(
  formData: ActivityFormData,
  userId: string
): Promise<void> {
  const formId = `form_${Date.now()}`;
  const now = new Date().toISOString();

  const activityForm: ActivityForm = {
    ...formData,
    id: formId,
    createdAt: now,
    createdBy: userId,
    updatedAt: now,
    updatedBy: userId
  };

  await setDoc(doc(db, ACTIVITY_FORMS_COLLECTION, formId), activityForm);
}

export async function getActivityForm(formId: string): Promise<ActivityForm | null> {
  const docRef = doc(db, ACTIVITY_FORMS_COLLECTION, formId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as ActivityForm;
  }

  return null;
}

export async function downloadActivityForm(): Promise<void> {
  // TODO: Implémenter la logique de téléchargement
  // Cette fonction pourrait générer un PDF ou un document Word
  console.log('Téléchargement de la fiche activité');
}