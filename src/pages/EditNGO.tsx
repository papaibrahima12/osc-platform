import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
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
import toast from "react-hot-toast";
import {NGO} from "../types/user.ts";
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

interface EditNGOProps {
  ngo: NGO;
  onCancel: () => void;
}

const getFormStorageKey = (ngoId: string) => `ngo_edit_form_data_${ngoId}`;
const getStepStorageKey = (ngoId: string) => `ngo_edit_current_step_${ngoId}`;


function EditNGO({ ngo, onCancel }: EditNGOProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(getStepStorageKey(ngo.id));
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  const { updateNGO } = useDemoStore();
  const [formData, setFormData] = useState(() =>{
    const initialFormData = {
      name: ngo.name,
      status: ngo.status,
      otherStatus: ngo.other_status || '',
      category: ngo.category,
      otherCategory: ngo.other_category || '',
      scale: ngo.scale,
      address: ngo.address,
      latitude: ngo.latitude,
      longitude: ngo.longitude,
      email: ngo.email,
      phone: ngo.phone,
      website: ngo.website || '',
      facebook: ngo.facebook || '',
      linkedin: ngo.linkedin || '',
      twitter: ngo.twitter || '',
      creationYear: ngo.creation_year,
      approvalYear: ngo.approval_year || '',
      agreementDocument: undefined as File | undefined,
      contactFirstName: ngo.contact_first_name || '',
      contactLastName: ngo.contact_last_name || '',
      contactEmail: ngo.contact_email || '',
      contactPhone: ngo.contact_phone || '',
      staff: ngo.staff ,
      intervention_zones: ngo.intervention_zones || [],
      activity_sectors: ngo.activity_sectors || [],
      investments: ngo.investments || [],
      financial_resources: ngo.financial_resources || [],
      beneficiaries: ngo.beneficiaries || [],
      realizations: ngo.realizations || []
    }
    const savedData = localStorage.getItem(getFormStorageKey(ngo.id));
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
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

  useEffect(() => {
    const dataToSave = { ...formData };
    delete dataToSave.agreementDocument;

    localStorage.setItem(getFormStorageKey(ngo.id), JSON.stringify(dataToSave));
    localStorage.setItem(getStepStorageKey(ngo.id), currentStep.toString());
  }, [formData, currentStep, ngo.id]);

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
    if (data.status === 'ngo' && !data.agreementDocument) errors.push("Le document d'agrément est requis");
    if (!data.contactFirstName) errors.push('Le prénom du contact est requis');
    if (!data.contactLastName) errors.push('Le nom du contact est requis');
    if (!data.contactEmail) errors.push("L'email du contact est requis");
    if (!data.contactPhone) errors.push('Le téléphone du contact est requis');

    return errors;
  };

  const validatePersonnelInformation = (data: typeof formData) => {
    const errors: string[] = [];
    const staff = data.staff;

    if (!staff?.men_count && !staff?.women_count) {
      errors.push('Au moins un homme ou une femme doit être renseigné');
    }

    const total = (staff?.men_count || 0) + (staff?.women_count || 0);
    if (total === 0) {
      errors.push('Le nombre total de personnel doit être supérieur à 0');
    }


    return errors;
  };

  const validateActivitySectors = (data: typeof formData) => {
    const errors: string[] = [];
    const sectors = data.activity_sectors;

    if (!sectors?.length) {
      errors.push("Au moins une activité doit être renseignée");
    }

    return errors;
  };

  const validateInvestment = (data: typeof formData) => {
    const errors: string[] = [];
    const investments = data.investments;

    if (!investments?.length) {
      errors.push("Au moins un investissement doit être renseigné");
    }

    return errors;
  };

  const validateFinancialResources = (data: typeof formData) => {
    const errors: string[] = [];
    const resources = data.financial_resources;

    if (!resources?.length) {
      errors.push("Au moins une source de financement doit être renseignée");
    }

    return errors;
  };

  const validateBeneficiaries = (data: typeof formData) => {
    const errors: string[] = [];
    const beneficiaries = data.beneficiaries;

    if (!beneficiaries?.length) {
      errors.push("Au moins un bénéficiaire doit être renseigné");
    }

    return errors;
  };

  const validateRealizations = (data: typeof formData) => {
    const errors: string[] = [];
    const realizations = data.realizations;

    if (!realizations?.length) {
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
          formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (formContainerRef.current) {
        formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // const handleStepClick = (step: number) => {
  //   // Don't allow clicking on future steps
  //   if (step > currentStep) return;
  //
  //   // For current step or next steps, validate
  //   if (step < currentStep) {
  //     // Validate all steps up to the current one before allowing to go back
  //     for (let i = step; i <= currentStep; i++) {
  //       const currentErrors = validateStep(i);
  //       if (currentErrors.length > 0) {
  //         setError(currentErrors.join('\n'));
  //         return;
  //       }
  //     }
  //     setCurrentStep(step);
  //     setError(null);
  //     return;
  //   }
  //
  //   // For same step, just validate
  //   if (validateCurrentStep()) {
  //     setCurrentStep(step);
  //   }
  // };

  // Helper function to validate a specific step
  // const validateStep = (step: number) => {
  //   switch (step) {
  //     case 1:
  //       return validateGeneralInformation(formData);
  //     case 2:
  //       return validatePersonnelInformation(formData);
  //     case 3:
  //       return validateInterventionZones(formData);
  //     case 4:
  //       return validateActivitySectors(formData);
  //     case 5:
  //       return validateInvestment(formData);
  //     case 6:
  //       return validateFinancialResources(formData);
  //     case 7:
  //       return validateBeneficiaries(formData);
  //     case 8:
  //       return validateRealizations(formData);
  //     default:
  //       return [];
  //   }
  // };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length) {
      handleNext();
      return;
    }

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
        contact_first_name: formData.contactFirstName,
        contact_last_name: formData.contactLastName,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        is_active: true,
        agreementDocument: formData.agreementDocument,
        staff: formData?.staff,
        activity_sectors: formData?.activity_sectors,
        intervention_zones: formData?.intervention_zones,
        investments: formData?.investments,
        financial_resources: formData?.financial_resources,
        beneficiaries: formData?.beneficiaries,
        realizations: formData?.realizations
      });

      toast.success('OSC modifiée avec succès');
      localStorage.removeItem(getFormStorageKey(ngo.id));
      localStorage.removeItem(getStepStorageKey(ngo.id));
      if (user?.role === 'admin'){
        navigate(`/ngos/${ngo.id}`);
      }else {
        navigate(`/my-osc/${ngo.id}`);
        window.location.reload();
      }

      onCancel();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ' here Une erreur est survenue lors de la mise à jour de l\'OSC.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
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
                onClick={() => setCurrentStep(index + 1)}
                className={`flex flex-col items-center ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600 cursor-pointer'
                          : 'text-gray-400'
                }`}
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