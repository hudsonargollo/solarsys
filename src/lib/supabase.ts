import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database.types'
import { supabaseConfig } from './config'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseConfig.url !== 'https://placeholder.supabase.co' && 
  supabaseConfig.anonKey !== 'placeholder-key' &&
  supabaseConfig.url.includes('supabase.co')

export const supabase = isSupabaseConfigured 
  ? createClient<Database>(
      supabaseConfig.url, 
      supabaseConfig.anonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-application-name': 'solarsys',
          },
        },
      }
    )
  : null // Return null if not configured

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => supabase !== null

// Database types
export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']
export type HSPData = Database['public']['Tables']['hsp_data']['Row']

// Database schema creation SQL (for reference)
export const DATABASE_SCHEMA = `
-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'whatsapp_clicked', 'contacted')),
  name text NOT NULL,
  whatsapp text NOT NULL,
  email text,
  zip_code text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  bill_value numeric NOT NULL,
  connection_type text NOT NULL CHECK (connection_type IN ('mono', 'bi', 'tri')),
  roof_type text NOT NULL CHECK (roof_type IN ('clay', 'metal', 'fiber', 'slab')),
  system_size_kwp numeric,
  est_savings numeric,
  session_id uuid NOT NULL,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  disqualification_reason text,
  warnings text[]
);

-- Create HSP reference data table
CREATE TABLE IF NOT EXISTS public.hsp_data (
  state text PRIMARY KEY,
  hsp_value numeric NOT NULL,
  region text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE hsp_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads table
-- Allow anonymous users to insert leads
CREATE POLICY "Allow public insert" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow users to read only their own session data
CREATE POLICY "Allow session-based read" ON leads
  FOR SELECT TO anon
  USING (session_id::text = current_setting('request.headers', true)::json->>'x-session-id');

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow admin read all" ON leads
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update lead status
CREATE POLICY "Allow admin update" ON leads
  FOR UPDATE TO authenticated
  USING (true);

-- RLS Policies for hsp_data table
-- Allow everyone to read HSP data (it's reference data)
CREATE POLICY "Allow public read hsp" ON hsp_data
  FOR SELECT TO anon, authenticated
  USING (true);

-- Insert HSP data for Brazilian states
INSERT INTO public.hsp_data (state, hsp_value, region) VALUES
  ('AC', 4.5, 'Norte'),
  ('AL', 5.2, 'Nordeste'),
  ('AP', 4.8, 'Norte'),
  ('AM', 4.3, 'Norte'),
  ('BA', 5.8, 'Nordeste'),
  ('CE', 5.9, 'Nordeste'),
  ('DF', 5.4, 'Centro-Oeste'),
  ('ES', 5.1, 'Sudeste'),
  ('GO', 5.3, 'Centro-Oeste'),
  ('MA', 5.5, 'Nordeste'),
  ('MT', 5.4, 'Centro-Oeste'),
  ('MS', 5.2, 'Centro-Oeste'),
  ('MG', 5.3, 'Sudeste'),
  ('PA', 4.9, 'Norte'),
  ('PB', 5.7, 'Nordeste'),
  ('PR', 4.8, 'Sul'),
  ('PE', 5.6, 'Nordeste'),
  ('PI', 5.8, 'Nordeste'),
  ('RJ', 4.9, 'Sudeste'),
  ('RN', 5.8, 'Nordeste'),
  ('RS', 4.6, 'Sul'),
  ('RO', 4.4, 'Norte'),
  ('RR', 4.7, 'Norte'),
  ('SC', 4.7, 'Sul'),
  ('SP', 5.0, 'Sudeste'),
  ('SE', 5.4, 'Nordeste'),
  ('TO', 5.1, 'Norte')
ON CONFLICT (state) DO NOTHING;
`;