import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserCheck, Users, GraduationCap, LogOut, Menu, X, BarChart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ADMIN_EMAIL = 'miniclubnice@eibschools.fr';

export function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showClassMenu, setShowClassMenu] = useState(false);
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  const navItems = [
    { to: "/attendance", icon: UserCheck, text: "Pointage" },
    { to: "/presence", icon: Users, text: "Présences" },
    { to: "/statistics", icon: BarChart, text: "Statistiques" }
  ];

  const classItems = [
    { to: "/class/cm2", text: "Historique CM2" },
    { to: "/class/cm1", text: "Historique CM1" },
    { to: "/class/ce2", text: "Historique CE2" },
    { to: "/class/ce1", text: "Historique CE1" },
    { to: "/class/cp", text: "Historique CP" },
    { to: "/class/pk4", text: "Historique PK4" },
    { to: "/class/pk3", text: "Historique PK3" },
    { to: "/class/pk2", text: "Historique PK2" },
    { to: "/class/pk1", text: "Historique PK1" }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex space-x-8">
            {navItems.map(({ to, icon: Icon, text }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive
                      ? 'border-b-2 border-blue-500 text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`
                }
              >
                <Icon className="h-5 w-5 mr-2" />
                {text}
              </NavLink>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setShowClassMenu(!showClassMenu)}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Historique Classes
              </button>
              
              {showClassMenu && (
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {classItems.map(({ to, text }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm ${
                            isActive
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`
                        }
                        onClick={() => setShowClassMenu(false)}
                      >
                        {text}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Admin and Logout buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin/invite-codes')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin
              </button>
            )}
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

      {/* Mobile Navigation Menu */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {navItems.map(({ to, icon: Icon, text }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center">
                <Icon className="h-5 w-5 mr-2" />
                {text}
              </div>
            </NavLink>
          ))}
          
          {classItems.map(({ to, text }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                {text}
              </div>
            </NavLink>
          ))}
          
          {isAdmin && (
            <NavLink
              to="/admin/invite-codes"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? 'border-blue-500 text-blue-700 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Admin
              </div>
            </NavLink>
          )}
          
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center">
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}