import  { useState } from 'react';
import type { NGOBeneficiary, NGOActivitySector } from '../types/user';

interface BeneficiariesStepProps {
  data: NGOBeneficiary[];
  activitySectors: NGOActivitySector[];
  onChange: (data: NGOBeneficiary[]) => void;
}

const SECTORS = {
  democratic_governance: 'Gouvernance démocratique / Droit de l\'Homme / Droit du consommateur / Genre',
  natural_resources: 'Gouvernance / Ressources naturelles',
  food_sovereignty: 'Souveraineté alimentaire',
  crafts_economy: 'Artisanat et économie populaire',
  territorial_development: 'Développement des territoires',
  culture_religion: 'Culture et religion',
  digital_innovation: 'Innovation numérique',
  sports_leisure: 'Sports et loisirs',
  education_training: 'Éducation / Formation professionnelle / Insertion',
  health: 'Santé',
  environment_climate: 'Environnement, climat et biodiversité'
} as const;

function BeneficiariesStep({ data, activitySectors, onChange }: BeneficiariesStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
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

  // Group beneficiaries by sector
  const groupedBeneficiaries = data.reduce((acc, beneficiary) => {
    acc[beneficiary.sector] = beneficiary;
    return acc;
  }, {} as Record<string, NGOBeneficiary>);

  const handleInputChange = (
    sector: string,
    field: keyof NGOBeneficiary,
    value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    // Check if this sector has activities
    const hasActivities = groupedActivities[sector]?.total > 0;
    if (!hasActivities) return;

    // Find existing beneficiary or create new one
    const existingBeneficiary = groupedBeneficiaries[sector];
    let newBeneficiary: Partial<NGOBeneficiary>;

    if (existingBeneficiary) {
      newBeneficiary = { ...existingBeneficiary };
    } else {
      newBeneficiary = {
        sector,
        total: 0,
        men: 0,
        women: 0,
        young: 0,
        pregnant_women: 0,
        lactating_women: 0,
        teachers: 0,
        students: 0,
        legal_entities: 0,
        preschool_age_child: 0,
        school_age_child: 0,
        child_before_preschool_age: 0,
        disabled: 0,
        other_vulnerable: 0
      };
    }

    // Update the field
    newBeneficiary[field] = numValue;

    // Validation logic
    if (field === 'total') {
      const currentSum = newBeneficiary.men + newBeneficiary.women;
      if (numValue < currentSum) {
        newBeneficiary.men = 0;
        newBeneficiary.women = 0;
      }
      if (numValue < newBeneficiary?.young) {
        newBeneficiary.young = 0;
      }
      if (numValue < newBeneficiary?.disabled) {
        newBeneficiary.disabled = 0;
      }
      if (numValue < newBeneficiary?.other_vulnerable) {
        newBeneficiary.other_vulnerable = 0;
      }
      setErrors({});
    } else if (field === 'men' || field === 'women') {
      const otherField = field === 'men' ? 'women' : 'men';
      const sum = numValue + newBeneficiary[otherField];

      if (sum > newBeneficiary.total) {
        setErrors({
          ...errors,
          [sector]: `La somme des hommes et des femmes ne peut pas dépasser le total (${newBeneficiary.total})`
        });
        return;
      } else {
        setErrors({
          ...errors,
          [sector]: ''
        });
      }
    } else if (field === 'young' || field === 'disabled' || field === 'other_vulnerable' || field === 'pregnant_women' || field === 'lactating_women' || field === 'students' || field === 'teachers' || field === 'legal_entities' || field === 'preschool_age_child' || field === 'child_before_preschool_age' || field === 'school_age_child') {
      if (numValue > newBeneficiary.total) {
        setErrors({
          ...errors,
          [sector]: `Le nombre ne peut pas dépasser le total (${newBeneficiary.total})`
        });
        return;
      } else {
        setErrors({
          ...errors,
          [sector]: ''
        });
      }
    }

    const newData = [...data.filter(b => b.sector !== sector)];
    if (Object.values(newBeneficiary).some(v => v > 0)) {
      newData.push(newBeneficiary as NGOBeneficiary);
    }
    onChange(newData);
  };

  const renderSectorInputs = (sector: string) => {
    // Only show sectors that have activities
    const activityTotal = groupedActivities[sector]?.total || 0;
    if (activityTotal === 0) return null;

    const beneficiary = groupedBeneficiaries[sector] || {
      total: 0,
      men: 0,
      women: 0,
      young: 0,
      pregnant_women: 0,
      lactating_women: 0,
      teachers: 0,
      students: 0,
      legal_entities: 0,
      preschool_age_child: 0,
      school_age_child: 0,
      child_before_preschool_age: 0,
      disabled: 0,
      other_vulnerable: 0
    };
    const error = errors[sector];

    return (
      <div key={sector} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{SECTORS[sector]}</h3>
            <p className="text-sm text-blue-600">
              Activités déclarées: {activityTotal} activités
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <input
              type="number"
              min="0"
              value={beneficiary.total}
              onChange={(e) => handleInputChange(sector, 'total', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hommes
            </label>
            <input
              type="number"
              min="0"
              value={beneficiary.men}
              onChange={(e) => handleInputChange(sector, 'men', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Femmes
            </label>
            <input
              type="number"
              min="0"
              value={beneficiary.women}
              onChange={(e) => handleInputChange(sector, 'women', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Jeunes (-35 ans)
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.young}
                onChange={(e) => handleInputChange(sector, 'young', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Femmes Enceintes
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.pregnant_women}
                onChange={(e) => handleInputChange(sector, 'pregnant_women', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Femmes Allaitantes
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.lactating_women}
                onChange={(e) => handleInputChange(sector, 'lactating_women', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enseignants
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.teachers}
                onChange={(e) => handleInputChange(sector, 'teachers', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Elèves
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.students}
                onChange={(e) => handleInputChange(sector, 'students', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Entités Morales
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.legal_entities}
                onChange={(e) => handleInputChange(sector, 'legal_entities', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enfants (0-36 mois)
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.child_before_preschool_age}
                onChange={(e) => handleInputChange(sector, 'child_before_preschool_age', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enfants (3-6 ans)
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.preschool_age_child}
                onChange={(e) => handleInputChange(sector, 'preschool_age_child', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enfants (7-15 ans)
            </label>
            <input
                type="number"
                min="0"
                value={beneficiary.school_age_child}
                onChange={(e) => handleInputChange(sector, 'school_age_child', e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Personnes handicapées
            </label>
            <input
              type="number"
              min="0"
              value={beneficiary.disabled}
              onChange={(e) => handleInputChange(sector, 'disabled', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Autres
            </label>
            <input
              type="number"
              min="0"
              value={beneficiary.other_vulnerable}
              onChange={(e) => handleInputChange(sector, 'other_vulnerable', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {beneficiary.total > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hommes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.men / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Femmes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.women / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Jeunes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.young / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Femmes Enceintes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.pregnant_women / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Femmes Allaitantes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.lactating_women / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enseignants</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.teachers / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Elèves</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.students / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Entités Morales</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.legal_entities / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Enfants (0-36 mois)</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.child_before_preschool_age / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enfants (3-6 ans)</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.preschool_age_child / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enfants (7-15 ans)</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.school_age_child / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Handicapés</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.disabled / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Autres</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((beneficiary.other_vulnerable / beneficiary.total) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get active sectors (sectors with activities)
  const activeSectors = Object.keys(SECTORS).filter(
    sector => groupedActivities[sector]?.total > 0
  );

  return (
    <div className="space-y-6">
      {activeSectors.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            Aucun secteur d'activité n'a été déclaré. Veuillez d'abord déclarer vos activités par secteur.
          </p>
        </div>
      ) : (
        <>
          {Object.keys(SECTORS).map((sector) => 
            renderSectorInputs(sector)
          )}

          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h4 className="text-lg font-medium text-blue-900 mb-4">Résumé des bénéficiaires</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(SECTORS).map(([sector, label]) => {
                const beneficiary = groupedBeneficiaries[sector];
                const activityTotal = groupedActivities[sector]?.total || 0;
                
                if (activityTotal > 0 && beneficiary?.total > 0) {
                  return (
                    <div key={sector} className="bg-white rounded-lg p-4 border border-blue-200">
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {beneficiary.total.toLocaleString()}
                      </p>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>H: {beneficiary.men} / F: {beneficiary.women}</p>
                        <p>Jeunes: {beneficiary.young}</p>
                        <p>Femmes Enceintes: {beneficiary.pregnant_women}</p>
                        <p>Femmes Allaitantes: {beneficiary.lactating_women}</p>
                        <p>Enseignants: {beneficiary.teachers}</p>
                        <p>Elèves: {beneficiary.students}</p>
                        <p>Entités morales: {beneficiary.legal_entities}</p>
                        <p>Enfants (0-36 mois): {beneficiary.child_before_preschool_age}</p>
                        <p>Enfants (3-6 ans): {beneficiary.preschool_age_child}</p>
                        <p>Enfants (7-15 ans): {beneficiary.school_age_child}</p>
                        <p>Handicapés: {beneficiary.disabled}</p>
                        <p>Autres: {beneficiary.other_vulnerable}</p>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BeneficiariesStep;