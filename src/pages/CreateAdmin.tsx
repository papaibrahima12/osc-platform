import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../lib/api';
import toast from 'react-hot-toast';

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;

    // Validation côté client
    if (!email || !firstName || !lastName) {
      setError('Tous les champs sont requis');
      toast.error('Tous les champs sont requis');
      setIsLoading(false);
      return;
    }

    // Validation de l'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide');
      toast.error('Veuillez entrer une adresse email valide');
      setIsLoading(false);
      return;
    }

    const createToast = toast.loading('Création de l\'administrateur en cours...');

    try {
      await createUser(email, {
        first_name: firstName,
        last_name: lastName,
        role: 'admin',
        email: email
      });

      toast.success('Administrateur créé avec succès. Un email avec les identifiants a été envoyé.', {
        id: createToast,
        duration: 5000
      });

      // Rediriger vers la liste des administrateurs
      navigate('/admins');
    } catch (err: any) {
      console.error('Error creating admin:', err);
      const errorMessage = err.message === 'Un utilisateur avec cet email existe déjà' 
        ? 'Cette adresse email existe déjà'
        : err.message || 'Une erreur est survenue lors de la création de l\'administrateur';
      
      setError(errorMessage);
      toast.error(errorMessage, {
        id: createToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvel Administrateur</h1>
        <p className="text-gray-500 mt-1">Créer un nouveau compte administrateur</p>
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
                  Prénom <span className="text-red-500">*</span>
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
                  Nom <span className="text-red-500">*</span>
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
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="administrateur@example.com"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-900">Information</h3>
              <p className="mt-1 text-sm text-blue-700">
                Un email contenant les identifiants de connexion sera envoyé à l'administrateur.
                L'administrateur devra changer son mot de passe lors de sa première connexion.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admins')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Création...' : 'Créer l\'administrateur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}