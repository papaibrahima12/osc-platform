import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Mail, Phone, Calendar, User, MapPin, Activity, Globe2, Users, 
  Wallet, DollarSign, Award, Target, Link, Facebook, Linkedin, Twitter, Download,
  Edit
} from 'lucide-react';
import { useDemoStore } from '../store/demo';
import { SECTORS } from '../components/ActivitySectorsStep';
import { SECTORS_INDICATORS } from '../components/RealizationStep';
import EditNGO from './EditNGO';

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

function formatCurrency(amount: number) {
  return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
}

function NGODetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ngos, activities, fetchNGOs, fetchActivities } = useDemoStore();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchNGOs(),
          id ? fetchActivities(id) : Promise.resolve()
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, fetchNGOs, fetchActivities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  const ngo = ngos.find(n => n.id === id);

  if (!ngo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">OSC non trouvée</h2>
        <p className="mt-2 text-gray-600">L'OSC que vous recherchez n'existe pas.</p>
        <button
          onClick={() => navigate('/ngos')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  if (isEditing) {
    return <EditNGO ngo={ngo} onCancel={() => setIsEditing(false)} />;
  }

  const ngoActivities = activities.filter(activity => activity.ngo_id === ngo.id) || [];
  const staff = ngo.staff;

  // Calculate totals
  const totalBeneficiaries = Object.values(ngo.beneficiaries || []).reduce((sum, data) => {
    return sum + (data.total || 0);
  }, 0);

  const totalPersonnel = staff 
    ? (staff?.men_count || 0) + (staff.women_count || 0)
    : 0;

  const totalRegions = (ngo.intervention_zones || []).filter(
    zone => zone.zone_type === 'country'
  ).length;

  const totalActivities = (ngo.activity_sectors || []).reduce((sum, sector) => {
    return sum + (sector.activity_count || 0);
  }, 0);

  // Calculate total funding
  const totalFunding = (ngo.financial_resources || []).reduce((sum, resource) => {
    return sum + (resource.amount || 0);
  }, 0);

  // Group financial resources by type
  const groupedResources = (ngo.financial_resources || []).reduce((acc, resource) => {
    if (!acc[resource.funding_type]) {
      acc[resource.funding_type] = [];
    }
    acc[resource.funding_type].push(resource);
    return acc;
  }, {} as Record<string, typeof ngo.financial_resources>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{ngo.name}</h1>
          <p className="mt-1 text-gray-500">Détails de l'organisation</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button
            onClick={() => navigate('/ngos')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retour à la liste
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderStatCard({
          title: "Personnel total",
          value: totalPersonnel,
          icon: Users,
          color: "bg-blue-600"
        })}
        {renderStatCard({
          title: "Zones d'intervention",
          value: totalRegions,
          icon: Globe2,
          color: "bg-emerald-600"
        })}
        {renderStatCard({
          title: "Activités",
          value: totalActivities,
          icon: Activity,
          color: "bg-violet-600"
        })}
        {renderStatCard({
          title: "Bénéficiaires",
          value: totalBeneficiaries,
          icon: Target,
          color: "bg-amber-600"
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nom</p>
                    <p className="text-sm text-gray-600">{ngo.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{ngo.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <p className="text-sm text-gray-600">{ngo.phone || 'Non renseigné'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">{ngo.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date de création</p>
                    <p className="text-sm text-gray-600">{ngo.creation_year}</p>
                  </div>
                </div>
                {ngo.approval_year && (
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date d'agrément</p>
                      <p className="text-sm text-gray-600">{ngo.approval_year}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Liens</p>
                  <div className="flex space-x-4">
                    {ngo.website && (
                      <a href={ngo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Link className="w-5 h-5" />
                      </a>
                    )}
                    {ngo.facebook && (
                      <a href={ngo.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                    {ngo.linkedin && (
                      <a href={ngo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {ngo.twitter && (
                      <a href={ngo.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {(ngo.contact_first_name || ngo.contact_last_name || ngo.contact_email || ngo.contact_phone) && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personne à contacter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(ngo.contact_first_name || ngo.contact_last_name) && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nom complet</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {[ngo.contact_first_name, ngo.contact_last_name].filter(Boolean).join(' ')}
                    </p>
                  </div>
                )}
                {ngo.contact_email && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{ngo.contact_email}</p>
                  </div>
                )}
                {ngo.contact_phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Téléphone</p>
                    <p className="mt-1 text-sm text-gray-900">{ngo.contact_phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Staff Information */}
          {staff && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personnel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Répartition par genre</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Hommes: {staff.men_count || 0}</p>
                    <p className="text-sm text-gray-600">Femmes: {staff.women_count || 0}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Répartition par âge</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">18-25 ans: {staff.young_18_25_count || 0}</p>
                    <p className="text-sm text-gray-600">26-35 ans: {staff.young_26_35_count || 0}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Statut</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Permanents: {staff.permanent_count || 0}</p>
                    <p className="text-sm text-gray-600">Temporaires: {staff.temporary_count || 0}</p>
                    <p className="text-sm text-gray-600">Volontaires: {staff.volunteer_count || 0}</p>
                    <p className="text-sm text-gray-600">Stagiaires: {staff.intern_count || 0}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Catégories spéciales</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Personnes handicapées: {staff.disabled_count || 0}</p>
                    <p className="text-sm text-gray-600">Expatriés: {staff.expatriate_count || 0}</p>
                    <p className="text-sm text-gray-600">Nationaux: {staff.national_count || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Intervention Zones */}
          {ngo.intervention_zones?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Zones d'intervention</h2>
              <div className="space-y-4">
                {/* Countries */}
                {ngo.intervention_zones.filter(zone => zone.zone_type === 'country').length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Pays</h3>
                    <div className="flex flex-wrap gap-2">
                      {ngo.intervention_zones
                        .filter(zone => zone.zone_type === 'country')
                        .map(zone => (
                          <span
                            key={zone.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {zone.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Regions */}
                {ngo.intervention_zones.filter(zone => zone.zone_type === 'region').length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Régions</h3>
                    <div className="flex flex-wrap gap-2">
                      {ngo.intervention_zones
                        .filter(zone => zone.zone_type === 'region')
                        .map(zone => (
                          <span
                            key={zone.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {zone.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Departments */}
                {ngo.intervention_zones.filter(zone => zone.zone_type === 'department').length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Départements</h3>
                    <div className="flex flex-wrap gap-2">
                      {ngo.intervention_zones
                        .filter(zone => zone.zone_type === 'department')
                        .map(zone => (
                          <span
                            key={zone.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                          >
                            {zone.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Municipalities */}
                {ngo.intervention_zones.filter(zone => zone.zone_type === 'municipality').length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Communes</h3>
                    <div className="flex flex-wrap gap-2">
                      {ngo.intervention_zones
                        .filter(zone => zone.zone_type === 'municipality')
                        .map(zone => (
                          <span
                            key={zone.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {zone.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Activity Sectors */}
          {ngo.activity_sectors?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Secteurs d'activité</h2>
                <span className="text-sm text-gray-500">
                  Année: {ngo.activity_sectors[0].activity_year}
                </span>
              </div>
              <div className="space-y-4">
                {Object.entries(SECTORS).map(([sectorKey, sector]) => {
                  const sectorActivities = ngo.activity_sectors?.filter(
                    activity => activity.sector === sectorKey
                  );

                  if (!sectorActivities?.length) return null;

                  return (
                    <div key={sectorKey} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {sector.label}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sectorActivities.map(activity => (
                          <div key={activity.id} className="text-sm">
                            <span className="text-gray-600">
                              {sector.subsectors[activity.subsector]}: 
                            </span>
                            <span className="font-medium text-gray-900 ml-1">
                              {activity.activity_count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Investments */}
          {ngo.investments?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Investissements</h2>
                <span className="text-sm text-gray-500">
                  Année: {ngo.investments[0].investment_year}
                </span>
              </div>
              <div className="space-y-4">
                {Object.entries(SECTORS).map(([sectorKey, sector]) => {
                  const sectorInvestments = ngo.investments?.filter(
                    investment => investment.sector === sectorKey
                  );

                  if (!sectorInvestments?.length) return null;

                  const total = sectorInvestments.reduce(
                    (sum, investment) => sum + investment.amount,
                    0
                  );

                  return (
                    <div key={sectorKey} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {sector.label}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sectorInvestments.map(investment => (
                          <div key={investment.id} className="text-sm">
                            <span className="text-gray-600">
                              {sector.subsectors[investment.subsector]}: 
                            </span>
                            <span className="font-medium text-gray-900 ml-1">
                              {formatCurrency(investment.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-sm font-medium text-blue-600">
                          Total: {formatCurrency(total)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Realizations */}
          {ngo.realizations?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Réalisations</h2>
              <div className="space-y-4">
                {Object.entries(SECTORS_INDICATORS).map(([sectorKey, sector]) => {
                  const sectorRealizations = ngo.realizations?.filter(
                    realization => realization.sector === sectorKey
                  );

                  if (!sectorRealizations?.length) return null;

                  return (
                    <div key={sectorKey} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {sector.label}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sectorRealizations.map(realization => (
                          <div key={realization.id} className="text-sm">
                            <span className="text-gray-600">
                              {sector.indicators[realization.indicator]}: 
                            </span>
                            <span className="font-medium text-gray-900 ml-1">
                              {realization.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Financial Resources */}
          {ngo.financial_resources?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Sources de financement</h2>
                  <span className="text-sm text-gray-500">
        Année: {ngo.financial_resources[0].funding_year}
      </span>
                </div>
                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-blue-900">Total des financements</span>
                      <span className="text-lg font-bold text-blue-600">
            {formatCurrency(totalFunding)}
          </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Financement national</span>
                        <span className="text-sm font-medium text-blue-900">
              {formatCurrency((groupedResources['national'] || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
            </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-700">Financement international</span>
                        <span className="text-sm font-medium text-blue-900">
              {formatCurrency((groupedResources['international'] || []).reduce((sum, r) => sum + (r.amount || 0), 0))}
            </span>
                      </div>
                    </div>
                  </div>

                  {/* Table Display */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Source
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Détails
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {ngo.financial_resources.map((resource) => {
                        // Get proper labels for funding type
                        const typeLabel = resource.funding_type === 'national' ? 'National' : 'International';

                        // Get proper labels for funding source
                        let sourceLabel = '';
                        let detailsLabel = '';

                        if (resource.funding_type === 'national') {
                          // National funding sources
                          switch (resource.funding_source) {
                            case 'government_grant':
                              sourceLabel = 'Subvention gouvernementale';
                              break;
                            case 'private_grant':
                              sourceLabel = 'Subvention secteur privé';
                              break;
                            case 'membership_fees':
                              sourceLabel = 'Cotisations des membres';
                              break;
                            case 'donations':
                              sourceLabel = 'Dons';
                              break;
                            case 'self_financing':
                              sourceLabel = 'Autofinancement';
                              break;
                            default:
                              sourceLabel = resource.funding_source || 'Autre';
                          }

                          // Get details for national funding
                          detailsLabel = resource.details?.description || '';
                        } else if (resource.funding_type === 'international') {
                          // International funding source mapping based on the provided structure
                          const source = resource.funding_source || '';
                          const region = source.split('_')[0]; // ex: eu, usa, canada, etc.
                          const fundingType = source.split('_')[1]; // ex: public, private
                          const subSource = source.split('_')[2]; // ex: member_states, foundations, etc.
                          // Set region label
                          switch (region) {
                            case 'eu':
                              sourceLabel = 'Union Européenne';
                              break;
                            case 'usa':
                              sourceLabel = 'États-Unis';
                              break;
                            case 'canada':
                              sourceLabel = 'Canada';
                              break;
                            case 'latam':
                              sourceLabel = 'Amérique Latine';
                              break;
                            case 'arab':
                              sourceLabel = 'Pays Arabes';
                              break;
                            case 'uk':
                              sourceLabel = 'Royaume-Uni';
                              break;
                            case 'multi':
                              sourceLabel = 'Organisations multinationales';
                              break;
                            default:
                              sourceLabel = 'Autre International';
                          }

                          // Add funding type to details if available (public/private)
                          let fundingTypeLabel = '';
                          if (fundingType === 'public') {
                            fundingTypeLabel = 'Financement publique';
                          } else if (fundingType === 'private') {
                            fundingTypeLabel = 'Financement privé';
                          }

                          // Add specific sub-source to details if available
                          let subSourceLabel = '';
                          if (subSource) {
                            // Map specific sources based on the region and funding type
                            if (region === 'eu') {
                              if (subSource === 'member_states') subSourceLabel = 'États membres';
                              else if (subSource === 'territorial_collectivities') subSourceLabel = 'Collectivités territoriales';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'usa') {
                              if (subSource === 'usaid') subSourceLabel = 'USAID';
                              else if (subSource === 'mcc') subSourceLabel = 'MCC';
                              else if (subSource === 'peaceCorp') subSourceLabel = 'Peace Corp';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'canada') {
                              if (subSource === 'acdi') subSourceLabel = 'ACDI';
                              else if (subSource === 'crdi') subSourceLabel = 'CRDI';
                              else if (subSource === 'ceci') subSourceLabel = 'CECI';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'latam') {
                              if (subSource === 'countries') subSourceLabel = 'Pays';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'arab') {
                              if (subSource === 'saudi_arabia') subSourceLabel = 'Arabie Saoudite';
                              else if (subSource === 'uae') subSourceLabel = 'Émirats Arabes Unis';
                              else if (subSource === 'kuwait') subSourceLabel = 'Koweït';
                              else if (subSource === 'qatar') subSourceLabel = 'Qatar';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'uk') {
                              if (subSource === 'ambassy') subSourceLabel = 'Ambassade';
                              else if (subSource === 'foundations') subSourceLabel = 'Fondations';
                              else if (subSource === 'ngos') subSourceLabel = 'ONG';
                            } else if (region === 'multi_nationalorg') {
                              if (subSource === 'onu') subSourceLabel = 'ONU';
                              else if (subSource === 'world_bank') subSourceLabel = 'Banque Mondiale';
                              else if (subSource === 'bad') subSourceLabel = 'BAD';
                              else if (subSource === 'cedeao') subSourceLabel = 'CEDEAO';
                              else if (subSource === 'boad') subSourceLabel = 'BOAD';
                              else if (subSource === 'uemoa') subSourceLabel = 'UEMOA';
                            }

                            if (subSource === 'other') subSourceLabel = 'Autres';
                          }

                          // Build details string from available fields
                          const details = [];
                          if (fundingTypeLabel) details.push(fundingTypeLabel);
                          if (subSourceLabel) details.push(subSourceLabel);
                          if (resource.details?.country) details.push(resource.details.country);
                          if (resource.details?.description) details.push(resource.details.description);

                          detailsLabel = details.join(' - ') || '';
                        }

                        return (
                            <tr key={resource.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {typeLabel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {sourceLabel}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {detailsLabel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                                {formatCurrency(resource.amount)}
                              </td>
                            </tr>
                        );
                      })}
                      </tbody>
                      <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Total
                        </td>
                        <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                          {formatCurrency(totalFunding)}
                        </td>
                      </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Funding Distribution Chart */}
                  {ngo.financial_resources.length > 1 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Répartition des financements</h3>
                        <div className="space-y-3">
                          {Object.entries(groupedResources).map(([type, resources]) => {
                            const total = resources.reduce((sum, r) => sum + r.amount, 0);
                            const percentage = Math.round((total / totalFunding) * 100);
                            const typeLabel = type === 'national' ? 'National' : 'International';

                            return (
                                <div key={type} className="relative pt-1">
                                  <div className="flex mb-2 items-center justify-between">
                                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-800">
                        {typeLabel}
                      </span>
                                    </div>
                                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-gray-800">
                        {percentage}%
                      </span>
                                    </div>
                                  </div>
                                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div
                                        style={{ width: `${percentage}%` }}
                                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                            type === 'national' ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    ></div>
                                  </div>
                                </div>
                            );
                          })}

                          {/* Add detailed international funding breakdown if available */}
                          {groupedResources['international']?.length > 1 && (
                              <div className="mt-4">
                                <h4 className="text-xs font-medium text-gray-700 mb-2">Répartition des financements internationaux</h4>
                                {Object.entries(
                                    groupedResources['international'].reduce((acc, resource) => {
                                      const region = (resource.funding_source || '').split('.')[0];
                                      if (!region) return acc;

                                      let regionLabel = '';
                                      switch (region) {
                                        case 'eu': regionLabel = 'Union Européenne'; break;
                                        case 'usa': regionLabel = 'États-Unis'; break;
                                        case 'canada': regionLabel = 'Canada'; break;
                                        case 'latam': regionLabel = 'Amérique Latine'; break;
                                        case 'arab': regionLabel = 'Pays Arabes'; break;
                                        case 'uk': regionLabel = 'Royaume-Uni'; break;
                                        case 'multi_nationalorg': regionLabel = 'Org. multinationales'; break;
                                        default: regionLabel = 'Autre';
                                      }

                                      acc[regionLabel] = (acc[regionLabel] || 0) + (resource.amount || 0);
                                      return acc;
                                    }, {})
                                ).map(([region, amount]) => {
                                  const intTotal = groupedResources['international'].reduce((sum, r) => sum + r.amount, 0);
                                  const percentage = Math.round((amount / intTotal) * 100);

                                  return (
                                      <div key={region} className="relative pt-1">
                                        <div className="flex mb-2 items-center justify-between">
                                          <div>
                          <span className="text-xs font-semibold inline-block text-gray-800">
                            {region}
                          </span>
                                          </div>
                                          <div className="text-right">
                          <span className="text-xs font-semibold inline-block text-gray-800">
                            {percentage}%
                          </span>
                                          </div>
                                        </div>
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                          <div
                                              style={{ width: `${percentage}%` }}
                                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                                          ></div>
                                        </div>
                                      </div>
                                  );
                                })}
                              </div>
                          )}
                        </div>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Activities */}
          {/*<div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">*/}
          {/*  <h2 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h2>*/}
          {/*  <div className="space-y-4">*/}
          {/*    {ngoActivities.map((activity) => (*/}
          {/*      <div*/}
          {/*        key={activity.id}*/}
          {/*        className="flex items-center p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"*/}
          {/*      >*/}
          {/*        <div className="p-2 rounded-lg bg-blue-50">*/}
          {/*          <Activity className="w-5 h-5 text-blue-600" />*/}
          {/*        </div>*/}
          {/*        <div className="ml-4">*/}
          {/*          <p className="text-sm font-medium text-gray-900">{activity.name}</p>*/}
          {/*          <p className="text-sm text-gray-500">*/}
          {/*            {new Date(activity.activity_date).toLocaleDateString()}*/}
          {/*          </p>*/}
          {/*        </div>*/}
          {/*        <div className="ml-auto">*/}
          {/*          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">*/}
          {/*            {activity.beneficiaries_count} bénéficiaires*/}
          {/*          </span>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    ))}*/}
          {/*    {ngoActivities.length === 0 && (*/}
          {/*      <p className="text-center text-gray-500 py-4">*/}
          {/*        Aucune activité enregistrée*/}
          {/*      </p>*/}
          {/*    )}*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                  ngo.is_active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ngo.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Type</p>
                <p className="mt-1 text-sm text-gray-600">
                  {ngo.status === 'ngo' ? 'ONG' : 
                   ngo.status === 'association' ? 'Association' : 
                   ngo.status === 'foundation' ? 'Fondation' :
                   ngo.status === 'public_utility' ? 'Organisation d’utilité publique' :
                   ngo.status === 'gie' ? 'GIE' :
                   ngo.status === 'cooperative' ? 'Coopérative' :
                   ngo.status === 'other' ? 'Autre' :
                   ngo.other_status || 'Autre'}
                </p>
              </div>
              {ngo.category && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Catégorie</p>
                  <p className="mt-1 text-sm text-gray-600">{
                    ngo.category === 'think_tank' ? 'Think Thank' :
                    ngo.category === 'citizen_movement' ? 'Mouvement Citoyen' :
                    ngo.category === 'religious' ? 'Association Religieuse' :
                    ngo.category === 'responsible_business' ? 'Association entreprenante responsable' :
                    ngo.category === 'nonprofit' ? 'Etablissement à but non lucratif' :
                    ngo.category === 'sports_cultural' ? 'Association sportive et culturelle (ASC)' :
                    ngo.category === 'community_org' ? 'Organisme communautaire de base (OCB)' :
                    ngo.category === 'foreign_assoc' ? 'Association étrangère' :
                    ngo.category === 'social_enterprise' ? 'Entreprise Sociale' :
                    ngo.category === 'other' ? 'Autre' : 'Autre'
                  }</p>
                </div>
              )}
              {ngo.scale && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Échelle</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {ngo.scale === 'national' ? 'Nationale' :
                     ngo.scale === 'international' ? 'Internationale' :
                     ngo.scale === 'local' ? 'Locale' :
                     ngo.scale === 'regional' ? 'Régionale' : 'Régionale'
                    }
                  </p>
                </div>
              )}
              {ngo.status === 'ngo' && ngo.approval_year && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Document d'agrément</p>
                  <a
                    href={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/agreements/${ngo.id}/agreement.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Manager */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Gestionnaire</h2>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 rounded-full p-2">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {ngo.manager_id ? 'John Doe' : 'Non assigné'}
                </p>
                <p className="text-sm text-gray-500">Gestionnaire OSC</p>
              </div>
            </div>
          </div>

          {/* Beneficiaries */}
          {ngo.beneficiaries?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bénéficiaires par secteur</h2>
              <div className="space-y-4">
                {ngo.beneficiaries.map(beneficiary => (
                  <div key={beneficiary.id} className="p-4 bg -gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      {SECTORS[beneficiary.sector as keyof typeof SECTORS]?.label}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-600">Total: <span className="font-medium">{beneficiary.total}</span></p>
                      <p className="text-gray-600">Hommes: <span className="font-medium">{beneficiary.men}</span></p>
                      <p className="text-gray-600">Femmes: <span className="font-medium">{beneficiary.women}</span></p>
                      <p className="text-gray-600">Jeunes: <span className="font-medium">{beneficiary.young}</span></p>
                      <p className="text-gray-600">Handicapés: <span className="font-medium">{beneficiary.disabled}</span></p>
                      <p className="text-gray-600">Autres vulnérables: <span className="font-medium">{beneficiary.other_vulnerable}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NGODetails;