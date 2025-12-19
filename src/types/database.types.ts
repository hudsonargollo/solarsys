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
      leads: {
        Row: {
          id: string
          created_at: string
          status: 'new' | 'qualified' | 'whatsapp_clicked' | 'contacted'
          name: string
          whatsapp: string
          email: string | null
          zip_code: string
          city: string
          state: string
          bill_value: number
          connection_type: 'mono' | 'bi' | 'tri'
          roof_type: 'clay' | 'metal' | 'fiber' | 'slab'
          system_size_kwp: number | null
          est_savings: number | null
          session_id: string
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          disqualification_reason: string | null
          warnings: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          status?: 'new' | 'qualified' | 'whatsapp_clicked' | 'contacted'
          name: string
          whatsapp: string
          email?: string | null
          zip_code: string
          city: string
          state: string
          bill_value: number
          connection_type: 'mono' | 'bi' | 'tri'
          roof_type: 'clay' | 'metal' | 'fiber' | 'slab'
          system_size_kwp?: number | null
          est_savings?: number | null
          session_id: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          disqualification_reason?: string | null
          warnings?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          status?: 'new' | 'qualified' | 'whatsapp_clicked' | 'contacted'
          name?: string
          whatsapp?: string
          email?: string | null
          zip_code?: string
          city?: string
          state?: string
          bill_value?: number
          connection_type?: 'mono' | 'bi' | 'tri'
          roof_type?: 'clay' | 'metal' | 'fiber' | 'slab'
          system_size_kwp?: number | null
          est_savings?: number | null
          session_id?: string
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          disqualification_reason?: string | null
          warnings?: string[] | null
        }
        Relationships: []
      }
      hsp_data: {
        Row: {
          state: string
          hsp_value: number
          region: string
        }
        Insert: {
          state: string
          hsp_value: number
          region: string
        }
        Update: {
          state?: string
          hsp_value?: number
          region?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}