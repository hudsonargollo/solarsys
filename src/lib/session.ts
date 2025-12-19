import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'solarsys_session_id'

/**
 * Generate a unique session ID and store it in localStorage
 */
export function generateSessionId(): string {
  const sessionId = uuidv4()
  try {
    localStorage.setItem(SESSION_KEY, sessionId)
  } catch (error) {
    console.warn('localStorage not available, session will not persist')
  }
  return sessionId
}

/**
 * Get the current session ID from localStorage, or generate a new one
 */
export function getSessionId(): string {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY)
    
    if (!sessionId) {
      sessionId = generateSessionId()
    }
    
    return sessionId
  } catch (error) {
    // Fallback if localStorage is not available
    console.warn('localStorage not available, using temporary session ID')
    return uuidv4()
  }
}

/**
 * Clear the current session ID
 */
export function clearSession(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  } catch (error) {
    console.warn('Could not clear session from localStorage')
  }
}

/**
 * Check if a session ID exists
 */
export function hasSession(): boolean {
  try {
    return typeof window !== 'undefined' && localStorage.getItem(SESSION_KEY) !== null
  } catch (error) {
    return false
  }
}