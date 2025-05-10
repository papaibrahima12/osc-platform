import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Plus, Building2, Users } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Profile from './Profile';
import CreateAdmin from './CreateAdmin';
import { useDemoStore } from '../store/demo';
import { useAuthStore } from '../store/auth';
import CreateManager from "./CreateManager.tsx";

function renderStatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const { ngos, users, loading, fetchNGOs, fetchUsers } = useDemoStore();

  useEffect(() => {
    fetchNGOs();
    fetchUsers();
  }, [fetchNGOs, fetchUsers]);

  console.log('ngos length', ngos.length);
  console.log('ngos', ngos);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const adminUsers = users.filter(user => user.role !== 'super_admin');

  return (
    <div className="space-y-8">
      <div className="mt-5">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-gray-500">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderStatCard({
          title: "Nombre d'OSCs",
          value: ngos.length,
          icon: Building2,
          color: "bg-blue-600"
        })}
        {renderStatCard({
          title: "Utilisateurs",
          value: adminUsers.length,
          icon: Users,
          color: "bg-emerald-600"
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Utilisateurs</h2>
        <div className="space-y-4">
          {adminUsers.slice(0, 4).map((admin) => (
            <div
              key={admin.id}
              className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-lg bg-emerald-50">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  {admin.first_name} {admin.last_name}
                </p>
                <p className="text-sm text-gray-500">{admin.email}</p>
              </div>
            </div>
          ))}
          {adminUsers.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              Aucun utilisateur enregistré
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Administrators() {
  const { users, loading, fetchUsers } = useDemoStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const adminUsers = users.filter(user => user.role === 'admin');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="mt-5">
          <h2 className="text-2xl font-bold text-gray-900">Administrateurs</h2>
          <p className="mt-1 text-gray-500">Gérer les administrateurs de la plateforme</p>
        </div>
        <Link
          to="/admins/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvel administrateur</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adminUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {adminUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Aucun administrateur enregistré
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Managers() {
  const { managers, loading, fetchManagers } = useDemoStore();

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Chargement...</div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="mt-5">
            <h2 className="text-2xl font-bold text-gray-900">Managers</h2>
            <p className="mt-1 text-gray-500">Gérer les gestionnaires des OSCs de la plateforme</p>
          </div>
          <Link
              to="/managers/new"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau Gestionnaire</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {managers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
              ))}
              {managers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                      Aucun gestionnaire enregistré
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
}


export default function SuperAdminDashboard() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="super_admin" />
      <Navbar />
      
      <div className="pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="admins" element={<Administrators />} />
            <Route path="managers" element={<Managers />} />
            <Route path="admins/new" element={<CreateAdmin />} />
            <Route path="managers/new" element={<CreateManager />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}