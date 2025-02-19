import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuthStore();

  return (
    <div className="h-16 bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-4 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-left hidden sm:block">
              <p className="font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
              <p className="text-gray-500 text-xs">
                {
                  user?.role === 'admin' ? 'Administrateur' :
                  user?.role === 'super_admin' ? 'Super Administrateur' : 'Gestionnaire OSC'
                }
              </p>
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {
                    user?.role === 'admin' ? 'Administrateur' :
                    user?.role === 'super_admin' ? 'Super Administrateur' : 'Gestionnaire OSC'
                  }

                </p>
              </div>
              
              <div className="py-2">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Paramètres du profil
                </Link>
                
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Déconnexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}