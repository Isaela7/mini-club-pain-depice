import React, { useState } from 'react';
import { Inventory } from '../../components/animator/material/Inventory';
import { OrderForm } from '../../components/animator/material/OrderForm';

export function MaterialPage() {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Matériel</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Inventaire
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'order'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Commande
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'inventory' ? (
            <Inventory />
          ) : (
            <OrderForm />
          )}
        </div>
      </div>
    </div>
  );
}