import Airtable from 'airtable';

export const AIRTABLE_CONFIG = {
  API_KEY: 'patOtSXRwHnBlbmvN.5a3562325398f121c04ef20bdce08866d960d83c6b38484d063ea3cf6b966072',
  BASE_ID: 'appcCfYyjYopeJz6l',
  TABLE_NAME: 'Eff. M',
  VIEW_NAME: 'Grid view'
};

// Initialize Airtable with explicit configuration
export const airtableBase = new Airtable({ 
  apiKey: AIRTABLE_CONFIG.API_KEY,
  endpointUrl: 'https://api.airtable.com'
}).base(AIRTABLE_CONFIG.BASE_ID);

// Add error handling wrapper
export const handleAirtableError = (error: any): never => {
  console.error('Airtable API Error:', error);
  if (error.error === 'NOT_AUTHORIZED') {
    throw new Error('Erreur d\'authentification Airtable. Veuillez vérifier votre clé API.');
  }
  throw error;
};