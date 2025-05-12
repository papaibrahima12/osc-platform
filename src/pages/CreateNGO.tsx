import React, {useEffect, useRef, useState} from 'react';
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
import {useAuthStore} from "../store/auth.ts";

const steps = [
  { icon: Building2, label: 'Informations générales' },
  { icon: Users, label: 'Personnel' },
  { icon: MapPin, label: "Zones d'intervention" },
  { icon: Activity, label: "Projets" },
  { icon: Wallet, label: 'Investissement' },
  { icon: DollarSign, label: 'Source de financement' },
  { icon: Target, label: 'Bénéficiaires' },
  { icon: CheckSquare, label: 'Réalisations' }
];

const initialFormData = {
  name: '',
  status: undefined as 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'responsible_entity' | 'other' | undefined,
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
  manager_id: '',
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

const FORM_STORAGE_KEY = 'ngo_create_form_data';
const STEP_STORAGE_KEY = 'ngo_create_current_step';

export default function CreateNGO() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(() => {
        const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
        return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem(FORM_STORAGE_KEY);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
              const savedFileName = localStorage.getItem('agreement_document_name');
              if (savedFileName) {
                setSelectedFileName(savedFileName);
              }
                return { ...parsedData, agreementDocument: undefined };
            } catch (e) {
                console.error('Erreur lors de la récupération des données sauvegardées:', e);
                return initialFormData;
            }
        }
        return initialFormData;
    });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNGO, ngos } = useDemoStore();

  useEffect(() => {
        const dataToSave = { ...formData };
        delete dataToSave.agreementDocument;

        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
        localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    }, [formData, currentStep]);

  const handleFormUpdate = (updates: Partial<typeof initialFormData>) => {
    setFormData((prev: typeof initialFormData) => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleActivityYearChange = (year: string) => {
    if (formData.financial_resources.length > 0) {
      const updatedResources = formData.financial_resources.map((resource: NGOFinancialResource) => ({
        ...resource,
        funding_year: year
      }));
      handleFormUpdate({ financial_resources: updatedResources });
    }
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

    if (ngos.some(ngo => ngo.email === data.email)) {
      errors.push('Cette adresse email est déjà utilisée');
    }

    if (data.status=== 'ngo'){
      if(data.approvalYear < data.creationYear) errors.push("La date d'approbation ne doit pas etre superieure à la date de création")
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

    const hasDepartment = zones.some(zone => zone.zone_type === 'department');
    const hasMunicipality = zones.some(zone => zone.zone_type === 'municipality');

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
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (formContainerRef.current) {
              formContainerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
          }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (formContainerRef.current) {
            formContainerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Ou faire défiler vers le haut du conteneur du formulaire
        if (formContainerRef.current) {
            formContainerRef.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
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

  const validateFormBeforeSubmit = () => {
    const errors: string[] = [];

    if (!formData.name) errors.push('Le nom est requis');
    if (!formData.status) errors.push('Le statut est requis');
    if (formData.status === 'other' && !formData.otherStatus) errors.push('Précisez le statut');
    if (!formData.scale) errors.push("L'échelle est requise");
    if (!formData.address) errors.push("L'adresse est requise");
    if (!formData.email) errors.push("L'email est requis");
    if (!formData.phone) errors.push('Le téléphone est requis');

    if (!formData.creationYear) {
      errors.push('La date de création est requise');
    } else {
      const yearRegex = /^\d{4}$/;
      if (!yearRegex.test(formData.creationYear)) {
        errors.push("L'année de création doit être composée de 4 chiffres");
      } else if (parseInt(formData.creationYear, 10) > 2025) {
        errors.push("L'année de création ne peut pas dépasser 2025");
      }
    }

    if (formData.status === 'ngo') {
      if (!formData.approvalYear) {
        errors.push("L'année d'agrément est requise");
      } else {
        const yearRegex = /^\d{4}$/;
        if (!yearRegex.test(formData.approvalYear)) {
          errors.push("L'année d'agrément doit être composée de 4 chiffres");
        } else if (parseInt(formData.approvalYear, 10) > 2025) {
          errors.push("L'année d'agrément ne peut pas dépasser 2025");
        }
      }

      if (!formData.agreementDocument) {
        errors.push("Le document d'agrément est requis");
      }
    }

    if (ngos.some(n => n.email === formData.email)) {
      errors.push('Cette adresse email est déjà utilisée');
    }

    if (formData.activity_sectors.length > 0) {
      const activityYear = formData.activity_sectors[0].activity_year;
      const yearRegex = /^\d{4}$/;
      if (!yearRegex.test(activityYear)) {
        errors.push("L'année d'activité doit être composée de 4 chiffres");
      } else if (parseInt(activityYear, 10) > 2025) {
        errors.push("L'année d'activité ne peut pas dépasser 2025");
      }
    }

    if (formData.investments.length > 0) {
      const investmentYear = formData.investments[0].investment_year;
      const yearRegex = /^\d{4}$/;
      if (!yearRegex.test(investmentYear)) {
        errors.push("L'année d'investissement doit être composée de 4 chiffres");
      } else if (parseInt(investmentYear, 10) > 2025) {
        errors.push("L'année d'investissement ne peut pas dépasser 2025");
      }
    }

    if (formData.financial_resources.length > 0) {
      const fundingYear = formData.financial_resources[0].funding_year;
      const yearRegex = /^\d{4}$/;
      if (!yearRegex.test(fundingYear)) {
        errors.push("L'année de financement doit être composée de 4 chiffres");
      } else if (parseInt(fundingYear, 10) > 2025) {
        errors.push("L'année de financement ne peut pas dépasser 2025");
      }

      if (formData.activity_sectors.length > 0) {
        const activityYear = formData.activity_sectors[0].activity_year;
        if (fundingYear !== activityYear) {
          errors.push("L'année de financement doit être la même que l'année d'activité");
        }
      }
    }

    return errors;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length) {
      handleNext();
      return;
    }

    const errors = validateFormBeforeSubmit();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      setCurrentStep(1);
      return;
    }
    
    if (!window.confirm('Voulez-vous vraiment créer cette OSC ?')) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const activityYear = formData.activity_sectors[0]?.activity_year;
      const investmentYear = formData.activity_sectors[0]?.activity_year;
      if (activityYear !== investmentYear) {
        toast.error('"Les années d\'activité, d\'investissement doivent être identiques"');
        throw new Error("Les années d'activité, d'investissement doivent être identiques");
      }
      const ngoData = {
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
        manager_id: user?.id,
        contact_first_name: formData.contactFirstName,
        contact_last_name: formData.contactLastName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        is_active: true,
        agreementDocument: formData.agreementDocument,

        staff: formData.staff,

        activity_sectors: formData.activity_sectors.map((sector: NGOActivitySector) => ({
          activity_year: sector.activity_year,
          sector: sector.sector,
          subsector: sector.subsector,
          activity_count: sector.activity_count
        })),

        intervention_zones: formData.intervention_zones.map((zone: NGOInterventionZone) => ({
          zone_type: zone.zone_type,
          name: zone.name,
          parent_zone_id: zone.parent_zone_id
        })),

        investments: formData.investments.map((investment: NGOInvestment) => ({
          investment_year: investment.investment_year,
          sector: investment.sector,
          subsector: investment.subsector,
          amount: investment.amount
        })),

        financial_resources: formData.financial_resources.map((resource: NGOFinancialResource) => ({
          funding_year: resource.funding_year,
          funding_type: resource.funding_type,
          funding_source: resource.funding_source,
          amount: resource.amount,
          details: resource.details
        })),

        beneficiaries: formData.beneficiaries,

        realizations: formData.realizations
      };

      await addNGO(ngoData);
      toast.success('OSC créée avec succès');
      localStorage.removeItem(FORM_STORAGE_KEY);
      localStorage.removeItem(STEP_STORAGE_KEY);
      if (user?.role === 'ngo_manager') {
        navigate('/my-osc');
      } else {
        navigate('/ngos');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue lors de la création de l\'OSC.';
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
            onYearChange={handleActivityYearChange}
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
        { const activityYear = formData.activity_sectors.length > 0
            ? formData.activity_sectors[0].activity_year
            : undefined;

        return (
          <FinancialResourcesStep
            data={formData.financial_resources}
            onChange={(data) => handleFormUpdate({ financial_resources: data })}
            activityYear={activityYear}
          />
        ); }
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
    <div className="space-y-6 pt-4">
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
              onClick={() => {
                if (window.confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.')) {
                  localStorage.removeItem(FORM_STORAGE_KEY);
                  localStorage.removeItem(STEP_STORAGE_KEY);
                  navigate('/ngos');
                }
              }}
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