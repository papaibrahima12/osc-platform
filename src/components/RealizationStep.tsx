import React from 'react';
import type { NGORealization, NGOActivitySector } from '../types/user';

export const SECTORS_INDICATORS = {
  democratic_governance: {
    label: 'Gouvernance démocratique / Droit de l\'Homme / Droit du consommateur / Genre',
    indicators: {
      training_count: 'Nombre de formations dispensées',
      platform_count: 'Nombre de plateformes de dialogue',
      vbg_case_count: 'Nombre de cas de VBG signalés',
      infrastructure_count: 'Nombre d\'infrastructures',
      report_count: 'Nombre de rapports alternatifs publiés',
      equipment_count: 'Nombre d\'équipements'
    }
  },
  natural_resources: {
    label: 'Gouvernance / Ressources naturelles',
    indicators: {
      report_count: 'Nombre de rapports alternatifs publiés',
      platform_count: 'Nombre de plateformes de dialogue',
      infrastructure_count: 'Nombre d\'infrastructures',
      training_count: 'Nombre de formations dispensées',
      protected_area_count: 'Nombre de zones protégées'
    }
  },
  food_sovereignty: {
    label: 'Souveraineté alimentaire',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures',
      equipment_count: 'Nombre d\'équipements',
      livestock_count: 'Nombre de têtes de bétail',
      input_quantity: 'Quantité d\'intrants distribués',
      training_count: 'Nombre de formations dispensées'
    }
  },
  crafts_economy: {
    label: 'Artisanat et économie populaire',
    indicators: {
      certified_product_count: 'Nombre de produits certifiés',
      fair_count: 'Nombre de foires et salons',
      infrastructure_count: 'Nombre d\'infrastructures',
      platform_count: 'Nombre de plateformes',
      equipment_count: 'Nombre d\'équipements',
      training_count: 'Nombre de formations dispensées'
    }
  },
  territorial_development: {
    label: 'Développement des territoires',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures',
      training_count: 'Nombre de formations dispensées',
      urban_plan_count: 'Nombre de plans d\'aménagement',
      housing_count: 'Nombre de logements construits',
      equipment_count: 'Nombre d\'équipements'
    }
  },
  culture_religion: {
    label: 'Culture et religion',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures',
      training_count: 'Nombre de formations dispensées',
      platform_count: 'Nombre de plateformes',
      equipment_count: 'Nombre d\'équipements'
    }
  },
  digital_innovation: {
    label: 'Innovation numérique',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures',
      training_count: 'Nombre de formations dispensées',
      platform_count: 'Nombre de plateformes',
      equipment_count: 'Nombre d\'équipements'
    }
  },
  sports_leisure: {
    label: 'Sports et loisirs',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures',
      equipment_count: 'Nombre d\'équipements',
      training_count: 'Nombre de formations dispensées',
      kit_count: 'Nombre de kits sportifs/loisirs'
    }
  },
  education_training: {
    label: 'Education, Formation Professionnelle et insertion',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures scolaires',
      equipment_count: 'Nombre d\'équipements scolaires',
      training_count: 'Nombre de formations dispensées',
      job_support_count: 'Nombre de jeunes ou d\'adultes accompagnés',
      kit_count: 'Nombre de kits scolaires/formations/insertion'
    }
  },
  health: {
    label: 'Santé',
    indicators: {
      infrastructure_count: 'Nombre d\'infrastructures sanitaires',
      equipment_count: 'Nombre d\'équipements sanitaires',
      prevention_kit_count: 'Nombre de kits de prévention',
      patient_count: 'Nombre de patients pris en charge',
      awareness_session_count: 'Nombre de séances de sensibilisation',
      training_count: 'Nombre de formations dispensées'
    }
  },
  environment_climate: {
    label: 'Environnement, Climat et Biodiversité',
    indicators: {
      tree_count: 'Nombre d\'arbres plantés',
      restored_area: 'Nombre d\'hectares restaurés ou protégés',
      waste_quantity: 'Nombre de tonnes de déchets collectés',
      training_count: 'Nombre de formations dispensées'
    }
  }
} as const;

