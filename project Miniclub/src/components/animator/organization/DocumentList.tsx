import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, FileText, Download } from 'lucide-react';
import { useAuth } from '../../../contexts/animator/AuthContext';
import { saveDocuments, getDocuments } from '../../../services/firebase/documents';

interface Document {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  uploadDate: string;
}

export function DocumentList() {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const documentsData = await getDocuments();
      setDocuments(documentsData);
    } catch (err) {
      setError("Erreur lors du chargement des documents");
    }
  };

  const handleAddDocument = () => {
    const newDocument: Document = {
      id: `doc_${Date.now()}`,
      name: '',
      category: '',
      description: '',
      url: '',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const handleUpdateDocument = (id: string, field: keyof Document, value: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleSave = async () => {
    if (!currentUser) {
      setError("Vous devez être connecté pour sauvegarder");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await saveDocuments(documents, currentUser.uid);
    } catch (err) {
      setError("Erreur lors de la sauvegarde des documents");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        <div className="flex gap-4">
          <button
            onClick={handleAddDocument}
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
                Nom du document
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'ajout
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={doc.name}
                      onChange={(e) => handleUpdateDocument(doc.id, 'name', e.target.value)}
                      placeholder="Nom du document"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={doc.category}
                    onChange={(e) => handleUpdateDocument(doc.id, 'category', e.target.value)}
                    placeholder="Catégorie"
                  />
                </td>
                <td className="px-6 py-4">
                  <textarea
                    rows={2}
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={doc.description}
                    onChange={(e) => handleUpdateDocument(doc.id, 'description', e.target.value)}
                    placeholder="Description"
                  />
                </td>
                <td className="px-6 py-4">
                  <input
                    type="url"
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={doc.url}
                    onChange={(e) => handleUpdateDocument(doc.id, 'url', e.target.value)}
                    placeholder="URL du document"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    {doc.url && (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Download className="h-5 w-5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}