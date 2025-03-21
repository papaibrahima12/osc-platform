import React, { useState } from 'react';
import type { NGO } from '../types/user';

interface FormData {
  name: string;
  status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'responsible_entity' | 'cooperative' | 'other';
  otherStatus?: string;
  category?: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other';
  otherCategory?: string;
  scale?: 'local' | 'regional' | 'national' | 'international';
  address: string;
  latitude?: number;
  longitude?: number;
  email: string;
  phone: string;
  website?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  creationYear: string;
  approvalYear?: string;
  agreementDocument?: File;
  // Contact person information
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
}

interface GeneralInformationStepProps {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&countrycodes=sn`
    );
    const data = await response.json();

    if (data && data[0]) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

export default function GeneralInformationStep({ data, onChange }: GeneralInformationStepProps) {
  const [geocoding, setGeocoding] = useState(false);
  const [yearErrors, setYearErrors] = useState<{
    creationYear?: string;
    approvalYear?: string;
  }>({});

  const validateYear = (year: string, field: 'creationYear' | 'approvalYear'): boolean => {
    const yearRegex = /^\d{4}$/;
    if (!yearRegex.test(year)) {
      setYearErrors(prev => ({ ...prev, [field]: "L'année doit être composée de 4 chiffres" }));
      return false;
    }

    const yearNum = parseInt(year, 10);
    if (yearNum > 2025) {
      setYearErrors(prev => ({ ...prev, [field]: "L'année ne peut pas dépasser 2025" }));
      return false;
    }

    if (field === 'approvalYear' && data.creationYear) {
      const creationYearNum = parseInt(data.creationYear, 10);
      if (yearRegex.test(data.creationYear) && yearNum <= creationYearNum) {
        setYearErrors(prev => ({
          ...prev,
          [field]: "L'année d'agrément doit être supérieure à l'année de création"
        }));
        return false;
      }
    }

    setYearErrors(prev => ({ ...prev, [field]: undefined }));
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('application/pdf')) {
        alert('Veuillez sélectionner un fichier PDF');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Le fichier ne doit pas dépasser 5MB');
        return;
      }
      onChange({ agreementDocument: file });
    }
  };

  const needsInternationalScale = (status: string) => {
    return ['ngo', 'foundation', 'public_utility'].includes(status);
  };

  const handleAddressChange = async (address: string) => {
    onChange({ address });

    if (address.length < 5) return;

    setGeocoding(true);
    try {
      const coordinates = await geocodeAddress(address);
      if (coordinates) {
        onChange({
          latitude: coordinates.lat,
          longitude: coordinates.lng
        });
      } else {
        onChange({
          latitude: undefined,
          longitude: undefined
        });
      }
    } finally {
      setGeocoding(false);
    }
  };

  const handleYearChange = (year: string, field: 'creationYear' | 'approvalYear') => {
    onChange({ [field]: year });

    validateYear(year, field);
  };

  return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de l'organisation</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom de l'organisation <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Entrez le nom de l'organisation"
                  required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Statut <span className="text-red-500">*</span>
              </label>
              <select
                  id="status"
                  value={data.status}
                  onChange={(e) => onChange({
                    status: e.target.value as NGO['status'],
                    category: undefined,
                    scale: undefined
                  })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  required
              >
                <option value="">Sélectionner un statut</option>
                <option value="association">Association</option>
                <option value="ngo">ONG</option>
                <option value="foundation">Fondation</option>
                <option value="public_utility">Organisation d'utilité publique</option>
                <option value="gie">GIE</option>
                <option value="cooperative">Coopérative</option>
                <option value="responsible_entity">Association Entreprenante Responsable</option>
                <option value="other">Autres</option>
              </select>
            </div>

            {/* Other Status */}
            {data.status === 'other' && (
                <div>
                  <label htmlFor="otherStatus" className="block text-sm font-medium text-gray-700">
                    Autre statut <span className="text-red-500">*</span>
                  </label>
                  <input
                      type="text"
                      id="otherStatus"
                      value={data.otherStatus || ''}
                      onChange={(e) => onChange({ otherStatus: e.target.value })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Précisez le statut"
                      required
                  />
                </div>
            )}

            {/* Category - For Associations */}
            {data.status === 'association' && (
                <>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Catégorie <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={data.category || ''}
                        onChange={(e) => onChange({ category: e.target.value as NGO['category'] })}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                        required
                    >
                      <option value="">Sélectionner une catégorie</option>
                      <option value="think_tank">Think Tank</option>
                      <option value="citizen_movement">Mouvement citoyen</option>
                      <option value="religious">Association religieuse</option>
                      <option value="responsible_business">Association entreprenante responsable</option>
                      <option value="nonprofit">Etablissement à but non lucratif</option>
                      <option value="sports_cultural">Association sportive et culturelle (ASC)</option>
                      <option value="community_org">Organisme communautaire de base (OCB)</option>
                      <option value="foreign_assoc">Association étrangère</option>
                      <option value="social_enterprise">Entreprise sociale</option>
                      <option value="other">Autres</option>
                    </select>
                  </div>

                  {data.category === 'other' && (
                      <div>
                        <label htmlFor="otherCategory" className="block text-sm font-medium text-gray-700">
                          Autre catégorie <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="otherCategory"
                            value={data.otherCategory || ''}
                            onChange={(e) => onChange({ otherCategory: e.target.value })}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Précisez la catégorie"
                            required
                        />
                      </div>
                  )}
                </>
            )}

            {/* Scale - Different options based on status */}
            {data.status && (
                <div>
                  <label htmlFor="scale" className="block text-sm font-medium text-gray-700">
                    Échelle <span className="text-red-500">*</span>
                  </label>
                  <select
                      id="scale"
                      value={data.scale || ''}
                      onChange={(e) => onChange({ scale: e.target.value as NGO['scale'] })}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      required
                  >
                    <option value="">Sélectionner une échelle</option>
                    {needsInternationalScale(data.status) ? (
                        <>
                          <option value="national">Nationale</option>
                          <option value="international">Internationale</option>
                        </>
                    ) : (
                        <>
                          <option value="local">Locale</option>
                          <option value="regional">Régionale</option>
                          <option value="national">Nationale</option>
                        </>
                    )}
                  </select>
                </div>
            )}

            {/* Address */}
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Adresse <span className="text-red-500">*</span>
              </label>
              <div className="relative">
              <textarea
                  id="address"
                  value={data.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Adresse complète"
                  required
              />
                {geocoding && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                )}
              </div>
              {data.latitude && data.longitude && (
                  <div className="mt-1 text-sm text-green-600">
                    Coordonnées trouvées: {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                  </div>
              )}
            </div>

            {/* Organization Contact Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => onChange({ email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="contact@organisation.org"
                  required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                  type="tel"
                  id="phone"
                  value={data.phone}
                  onChange={(e) => onChange({ phone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+221 XX XXX XX XX"
                  required
              />
            </div>

            {/* Social Media */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Site Web
              </label>
              <input
                  type="url"
                  id="website"
                  value={data.website || ''}
                  onChange={(e) => onChange({ website: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://www.example.org"
              />
            </div>

            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                Facebook
              </label>
              <input
                  type="url"
                  id="facebook"
                  value={data.facebook || ''}
                  onChange={(e) => onChange({ facebook: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://facebook.com/organisation"
              />
            </div>

            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                  type="url"
                  id="linkedin"
                  value={data.linkedin || ''}
                  onChange={(e) => onChange({ linkedin: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/organisation"
              />
            </div>

            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                X (ex-Twitter)
              </label>
              <input
                  type="url"
                  id="twitter"
                  value={data.twitter || ''}
                  onChange={(e) => onChange({ twitter: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="https://x.com/organisation"
              />
            </div>

            {/* Dates */}
            <div>
              <label htmlFor="creationYear" className="block text-sm font-medium text-gray-700">
                Année de création <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  id="creationYear"
                  value={data.creationYear}
                  onChange={(e) => handleYearChange(e.target.value, 'creationYear')}
                  className={`mt-1 block w-full rounded-lg border ${yearErrors.creationYear ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
                  placeholder="AAAA"
                  maxLength={4}
                  required
              />
              {yearErrors.creationYear && (
                  <p className="mt-1 text-sm text-red-600">{yearErrors.creationYear}</p>
              )}
            </div>

            {/* Approval Year and Document - For NGOs */}
            {data.status === 'ngo' && (
                <>
                  <div>
                    <label htmlFor="approvalYear" className="block text-sm font-medium text-gray-700">
                      Année d'agrément <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="approvalYear"
                        value={data.approvalYear || ''}
                        onChange={(e) => handleYearChange(e.target.value, 'approvalYear')}
                        className={`mt-1 block w-full rounded-lg border ${yearErrors.approvalYear ? 'border-red-300' : 'border-gray-300'} px-3 py-2 focus:border-blue-500 focus:ring-blue-500`}
                        placeholder="AAAA"
                        maxLength={4}
                        required
                    />
                    {yearErrors.approvalYear && (
                        <p className="mt-1 text-sm text-red-600">{yearErrors.approvalYear}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="agreementDocument" className="block text-sm font-medium text-gray-700">
                      Document d'agrément <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex items-center">
                      <label className="block w-full">
                        <span className="sr-only">Choisir un fichier</span>
                        <input
                            type="file"
                            id="agreementDocument"
                            onChange={handleFileChange}
                            accept=".pdf"
                            className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        file:cursor-pointer cursor-pointer"
                            required
                        />
                      </label>
                    </div>
                    {data.agreementDocument && (
                        <p className="mt-2 text-sm text-green-600">
                          Fichier sélectionné: {data.agreementDocument.name}
                        </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Format accepté: PDF. Taille maximale: 5MB
                    </p>
                  </div>
                </>
            )}
          </div>
        </div>

        {/* Contact Person Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Personne à contacter</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactFirstName" className="block text-sm font-medium text-gray-700">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  id="contactFirstName"
                  value={data.contactFirstName}
                  onChange={(e) => onChange({ contactFirstName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Prénom de la personne à contacter"
                  required
              />
            </div>

            <div>
              <label htmlFor="contactLastName" className="block text-sm font-medium text-gray-700">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                  type="text"
                  id="contactLastName"
                  value={data.contactLastName}
                  onChange={(e) => onChange({ contactLastName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nom de la personne à contacter"
                  required
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                  type="email"
                  id="contactEmail"
                  value={data.contactEmail}
                  onChange={(e) => onChange({ contactEmail: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="email@example.com"
                  required
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                  type="tel"
                  id="contactPhone"
                  value={data.contactPhone}
                  onChange={(e) => onChange({ contactPhone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="+221 XX XXX XX XX"
                  required
              />
            </div>
          </div>
        </div>
      </div>
  );
}