interface RealizationStepProps {
  data: NGORealization[];
  activitySectors: NGOActivitySector[];
  onChange: (data: NGORealization[]) => void;
}

export default function RealizationStep({ data, activitySectors, onChange }: RealizationStepProps) {
  // Group realizations by sector and indicator
  const groupedRealizations = data.reduce((acc, realization) => {
    if (!acc[realization.sector]) {
      acc[realization.sector] = {};
    }
    acc[realization.sector][realization.indicator] = realization.value;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  // Group activities by sector for validation
  const groupedActivities = activitySectors.reduce((acc, activity) => {
    if (!acc[activity.sector]) {
      acc[activity.sector] = {
        total: 0,
        subsectors: {}
      };
    }
    acc[activity.sector].subsectors[activity.subsector] = activity.activity_count;
    acc[activity.sector].total += activity.activity_count;
    return acc;
  }, {} as Record<string, { total: number; subsectors: Record<string, number> }>);

  const handleValueChange = (
    sector: string,
    indicator: string,
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    // Check if this sector has activities
    const hasActivities = groupedActivities[sector]?.total > 0;
    if (!hasActivities) return;

    // Find existing realization or create new one
    const existingRealizationIndex = data.findIndex(
      realization => realization.sector === sector && realization.indicator === indicator
    );

    let newRealizations = [...data];
    if (existingRealizationIndex >= 0) {
      // Update existing realization
      newRealizations[existingRealizationIndex] = {
        ...newRealizations[existingRealizationIndex],
        value: numValue
      };
    } else if (numValue > 0) {
      // Only add new realization if value is greater than 0
      newRealizations.push({
        sector,
        indicator,
        value: numValue
      });
    }

    // Remove realizations with zero value
    newRealizations = newRealizations.filter(realization => realization.value > 0);

    onChange(newRealizations);
  };

  const getValue = (sector: string, indicator: string): string => {
    return (groupedRealizations[sector]?.[indicator] || '').toString();
  };

  return (
    <div className="space-y-8">
      {/* Informative Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          Renseigner les réalisations par secteur d'activité
        </p>
      </div>

      {/* Sectors */}
      {Object.entries(SECTORS_INDICATORS).map(([sectorKey, sector]) => {
        const activityTotal = groupedActivities[sectorKey]?.total || 0;
        const hasActivities = activityTotal > 0;

        // Skip sectors without activities
        if (!hasActivities) return null;

        return (
          <div key={sectorKey} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{sector.label}</h3>
                <p className="text-sm text-blue-600">
                  Activités déclarées: {activityTotal} activités
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(sector.indicators).map(([indicatorKey, label]) => (
                <div key={indicatorKey} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={getValue(sectorKey, indicatorKey)}
                    onChange={(e) => handleValueChange(sectorKey, indicatorKey, e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé des réalisations</h4>
        <div className="space-y-4">
          {Object.entries(SECTORS_INDICATORS).map(([sectorKey, sector]) => {
            const sectorRealizations = groupedRealizations[sectorKey];
            if (!sectorRealizations) return null;

            const hasValues = Object.values(sectorRealizations).some(value => value > 0);
            if (!hasValues) return null;

            return (
              <div key={sectorKey} className="p-4 bg-white rounded-lg border border-gray-100">
                <h5 className="font-medium text-gray-900 mb-2">{sector.label}</h5>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(sector.indicators).map(([indicatorKey, label]) => {
                    const value = sectorRealizations[indicatorKey];
                    if (!value) return null;

                    return (
                      <p key={indicatorKey} className="text-sm text-gray-600">
                        <span className="font-medium">{label}:</span> {value}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {Object.keys(groupedRealizations).length === 0 && (
            <p className="text-sm text-gray-500">Aucune réalisation enregistrée</p>
          )}
        </div>
      </div>
    </div>
  );
}