import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Administration
          </h1>
        </div>
      </header>
      
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Home className="h-5 w-5" />
          <span>Accueil</span>
        </button>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}