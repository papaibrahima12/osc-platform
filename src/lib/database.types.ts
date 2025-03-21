export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'responsible_entity' | 'other'
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'responsible_entity' | 'other'
          other_status?: string | null
          category?: 'think_tank' | 'citizen_movement' | 'religious' | 'responsible_business' | 'nonprofit' | 'sports_cultural' | 'community_org' | 'foreign_assoc' | 'social_enterprise' | 'other' | null
          other_category?: string | null
          scale?: 'local' | 'regional' | 'national' | 'international'
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: 'association' | 'ngo' | 'foundation' | 'public_utility' | 'gie' | 'cooperative' | 'responsible_entity' | 'other'
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
          created_at?: string
          updated_at?: string
        }
      }
      ngo_metadata: {
        Row: {
          id: string
          ngo_id: string
          personnel_data: Json | null
          intervention_zones: Json | null
          activity_sectors: Json | null
          investment_data: Json | null
          financial_resources: Json | null
          realizations: Json | null
          beneficiaries_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ngo_id: string
          personnel_data?: Json | null
          intervention_zones?: Json | null
          activity_sectors?: Json | null
          investment_data?: Json | null
          financial_resources?: Json | null
          realizations?: Json | null
          beneficiaries_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ngo_id?: string
          personnel_data?: Json | null
          intervention_zones?: Json | null
          activity_sectors?: Json | null
          investment_data?: Json | null
          financial_resources?: Json | null
          realizations?: Json | null
          beneficiaries_data?: Json | null
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