import React, { useState } from 'react';
import { PlanningTable } from '../../components/animator/organization/PlanningTable';
import { ContactList } from '../../components/animator/organization/ContactList';
import { DocumentList } from '../../components/animator/organization/DocumentList';

export function OrganizationPage() {
  const [activeTab, setActiveTab] = useState('planning');

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Organisation</h1>
      
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
              Planning
            </button>
            <button
              onClick={() => setActiveTab('contacts')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Coordonnées
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Documents
            </button>
          </nav>
        </div>

        <div className="p-4">
          {activeTab === 'planning' && <PlanningTable />}
          {activeTab === 'contacts' && <ContactList />}
          {activeTab === 'documents' && <DocumentList />}
        </div>
      </div>
    </div>
  );
}