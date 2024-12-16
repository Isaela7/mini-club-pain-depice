import React from 'react';
import { ExternalLink } from 'lucide-react';

export function RegistrationPage() {
  const formUrl = "https://airtable.com/appcCfYyjYopeJz6l/pag2OInjmlecCPUNB/form";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Inscription</h1>
      
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-6">
          Pour inscrire votre enfant, veuillez remplir le formulaire en ligne en cliquant sur le bouton ci-dessous.
        </p>
        
        <a
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Accéder au formulaire d'inscription
        </a>
      </div>
    </div>
  );
}