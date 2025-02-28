import {useEffect, useState} from 'react';
import type { NGOFinancialResource } from '../types/user';

interface FinancialResourcesStepProps {
  data: NGOFinancialResource[];
  onChange: (data: NGOFinancialResource[]) => void;
  activityYear?: string;
}

const FUNDING_TYPES = [
  { id: 'national', label: 'National' },
  { id: 'international', label: 'International' }
] as const;

const NATIONAL_FUNDING_SOURCES = [
  { id: 'government_grant', label: 'Subvention Publique' },
  { id: 'private_sector_grant', label: 'Subvention Privée' }
] as const;

// Ajouter la liste des pays UE
const EU_COUNTRIES = [
  { id: 'france', label: 'France' },
  { id: 'germany', label: 'Allemagne' },
  { id: 'italy', label: 'Italie' },
  { id: 'spain', label: 'Espagne' },
  { id: 'belgium', label: 'Belgique' },
  { id: 'netherlands', label: 'Pays-Bas' },
  { id: 'portugal', label: 'Portugal' },
  { id: 'sweden', label: 'Suède' },
  { id: 'denmark', label: 'Danemark' },
  { id: 'austria', label: 'Autriche' },
  { id: 'poland', label: 'Pologne' },
  { id: 'finland', label: 'Finlande' },
  { id: 'ireland', label: 'Irlande' },
  { id: 'luxembourg', label: 'Luxembourg' },
  { id: 'other', label: 'Autres pays membres' }
] as const;

// Ajouter la liste des pays d'Amérique Latine
const LATAM_COUNTRIES = [
  { id: 'brazil', label: 'Brésil' },
  { id: 'argentina', label: 'Argentine' },
  { id: 'mexico', label: 'Mexique' },
  { id: 'colombia', label: 'Colombie' },
  { id: 'chile', label: 'Chili' },
  { id: 'peru', label: 'Pérou' },
  { id: 'venezuela', label: 'Venezuela' },
  { id: 'uruguay', label: 'Uruguay' },
  { id: 'ecuador', label: 'Équateur' },
  { id: 'other', label: 'Autres pays' }
] as const;

const INTERNATIONAL_FUNDING_SOURCES = {
  eu: {
    label: 'Union Européenne',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'member_states', label: 'États membres', useCheckboxes: true, countries: EU_COUNTRIES },
        { id: 'territorial_collectivities', label: 'Collectivités territoriales' }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  usa: {
    label: 'États-Unis',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'usaid', label: 'USAID' },
        { id: 'mcc', label: 'MCC' },
        { id: 'peaceCorp', label: 'Peace Corp' },
        { id: 'other', label: 'Autres' }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  canada: {
    label: 'Canada',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'acdi', label: 'ACDI' },
        { id: 'crdi', label: 'CRDI' },
        { id: 'ceci', label: 'CECI' },
        { id: 'other', label: 'Autres' }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  latam: {
    label: 'Amérique Latine',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'countries', label: 'Pays', useCheckboxes: true, countries: LATAM_COUNTRIES }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  arab: {
    label: 'Pays Arabes',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'saudi_arabia', label: 'Arabie Saoudite' },
        { id: 'uae', label: 'Émirats Arabes Unis' },
        { id: 'kuwait', label: 'Koweït' },
        { id: 'qatar', label: 'Qatar' },
        { id: 'other', label: 'Autres' }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  uk: {
    label: 'Royaume-Uni',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'ambassy', label: 'Ambassade' }
      ]
    },
    private: {
      label: 'Financement privé',
      sources: [
        { id: 'foundations', label: 'Fondations' },
        { id: 'ngos', label: 'ONG' },
        { id: 'other', label: 'Autres' }
      ]
    }
  },
  multi_nationalorg: {
    label: 'Organisations multinationales',
    sources: [
      { id: 'onu', label: 'ONU' },
      { id: 'world_bank', label: 'Banque Mondiale' },
      { id: 'bad', label: 'BAD' },
      { id: 'cedeao', label: 'CEDEAO' },
      { id: 'boad', label: 'BOAD' },
      { id: 'uemoa', label: 'UEMOA' }
    ]
  }
} as const;

