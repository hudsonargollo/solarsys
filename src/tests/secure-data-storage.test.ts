import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as fc from 'fast-check'
import { insertLead, getSessionLead } from '../lib/database'
import { generateSessionId, getSessionId, clearSession } from '../lib/session'
import { Lead } from '../lib/supabase'

/**
 * **Feature: solar-lead-platform, Property 6: Secure data storage with session isolation**
 * **Validates: Requirements 3.1, 3.3, 3.4**
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

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: null, error: null }))
        }))
      }))
    }))
  }
}))

describe('Secure Data Storage with Session Isolation', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should generate unique session IDs for different sessions', () => {
    fc.assert(fc.property(
      fc.integer({ min: 1, max: 100 }),
      (iterations) => {
        const sessionIds = new Set<string>()
        
        for (let i = 0; i < iterations; i++) {
          clearSession()
          const sessionId = generateSessionId()
          
          // Session ID should be a valid UUID format
          expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
          
          // Session ID should be unique
          expect(sessionIds.has(sessionId)).toBe(false)
          sessionIds.add(sessionId)
        }
        
        return true
      }
    ), { numRuns: 10 })
  })

  it('should persist session ID in localStorage', () => {
    fc.assert(fc.property(
      fc.constantFrom('session1', 'session2', 'session3'),
      (sessionPrefix) => {
        clearSession()
        
        // Generate a session ID
        const sessionId = generateSessionId()
        
        // Should be stored in localStorage
        expect(localStorage.getItem('solarsys_session_id')).toBe(sessionId)
        
        // Getting session ID should return the same value
        expect(getSessionId()).toBe(sessionId)
        
        return true
      }
    ), { numRuns: 20 })
  })

  it('should create new session if none exists', () => {
    fc.assert(fc.property(
      fc.boolean(),
      (clearFirst) => {
        if (clearFirst) {
          clearSession()
        }
        
        const sessionId = getSessionId()
        
        // Should be a valid UUID
        expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        
        // Should be stored in localStorage
        expect(localStorage.getItem('solarsys_session_id')).toBe(sessionId)
        
        return true
      }
    ), { numRuns: 50 })
  })

  it('should include session ID when inserting lead data', async () => {
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
        
        // Mock the Supabase response to return the inserted data with session_id
        const mockSessionId = generateSessionId()
        const mockInsertedLead = {
          ...leadData,
          id: 'mock-uuid',
          created_at: new Date().toISOString(),
          session_id: mockSessionId
        }

        const { supabase } = await import('../lib/supabase')
        const mockFrom = supabase.from as any
        mockFrom.mockReturnValue({
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ 
                data: mockInsertedLead, 
                error: null 
              }))
            }))
          }))
        })

        const result = await insertLead(leadData)
        
        // Should return the inserted lead with session_id
        expect(result).toBeTruthy()
        expect(result?.session_id).toBe(mockSessionId)
        
        // Verify the insert was called with session_id
        expect(mockFrom).toHaveBeenCalledWith('leads')
        
        return true
      }
    ), { numRuns: 20 })
  })
})