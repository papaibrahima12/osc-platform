import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  MapPin, 
  Activity, 
  Wallet, 
  DollarSign, 
  Target,
  ChevronLeft,
  ChevronRight,
  CheckSquare
} from 'lucide-react';
import GeneralInformationStep from '../components/GeneralInformationStep';
import PersonnelInformationStep from '../components/PersonnelInformationStep';
import InterventionZonesStep from '../components/InterventionZonesStep';
import ActivitySectorsStep from '../components/ActivitySectorsStep';
import InvestmentStep from '../components/InvestmentStep';
import FinancialResourcesStep from '../components/FinancialResourcesStep';
import BeneficiariesStep from '../components/BeneficiariesStep';
import RealizationStep from '../components/RealizationStep';
import { useDemoStore } from '../store/demo';
import type { NGO } from '../types/user';

const steps = [
  { icon: Building2, label: 'Informations générales' },
  { icon: Users, label: 'Personnel' },
  { icon: MapPin, label: "Zones d'intervention" },
  { icon: Activity, label: "Secteurs d'activité" },
  { icon: Wallet, label: 'Investissement' },
  { icon: DollarSign, label: 'Source de financement' },
  { icon: Target, label: 'Bénéficiaires' },
  { icon: CheckSquare, label: 'Réalisations' }
];

interface EditNGOProps {
  ngo: NGO;
  onCancel: () => void;
}

