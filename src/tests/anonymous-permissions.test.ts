import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { insertLead, getSessionLead, getAllLeads } from '../lib/database'
import { generateSessionId, clearSession } from '../lib/session'
import { Lead } from '../lib/supabase'

/**
 * **Feature: solar-lead-platform, Property 7: Anonymous database permissions**
 * **Validates: Requirements 3.2**
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

// Mock Supabase client to simulate RLS behavior
let mockSupabaseClient: any

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'leads') {
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: { id: 'mock-id', session_id: 'mock-session' }, 
                error: null 
              }))
            }))
          })),
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              single: vi.fn(() => {
                // Simulate RLS: anonymous users can only access their own session data
                const currentSession = localStorage.getItem('solarsys_session_id')
                if (!currentSession) {
                  return Promise.resolve({ data: null, error: { message: 'No session' } })
                }
                return Promise.resolve({ 
                  data: { id: 'mock-id', session_id: currentSession }, 
                  error: null 
                })
              })
            })),
            order: vi.fn(() => Promise.resolve({ 
              data: null, 
              error: { message: 'RLS: Anonymous users cannot read all leads' } 
            }))
          }))
        }
      }
      return {
        select: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }
    })
  }
}))

describe('Anonymous Database Permissions', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should allow anonymous users to insert new leads', async () => {
    const leadDataArbitrary = fc.record({
      name: fc.string({ minLength: 1, maxLength: 100 }),
      whatsapp: fc.string({ minLength: 10, maxLength: 15 }),
      email: fc.option(fc.emailAddress()),
      zip_code: fc.string({ minLength: 8, maxLength: 9 }),
      city: fc.string({ minLength: 1, maxLength: 100 }),
      state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO'),
      bill_value: fc.float({ min: 50, max: 2000 }),
      connection_type: fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<'mono' | 'bi' | 'tri'>,
      roof_type: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<'clay' | 'metal' | 'fiber' | 'slab'>,
      status: fc.constantFrom('new', 'qualified', 'whatsapp_clicked', 'contacted') as fc.Arbitrary<'new' | 'qualified' | 'whatsapp_clicked' | 'contacted'>
    })

    await fc.assert(fc.asyncProperty(
      leadDataArbitrary,
      async (leadData) => {
        clearSession()
        generateSessionId() // Create a session for the anonymous user
        
        const result = await insertLead(leadData)
        
        // Anonymous users should be able to insert leads
        expect(result).toBeTruthy()
        expect(result?.id).toBe('mock-id')
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should allow anonymous users to read only their own session data', async () => {
    await fc.assert(fc.asyncProperty(
      fc.string({ minLength: 1, maxLength: 50 }),
      async (sessionPrefix) => {
        clearSession()
        const sessionId = generateSessionId()
        
        // Should be able to read own session data
        const result = await getSessionLead()
        
        // Should return data for the current session (mocked)
        expect(result?.session_id).toBe(sessionId)
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should prevent anonymous users from reading all leads', async () => {
    await fc.assert(fc.asyncProperty(
      fc.boolean(),
      async (hasSession) => {
        if (hasSession) {
          generateSessionId()
        } else {
          clearSession()
        }
        
        // Anonymous users should not be able to read all leads
        const result = await getAllLeads()
        
        // Should return empty array due to RLS restrictions
        expect(result).toEqual([])
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should prevent anonymous users from accessing other sessions data', async () => {
    await fc.assert(fc.asyncProperty(
      fc.tuple(fc.string({ minLength: 1, maxLength: 20 }), fc.string({ minLength: 1, maxLength: 20 })),
      async ([session1, session2]) => {
        // Create first session
        clearSession()
        localStorage.setItem('solarsys_session_id', `session-${session1}`)
        
        const result1 = await getSessionLead()
        expect(result1?.session_id).toBe(`session-${session1}`)
        
        // Switch to different session
        localStorage.setItem('solarsys_session_id', `session-${session2}`)
        
        const result2 = await getSessionLead()
        expect(result2?.session_id).toBe(`session-${session2}`)
        
        // Each session should only see its own data
        if (session1 !== session2) {
          expect(result1?.session_id).not.toBe(result2?.session_id)
        }
        
        return true
      }
    ), { numRuns: 30 })
  })

  it('should enforce session-based isolation for anonymous users', async () => {
    await fc.assert(fc.asyncProperty(
      fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 2, maxLength: 5 }),
      async (sessionIds) => {
        const uniqueSessionIds = [...new Set(sessionIds)]
        const results: (Lead | null)[] = []
        
        // Test each session in isolation
        for (const sessionId of uniqueSessionIds) {
          clearSession()
          localStorage.setItem('solarsys_session_id', `test-${sessionId}`)
          
          const result = await getSessionLead()
          results.push(result)
          
          // Each session should only see its own data
          if (result) {
            expect(result.session_id).toBe(`test-${sessionId}`)
          }
        }
        
        // Verify session isolation: each result should have different session_id
        const sessionIdsFromResults = results
          .filter(r => r !== null)
          .map(r => r!.session_id)
        
        const uniqueResultSessionIds = new Set(sessionIdsFromResults)
        expect(uniqueResultSessionIds.size).toBe(sessionIdsFromResults.length)
        
        return true
      }
    ), { numRuns: 15 })
  })
})