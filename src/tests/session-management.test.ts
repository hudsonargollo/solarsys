import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { generateSessionId, getSessionId, clearSession, hasSession } from '../lib/session'

/**
 * **Feature: solar-lead-platform, Property 8: Session management**
 * **Validates: Requirements 3.5**
 */

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Session Management', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should generate unique session IDs that persist across calls', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 50 }),
      (callCount) => {
        clearSession()
        
        // Generate initial session ID
        const firstSessionId = generateSessionId()
        
        // Verify it's a valid UUID format
        expect(firstSessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        
        // Multiple calls to getSessionId should return the same ID
        for (let i = 0; i < callCount; i++) {
          const retrievedSessionId = getSessionId()
          expect(retrievedSessionId).toBe(firstSessionId)
        }
        
        return true
      }
    ), { numRuns: 30 })
  })

  it('should create new session ID when none exists', () => {
    fc.assert(fc.property(
      fc.boolean(),
      (shouldClear) => {
        if (shouldClear) {
          clearSession()
        }
        
        // Check if session exists before getting it
        const hadSession = hasSession()
        const sessionId = getSessionId()
        
        // Should always return a valid UUID
        expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        
        // After getting session ID, should have a session
        expect(hasSession()).toBe(true)
        
        // Session should be stored in localStorage
        expect(localStorage.getItem('solarsys_session_id')).toBe(sessionId)
        
        return true
      }
    ), { numRuns: 50 })
  })

  it('should maintain session persistence across page reloads (localStorage simulation)', () => {
    fc.assert(fc.property(
      fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
      (operations) => {
        clearSession()
        
        let currentSessionId: string | null = null
        
        for (const operation of operations) {
          if (operation.includes('clear')) {
            clearSession()
            currentSessionId = null
          } else if (operation.includes('get')) {
            const sessionId = getSessionId()
            
            if (currentSessionId === null) {
              // First time getting session, should create new one
              currentSessionId = sessionId
              expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            } else {
              // Should return the same session ID
              expect(sessionId).toBe(currentSessionId)
            }
            
            expect(hasSession()).toBe(true)
          } else if (operation.includes('generate')) {
            const newSessionId = generateSessionId()
            currentSessionId = newSessionId
            expect(newSessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
            expect(hasSession()).toBe(true)
          }
        }
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should properly clear sessions and create new ones', () => {
    fc.assert(fc.property(
      fc.integer({ min: 2, max: 10 }),
      (sessionCount) => {
        const sessionIds: string[] = []
        
        for (let i = 0; i < sessionCount; i++) {
          clearSession()
          expect(hasSession()).toBe(false)
          
          const sessionId = generateSessionId()
          expect(hasSession()).toBe(true)
          expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
          
          sessionIds.push(sessionId)
        }
        
        // All session IDs should be unique
        const uniqueSessionIds = new Set(sessionIds)
        expect(uniqueSessionIds.size).toBe(sessionIds.length)
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should handle concurrent session operations correctly', () => {
    fc.assert(fc.property(
      fc.array(fc.constantFrom('get', 'generate', 'clear', 'check'), { minLength: 5, maxLength: 20 }),
      (operations) => {
        clearSession()
        let expectedSessionId: string | null = null
        
        for (const operation of operations) {
          switch (operation) {
            case 'get':
              const sessionId = getSessionId()
              if (expectedSessionId === null) {
                expectedSessionId = sessionId
              }
              expect(sessionId).toBe(expectedSessionId)
              expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
              break
              
            case 'generate':
              const newSessionId = generateSessionId()
              expectedSessionId = newSessionId
              expect(newSessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
              break
              
            case 'clear':
              clearSession()
              expectedSessionId = null
              expect(hasSession()).toBe(false)
              break
              
            case 'check':
              const shouldHaveSession = expectedSessionId !== null
              expect(hasSession()).toBe(shouldHaveSession)
              break
          }
        }
        
        return true
      }
    ), { numRuns: 30 })
  })

  it('should maintain session state consistency', () => {
    fc.assert(fc.property(
      fc.tuple(
        fc.boolean(), // whether to start with a session
        fc.array(fc.constantFrom('read', 'write', 'clear'), { minLength: 1, maxLength: 15 })
      ),
      ([startWithSession, operations]) => {
        clearSession()
        
        let currentSession: string | null = null
        
        if (startWithSession) {
          currentSession = generateSessionId()
        }
        
        for (const operation of operations) {
          switch (operation) {
            case 'read':
              const readSession = getSessionId()
              if (currentSession === null) {
                currentSession = readSession
              }
              expect(readSession).toBe(currentSession)
              expect(hasSession()).toBe(true)
              break
              
            case 'write':
              const newSession = generateSessionId()
              currentSession = newSession
              expect(getSessionId()).toBe(newSession)
              expect(hasSession()).toBe(true)
              break
              
            case 'clear':
              clearSession()
              currentSession = null
              expect(hasSession()).toBe(false)
              break
          }
          
          // Verify localStorage consistency
          if (currentSession !== null) {
            expect(localStorage.getItem('solarsys_session_id')).toBe(currentSession)
          } else {
            expect(localStorage.getItem('solarsys_session_id')).toBeNull()
          }
        }
        
        return true
      }
    ), { numRuns: 25 })
  })
})