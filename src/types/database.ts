export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          role: 'admin' | 'ngo_manager'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          role?: 'admin' | 'ngo_manager'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          role?: 'admin' | 'ngo_manager'
          created_at?: string
          updated_at?: string
        }
      }
      ngos: {
        Row: {
          id: string
          name: string
          status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'other'
          other_status: string | null
          category: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other' | null
          other_category: string | null
          scale: 'local' | 'regional' | 'national' | 'international'
          address: string
          email: string
          phone: string
          website: string | null
          facebook: string | null
          linkedin: string | null
          twitter: string | null
          creation_year: string
          approval_year: string | null
          manager_id: string | null
          is_active: boolean
          contact_first_name: string | null
          contact_last_name: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'other'
          other_status?: string | null
          category?: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other' | null
          other_category?: string | null
          scale: 'local' | 'regional' | 'national' | 'international'
          address: string
          email: string
          phone: string
          website?: string | null
          facebook?: string | null
          linkedin?: string | null
          twitter?: string | null
          creation_year: string
          approval_year?: string | null
          manager_id?: string | null
          is_active?: boolean
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'other'
          other_status?: string | null
          category?: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other' | null
          other_category?: string | null
          scale?: 'local' | 'regional' | 'national' | 'international'
          address?: string
          email?: string
          phone?: string
          website?: string | null
          facebook?: string | null
          linkedin?: string | null
          twitter?: string | null
          creation_year?: string
          approval_year?: string | null
          manager_id?: string | null
          is_active?: boolean
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ngo_staff: {
        Row: {
          id: string
          ngo_id: string
          men_count: number
          women_count: number
          young_18_25_count: number
          young_26_35_count: number
          disabled_count: number
          expatriate_count: number
          national_count: number
          temporary_count: number
          permanent_count: number
          volunteer_count: number
          intern_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          men_count?: number
          women_count?: number
          young_18_25_count?: number
          young_26_35_count?: number
          disabled_count?: number
          expatriate_count?: number
          national_count?: number
          temporary_count?: number
          permanent_count?: number
          volunteer_count?: number
          intern_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          men_count?: number
          women_count?: number
          young_18_25_count?: number
          young_26_35_count?: number
          disabled_count?: number
          expatriate_count?: number
          national_count?: number
          temporary_count?: number
          permanent_count?: number
          volunteer_count?: number
          intern_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      ngo_activity_sectors: {
        Row: {
          id: string
          ngo_id: string
          activity_year: string
          sector: string
          subsector: string
          activity_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          activity_year: string
          sector: string
          subsector: string
          activity_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          activity_year?: string
          sector?: string
          subsector?: string
          activity_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      ngo_intervention_zones: {
        Row: {
          id: string
          ngo_id: string
          zone_type: 'country' | 'region' | 'department' | 'municipality'
          name: string
          parent_zone_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          zone_type: 'country' | 'region' | 'department' | 'municipality'
          name: string
          parent_zone_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          zone_type?: 'country' | 'region' | 'department' | 'municipality'
          name?: string
          parent_zone_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ngo_investments: {
        Row: {
          id: string
          ngo_id: string
          investment_year: string
          sector: string
          subsector: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          investment_year: string
          sector: string
          subsector: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          investment_year?: string
          sector?: string
          subsector?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      ngo_financial_resources: {
        Row: {
          id: string
          ngo_id: string
          funding_year: string
          funding_type: string
          funding_source: string
          amount: number
          details: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          funding_year: string
          funding_type: string
          funding_source: string
          amount: number
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          funding_year?: string
          funding_type?: string
          funding_source?: string
          amount?: number
          details?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      ngo_beneficiaries: {
        Row: {
          id: string
          ngo_id: string
          sector: string
          total: number
          men: number
          women: number
          young: number
          disabled: number
          other_vulnerable: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          sector: string
          total: number
          men: number
          women: number
          young: number
          disabled: number
          other_vulnerable: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          sector?: string
          total?: number
          men?: number
          women?: number
          young?: number
          disabled?: number
          other_vulnerable?: number
          created_at?: string
          updated_at?: string
        }
      }
      ngo_realizations: {
        Row: {
          id: string
          ngo_id: string
          sector: string
          indicator: string
          value: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          sector: string
          indicator: string
          value: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          sector?: string
          indicator?: string
          value?: number
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          ngo_id: string
          name: string
          sector_id: string | null
          description: string | null
          beneficiaries_count: number
          activity_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          name: string
          sector_id?: string | null
          description?: string | null
          beneficiaries_count?: number
          activity_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          name?: string
          sector_id?: string | null
          description?: string | null
          beneficiaries_count?: number
          activity_date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Storage: {
      Buckets: {
        agreements: {
          Row: {
            id: string
            name: string
            owner: string | null
            created_at: string | null
            updated_at: string | null
            bucket_id: string
            size: number
          }
        }
      }
    }
  }
}