import { supabase } from './supabase'
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
    
    const { data, error } = await supabase
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
  const { data, error } = await supabase
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