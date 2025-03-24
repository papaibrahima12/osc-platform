import { useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { useDemoStore } from '../store/demo';
import { Building2, Users, Target, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#6366f1'];

export default function Reports() {
  const { ngos, loading, activities, fetchNGOs, fetchActivities } = useDemoStore();

  useEffect(() => {
    fetchNGOs();
    fetchActivities();
  }, [fetchNGOs]);

  const totalActivities = activities.reduce(
      (sum, activity) => sum + activity.activity_count,
      0
  );

  // Statistiques par statut
  const statusStats = useMemo(() => {
    const stats = ngos.reduce((acc, ngo) => {
      const status = ngo.status === 'other' ? ngo.other_status : ngo.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, value]) => ({
      name: name === 'ngo' ? 'ONG' 
        : name === 'association' ? 'Association'
        : name === 'foundation' ? 'Fondation'
        : name === 'public_utility' ? 'Utilité publique'
        : name === 'gie' ? 'GIE'
        : name === 'cooperative' ? 'Coopérative'
        : name === 'responsible_entity' ? 'Association Entreprenante Responsable'
        : name,
      value
    }));
  }, [ngos]);

  // Statistiques par échelle
  const scaleStats = useMemo(() => {
    const stats = ngos.reduce((acc, ngo) => {
      acc[ngo.scale] = (acc[ngo.scale] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(stats).map(([name, value]) => ({
      name: name === 'local' ? 'Locale'
        : name === 'regional' ? 'Régionale'
        : name === 'national' ? 'Nationale'
        : 'Internationale',
      value
    }));
  }, [ngos]);

  // Statistiques du personnel
  const staffStats = useMemo(() => {
    return ngos.reduce((acc, ngo) => {
      const staff = ngo.staff;
      if (staff) {
        acc.total += (staff.men_count || 0) + (staff.women_count || 0);
        acc.men += staff.men_count || 0;
        acc.women += staff.women_count || 0;
        acc.young += (staff.young_18_25_count || 0) + (staff.young_26_35_count || 0);
        acc.permanent += staff.permanent_count || 0;
        acc.temporary += staff.temporary_count || 0;
        acc.volunteer += staff.volunteer_count || 0;
        acc.intern += staff.intern_count || 0;
      }
      return acc;
    }, {
      total: 0,
      men: 0,
      women: 0,
      young: 0,
      permanent: 0,
      temporary: 0,
      volunteer: 0,
      intern: 0
    });
  }, [ngos]);

  // Statistiques des bénéficiaires par secteur
  const beneficiaryStats = useMemo(() => {
    const stats = ngos.reduce((acc, ngo) => {
      (ngo.beneficiaries || []).forEach(beneficiary => {
        if (!acc[beneficiary.sector]) {
          acc[beneficiary.sector] = {
            total: 0,
            men: 0,
            women: 0,
            young: 0,
            disabled: 0
          };
        }
        acc[beneficiary.sector].total += beneficiary.total;
        acc[beneficiary.sector].men += beneficiary.men;
        acc[beneficiary.sector].women += beneficiary.women;
        acc[beneficiary.sector].young += beneficiary.young;
        acc[beneficiary.sector].disabled += beneficiary.disabled;
      });
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(stats).map(([sector, data]) => ({
      sector,
      ...data
    }));
  }, [ngos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-gray-900">Rapports et Statistiques</h1>
        <p className="mt-1 text-gray-500">Vue d'ensemble des OSC et leurs activités</p>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total OSC</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{ngos.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-600">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Personnel</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{staffStats.total}</p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-600">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Activités</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalActivities}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-violet-600">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bénéficiaires</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {beneficiaryStats.reduce((sum, stat) => sum + stat.total, 0)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-amber-600">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribution par statut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution par statut</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution par échelle */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution par échelle</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scaleStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre d'OSC" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistiques du personnel */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Répartition du personnel</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Hommes', value: staffStats.men },
                  { name: 'Femmes', value: staffStats.women },
                  { name: 'Jeunes', value: staffStats.young },
                  { name: 'Permanents', value: staffStats.permanent },
                  { name: 'Temporaires', value: staffStats.temporary },
                  { name: 'Volontaires', value: staffStats.volunteer },
                  { name: 'Stagiaires', value: staffStats.intern }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Nombre" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bénéficiaires par secteur */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bénéficiaires par secteur</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={beneficiaryStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total" stroke="#3b82f6" />
                <Line type="monotone" dataKey="men" name="Hommes" stroke="#10b981" />
                <Line type="monotone" dataKey="women" name="Femmes" stroke="#8b5cf6" />
                <Line type="monotone" dataKey="young" name="Jeunes" stroke="#f59e0b" />
                <Line type="monotone" dataKey="disabled" name="Handicapés" stroke="#ef4444" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}