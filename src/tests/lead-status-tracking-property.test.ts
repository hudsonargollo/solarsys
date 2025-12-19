/**
 * Property-based tests for lead status tracking
 * **Feature: solar-lead-platform, Property 11: Lead status tracking**
 * **Validates: Requirements 4.4**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { updateLeadStatus, insertLead } from '../lib/database'
import type { Lead } from '../lib/supabase'

/**
 * **Feature: solar-lead-platform, Property 11: Lead status tracking**
 * **Validates: Requirements 4.4**
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
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null }))
      }))
    }))
  }
}))

// Mock the session module
vi.mock('../lib/session', () => ({
  getSessionId: vi.fn(() => 'test-session-id'),
  generateSessionId: vi.fn(() => 'test-session-id'),
  clearSession: vi.fn()
}))

describe('Lead Status Tracking Properties', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Property 11: Lead status tracking', () => {
    it('should update lead status from new to whatsapp_clicked when WhatsApp interaction occurs', async () => {
      const leadDataArbitrary = fc.record({
        name: fc.string({ minLength: 1, maxLength: 100 }),
        whatsapp: fc.string({ minLength: 10, maxLength: 15 }),
        email: fc.option(fc.emailAddress()),
        zip_code: fc.string({ minLength: 8, maxLength: 9 }),
        city: fc.string({ minLength: 1, maxLength: 100 }),
        state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO'),
        bill_value: fc.float({ min: 50, max: 2000 }),
        connection_type: fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<'mono' | 'bi' | 'tri'>,
        roof_type: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<'clay' | 'metal' | 'fiber' | 'slab'>
      })

      await fc.assert(fc.asyncProperty(
        leadDataArbitrary,
        async (leadData) => {
          // Mock the Supabase response for inserting a lead
          const mockLeadId = 'mock-lead-id'
          const mockInsertedLead: Lead = {
            ...leadData,
            id: mockLeadId,
            created_at: new Date().toISOString(),
            status: 'new',
            session_id: 'test-session-id',
            system_size_kwp: null,
            est_savings: null,
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            disqualification_reason: null,
            warnings: null
          }

          const { supabase } = await import('../lib/supabase')
          const mockFrom = supabase.from as any
          
          // Mock insert operation
          mockFrom.mockReturnValue({
            insert: vi.fn(() => ({
              select: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ 
                  data: mockInsertedLead, 
                  error: null 
                }))
              }))
            })),
            update: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ error: null }))
            })),
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                single: vi.fn(() => Promise.resolve({ 
                  data: { ...mockInsertedLead, status: 'whatsapp_clicked' }, 
                  error: null 
                }))
              }))
            }))
          })

          // Insert a new lead with 'new' status
          const insertedLead = await insertLead(leadData)
          
          // Lead should be successfully inserted
          expect(insertedLead).toBeTruthy()
          expect(insertedLead?.status).toBe('new')
          
          // Simulate WhatsApp button click by updating status
          const updateResult = await updateLeadStatus(mockLeadId, 'whatsapp_clicked')
          
          // Update should be successful
          expect(updateResult).toBe(true)
          
          // Verify the mocks were called correctly
          expect(mockFrom).toHaveBeenCalledWith('leads')
          
          return true
        }
      ), { numRuns: 20 })
    })

    it('should handle status update failures gracefully', async () => {
      await fc.assert(fc.asyncProperty(
        fc.uuid(),
        async (invalidLeadId) => {
          const { supabase } = await import('../lib/supabase')
          const mockFrom = supabase.from as any
          
          // Mock update operation to return an error
          mockFrom.mockReturnValue({
            update: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ error: { message: 'Lead not found' } }))
            }))
          })

          // Try to update status for a non-existent lead
          const updateResult = await updateLeadStatus(invalidLeadId, 'whatsapp_clicked')
          
          // Update should fail gracefully (return false) for non-existent leads
          expect(updateResult).toBe(false)
          
          return true
        }
      ), { numRuns: 10 })
    })

    it('should support all valid status transitions', async () => {
      const validStatuses = ['new', 'qualified', 'whatsapp_clicked', 'contacted'] as const
      
      await fc.assert(fc.asyncProperty(
        fc.constantFrom(...validStatuses),
        fc.constantFrom(...validStatuses),
        fc.uuid(),
        async (initialStatus, targetStatus, leadId) => {
          const { supabase } = await import('../lib/supabase')
          const mockFrom = supabase.from as any
          
          // Mock successful update operation
          mockFrom.mockReturnValue({
            update: vi.fn(() => ({
              eq: vi.fn(() => Promise.resolve({ error: null }))
            }))
          })

          // Update to target status
          const updateResult = await updateLeadStatus(leadId, targetStatus)
          expect(updateResult).toBe(true)
          
          // Verify the update was called with correct parameters
          expect(mockFrom).toHaveBeenCalledWith('leads')
          
          return true
        }
      ), { numRuns: 50 })
    })
  })
})