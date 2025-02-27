import React, {useState} from 'react';
import type { NGOInvestment, NGOActivitySector } from '../types/user';
import { SECTORS } from './ActivitySectorsStep';

interface InvestmentStepProps {
  data: NGOInvestment[];
  activitySectors: NGOActivitySector[];
  onChange: (data: NGOInvestment[]) => void;
}

export default function InvestmentStep({ data, activitySectors, onChange }: InvestmentStepProps) {
  const [yearError, setYearError] = useState<string | null>(null);

  // Group investments by sector and subsector for display
  const groupedInvestments = data.reduce((acc, investment) => {
    if (!acc[investment.sector]) {
      acc[investment.sector] = {
        total: 0,
        subsectors: {}
      };
    }
    acc[investment.sector].subsectors[investment.subsector] = investment.amount;
    acc[investment.sector].total += investment.amount;
    return acc;
  }, {} as Record<string, { total: number; subsectors: Record<string, number> }>);

  // Use activity year for investments if no investment year is set
  const investmentYear = activitySectors[0]?.activity_year || data[0]?.investment_year || new Date().getFullYear().toString();
  // Group activity sectors for validation
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
    // Update all existing investments with new year
    const updatedInvestments = data.map(investment => ({
      ...investment,
      investment_year: year
    }));
    onChange(updatedInvestments);
  };

  const handleAmountChange = (
      sector: keyof typeof SECTORS,
      subsector: string,
      value: string
  ) => {
    const numValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) return;

    // Check if this subsector has activities
    const hasActivities = groupedActivities[sector]?.subsectors[subsector] > 0;
    if (!hasActivities) return;

    // Find existing investment or create new one
    const existingInvestmentIndex = data.findIndex(
        investment => investment.sector === sector && investment.subsector === subsector
    );

    let newInvestments = [...data];
    if (existingInvestmentIndex >= 0) {
      // Update existing investment
      newInvestments[existingInvestmentIndex] = {
        ...newInvestments[existingInvestmentIndex],
        amount: numValue
      };
    } else if (numValue > 0) {
      // Only add new investment if amount is greater than 0
      newInvestments.push({
        investment_year: investmentYear,
        sector,
        subsector,
        amount: numValue
      });
    }

    // Remove investments with zero amount
    newInvestments = newInvestments.filter(investment => investment.amount > 0);

    onChange(newInvestments);
  };

  const getSubsectorValue = (sector: keyof typeof SECTORS, subsector: string): string => {
    const investment = data.find(
        i => i.sector === sector && i.subsector === subsector
    );
    return investment ? investment.amount.toString() : '';
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' });
  };

  return (
      <div className="space-y-8">
        {/* Investment Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Année d'investissement
          </label>
          <input
              type="text"
              value={investmentYear}
              onChange={(e) => handleYearChange(e.target.value)}
              className={`mt-1 block w-full rounded-lg border ${yearError ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
              placeholder="AAAA"
              maxLength={4}
              disabled
          />
        </div>

        {/* Sectors */}
        {Object.entries(SECTORS).map(([sectorKey, sector]) => {
          const activityTotal = groupedActivities[sectorKey]?.total || 0;
          const hasActivities = activityTotal > 0;

          // Skip sectors without activities
          if (!hasActivities) return null;

          return (
              <div
                  key={sectorKey}
                  className="bg-white rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900">{sector.label}</h3>
                    <p className="text-sm text-blue-600">
                      Activités déclarées: {activityTotal} activités
                    </p>
                  </div>
                  {groupedInvestments[sectorKey]?.total > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Total: {formatCurrency(groupedInvestments[sectorKey].total)}
                </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(sector.subsectors).map(([subsectorKey, subsectorLabel]) => {
                    const hasSubsectorActivity = groupedActivities[sectorKey]?.subsectors[subsectorKey] > 0;

                    return (
                        <div key={subsectorKey} className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            {subsectorLabel}
                          </label>
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="number"
                                min="0"
                                value={getSubsectorValue(sectorKey as keyof typeof SECTORS, subsectorKey)}
                                onChange={(e) => handleAmountChange(
                                    sectorKey as keyof typeof SECTORS,
                                    subsectorKey,
                                    e.target.value
                                )}
                                className={`block w-full rounded-lg border px-3 py-2 ${
                                    hasSubsectorActivity
                                        ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                }`}
                                placeholder="0"
                                disabled={!hasSubsectorActivity}
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-gray-500 sm:text-sm">FCFA</span>
                            </div>
                          </div>
                          {!hasSubsectorActivity && (
                              <p className="text-xs text-gray-500">
                                Aucune activité déclarée pour ce sous-secteur
                              </p>
                          )}
                        </div>
                    );
                  })}
                </div>
              </div>
          );
        })}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Résumé des investissements</h4>
          <div className="space-y-2">
            {Object.entries(groupedInvestments).map(([sector, data]) => (
                <p key={sector} className="text-sm text-gray-600">
                  <span className="font-medium">{SECTORS[sector as keyof typeof SECTORS].label}:</span>{' '}
                  {formatCurrency(data.total)}
                </p>
            ))}
            {Object.keys(groupedInvestments).length === 0 && (
                <p className="text-sm text-gray-500">Aucun investissement enregistré</p>
            )}
          </div>
        </div>
      </div>
  );
}