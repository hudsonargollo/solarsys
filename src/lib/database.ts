import { supabase, isSupabaseAvailable } from './supabase'
import type { Lead, LeadInsert, HSPData } from './supabase'
import { getSessionId } from './session'
import type { UTMParameters } from './utm'
import { handleSupabaseError, safeAsync, validateInput } from './errors'
import type { AppError } from './errors'

/**
 * Insert a new lead into the database
 */
export async function insertLead(
  leadData: Omit<LeadInsert, 'id' | 'created_at' | 'session_id' | 'utm_source' | 'utm_medium' | 'utm_campaign'>,
  utmParameters?: UTMParameters
): Promise<Lead | null> {
  try {
    // Check if Supabase is available
    if (!isSupabaseAvailable()) {
      console.warn('Supabase not configured - lead data will not be saved')
      // Return a mock lead object for development/demo purposes
      return {
        id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        session_id: getSessionId(),
        status: 'new',
        ...leadData,
        utm_source: utmParameters?.utm_source || null,
        utm_medium: utmParameters?.utm_medium || null,
        utm_campaign: utmParameters?.utm_campaign || null,
        disqualification_reason: null,
        warnings: null
      } as Lead
    }

    // Validate required fields
    const validationErrors = [
      validateInput(leadData.name, 'required'),
      validateInput(leadData.whatsapp, 'phone'),
      validateInput(leadData.email, 'email'),
      validateInput(leadData.zip_code, 'cep'),
      validateInput(leadData.bill_value, 'bill_value')
    ].filter(Boolean)

    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors)
      throw new Error('Dados inválidos para criar o lead')
    }

    const sessionId = getSessionId()
    
    const { data, error } = await supabase!
      .from('leads')
      .insert({
        ...leadData,
        session_id: sessionId,
        utm_source: utmParameters?.utm_source || null,
        utm_medium: utmParameters?.utm_medium || null,
        utm_campaign: utmParameters?.utm_campaign || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting lead:', error)
      throw handleSupabaseError(error)
    }

    return data
  } catch (error) {
    console.error('Error in insertLead:', error)
    return null
  }
}

/**
 * Safe lead insertion with error handling
 */
export async function safeInsertLead(
  leadData: Omit<LeadInsert, 'id' | 'created_at' | 'session_id' | 'utm_source' | 'utm_medium' | 'utm_campaign'>,
  utmParameters?: UTMParameters
): Promise<{ data: Lead | null; error: AppError | null }> {
  return safeAsync(() => insertLead(leadData, utmParameters))
}

/**
 * Get lead data for the current session
 */
export async function getSessionLead(): Promise<Lead | null> {
  try {
    const sessionId = getSessionId()
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('session_id', sessionId)
      .single()

    if (error) {
      // Handle case where no lead is found (not an error)
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching session lead:', error)
      throw handleSupabaseError(error)
    }

    return data
  } catch (error) {
    console.error('Error in getSessionLead:', error)
    return null
  }
}

/**
 * Safe session lead retrieval with error handling
 */
export async function safeGetSessionLead(): Promise<{ data: Lead | null; error: AppError | null }> {
  return safeAsync(() => getSessionLead())
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<boolean> {
  try {
    // Validate inputs
    if (!leadId || !status) {
      throw new Error('Lead ID e status são obrigatórios')
    }

    const validStatuses = ['new', 'qualified', 'whatsapp_clicked', 'contacted']
    if (!validStatuses.includes(status)) {
      throw new Error('Status inválido')
    }

    const { error } = await supabase
      .from('leads')
      .update({ status })
      .eq('id', leadId)

    if (error) {
      console.error('Error updating lead status:', error)
      throw handleSupabaseError(error)
    }

    return true
  } catch (error) {
    console.error('Error in updateLeadStatus:', error)
    return false
  }
}

/**
 * Safe lead status update with error handling
 */
export async function safeUpdateLeadStatus(leadId: string, status: Lead['status']): Promise<{ data: boolean | null; error: AppError | null }> {
  const result = await safeAsync(() => updateLeadStatus(leadId, status))
  return {
    data: result.data,
    error: result.error
  }
}

/**
 * Get HSP value for a given state
 */
export async function getHSPValue(state: string): Promise<number | null> {
  // Check if Supabase is available
  if (!isSupabaseAvailable()) {
    console.warn('Supabase not configured - using fallback HSP values')
    // Return fallback HSP values for demo purposes
    const fallbackHSP: Record<string, number> = {
      'AC': 4.5, 'AL': 5.2, 'AP': 4.8, 'AM': 4.3, 'BA': 5.8, 'CE': 5.9,
      'DF': 5.4, 'ES': 5.1, 'GO': 5.3, 'MA': 5.5, 'MT': 5.4, 'MS': 5.2,
      'MG': 5.3, 'PA': 4.9, 'PB': 5.7, 'PR': 4.8, 'PE': 5.6, 'PI': 5.8,
      'RJ': 4.9, 'RN': 5.8, 'RS': 4.6, 'RO': 4.4, 'RR': 4.7, 'SC': 4.7,
      'SP': 5.0, 'SE': 5.4, 'TO': 5.1
    }
    return fallbackHSP[state.toUpperCase()] || 5.0
  }

  const { data, error } = await supabase!
    .from('hsp_data')
    .select('hsp_value')
    .eq('state', state.toUpperCase())
    .single()

  if (error) {
    console.error('Error fetching HSP data:', error)
    return null
  }

  return data.hsp_value
}

/**
 * Get all leads (admin only)
 */
export async function getAllLeads(): Promise<Lead[]> {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all leads:', error)
      throw handleSupabaseError(error)
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllLeads:', error)
    return []
  }
}

/**
 * Safe get all leads with error handling
 */
export async function safeGetAllLeads(): Promise<{ data: Lead[] | null; error: AppError | null }> {
  const result = await safeAsync(() => getAllLeads())
  return {
    data: result.data,
    error: result.error
  }
}

/**
 * Get HSP data for all states
 */
export async function getAllHSPData(): Promise<HSPData[]> {
  const { data, error } = await supabase
    .from('hsp_data')
    .select('*')
    .order('state')

  if (error) {
    console.error('Error fetching HSP data:', error)
    return []
  }

  return data || []
}