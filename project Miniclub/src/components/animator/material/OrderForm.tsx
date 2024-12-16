import React, { useState, useEffect } from 'react';
import { Plus, Save, Download } from 'lucide-react';
import { useAuth } from '../../../contexts/animator/AuthContext';
import { saveOrder, getOrder } from '../../../services/firebase/orders';
import { downloadOrderAsExcel } from '../../../utils/excel';

interface OrderItem {
  id: string;
  supplier: string;
  reference: string;
  name: string;
  quantity: number;
  price: number;
}

export function OrderForm() {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const order = await getOrder();
      if (order) {
        setItems(order);
      }
    } catch (err) {
      setError("Erreur lors du chargement de la commande");
    }
  };

  const handleAddItem = () => {
    const newItem: OrderItem = {
      id: `item_${Date.now()}`,
      supplier: '',
      reference: '',
      name: '',
      quantity: 0,
      price: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof OrderItem, value: string | number) => {
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
      await saveOrder(items, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde de la commande");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    downloadOrderAsExcel(items);
  };

  const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Bon de commande</h2>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </button>
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
                Fournisseur
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantité
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix unitaire (€)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (€)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.supplier}
                    onChange={(e) => handleUpdateItem(item.id, 'supplier', e.target.value)}
                    placeholder="Nom du fournisseur"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.reference}
                    onChange={(e) => handleUpdateItem(item.id, 'reference', e.target.value)}
                  />
                </td>
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
                    type="number"
                    min="0"
                    step="0.01"
                    className="block w-32 text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={item.price}
                    onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {(item.quantity * item.price).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan={5} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                Total
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {total.toFixed(2)} €
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}