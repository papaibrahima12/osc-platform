import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Activity, Users, Target, TrendingUp, Plus } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Profile from './Profile';
import NGODetails from './NGODetails';
import { useDemoStore } from '../store/demo';
import { useAuthStore } from '../store/auth';

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: any; color: string }) {
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
  const { activities, loading, fetchActivities } = useDemoStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchActivities(user.id);
    }
  }, [user, fetchActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const safeActivities = activities || [];
  const totalBeneficiaries = safeActivities.reduce(
    (sum, activity) => sum + (activity.beneficiaries_count || 0),
    0
  );

  const averageBeneficiaries = safeActivities.length > 0
    ? Math.round(totalBeneficiaries / safeActivities.length)
    : 0;

  const activePrograms = safeActivities.filter(
    activity => new Date(activity.activity_date) > new Date()
  ).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-gray-500">Vue d'ensemble de vos activités</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Activités"
          value={safeActivities.length}
          icon={Activity}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Bénéficiaires"
          value={totalBeneficiaries}
          icon={Target}
          color="bg-emerald-600"
        />
        <StatCard
          title="Programmes Actifs"
          value={activePrograms}
          icon={TrendingUp}
          color="bg-violet-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités Récentes</h2>
          <div className="space-y-4">
            {safeActivities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-50">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {activity.beneficiaries_count} bénéficiaires
                  </span>
                </div>
              </div>
            ))}
            {safeActivities.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aucune activité récente
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques des Bénéficiaires</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Moyenne par activité</p>
                <p className="text-lg font-semibold text-gray-900">
                  {averageBeneficiaries}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((averageBeneficiaries / 1000) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Activities() {
  const { activities, loading, fetchActivities } = useDemoStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchActivities(user.id);
    }
  }, [user, fetchActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const safeActivities = activities || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Activités</h2>
          <p className="mt-1 text-gray-500">Gérer vos activités et programmes</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle activité</span>
        </button>
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
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bénéficiaires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activity.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.activity_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {activity.beneficiaries_count} bénéficiaires
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      new Date(activity.activity_date) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(activity.activity_date) > new Date() ? 'À venir' : 'Terminée'}
                    </span>
                  </td>
                </tr>
              ))}
              {safeActivities.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    Aucune activité enregistrée
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

export default function NGOManagerDashboard() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar role="ngo_manager" />
      <Navbar />
      
      <div className="pl-64 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/my-osc" element={<NGODetails />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}