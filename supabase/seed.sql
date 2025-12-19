-- Seed file for development data
-- This file is run after migrations in local development

-- Insert some sample leads for testing (optional)
-- These will only be inserted in local development, not production

-- Sample lead data for testing
INSERT INTO public.leads (
  name, 
  whatsapp, 
  email, 
  zip_code, 
  city, 
  state, 
  bill_value, 
  connection_type, 
  roof_type, 
  system_size_kwp, 
  est_savings, 
  session_id, 
  status
) VALUES 
  (
    'João Silva', 
    '11999999999', 
    'joao@example.com', 
    '01310-100', 
    'São Paulo', 
    'SP', 
    350.00, 
    'mono', 
    'clay', 
    3.5, 
    280.00, 
    gen_random_uuid(), 
    'qualified'
  ),
  (
    'Maria Santos', 
    '21888888888', 
    'maria@example.com', 
    '20040-020', 
    'Rio de Janeiro', 
    'RJ', 
    450.00, 
    'bi', 
    'metal', 
    4.2, 
    360.00, 
    gen_random_uuid(), 
    'whatsapp_clicked'
  ),
  (
    'Carlos Oliveira', 
    '31777777777', 
    'carlos@example.com', 
    '30112-000', 
    'Belo Horizonte', 
    'MG', 
    280.00, 
    'tri', 
    'slab', 
    2.8, 
    224.00, 
    gen_random_uuid(), 
    'new'
  )
ON CONFLICT DO NOTHING;