export default function FinancialResourcesStep({ data, onChange, activityYear }: FinancialResourcesStepProps) {
  const [yearError, setYearError] = useState<string | null>(null);
  const [fundingYear, setFundingYear] = useState(data[0]?.funding_year || new Date().getFullYear().toString());
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>(
      data.map(resource => resource.funding_type)
  );
  const [selectedCountries, setSelectedCountries] = useState<Record<string, string[]>>({
    eu: data
        .filter(res => res.funding_source.startsWith('eu_public_member_states_'))
        .map(res => res.funding_source.replace('eu_public_member_states_', '')),
    latam: data
        .filter(res => res.funding_source.startsWith('latam_public_countries_'))
        .map(res => res.funding_source.replace('latam_public_countries_', ''))
  });

  useEffect(() => {
    if (activityYear && activityYear !== fundingYear) {
      setFundingYear(activityYear);

      // Mettre à jour toutes les ressources financières avec la nouvelle année
      const updatedResources = data.map(resource => ({
        ...resource,
        funding_year: activityYear
      }));
      onChange(updatedResources);
    }
  }, [activityYear, data, fundingYear, onChange]);

  // Group resources by type and source
  const groupedResources = data.reduce((acc, resource) => {
    if (!acc[resource.funding_type]) {
      acc[resource.funding_type] = {};
    }
    acc[resource.funding_type][resource.funding_source] = resource.amount;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const validateYear = (year: string): boolean => {
    // Vérifier que c'est un nombre à 4 chiffres et ne dépasse pas 2025
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      setYearError("L'année doit être composée de 4 chiffres");
      return false;
    }

    const yearNum = parseInt(year, 10);
    if (yearNum > 2025) {
      setYearError("L'année ne peut pas dépasser 2025");
      return false;
    }

    // Effacer l'erreur si la validation est réussie
    setYearError(null);
    return true;
  };

  const handleYearChange = (year: string) => {
    validateYear(year);
    setFundingYear(year);
    // Update all existing resources with new year
    const updatedResources = data.map(resource => ({
      ...resource,
      funding_year: year
    }));
    onChange(updatedResources);
  };

  const handleFundingTypeChange = (type: string) => {
    const newTypes = selectedFundingTypes.includes(type)
        ? selectedFundingTypes.filter(t => t !== type)
        : [...selectedFundingTypes, type];

    setSelectedFundingTypes(newTypes);

    // Remove resources for unselected types
    const newResources = data.filter(resource =>
        newTypes.includes(resource.funding_type)
    );

    onChange(newResources);
  };

  const handleAmountChange = (
      type: string,
      source: string,
      value: string,
      details?: Record<string, any>
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    // Find existing resource or create new one
    const existingResourceIndex = data.findIndex(
        resource => resource.funding_type === type && resource.funding_source === source
    );

    let newResources = [...data];
    if (existingResourceIndex >= 0) {
      // Update existing resource
      newResources[existingResourceIndex] = {
        ...newResources[existingResourceIndex],
        amount: numValue,
        details: details
      };
    } else if (numValue > 0) {
      // Only add new resource if amount is greater than 0
      newResources.push({
        funding_year: fundingYear,
        funding_type: type,
        funding_source: source,
        amount: numValue,
        details: details
      });
    }

    // Remove resources with zero amount
    newResources = newResources.filter(resource => resource.amount > 0);

    onChange(newResources);
  };

  const handleCountrySelect = (region: string, sourceId: string, country: string, isChecked: boolean) => {
    // Mise à jour de la liste des pays sélectionnés
    const newSelectedCountries = { ...selectedCountries };
    if (isChecked) {
      if (!newSelectedCountries[region]) {
        newSelectedCountries[region] = [];
      }
      newSelectedCountries[region] = [...newSelectedCountries[region], country];
    } else {
      newSelectedCountries[region] = newSelectedCountries[region].filter(c => c !== country);
    }
    setSelectedCountries(newSelectedCountries);

    // Création d'une source de financement spécifique pour le pays
    const sourceKey = `${region}_public_${sourceId}_${country}`;

    if (isChecked) {
      // Ajouter une nouvelle source avec montant 0
      handleAmountChange(
          'international',
          sourceKey,
          '0',
          { region, type: 'public', source: sourceId, country }
      );
    } else {
      // Supprimer la source existante
      const newResources = data.filter(
          resource => !(resource.funding_type === 'international' && resource.funding_source === sourceKey)
      );
      onChange(newResources);
    }
  };

  const getValue = (type: string, source: string): string => {
    return (groupedResources[type]?.[source] || '').toString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
  };

  const isCountrySelected = (region: string, country: string): boolean => {
    return selectedCountries[region]?.includes(country) || false;
  };

  const getSourceLabel = (source) => {
    // Sources nationales
    for (const natSource of NATIONAL_FUNDING_SOURCES) {
      if (source === natSource.id) {
        return natSource.label;
      }
    }

    // Sources internationales
    const parts = source.split('_');
    if (parts.length < 2) return source;

    const region = parts[0];
    const funding = INTERNATIONAL_FUNDING_SOURCES[region];
    if (!funding) return source;

    // Cas spécial pour les organisations multinationales
    if (region === 'multi_nationalorg') {
      // Format: multi_nationalorg_cdao
      const orgId = parts[1]; // par exemple 'cdao'
      const org = funding.sources.find(s => s.id === orgId);
      if (org) return org.label;
      return source;
    }

    // Traiter les cas spéciaux pour les pays membres
    if (source.includes('member_states_') || source.includes('countries_')) {
      const countryId = parts[parts.length - 1];
      let countryList = [];

      // Déterminer quelle liste de pays utiliser
      if (region === 'eu') {
        countryList = EU_COUNTRIES;
      } else if (region === 'latam') {
        countryList = LATAM_COUNTRIES;
      }

      const country = countryList.find(c => c.id === countryId);
      if (country) {
        return country.label;
      }
      return source;
    }

    // Autres sources internationales
    const sourceType = parts[1]; // 'public' ou 'private'
    const sourceId = parts.slice(2).join('_');

    if (sourceType === 'public' && 'public' in funding) {
      const source = funding.public.sources.find(s => s.id === sourceId);
      if (source) return source.label;
    }
    else if (sourceType === 'private' && 'private' in funding) {
      const source = funding.private.sources.find(s => s.id === sourceId);
      if (source) return source.label;
    }
    else if ('sources' in funding) {
      const source = funding.sources.find(s => s.id === sourceId || s.id === parts[1]);
      if (source) return source.label;
    }

    return source;
  };

  return (
      <div className="space-y-8">
        {/* Funding Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Année de financement
          </label>
          <input
              type="text"
              value={fundingYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className={`mt-1 block w-full rounded-lg border ${yearError ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
              placeholder="AAAA"
              maxLength={4}
              disabled
          />
        </div>

        {/* Funding Types */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Types de financement</h3>
          <div className="flex flex-wrap gap-4">
            {FUNDING_TYPES.map(type => (
                <label key={type.id} className="inline-flex items-center">
                  <input
                      type="checkbox"
                      checked={selectedFundingTypes.includes(type.id)}
                      onChange={() => handleFundingTypeChange(type.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">{type.label}</span>
                </label>
            ))}
          </div>
        </div>

        {/* National Funding */}
        {selectedFundingTypes.includes('national') && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Financement national</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {NATIONAL_FUNDING_SOURCES.map(source => (
                    <div key={source.id} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {source.label}
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <input
                            type="number"
                            min="0"
                            value={getValue('national', source.id)}
                            onChange={(e) => handleAmountChange('national', source.id, e.target.value)}
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="0"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-gray-500 sm:text-sm">FCFA</span>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}

        {/* International Funding */}
        {selectedFundingTypes.includes('international') && (
            <div className="space-y-6">
              {Object.entries(INTERNATIONAL_FUNDING_SOURCES).map(([region, config]) => (
                  <div key={region} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">{config.label}</h3>

                    {'public' in config && (
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-700">{config.public.label}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.public.sources.map(source => (
                                <div key={source.id} className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    {source.label}
                                  </label>

                                  {/* S'il s'agit d'une source avec checkboxes (pays) */}
                                  {source.useCheckboxes && 'countries' in source ? (
                                      <div className="mt-2 space-y-2 bg-gray-50 p-3 rounded-lg max-h-80 overflow-y-auto">
                                        {source.countries.map(country => (
                                            <div key={country.id} className="flex items-center">
                                              <input
                                                  type="checkbox"
                                                  id={`${region}_${source.id}_${country.id}`}
                                                  checked={isCountrySelected(region, country.id)}
                                                  onChange={(e) => handleCountrySelect(region, source.id, country.id, e.target.checked)}
                                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                              />
                                              <label
                                                  htmlFor={`${region}_${source.id}_${country.id}`}
                                                  className="ml-2 text-sm text-gray-700"
                                              >
                                                {country.label}
                                              </label>

                                              {/* Montant pour chaque pays sélectionné */}
                                              {isCountrySelected(region, country.id) && (
                                                  <div className="relative ml-2 flex-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={getValue('international', `${region}_public_${source.id}_${country.id}`)}
                                                        onChange={(e) => handleAmountChange(
                                                            'international',
                                                            `${region}_public_${source.id}_${country.id}`,
                                                            e.target.value,
                                                            { region, type: 'public', source: source.id, country: country.id }
                                                        )}
                                                        className="block w-full rounded-lg border border-gray-300 px-3 py-1 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                                        placeholder="0"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                      <span className="text-gray-500 text-xs">FCFA</span>
                                                    </div>
                                                  </div>
                                              )}
                                            </div>
                                        ))}
                                      </div>
                                  ) : (
                                      <div className="relative mt-1 rounded-md shadow-sm">
                                        <input
                                            type="number"
                                            min="0"
                                            value={getValue('international', `${region}_public_${source.id}`)}
                                            onChange={(e) => handleAmountChange(
                                                'international',
                                                `${region}_public_${source.id}`,
                                                e.target.value,
                                                { region, type: 'public', source: source.id }
                                            )}
                                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="0"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                          <span className="text-gray-500 sm:text-sm">FCFA</span>
                                        </div>
                                      </div>
                                  )}
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {'private' in config && (
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-700">{config.private.label}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {config.private.sources.map(source => (
                                <div key={source.id} className="space-y-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    {source.label}
                                  </label>
                                  <div className="relative mt-1 rounded-md shadow-sm">
                                    <input
                                        type="number"
                                        min="0"
                                        value={getValue('international', `${region}_private_${source.id}`)}
                                        onChange={(e) => handleAmountChange(
                                            'international',
                                            `${region}_private_${source.id}`,
                                            e.target.value,
                                            { region, type: 'private', source: source.id }
                                        )}
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="0"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                      <span className="text-gray-500 sm:text-sm">FCFA</span>
                                    </div>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                    )}

                    {'sources' in config && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {config.sources.map(source => (
                              <div key={source.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  {source.label}
                                </label>
                                <div className="relative mt-1 rounded-md shadow-sm">
                                  <input
                                      type="number"
                                      min="0"
                                      value={getValue('international', `${region}_${source.id}`)}
                                      onChange={(e) => handleAmountChange(
                                          'international',
                                          `${region}_${source.id}`,
                                          e.target.value,
                                          { region, source: source.id }
                                      )}
                                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                                      placeholder="0"
                                  />
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm">FCFA</span>
                                  </div>
                                </div>
                              </div>
                          ))}
                        </div>
                    )}
                  </div>
              ))}
            </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé des financements</h4>
          <div className="space-y-4">
            {Object.entries(groupedResources).map(([type, sources]) => {
              const total = Object.values(sources).reduce((sum, amount) => sum + amount, 0);
              return (
                  <div key={type} className="p-4 bg-white rounded-lg border border-gray-100">
                    <h5 className="font-medium text-gray-900 mb-2">
                      {FUNDING_TYPES.find(t => t.id === type)?.label}
                    </h5>
                    <p className="text-lg font-bold text-blue-600">
                      Total: {formatCurrency(total)}
                    </p>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {Object.entries(sources).map(([source, amount]) => {
                        // Utiliser la fonction pour obtenir le libellé lisible
                        const sourceLabel = getSourceLabel(source);
                        return (
                            <p key={source} className="text-sm text-gray-600">
                              <span className="font-medium">{sourceLabel}:</span>{' '}
                              {formatCurrency(amount)}
                            </p>
                        );
                      })}
                    </div>
                  </div>
              );
            })}
            {Object.keys(groupedResources).length === 0 && (
                <p className="text-sm text-gray-500">Aucun financement enregistré</p>
            )}
          </div>
        </div>
      </div>
  );
}