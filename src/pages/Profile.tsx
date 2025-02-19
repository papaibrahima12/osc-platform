import React from 'react';
import { useAuthStore } from '../store/auth';
import { useDemoStore } from '../store/demo';

export default function Profile() {
  const { user } = useAuthStore();
  const { ngos } = useDemoStore();

  // Find the OSC managed by this user
  const managedOSC = ngos.find(ngo => ngo.manager_id === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres du profil</h1>
        <p className="text-gray-500 mt-1">Gérez vos informations personnelles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom complet</label>
              <p className="mt-1 text-base text-gray-900">{user?.first_name} {user?.last_name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rôle</label>
              <p className="mt-1 text-base text-gray-900">
                {user?.role === 'admin' ? 'Administrateur' : 'Gestionnaire OSC'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'inscription</label>
              <p className="mt-1 text-base text-gray-900">
                {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* OSC Information - Only show for OSC managers */}
        {user?.role === 'ngo_manager' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Mon OSC</h2>
            {managedOSC ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom de l'OSC</label>
                  <p className="mt-1 text-base text-gray-900">{managedOSC.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-base text-gray-900">{managedOSC.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1 text-base text-gray-900">{managedOSC.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse</label>
                  <p className="mt-1 text-base text-gray-900">{managedOSC.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span className={`mt-1 inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    managedOSC.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {managedOSC.is_active ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">Aucune OSC assignée</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}