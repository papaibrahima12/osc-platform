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
import toast from 'react-hot-toast';
import GeneralInformationStep from '../components/GeneralInformationStep';
import PersonnelInformationStep from '../components/PersonnelInformationStep';
import InterventionZonesStep from '../components/InterventionZonesStep';
import ActivitySectorsStep from '../components/ActivitySectorsStep';
import InvestmentStep from '../components/InvestmentStep';
import FinancialResourcesStep from '../components/FinancialResourcesStep';
import BeneficiariesStep from '../components/BeneficiariesStep';
import RealizationStep from '../components/RealizationStep';
import { useDemoStore } from '../store/demo';
import {
  NGOActivitySector,
  NGOBeneficiary,
  NGOFinancialResource,
  NGOInterventionZone,
  NGOInvestment, NGORealization
} from "../types/user.ts";

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

const initialFormData = {
  // General Information
  name: '',
  status: undefined as 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'other' | undefined,
  otherStatus: '',
  category: undefined as 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other' | undefined,
  otherCategory: '',
  scale: undefined as 'local' | 'regional' | 'national' | 'international' | undefined,
  address: '',
  latitude : 0,
  longitude : 0,
  email: '',
  phone: '',
  website: '',
  facebook: '',
  linkedin: '',
  twitter: '',
  creationYear: '',
  approvalYear: '',
  agreementDocument: undefined as File | undefined,
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',

  staff: {
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

  intervention_zones: [] as NGOInterventionZone[],

  activity_sectors:[] as NGOActivitySector[],

  investments: [] as NGOInvestment[],

  financial_resources: [] as NGOFinancialResource[],

  beneficiaries: [] as NGOBeneficiary[],

  realizations: [] as NGORealization[]
};

export default function CreateNGO() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNGO, ngos } = useDemoStore();

  const handleFormUpdate = (updates: Partial<typeof initialFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  const validateGeneralInformation = (data: typeof initialFormData) => {
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
    if (data.status === 'ngo' && !data.agreementDocument) errors.push("Le document d'agrément est requis");
    if (!data.contactFirstName) errors.push('Le prénom du contact est requis');
    if (!data.contactLastName) errors.push('Le nom du contact est requis');
    if (!data.contactEmail) errors.push("L'email du contact est requis");
    if (!data.contactPhone) errors.push('Le téléphone du contact est requis');

    // Check if email already exists
    if (ngos.some(ngo => ngo.email === data.email)) {
      errors.push('Cette adresse email est déjà utilisée');
    }

    return errors;
  };

  const validatePersonnelInformation = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const staff = data.staff;

    if (!staff.men_count && !staff.women_count) {
      errors.push('Au moins un homme ou une femme doit être renseigné');
    }

    const total = (staff.men_count || 0) + (staff.women_count || 0);
    if (total === 0) {
      errors.push('Le nombre total de personnel doit être supérieur à 0');
    }


    return errors;
  };

  const validateInterventionZones = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const zones = data.intervention_zones;

    if (!zones.length) {
      errors.push("Au moins une zone d'intervention doit être sélectionnée");
    }

    // Vérifier la cohérence des zones
    const hasDepartment = zones.some(zone => zone.zone_type === 'department');
    const hasMunicipality = zones.some(zone => zone.zone_type === 'municipality');

    // Si on a un département, on doit avoir sa région parente
    if (hasDepartment) {
      const departments = zones.filter(zone => zone.zone_type === 'department');
      for (const dept of departments) {
        const hasParentRegion = zones.some(
            zone => zone.zone_type === 'region' && zone.name === dept.parent_zone_id
        );
        if (!hasParentRegion) {
          errors.push(`La région parente du département ${dept.name} doit être sélectionnée`);
        }
      }
    }

    // Si on a une municipalité, on doit avoir son département parent
    if (hasMunicipality) {
      const municipalities = zones.filter(zone => zone.zone_type === 'municipality');
      for (const mun of municipalities) {
        const hasParentDepartment = zones.some(
            zone => zone.zone_type === 'department' && zone.name === mun.parent_zone_id
        );
        if (!hasParentDepartment) {
          errors.push(`Le département parent de la municipalité ${mun.name} doit être sélectionné`);
        }
      }
    }

    // Vérifier que si on a des zones au Sénégal, le pays est sélectionné
    const hasSenegalZones = zones.some(zone =>
        zone.zone_type === 'region' ||
        zone.zone_type === 'department' ||
        zone.zone_type === 'municipality'
    );

    if (hasSenegalZones && !zones.some(zone =>
        zone.zone_type === 'country' &&
        zone.name === 'Sénégal'
    )) {
      errors.push("Le Sénégal doit être sélectionné pour ajouter ses subdivisions");
    }

    return errors;
  };

  const validateActivitySectors = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const sectors = data.activity_sectors;

    if (!sectors.length) {
      errors.push("Au moins une activité doit être renseignée");
    }

    return errors;
  };

  const validateInvestment = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const investments = data.investments;

    if (!investments.length) {
      errors.push("Au moins un investissement doit être renseigné");
    }

    return errors;
  };

  const validateFinancialResources = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const resources = data.financial_resources;

    if (!resources.length) {
      errors.push("Au moins une source de financement doit être renseignée");
    }

    return errors;
  };

  const validateBeneficiaries = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const beneficiaries = data.beneficiaries;

    if (!beneficiaries.length) {
      errors.push("Au moins un bénéficiaire doit être renseigné");
    }

    return errors;
  };

  const validateRealizations = (data: typeof initialFormData) => {
    const errors: string[] = [];
    const realizations = data.realizations;

    if (!realizations.length) {
      errors.push("Au moins une réalisation doit être renseignée");
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
      errors.forEach(error => toast.error(error));
      return false;
    }
    toast.success('Étape validée avec succès');

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
          currentErrors.forEach(error => toast.error(error));
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    if (!window.confirm('Voulez-vous vraiment créer cette OSC ?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const activityYear = formData.activity_sectors[0]?.activity_year;
      const investmentYear = formData.activity_sectors[0]?.activity_year;
      console.log('activityYear',  activityYear)
      console.log('investmentYear',  investmentYear)
      if (activityYear !== investmentYear) {
        toast.error('"Les années d\'activité, d\'investissement doivent être identiques"');
        throw new Error("Les années d'activité, d'investissement doivent être identiques");
      }
      // Prepare data for submission
      const ngoData = {
        // General Information
        name: formData.name,
        status: formData.status,
        other_status: formData.otherStatus,
        category: formData.category,
        scale: formData.scale,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        creation_year: formData.creationYear,
        approval_year: formData.approvalYear,
        contact_first_name: formData.contactFirstName,
        contact_last_name: formData.contactLastName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        is_active: true,
        agreementDocument: formData.agreementDocument,

        // Staff Information
        staff: formData.staff,

        // Activity Sectors
        activity_sectors: formData.activity_sectors.map(sector => ({
          activity_year: sector.activity_year,
          sector: sector.sector,
          subsector: sector.subsector,
          activity_count: sector.activity_count
        })),
        // Intervention Zones
        intervention_zones: formData.intervention_zones.map(zone => ({
          zone_type: zone.zone_type,
          name: zone.name,
          parent_zone_id: zone.parent_zone_id
        })),

        // Investments
        investments: formData.investments.map(investment => ({
          investment_year: investment.investment_year,
          sector: investment.sector,
          subsector: investment.subsector,
          amount: investment.amount
        })),

        // Financial Resources
        financial_resources: formData.financial_resources.map(resource => ({
          funding_year: resource.funding_year,
          funding_type: resource.funding_type,
          funding_source: resource.funding_source,
          amount: resource.amount,
          details: resource.details
        })),

        // Beneficiaries
        beneficiaries: formData.beneficiaries,

        // Realizations
        realizations: formData.realizations
      };

      // Create NGO with all related data
      await addNGO(ngoData);
      toast.success('OSC créée avec succès');
      navigate('/ngos');
    } catch (error) {
      const errorMessage = error.message || 'Une erreur est survenue lors de la création de l\'OSC.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
            data={formData.staff}
            onChange={(data) => handleFormUpdate({ staff: data })}
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
            data={formData.investments}
            activitySectors={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ investments: data })}
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
            data={formData.beneficiaries}
            activitySectors={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ beneficiaries: data })}
          />
        );
      case 8:
        return (
          <RealizationStep
            data={formData.realizations}
            activitySectors={formData.activity_sectors}
            onChange={(data) => handleFormUpdate({ realizations: data })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle OSC</h1>
        <p className="mt-1 text-gray-500">Créer une nouvelle organisation</p>
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
                onClick={() => setCurrentStep(index + 1)}
                className={`flex flex-col items-center ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600 cursor-pointer'
                    : 'text-gray-400'
                }`}
                // disabled={index + 1 > currentStep}
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
              onClick={() => navigate('/ngos')}
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
                  isLoading ? 'Création...' : 'Créer l\'OSC'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}