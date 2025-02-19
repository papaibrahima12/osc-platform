import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../lib/api';
import { useDemoStore } from '../store/demo';

export default function CreateUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { ngos, fetchNGOs } = useDemoStore();
  const [role, setRole] = useState<'admin' | 'ngo_manager'>('ngo_manager');
  const [selectedNGO, setSelectedNGO] = useState<string>('');

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  // Filter out NGOs that already have a manager
  const availableNGOs = ngos.filter(ngo => !ngo.manager_id);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const userData = {
      first_name: formData.get('firstName') as string,
      last_name: formData.get('lastName') as string,
      role: role,
      ngo_id: role === 'ngo_manager' ? selectedNGO : undefined
    };

    try {
      if (role === 'ngo_manager' && !selectedNGO) {
        throw new Error('Veuillez sélectionner une OSC pour le gestionnaire');
      }

      await createUser(email, userData);
      navigate('/users');
    } catch (err: any) {
      console.error('Error creating user:', err);
      if (err.code === 'user_already_exists') {
        setError('Un utilisateur avec cet email existe déjà');
      } else {
        setError(err.message || 'Une erreur est survenue lors de la création de l\'utilisateur');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvel Utilisateur</h1>
        <p className="text-gray-500 mt-1">Créer un nouveau compte utilisateur</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  placeholder="Prénom"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  placeholder="Nom"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="utilisateur@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as 'admin' | 'ngo_manager');
                  if (e.target.value === 'admin') {
                    setSelectedNGO('');
                  }
                }}
                required
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="admin">Administrateur</option>
                <option value="ngo_manager">Gestionnaire OSC</option>
              </select>
            </div>

            {role === 'ngo_manager' && (
              <div>
                <label htmlFor="ngo" className="block text-sm font-medium text-gray-700">
                  OSC
                </label>
                {availableNGOs.length > 0 ? (
                  <select
                    name="ngo"
                    id="ngo"
                    value={selectedNGO}
                    onChange={(e) => setSelectedNGO(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Sélectionner une OSC</option>
                    {availableNGOs.map((ngo) => (
                      <option key={ngo.id} value={ngo.id}>
                        {ngo.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="mt-1 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <p className="text-sm text-yellow-800">
                      Toutes les OSC ont déjà un gestionnaire assigné. Veuillez d'abord créer une nouvelle OSC.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-900">Information</h3>
              <p className="mt-1 text-sm text-blue-700">
                Un email contenant les identifiants de connexion sera envoyé à l'utilisateur.
                L'utilisateur devra changer son mot de passe lors de sa première connexion.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || (role === 'ngo_manager' && availableNGOs.length === 0)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}