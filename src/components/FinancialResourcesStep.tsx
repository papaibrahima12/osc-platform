import React, { useState } from 'react';
import type { NGOFinancialResource } from '../types/user';

interface FinancialResourcesStepProps {
  data: NGOFinancialResource[];
  onChange: (data: NGOFinancialResource[]) => void;
}

const FUNDING_TYPES = [
  { id: 'national', label: 'National' },
  { id: 'international', label: 'International' }
] as const;

const NATIONAL_FUNDING_SOURCES = [
  { id: 'government_grant', label: 'Subvention Publique' },
  { id: 'private_sector_grant', label: 'Subvention Privée' }
] as const;

const INTERNATIONAL_FUNDING_SOURCES = {
  eu: {
    label: 'Union Européenne',
    public: {
      label: 'Financement public',
      sources: [
        { id: 'member_states', label: 'États membres' },
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
        { id: 'brazil', label: 'Brésil' },
        { id: 'argentina', label: 'Argentine' },
        { id: 'mexico', label: 'Mexique' },
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
      { id: 'cdao', label: 'CDAO' },
      { id: 'boad', label: 'BOAD' },
      { id: 'uemoa', label: 'UEMOA' }
    ]
  }
} as const;

export default function FinancialResourcesStep({ data, onChange }: FinancialResourcesStepProps) {
  const [selectedFundingTypes, setSelectedFundingTypes] = useState<string[]>(
      data.map(resource => resource.funding_type)
  );

  const fundingYear = data[0]?.funding_year || new Date().getFullYear().toString();

  // Group resources by type and source
  const groupedResources = data.reduce((acc, resource) => {
    if (!acc[resource.funding_type]) {
      acc[resource.funding_type] = {};
    }
    acc[resource.funding_type][resource.funding_source] = resource.amount;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const handleYearChange = (year: string) => {
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

  const getValue = (type: string, source: string): string => {
    return (groupedResources[type]?.[source] || '').toString();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
  };

  return (
      <div className="space-y-8">
        {/* Funding Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Année de financement
          </label>
          <input
              type="date"
              value={fundingYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
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
                      {Object.entries(sources).map(([source, amount]) => (
                          <p key={source} className="text-sm text-gray-600">
                            <span className="font-medium">{source}:</span>{' '}
                            {formatCurrency(amount)}
                          </p>
                      ))}
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