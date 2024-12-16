import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { getMenus } from '../../services/firebase/menus';

interface Menu {
  id: string;
  date: string;
  lunch: {
    starter: string;
    main: string;
    side: string;
    dessert: string;
  };
  snack: string;
}

export function ParentMealsPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menuPdfUrl = "https://www.totalarmonie.com/menus.pdf"; // URL du menu à remplacer par la vraie URL

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const menusData = await getMenus();
      setMenus(menusData);
    } catch (err) {
      setError("Erreur lors du chargement des menus");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Chargement des menus...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Menus de la semaine</h1>
        <a
          href={menuPdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FileText className="h-5 w-5 mr-2" />
          Télécharger le menu PDF
        </a>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus.map(menu => (
          <div key={menu.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {new Date(menu.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Déjeuner</h4>
                  <dl className="mt-2 space-y-1">
                    <div>
                      <dt className="text-xs text-gray-500">Entrée</dt>
                      <dd className="text-sm text-gray-900">{menu.lunch.starter}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Plat principal</dt>
                      <dd className="text-sm text-gray-900">{menu.lunch.main}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Accompagnement</dt>
                      <dd className="text-sm text-gray-900">{menu.lunch.side}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Dessert</dt>
                      <dd className="text-sm text-gray-900">{menu.lunch.dessert}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Goûter</h4>
                  <p className="mt-1 text-sm text-gray-900">{menu.snack}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}