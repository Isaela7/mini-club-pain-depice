import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';
import { useAuth } from '../../contexts/animator/AuthContext';
import { saveActivityForm, downloadActivityForm } from '../../services/firebase/activityForms';

interface ActivityFormData {
  title: string;
  date: string;
  duration: string;
  targetAudience: 'Costauds' | 'Maous Costauds' | 'Loustics' | '';
  location: 'Salle' | 'Cour' | 'Parc' | 'Réfectoire' | 'Autre' | '';
  objectives: string;
  materials: string;
  procedure: string;
  evaluation: string;
}

const TARGET_AUDIENCES = ['Costauds', 'Maous Costauds', 'Loustics'] as const;
const LOCATIONS = ['Salle', 'Cour', 'Parc', 'Réfectoire', 'Autre'] as const;

export function ActivityForm() {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<ActivityFormData>({
    title: '',
    date: '',
    duration: '',
    targetAudience: '',
    location: '',
    objectives: '',
    materials: '',
    procedure: '',
    evaluation: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof ActivityFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      await saveActivityForm(formData, currentUser.uid);
      setSuccessMessage("Fiche d'activité sauvegardée avec succès");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors de la sauvegarde de la fiche");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadActivityForm();
      setSuccessMessage("Fiche d'activité téléchargée");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Erreur lors du téléchargement de la fiche");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Fiche activité</h2>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isSaving 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{successMessage}</h3>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titre
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="text"
              id="date"
              placeholder="JJ/MM/AA"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Durée
            </label>
            <input
              type="text"
              id="duration"
              value={formData.duration}
              onChange={(e) => handleChange('duration', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
              Public concerné
            </label>
            <select
              id="targetAudience"
              value={formData.targetAudience}
              onChange={(e) => handleChange('targetAudience', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner un public</option>
              {TARGET_AUDIENCES.map(audience => (
                <option key={audience} value={audience}>
                  {audience}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Lieu
            </label>
            <select
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Sélectionner un lieu</option>
              {LOCATIONS.map(location => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
            Objectifs
          </label>
          <textarea
            id="objectives"
            rows={3}
            value={formData.objectives}
            onChange={(e) => handleChange('objectives', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700">
            Matériel nécessaire
          </label>
          <textarea
            id="materials"
            rows={3}
            value={formData.materials}
            onChange={(e) => handleChange('materials', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="procedure" className="block text-sm font-medium text-gray-700">
            Déroulement
          </label>
          <textarea
            id="procedure"
            rows={6}
            value={formData.procedure}
            onChange={(e) => handleChange('procedure', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="evaluation" className="block text-sm font-medium text-gray-700">
            Evaluation
          </label>
          <textarea
            id="evaluation"
            rows={3}
            value={formData.evaluation}
            onChange={(e) => handleChange('evaluation', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </form>
    </div>
  );
}