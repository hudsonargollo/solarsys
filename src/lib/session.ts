import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'solarsys_session_id'

/**
 * Generate a unique session ID and store it in localStorage
 */
export function generateSessionId(): string {
  const sessionId = uuidv4()
  localStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}

/**
 * Get the current session ID from localStorage, or generate a new one
 */
export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY)
  
  if (!sessionId) {
    sessionId = generateSessionId()
  }
  
  return sessionId
}

/**
 * Clear the current session ID
 */
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
}

/**
 * Check if a session ID exists
 */
export function hasSession(): boolean {
  return localStorage.getItem(SESSION_KEY) !== null
}