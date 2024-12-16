import React, { useState, useEffect } from 'react';
import { Plus, Save, Search } from 'lucide-react';
import { useAuth } from '../../../contexts/animator/AuthContext';
import { saveInventory, getInventory } from '../../../services/firebase/inventory';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  location: string;
  notes?: string;
}

export function Inventory() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const inventory = await getInventory();
      if (inventory) {
        setItems(inventory);
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'inventaire");
    }
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `item_${Date.now()}`,
      name: '',
      quantity: 0,
      category: '',
      location: '',
      notes: ''
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InventoryItem, value: string | number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveInventory(items, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde de l'inventaire");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher dans l'inventaire..."
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emplacement
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.name}
                    onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min="0"
                    className="block w-24 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.quantity}
                    onChange={(e) => handleUpdateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.category}
                    onChange={(e) => handleUpdateItem(item.id, 'category', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.location}
                    onChange={(e) => handleUpdateItem(item.id, 'location', e.target.value)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.notes || ''}
                    onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}