import { useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { Plus, Building2, Users as UsersIcon, Activity, Target } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Map from '../components/Map';
import Profile from './Profile';
import CreateNGO from './CreateNGO';
import CreateAdmin from './CreateAdmin';
import NGODetails from './NGODetails';
import Reports from './Reports';
import { useDemoStore } from '../store/demo';
import { useAuthStore } from '../store/auth';
import AgreementsDoc from "./AgreementsDoc.tsx";

function renderStatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
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
  const { ngos, users, activities, beneficiairies, loading, fetchNGOs, fetchUsers, fetchActivities, fetchBeneficiairies } = useDemoStore();

  useEffect(() => {
    fetchNGOs();
    fetchUsers();
    fetchActivities();
    fetchBeneficiairies();
  }, [fetchNGOs, fetchUsers, fetchActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const totalActivities = activities.reduce(
    (sum, activity) => sum + activity.activity_count,
    0
  );

  const totalBeneficiairies = beneficiairies.reduce(
      (sum, beneficiairy) => sum + beneficiairy.total,
      0
  );


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl pt-4 font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-gray-500">Vue d'ensemble de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard({
          title: "Total OSC",
          value: ngos.length,
          icon: Building2,
          color: "bg-blue-600"
        })}
        {renderStatCard({
          title: "Total Utilisateurs",
          value: users.length,
          icon: UsersIcon,
          color: "bg-emerald-600"
        })}
        {renderStatCard({
          title: "Total Activités",
          value: totalActivities,
          icon: Activity,
          color: "bg-violet-600"
        })}
        {renderStatCard({
          title: "Total Bénéficiaires",
          value: totalBeneficiairies,
          icon: Target,
          color: "bg-amber-600"
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/*<div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">*/}
        {/*  <div className="flex items-center justify-between mb-4">*/}
        {/*    <h2 className="text-lg font-semibold text-gray-900">Activités Récentes</h2>*/}
        {/*    <Link*/}
        {/*      to="/activities"*/}
        {/*      className="text-sm text-blue-600 hover:text-blue-700"*/}
        {/*    >*/}
        {/*      Voir tout*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*  <div className="space-y-4">*/}
        {/*    {activities.slice(0, 5).map((activity) => {*/}
        {/*      const ngo = ngos.find(n => n.id === activity.ngo_id);*/}
        {/*      const daysSinceActivity = Math.floor(*/}
        {/*        (new Date().getTime() - new Date(activity.activity_date).getTime()) / (1000 * 3600 * 24)*/}
        {/*      );*/}

        {/*      return (*/}
        {/*        <div*/}
        {/*          key={activity.id}*/}
        {/*          className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"*/}
        {/*        >*/}
        {/*          <div className="p-2 rounded-lg bg-blue-50">*/}
        {/*            <Activity className="w-5 h-5 text-blue-600" />*/}
        {/*          </div>*/}
        {/*          <div className="ml-4 flex-1">*/}
        {/*            <div className="flex items-start justify-between">*/}
        {/*              <div>*/}
        {/*                <p className="text-sm font-medium text-gray-900">{activity.name}</p>*/}
        {/*                <p className="text-sm text-gray-500">*/}
        {/*                  par <span className="font-medium">{ngo?.name}</span>*/}
        {/*                </p>*/}
        {/*              </div>*/}
        {/*              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">*/}
        {/*                {activity.beneficiaries_count} bénéficiaires*/}
        {/*              </span>*/}
        {/*            </div>*/}
        {/*            <div className="mt-2 flex items-center text-xs text-gray-500">*/}
        {/*              <Calendar className="w-4 h-4 mr-1" />*/}
        {/*              {daysSinceActivity === 0 */}
        {/*                ? "Aujourd'hui"*/}
        {/*                : daysSinceActivity === 1*/}
        {/*                ? "Hier"*/}
        {/*                : `Il y a ${daysSinceActivity} jours`*/}
        {/*              }*/}
        {/*              {activity.description && (*/}
        {/*                <>*/}
        {/*                  <span className="mx-2">•</span>*/}
        {/*                  <span className="truncate">{activity.description}</span>*/}
        {/*                </>*/}
        {/*              )}*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      );*/}
        {/*    })}*/}
        {/*    {activities.length === 0 && (*/}
        {/*      <div className="text-center py-8">*/}
        {/*        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />*/}
        {/*        <p className="text-gray-500">Aucune activité récente</p>*/}
        {/*      </div>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Carte des OSC</h2>
          <Map ngos={ngos} />
        </div>
      </div>
    </div>
  );
}

function NGOs() {
  const { ngos, loading, fetchNGOs } = useDemoStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNGOs();
  }, [fetchNGOs]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Organisations</h2>
          <p className="mt-1 text-gray-500">Gérer les OSC enregistrées</p>
        </div>
        <Link
          to="/ngos/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle OSC</span>
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
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ngos.map((ngo) => (
                <tr
                  key={ngo.id}
                  onClick={() => navigate(`/ngos/${ngo.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ngo.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{ngo.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ngo.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ngo.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
              {ngos.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    Aucune OSC enregistrée
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

function Administrators() {
  const { users, loading, fetchUsers } = useDemoStore();
  useNavigate();
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
        <div>
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

export default function AdminDashboard() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role={user.role} />
      <Navbar />
      
      <div className="pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="ngos" element={<NGOs />} />
            <Route path="ngos/new" element={<CreateNGO />} />
            <Route path="ngos/:id" element={<NGODetails />} />
            <Route path="agreements" element={<AgreementsDoc />} />
            <Route path="investments_plans" element={<AgreementsDoc />} />
            <Route path="reports" element={<Reports />} />
            {user.role === 'super_admin' && (
              <>
                <Route path="admins" element={<Administrators />} />
                <Route path="admins/new" element={<CreateAdmin />} />
              </>
            )}
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}