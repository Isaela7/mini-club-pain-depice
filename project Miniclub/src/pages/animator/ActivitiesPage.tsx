import React, { useState } from 'react';
import { ActivityScheduleTable } from '../../components/animator/ActivityScheduleTable';
import { ActivityForm } from '../../components/animator/ActivityForm';
import { ExternalProviderTable } from '../../components/animator/ExternalProviderTable';

export function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Activités</h1>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('planning')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'planning'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Planning des activités
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'form'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Fiche activité
            </button>
            <button
              onClick={() => setActiveTab('providers')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'providers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Prestataire extérieur
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'planning' && <ActivityScheduleTable />}
          {activeTab === 'form' && <ActivityForm />}
          {activeTab === 'providers' && <ExternalProviderTable />}
        </div>
      </div>
    </div>
  );
}