function EditNGO({ ngo, onCancel }: EditNGOProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // General Information
    name: ngo.name,
    status: ngo.status,
    otherStatus: ngo.other_status || '',
    category: ngo.category,
    otherCategory: ngo.other_category || '',
    scale: ngo.scale,
    address: ngo.address,
    email: ngo.email,
    phone: ngo.phone,
    website: ngo.website || '',
    facebook: ngo.facebook || '',
    linkedin: ngo.linkedin || '',
    twitter: ngo.twitter || '',
    creationYear: ngo.creation_year,
    approvalYear: ngo.approval_year || '',
    agreementDocument: undefined as File | undefined,
    // Contact person information
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',

    // Personnel Information
    personnel_data: ngo.ngo_metadata?.personnel_data || {
      men_count: 0,
      women_count: 0,
      young_18_25_count: 0,
      young_26_35_count: 0,
      disabled_count: 0,
      expatriate_count: 0,
      national_count: 0,
      temporary_count: 0,
      permanent_count: 0,
      volunteer_count: 0,
      intern_count: 0
    },

    // Intervention Zones
    intervention_zones: ngo.ngo_metadata?.intervention_zones || {
      west_africa_countries: [],
      other_countries: [],
      senegal_regions: [],
      senegal_departments: [],
      municipalities: []
    },

    // Activity Sectors
    activity_sectors: ngo.ngo_metadata?.activity_sectors || {
      activity_year: '',
      sectors: {}
    },

    // Investment
    investment_data: ngo.ngo_metadata?.investment_data || {
      investment_year: '',
      sectors: {}
    },

    // Financial Resources
    financial_resources: ngo.ngo_metadata?.financial_resources || {
      funding_year: '',
      funding_types: [],
      national_funding: {
        government_grant: 0,
        private_sector_grant: 0
      },
      international_funding: {}
    },

    // Beneficiaries
    beneficiaries_data: ngo.ngo_metadata?.beneficiaries_data || {},

    // Realizations
    realizations: ngo.ngo_metadata?.realizations || {}
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateNGO, ngos } = useDemoStore();

  const handleFormUpdate = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  const validateGeneralInformation = (data: typeof formData) => {
    const errors: string[] = [];
    
    if (!data.name) errors.push('Le nom est requis');
    if (!data.status) errors.push('Le statut est requis');
    if (data.status === 'other' && !data.otherStatus) errors.push('Précisez le statut');
    if (data.status === 'association' && !data.category) errors.push('La catégorie est requise');
    if (data.status === 'association' && data.category === 'other' && !data.otherCategory) {
      errors.push('Précisez la catégorie');
    }
    if (!data.scale) errors.push("L'échelle est requise");
    if (!data.address) errors.push("L'adresse est requise");
    if (!data.email) errors.push("L'email est requis");
    if (!data.phone) errors.push('Le téléphone est requis');
    if (!data.creationYear) errors.push('La date de création est requise');
    if (data.status === 'ngo' && !data.approvalYear) errors.push("La date d'agrément est requise");

    // Check if email already exists (excluding current NGO)
    if (ngos.some(n => n.email === data.email && n.id !== ngo.id)) {
      errors.push('Cette adresse email est déjà utilisée');
    }

    return errors;
  };

  const validatePersonnelInformation = (data: typeof formData) => {
    const errors: string[] = [];
    const personnel = data.personnel_data;

    if (!personnel.men_count && !personnel.women_count) {
      errors.push('Au moins un homme ou une femme doit être renseigné');
    }

    const total = (personnel.men_count || 0) + (personnel.women_count || 0);
    if (total === 0) {
      errors.push('Le nombre total de personnel doit être supérieur à 0');
    }

    const totalStatus = (personnel.temporary_count || 0) + 
                       (personnel.permanent_count || 0) + 
                       (personnel.volunteer_count || 0) + 
                       (personnel.intern_count || 0);

    if (totalStatus !== total) {
      errors.push('La somme des statuts doit être égale au nombre total de personnel');
    }

    const totalOrigin = (personnel.expatriate_count || 0) + (personnel.national_count || 0);
    if (totalOrigin !== total) {
      errors.push("La somme des origines doit être égale au nombre total de personnel");
    }

    return errors;
  };

  const validateInterventionZones = (data: typeof formData) => {
    const errors: string[] = [];
    const zones = data.intervention_zones;

    if (!zones.west_africa_countries.length) {
      errors.push("Au moins un pays d'intervention doit être sélectionné");
    }

    if (zones.west_africa_countries.includes('Sénégal') && !zones.senegal_regions.length) {
      errors.push('Au moins une région du Sénégal doit être sélectionnée');
    }

    if (zones.senegal_regions.length && !zones.senegal_departments.length) {
      errors.push('Au moins un département doit être sélectionné');
    }

    if (zones.senegal_departments.length && !zones.municipalities.length) {
      errors.push('Au moins une commune doit être sélectionnée');
    }

    return errors;
  };

  const validateActivitySectors = (data: typeof formData) => {
    const errors: string[] = [];
    const sectors = data.activity_sectors;

    if (!sectors.activity_year) {
      errors.push("L'année d'activité est requise");
    }

    const hasActivities = Object.values(sectors.sectors).some(
      sector => sector.total > 0
    );

    if (!hasActivities) {
      errors.push("Au moins une activité doit être renseignée");
    }

    return errors;
  };

  const validateInvestment = (data: typeof formData) => {
    const errors: string[] = [];
    const investment = data.investment_data;

    if (!investment.investment_year) {
      errors.push("L'année d'investissement est requise");
    }

    const hasInvestments = Object.values(investment.sectors).some(
      sector => sector.total > 0
    );

    if (!hasInvestments) {
      errors.push("Au moins un investissement doit être renseigné");
    }

    return errors;
  };

  const validateFinancialResources = (data: typeof formData) => {
    const errors: string[] = [];
    const resources = data.financial_resources;

    if (!resources.funding_year) {
      errors.push("L'année de financement est requise");
    }

    if (!resources.funding_types.length) {
      errors.push('Au moins un type de financement doit être sélectionné');
    }

    const hasNationalFunding = resources.funding_types.includes('national') && 
      (resources.national_funding.government_grant > 0 || 
       resources.national_funding.private_sector_grant > 0);

    const hasInternationalFunding = resources.funding_types.includes('international') &&
      Object.values(resources.international_funding).some(funding => 
        funding.public_funding?.amount > 0 || funding.private_funding?.amount > 0
      );

    if (!hasNationalFunding && !hasInternationalFunding) {
      errors.push('Au moins un montant de financement doit être renseigné');
    }

    return errors;
  };

  const validateBeneficiaries = (data: typeof formData) => {
    const errors: string[] = [];
    const beneficiaries = data.beneficiaries_data;

    const hasBeneficiaries = Object.values(beneficiaries).some(
      sector => sector.total > 0
    );

    if (!hasBeneficiaries) {
      errors.push('Au moins un bénéficiaire doit être renseigné');
    }

    // Check if men + women equals total for each sector
    Object.entries(beneficiaries).forEach(([sector, data]) => {
      if (data.total > 0) {
        if (data.men + data.women !== data.total) {
          errors.push(`La somme des hommes et des femmes doit être égale au total pour le secteur ${sector}`);
        }
        if (data.young > data.total) {
          errors.push(`Le nombre de jeunes ne peut pas dépasser le total pour le secteur ${sector}`);
        }
        if (data.disabled > data.total) {
          errors.push(`Le nombre de personnes handicapées ne peut pas dépasser le total pour le secteur ${sector}`);
        }
        if (data.other_vulnerable > data.total) {
          errors.push(`Le nombre d'autres personnes vulnérables ne peut pas dépasser le total pour le secteur ${sector}`);
        }
      }
    });

    return errors;
  };

  const validateRealizations = (data: typeof formData) => {
    const errors: string[] = [];
    const realizations = data.realizations;

    const hasRealizations = Object.values(realizations).some(
      sector => Object.values(sector).some(value => value > 0)
    );

    if (!hasRealizations) {
      errors.push('Au moins une réalisation doit être renseignée');
    }

    return errors;
  };

  const validateCurrentStep = () => {
    let errors: string[] = [];

    switch (currentStep) {
      case 1:
        errors = validateGeneralInformation(formData);
        break;
      case 2:
        errors = validatePersonnelInformation(formData);
        break;
      case 3:
        errors = validateInterventionZones(formData);
        break;
      case 4:
        errors = validateActivitySectors(formData);
        break;
      case 5:
        errors = validateInvestment(formData);
        break;
      case 6:
        errors = validateFinancialResources(formData);
        break;
      case 7:
        errors = validateBeneficiaries(formData);
        break;
      case 8:
        errors = validateRealizations(formData);
        break;
    }

    if (errors.length > 0) {
      setError(errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(step => step + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
      setError(null);
    }
  };

  const handleStepClick = (step: number) => {
    // Don't allow clicking on future steps
    if (step > currentStep) return;

    // For current step or next steps, validate
    if (step < currentStep) {
      // Validate all steps up to the current one before allowing to go back
      for (let i = step; i <= currentStep; i++) {
        const currentErrors = validateStep(i);
        if (currentErrors.length > 0) {
          setError(currentErrors.join('\n'));
          return;
        }
      }
      setCurrentStep(step);
      setError(null);
      return;
    }

    // For same step, just validate
    if (validateCurrentStep()) {
      setCurrentStep(step);
    }
  };

  // Helper function to validate a specific step
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return validateGeneralInformation(formData);
      case 2:
        return validatePersonnelInformation(formData);
      case 3:
        return validateInterventionZones(formData);
      case 4:
        return validateActivitySectors(formData);
      case 5:
        return validateInvestment(formData);
      case 6:
        return validateFinancialResources(formData);
      case 7:
        return validateBeneficiaries(formData);
      case 8:
        return validateRealizations(formData);
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            {error && (
              <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-lg border border-red-200">
                {error.split('\n').map((line, index) => (
                  <p key={index} className="text-sm">
                    • {line}
                  </p>
                ))}
              </div>
            )}
            <GeneralInformationStep
              data={formData}
              onChange={handleFormUpdate}
            />
          </>
        );
      case 2:
        return (
          <PersonnelInformationStep
            data={formData.personnel_data}
            onChange={(data) => handleFormUpdate({ personnel_data: data })}
          />
        );
      case 3:
        return (
          <InterventionZonesStep
            data={formData.intervention_zones}
            onChange={(data) => handleFormUpdate({ intervention_zones: data })}
          />
        );
      case 4:
        return (
          <ActivitySectorsStep
            data={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ activity_sectors: data })}
          />
        );
      case 5:
        return (
          <InvestmentStep
            data={formData.investment_data}
            activitySectorsData={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ investment_data: data })}
          />
        );
      case 6:
        return (
          <FinancialResourcesStep
            data={formData.financial_resources}
            onChange={(data) => handleFormUpdate({ financial_resources: data })}
          />
        );
      case 7:
        return (
          <BeneficiariesStep
            data={formData.beneficiaries_data}
            activitySectorsData={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ beneficiaries_data: data })}
          />
        );
      case 8:
        return (
          <RealizationStep
            data={formData.realizations}
            activitySectorsData={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ realizations: data })}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    // If not on the last step, just move to next step
    if (currentStep < steps.length) {
      handleNext();
      return;
    }
    
    // Only show confirmation dialog on final submit
    if (!window.confirm('Voulez-vous vraiment mettre à jour cette OSC ?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      await updateNGO(ngo.id, {
        name: formData.name,
        status: formData.status,
        other_status: formData.otherStatus,
        category: formData.category,
        scale: formData.scale,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        creation_year: formData.creationYear,
        approval_year: formData.approvalYear,
        is_active: true,
        ngo_metadata: {
          personnel_data: formData.personnel_data,
          intervention_zones: formData.intervention_zones,
          activity_sectors: formData.activity_sectors,
          investment_data: formData.investment_data,
          financial_resources: formData.financial_resources,
          beneficiaries_data: formData.beneficiaries_data,
          realizations: formData.realizations
        }
      });
      
      onCancel(); // Return to details view
    } catch (error) {
      console.error('Error updating OSC:', error);
      setError(error.message || 'Une erreur est survenue lors de la mise à jour de l\'OSC.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Modifier l'OSC</h1>
        <p className="mt-1 text-gray-500">Modifier les informations de l'organisation</p>
      </div>

      {/* Progress Steps */}
      <div className="w-full py-4">
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;
            
            return (
              <button
                key={index}
                onClick={() => handleStepClick(index + 1)}
                className={`flex flex-col items-center ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600 cursor-pointer'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
                disabled={index + 1 > currentStep}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isActive
                      ? 'bg-blue-100'
                      : isCompleted
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="p-6">
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {currentStep < steps.length ? (
                  <>
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  isLoading ? 'Mise à jour...' : 'Mettre à jour l\'OSC'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNGO;