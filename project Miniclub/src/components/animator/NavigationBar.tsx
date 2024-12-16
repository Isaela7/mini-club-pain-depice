import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Palette, Package, LogOut, Home, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/animator/AuthContext';

export function NavigationBar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <NavLink
              to="/animator/activities"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              <Palette className="h-5 w-5 mr-2" />
              Activités
            </NavLink>

            <NavLink
              to="/animator/material"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              <Package className="h-5 w-5 mr-2" />
              Matériel
            </NavLink>

            <NavLink
              to="/animator/organization"
              className={({ isActive }) =>
                `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive
                    ? 'border-b-2 border-blue-500 text-gray-900'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`
              }
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Organisation
            </NavLink>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
            >
              <Home className="h-5 w-5 mr-2" />
              Accueil
            </button>
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}