import type { NGOActivitySector } from '../types/user';
import {useEffect, useState} from "react";

export const SECTORS = {
  democratic_governance: {
    label: 'Gouvernance démocratique / Droit de l\'Homme / Droit du consommateur / Genre',
    subsectors: {
      democratic_governance: 'Gouvernance démocratique',
      human_rights: 'Droits de l\'Homme',
      consumer_rights: 'Droits du consommateur',
      gender: 'Genre'
    }
  },
  natural_resources: {
    label: 'Gouvernance / Ressources naturelles',
    subsectors: {
      governance: 'Gouvernance',
      forestry: 'Foresterie',
      land: 'Foncier',
      mining: 'Mines',
      hydrocarbons: 'Hydrocarbures',
      livestock: 'Élevage',
      fishing: 'Pêche'
    }
  },
  food_sovereignty: {
    label: 'Souveraineté alimentaire',
    subsectors: {
      agriculture: 'Agriculture',
      transformation: 'Transformation',
      fishing: 'Pêche',
      elevage: 'Elevage',
      nutrition: 'Nutrition'
    }
  },
  crafts_economy: {
    label: 'Artisanat et économie populaire',
    subsectors: {
      crafts: 'Artisanat',
      popular_economy: 'Économie populaire'
    }
  },
  territorial_development: {
    label: 'Développement des territoires',
    subsectors: {
      infrastructure: 'Infrastructures',
      urban_planning: 'Aménagement urbain',
      rural_planning: 'Aménagement rural'
    }
  },
  culture_religion: {
    label: 'Culture et religion',
    subsectors: {
      culture: 'Culture',
      religion: 'Religion'
    }
  },
  digital_innovation: {
    label: 'Innovation numérique',
    subsectors: {
      digital_transformation: 'Transformation numérique',
      digital_services: 'Services numériques',
      digital_training: 'Formation numérique'
    }
  },
  sports_leisure: {
    label: 'Sports et loisirs',
    subsectors: {
      sports: 'Sports',
      leisure: 'Loisirs'
    }
  },
  education_training: {
    label: 'Éducation / Formation professionnelle / Insertion',
    subsectors: {
      education: 'Éducation',
      professional_training: 'Formation professionnelle',
      insertion: 'Insertion'
    }
  },
  health: {
    label: 'Santé',
    subsectors: {
      maternal_child: 'Santé maternelle et infantile',
      prevention: 'Prévention',
      mst: 'MST',
      community: 'Santé communautaire'
    }
  },
  environment_climate: {
    label: 'Environnement, climat et biodiversité',
    subsectors: {
      environment: 'Environnement',
      climate_biodiversity: 'Climat et biodiversité',
      other: 'Autres'
    }
  }
} as const;

interface ActivitySectorsStepProps {
  data: NGOActivitySector[];
  onChange: (data: NGOActivitySector[]) => void;
  onYearChange?: (year: string) => void;
}

export default function ActivitySectorsStep({ data, onChange, onYearChange }: ActivitySectorsStepProps) {
  // Group activities by sector and subsector
  const groupedActivities = data.reduce((acc, activity) => {
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [activityYear, setActivityYear] = useState(() => {
    // Chercher l'année dans les données existantes
    if (data.length > 0 && data[0].activity_year) {
      return data[0].activity_year;
    }
    // Valeur par défaut
    return new Date().getFullYear().toString();
  });

  useEffect(() => {
    if (!isInitialized && data.length > 0 && data[0].activity_year) {
      setActivityYear(data[0].activity_year);
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  const [yearError, setYearError] = useState<string | null>(null);

  const validateYear = (year: string): boolean => {
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

    setYearError(null);
    return true;
  };
  const handleYearChange = (year: string) => {
    setActivityYear(year);

    const isValid = validateYear(year);

    if (isValid) {
      let updatedActivities: NGOActivitySector[];

      if (data.length > 0) {
        // Mettre à jour les activités existantes avec la nouvelle année
        updatedActivities = data.map(activity => ({
          ...activity,
          activity_year: year
        }));
      } else {
        // Si aucune activité n'existe, créer une activité fictive pour persister l'année
        // On la supprimera plus tard si elle reste vide
        updatedActivities = [{
          activity_year: year,
          sector: 'education_training' as keyof typeof SECTORS,
          subsector: 'education',
          activity_count: 0
        }];
      }

      onChange(updatedActivities);

      if (onYearChange) {
        onYearChange(year);
      }
    }
  };

  const handleActivityCountChange = (
      sector: keyof typeof SECTORS,
      subsector: string,
      value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    // Find existing activity or create new one
    const existingActivityIndex = data.findIndex(
        activity => activity.sector === sector && activity.subsector === subsector
    );

    let newActivities = [...data];
    if (existingActivityIndex >= 0) {
      // Update existing activity
      newActivities[existingActivityIndex] = {
        ...newActivities[existingActivityIndex],
        activity_count: numValue,
        activity_year: activityYear
      };
    } else if (numValue > 0) {
      // Only add new activity if count is greater than 0
      newActivities.push({
        activity_year: activityYear,
        sector,
        subsector,
        activity_count: numValue
      });
    }

    // Remove activities with zero count
    newActivities = newActivities.filter(activity => activity.activity_count > 0);

    if (newActivities.length === 0) {
      newActivities.push({
        activity_year: activityYear,
        sector: 'education_training' as keyof typeof SECTORS,
        subsector: 'education',
        activity_count: 0
      });
    }

    onChange(newActivities);
  };

  const getSubsectorValue = (sector: keyof typeof SECTORS, subsector: string): string => {
    const activity = data.find(
        a => a.sector === sector && a.subsector === subsector
    );
    return activity ? activity.activity_count.toString() : '';
  };

  return (
      <div className="space-y-8">
        {/* Informative Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Renseigner le nombre de projets réalisés par secteur d'activité
          </p>
        </div>

        {/* Activity Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Année d'activité
          </label>
          <input
              type="text"
              value={activityYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className={`mt-1 block w-full rounded-lg border ${yearError ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
              placeholder="AAAA"
              maxLength={4}
              required
          />
          {yearError && (
              <p className="mt-1 text-sm text-red-600">{yearError}</p>
          )}
        </div>

        {/* Sectors */}
        {Object.entries(SECTORS).map(([sectorKey, sector]) => (
            <div key={sectorKey} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{sector.label}</h3>
                {groupedActivities[sectorKey]?.total > 0 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Total: {groupedActivities[sectorKey].total} activités
              </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(sector.subsectors).map(([subsectorKey, subsectorLabel]) => (
                    <div key={subsectorKey}>
                      <label className="block text-sm font-medium text-gray-700">
                        {subsectorLabel}
                      </label>
                      <input
                          type="number"
                          min="0"
                          value={getSubsectorValue(sectorKey as keyof typeof SECTORS, subsectorKey)}
                          onChange={(e) => handleActivityCountChange(
                              sectorKey as keyof typeof SECTORS,
                              subsectorKey,
                              e.target.value
                          )}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="0"
                      />
                    </div>
                ))}
              </div>
            </div>
        ))}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé des activités</h4>
          <div className="space-y-2">
            {Object.entries(groupedActivities).map(([sector, data]) => (
                <p key={sector} className="text-sm text-gray-600">
                  <span className="font-medium">{SECTORS[sector as keyof typeof SECTORS].label}:</span>{' '}
                  {data.total} activités
                </p>
            ))}
            {Object.keys(groupedActivities).length === 0 && (
                <p className="text-sm text-gray-500">Aucune activité enregistrée</p>
            )}
          </div>
        </div>
      </div>
  );
}