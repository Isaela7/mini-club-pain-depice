import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { NavigationBar } from './NavigationBar';

export function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Home className="h-5 w-5" />
          <span>Accueil</span>
        </button>
      </div>
      <main className="container mx-auto py-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="mt-16 sm:mt-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}