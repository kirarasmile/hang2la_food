// src/types/database.ts
// Supabase 数据库类型定义

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          nickname: string | null
          avatar_url: string | null
          is_admin: boolean
          invited_by: string | null
          invite_code_used: string | null
          created_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          invited_by?: string | null
          invite_code_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          invited_by?: string | null
          invite_code_used?: string | null
          created_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          tier: 'hang' | 'top' | 'elite' | 'npc' | 'la'
          category: string
          price_per_person: number
          address: string
          city: string
          district: string | null
          latitude: number | null
          longitude: number | null
          recommendation: string | null
          image_url: string | null
          created_by: string
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
        Insert: {
          id?: string
          name: string
          tier: 'hang' | 'top' | 'elite' | 'npc' | 'la'
          category: string
          price_per_person: number
          address: string
          city: string
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          recommendation?: string | null
          image_url?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
        Update: {
          id?: string
          name?: string
          tier?: 'hang' | 'top' | 'elite' | 'npc' | 'la'
          category?: string
          price_per_person?: number
          address?: string
          city?: string
          district?: string | null
          latitude?: number | null
          longitude?: number | null
          recommendation?: string | null
          image_url?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
      }
      invite_codes: {
        Row: {
          id: string
          code: string
          created_by: string | null
          max_uses: number
          current_uses: number
          used_by: string | null
          used_at: string | null
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          created_by?: string | null
          max_uses?: number
          current_uses?: number
          used_by?: string | null
          used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          created_by?: string | null
          max_uses?: number
          current_uses?: number
          used_by?: string | null
          used_at?: string | null
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      restaurant_votes: {
        Row: {
          id: string
          restaurant_id: string
          user_id: string | null
          vote_type: number
          fingerprint: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          user_id?: string | null
          vote_type: number
          fingerprint?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          user_id?: string | null
          vote_type?: number
          fingerprint?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
