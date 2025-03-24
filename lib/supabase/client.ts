import { createClient } from '@supabase/supabase-js';

// Create a Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'
);

export type Database = {
  public: {
    Tables: {
      availability: {
        Row: {
          id: string
          therapist_id: string
          start_time: string
          end_time: string
          recurrence: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          therapist_id: string
          start_time: string
          end_time: string
          recurrence?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          therapist_id?: string
          start_time?: string
          end_time?: string
          recurrence?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      time_off: {
        Row: {
          id: string
          therapist_id: string
          start_time: string
          end_time: string
          reason: string | null
          recurrence: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          therapist_id: string
          start_time: string
          end_time: string
          reason?: string | null
          recurrence?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          therapist_id?: string
          start_time?: string
          end_time?: string
          reason?: string | null
          recurrence?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          therapist_id: string
          client_id: string | null
          start_time: string
          end_time: string
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          therapist_id: string
          client_id?: string | null
          start_time: string
          end_time: string
          status: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          therapist_id?: string
          client_id?: string | null
          start_time?: string
          end_time?: string
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'] 