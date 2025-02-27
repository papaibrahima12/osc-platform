import type { NGOStaff } from '../types/user';

interface PersonnelInformationStepProps {
  data: NGOStaff | null;
  onChange: (data: Partial<NGOStaff>) => void;
}

export default function PersonnelInformationStep({ data, onChange }: PersonnelInformationStepProps) {
  // Ensure data is properly initialized
  const safeData = {
    men_count: data?.men_count || 0,
    women_count: data?.women_count || 0,
    young_18_25_count: data?.young_18_25_count || 0,
    young_26_35_count: data?.young_26_35_count || 0,
    disabled_count: data?.disabled_count || 0,
    expatriate_count: data?.expatriate_count || 0,
    national_count: data?.national_count || 0,
    temporary_count: data?.temporary_count || 0,
    permanent_count: data?.permanent_count || 0,
    volunteer_count: data?.volunteer_count || 0,
    intern_count: data?.intern_count || 0
  };

  const totalEmployees = safeData.men_count + safeData.women_count;
  const totalYoung = safeData.young_18_25_count + safeData.young_26_35_count;
  const totalOrigin = safeData.expatriate_count + safeData.national_count;
  const totalStatus = safeData.temporary_count + safeData.permanent_count + 
                     safeData.volunteer_count + safeData.intern_count;

  const handleInputChange = (field: keyof NGOStaff, value: string) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    const newData = { ...safeData, [field]: numValue };

    // Validate gender totals
    if (field === 'men_count' || field === 'women_count') {
      const otherField = field === 'men_count' ? 'women_count' : 'men_count';
      const maxValue = Math.max(
        newData[field],
        totalYoung,
        newData.disabled_count,
        totalOrigin,
        totalStatus
      );
      if (newData[field] + newData[otherField] < maxValue) {
        return; // Don't allow update if it would make totals inconsistent
      }
    }

    // Validate young totals
    if (field === 'young_18_25_count' || field === 'young_26_35_count') {
      if (totalEmployees < (field === 'young_18_25_count' ? 
          numValue + safeData.young_26_35_count : 
          safeData.young_18_25_count + numValue)) {
        return;
      }
    }

    // Validate origin totals
    if (field === 'expatriate_count' || field === 'national_count') {
      if (totalEmployees < (field === 'expatriate_count' ? 
          numValue + safeData.national_count : 
          safeData.expatriate_count + numValue)) {
        return;
      }
    }

    // Validate status totals
    if (['temporary_count', 'permanent_count', 'volunteer_count', 'intern_count'].includes(field)) {
      const newTotal = Object.entries(newData)
        .filter(([key]) => ['temporary_count', 'permanent_count', 'volunteer_count', 'intern_count'].includes(key))
        .reduce((sum, [key, val]) => sum + (key === field ? numValue : val), 0);
      
      if (newTotal > totalEmployees) {
        return;
      }
    }

    onChange(newData);
  };

  const renderNumberInput = (
    field: keyof NGOStaff,
    label: string,
    className: string = ''
  ) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <input
          type="number"
          min="0"
          value={safeData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
          placeholder="0"
          required
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Total Employees Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-blue-900">Total du personnel</h3>
            <p className="text-sm text-blue-600">Calculé automatiquement</p>
          </div>
          <div className="text-3xl font-bold text-blue-700">{totalEmployees}</div>
        </div>
      </div>

      {/* Gender Distribution */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par genre</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput('men_count', "Nombre d'hommes")}
          {renderNumberInput('women_count', 'Nombre de femmes')}
        </div>
        {totalEmployees > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Hommes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((safeData.men_count / totalEmployees) * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Femmes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((safeData.women_count / totalEmployees) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Age Distribution */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition par âge</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput('young_18_25_count', 'Nombre de jeunes (18-25 ans)')}
          {renderNumberInput('young_26_35_count', 'Nombre de jeunes (26-35 ans)')}
        </div>
        {totalYoung > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Total jeunes</p>
            <p className="text-lg font-semibold text-gray-900">
              {((totalYoung / totalEmployees) * 100).toFixed(1)}% du personnel
            </p>
          </div>
        )}
      </div>

      {/* Special Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Catégories spéciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderNumberInput('disabled_count', 'Personnes handicapées')}
          {renderNumberInput('expatriate_count', "Expatriés")}
          {renderNumberInput('national_count', 'Nationaux')}
        </div>
        {(safeData.disabled_count > 0 || totalOrigin > 0) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            {safeData.disabled_count > 0 && (
              <div>
                <p className="text-sm text-gray-500">Personnes handicapées</p>
                <p className="text-lg font-semibold text-gray-900">
                  {((safeData.disabled_count / totalEmployees) * 100).toFixed(1)}% du personnel
                </p>
              </div>
            )}
            {totalOrigin > 0 && (
              <div>
                <p className="text-sm text-gray-500">Répartition origine</p>
                <div className="flex space-x-4">
                  <p className="text-sm">
                    <span className="font-medium">Expatriés:</span>{' '}
                    {((safeData.expatriate_count / totalEmployees) * 100).toFixed(1)}%
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Nationaux:</span>{' '}
                    {((safeData.national_count / totalEmployees) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Employment Status */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statut d'emploi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderNumberInput('temporary_count', 'Temporaires')}
          {renderNumberInput('permanent_count', 'Permanents')}
          {renderNumberInput('volunteer_count', 'Volontaires')}
          {renderNumberInput('intern_count', 'Stagiaires')}
        </div>
        {totalStatus > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Répartition par statut</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <p className="text-sm">
                <span className="font-medium">Temporaires:</span>{' '}
                {((safeData.temporary_count / totalEmployees) * 100).toFixed(1)}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Permanents:</span>{' '}
                {((safeData.permanent_count / totalEmployees) * 100).toFixed(1)}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Volontaires:</span>{' '}
                {((safeData.volunteer_count / totalEmployees) * 100).toFixed(1)}%
              </p>
              <p className="text-sm">
                <span className="font-medium">Stagiaires:</span>{' '}
                {((safeData.intern_count / totalEmployees) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}