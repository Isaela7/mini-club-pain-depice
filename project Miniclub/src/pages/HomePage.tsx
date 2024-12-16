import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, Users2 } from 'lucide-react';

interface AccessCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  available: boolean;
}

export function HomePage() {
  const navigate = useNavigate();

  const accessCards: AccessCard[] = [
    {
      title: "Espace Pointage",
      description: "Gestion des présences et statistiques du mini-club",
      icon: <ClipboardList className="h-8 w-8 text-blue-500" />,
      path: "/login",
      available: true
    },
    {
      title: "Espace Animateur",
      description: "Gestion des activités et du matériel",
      icon: <Users className="h-8 w-8 text-green-500" />,
      path: "/animator/login",
      available: true
    },
    {
      title: "Espace Parent",
      description: "Suivi et informations pour les parents",
      icon: <Users2 className="h-8 w-8 text-purple-500" />,
      path: "/parents/login",
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Mini-club Pain d'Épice
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Bienvenue sur la plateforme de gestion du mini-club
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {accessCards.map((card) => (
            <div
              key={card.title}
              className={`relative group bg-white rounded-lg shadow-lg overflow-hidden 
                ${card.available ? 'hover:shadow-xl transition-shadow duration-300' : 'opacity-60'}`}
            >
              <div className="px-6 py-8">
                <div className="flex justify-center mb-6">
                  {card.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    onClick={() => card.available && navigate(card.path)}
                    disabled={!card.available}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                      ${card.available 
                        ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    {card.available ? 'Accéder' : 'Bientôt disponible'}
                  </button>
                </div>
              </div>
              {!card.available && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    À venir
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}