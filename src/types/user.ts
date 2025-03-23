
export type UserRole = 'super_admin' | 'admin' | 'ngo_manager';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface NGO {
  id: string;
  name: string;
  status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'responsible_entity' | 'other';
  other_status?: string;
  category?: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other';
  other_category?: string;
  scale: 'local' | 'regional' | 'national' | 'international';
  address: string;
  latitude?: number;
  longitude?: number;
  email: string;
  phone: string;
  website?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  creation_year: string;
  approval_year?: string;
  manager_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  agreementDocument?: File;
  agreementUrl?: string;
  staff?: NGOStaff;
  activity_sectors?: NGOActivitySector[];
  intervention_zones?: NGOInterventionZone[];
  investments?: NGOInvestment[];
  financial_resources?: NGOFinancialResource[];
  beneficiaries?: NGOBeneficiary[];
  realizations?: NGORealization[];
}

export interface NGOStaff {
  id?: string;
  ngo_id?: string;
  men_count: number;
  women_count: number;
  young_18_25_count: number;
  young_26_35_count: number;
  disabled_count: number;
  expatriate_count: number;
  national_count: number;
  temporary_count: number;
  permanent_count: number;
  volunteer_count: number;
  intern_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface NGOActivitySector {
  id?: string;
  ngo_id?: string;
  activity_year: string;
  sector: string;
  subsector: string;
  activity_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface NGOInterventionZone {
  id?: string;
  ngo_id?: string;
  zone_type: 'country' | 'region' | 'department' | 'municipality';
  name: string;
  parent_zone_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NGOInvestment {
  id?: string;
  ngo_id?: string;
  investment_year: string;
  sector: string;
  subsector: string;
  amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface NGOFinancialResource {
  id?: string;
  ngo_id?: string;
  funding_year: string;
  funding_type: string;
  funding_source: string;
  amount: number;
  details?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface NGOBeneficiary {
  id?: string;
  ngo_id?: string;
  sector: string;
  total: number;
  men: number;
  women: number;
  young: number;
  pregnant_women: number;
  lactating_women: number;
  teachers: number;
  students: number;
  legal_entities: number;
  preschool_age_child: number;
  school_age_child: number;
  child_before_preschool_age: number;
  disabled: number;
  other_vulnerable: number;
  created_at?: string;
  updated_at?: string;
}

export interface NGORealization {
  id?: string;
  ngo_id?: string;
  sector: string;
  indicator: string;
  value: number;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: string;
  ngo_id: string;
  name: string;
  sector_id?: string;
  description?: string;
  beneficiaries_count: number;
  activity_date: string;
  created_at: string;
  updated_at: string;
}