import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/animator/AuthContext';
import { saveProviders, getProviders } from '../../services/firebase/providers';

interface Provider {
  id: string;
  activityType: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  information: string;
}

export function ExternalProviderTable() {
  const { currentUser } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const providersData = await getProviders();
      setProviders(providersData);
    } catch (err) {
      setError("Erreur lors du chargement des prestataires");
    }
  };

  const handleAddProvider = () => {
    const newProvider: Provider = {
      id: `provider_${Date.now()}`,
      activityType: '',
      name: '',
      address: '',
      phone: '',
      website: '',
      information: ''
    };
    setProviders(prev => [...prev, newProvider]);
  };

  const handleUpdateProvider = (id: string, field: keyof Provider, value: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === id ? { ...provider, [field]: value } : provider
    ));
  };

  const handleDeleteProvider = (id: string) => {
    setProviders(prev => prev.filter(provider => provider.id !== id));
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveProviders(providers, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde des prestataires");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Prestataires extérieurs</h2>
        <div className="flex gap-4">
          <button
            onClick={handleAddProvider}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isSaving 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type d'activité
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Téléphone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Site web
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Informations
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.activityType}
                    onChange={(e) => handleUpdateProvider(provider.id, 'activityType', e.target.value)}
                    placeholder="Type d'activité"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.name}
                    onChange={(e) => handleUpdateProvider(provider.id, 'name', e.target.value)}
                    placeholder="Nom du prestataire"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.address}
                    onChange={(e) => handleUpdateProvider(provider.id, 'address', e.target.value)}
                    placeholder="Adresse"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="tel"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.phone}
                    onChange={(e) => handleUpdateProvider(provider.id, 'phone', e.target.value)}
                    placeholder="Téléphone"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="url"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.website}
                    onChange={(e) => handleUpdateProvider(provider.id, 'website', e.target.value)}
                    placeholder="Site web"
                  />
                </td>
                <td className="px-6 py-4">
                  <textarea
                    rows={2}
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={provider.information}
                    onChange={(e) => handleUpdateProvider(provider.id, 'information', e.target.value)}
                    placeholder="Informations complémentaires"
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteProvider(provider.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}