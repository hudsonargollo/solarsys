/**
 * UTM Parameter Tracking Utility
 * Captures and manages UTM parameters for marketing attribution
 */

export interface UTMParameters {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
}

const UTM_STORAGE_KEY = 'solarsys-utm-params'

/**
 * Extract UTM parameters from URL search params
 */
export function extractUTMFromURL(searchParams?: URLSearchParams): UTMParameters {
  const params = searchParams || new URLSearchParams(window.location.search)
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

/**
 * Check if any UTM parameters are present
 */
export function hasUTMParameters(utmParams: UTMParameters): boolean {
  return Object.values(utmParams).some(value => value !== null && value !== undefined && value !== '')
}

/**
 * Store UTM parameters in localStorage for session persistence
 */
export function storeUTMParameters(utmParams: UTMParameters): void {
  if (hasUTMParameters(utmParams)) {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams))
  }
}

/**
 * Retrieve stored UTM parameters from localStorage
 */
export function getStoredUTMParameters(): UTMParameters {
  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error parsing stored UTM parameters:', error)
  }
  
  return {}
}

/**
 * Clear stored UTM parameters
 */
export function clearUTMParameters(): void {
  localStorage.removeItem(UTM_STORAGE_KEY)
}

/**
 * Initialize UTM tracking - should be called on app startup
 * Returns the captured UTM parameters
 */
export function initializeUTMTracking(): UTMParameters {
  // First check if we have UTM parameters in the current URL
  const currentUTM = extractUTMFromURL()
  
  // If we have new UTM parameters, store them
  if (hasUTMParameters(currentUTM)) {
    storeUTMParameters(currentUTM)
    return currentUTM
  }
  
  // Otherwise, return any previously stored UTM parameters
  return getStoredUTMParameters()
}

/**
 * Get the current UTM parameters for the session
 * This should be used when creating leads
 */
export function getCurrentUTMParameters(): UTMParameters {
  // Always prioritize stored parameters to maintain attribution
  // across the entire user journey
  return getStoredUTMParameters()
}

/**
 * Format UTM parameters for display (removes null/undefined values)
 */
export function formatUTMForDisplay(utmParams: UTMParameters): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  Object.entries(utmParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formatted[key] = value
    }
  })
  
  return formatted
}