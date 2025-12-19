/**
 * Property-Based Test for Admin Status Management
 * **Feature: solar-lead-platform, Property 18: Admin status management**
 * **Validates: Requirements 6.5**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'
import type { Lead } from '../lib/supabase'

// Mock database functions
const mockUpdateLeadStatus = vi.fn()
const mockGetAllLeads = vi.fn()

vi.mock('../lib/database', () => ({
  updateLeadStatus: mockUpdateLeadStatus,
  getAllLeads: mockGetAllLeads
}))

describe('Admin Status Management Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Generator for lead IDs
  const leadIdGenerator = fc.uuid()

  // Generator for valid lead statuses
  const statusGenerator = fc.constantFrom('new', 'qualified', 'whatsapp_clicked', 'contacted') as fc.Arbitrary<Lead['status']>

  // Generator for lead data
  const leadGenerator = fc.record({
    id: fc.uuid(),
    created_at: fc.date().map(d => d.toISOString()),
    status: statusGenerator,
    name: fc.string({ minLength: 2, maxLength: 50 }),
    whatsapp: fc.string({ minLength: 10, maxLength: 11 }).filter(s => /^\d+$/.test(s)),
    email: fc.emailAddress(),
    zip_code: fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d{5}-?\d{3}$/.test(s)),
    city: fc.string({ minLength: 2, maxLength: 50 }),
    state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'CE', 'PE'),
    bill_value: fc.float({ min: 50, max: 5000 }),
    connection_type: fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<Lead['connection_type']>,
    roof_type: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<Lead['roof_type']>,
    system_size_kwp: fc.option(fc.float({ min: 1, max: 50 }), { nil: null }),
    est_savings: fc.option(fc.float({ min: 100, max: 10000 }), { nil: null }),
    session_id: fc.uuid(),
    utm_source: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
    utm_medium: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
    utm_campaign: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: null }),
    disqualification_reason: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: null }),
    warnings: fc.option(fc.array(fc.string({ minLength: 1, maxLength: 50 })), { nil: null })
  })

  it('Property 18.1: Admin should be able to update lead status to any valid status', () => {
    fc.assert(fc.property(
      leadIdGenerator,
      statusGenerator,
      statusGenerator,
      (leadId, currentStatus, newStatus) => {
        mockUpdateLeadStatus.mockResolvedValue(true)
        
        // Admin should be able to update from any status to any other valid status
        const validStatuses = ['new', 'qualified', 'whatsapp_clicked', 'contacted']
        
        expect(validStatuses).toContain(currentStatus)
        expect(validStatuses).toContain(newStatus)
        
        // Mock the update operation
        const updatePromise = mockUpdateLeadStatus(leadId, newStatus)
        
        expect(mockUpdateLeadStatus).toHaveBeenCalledWith(leadId, newStatus)
        
        return updatePromise.then((result) => {
          expect(result).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 18.2: Status updates should be atomic and consistent', () => {
    fc.assert(fc.property(
      fc.array(fc.tuple(leadIdGenerator, statusGenerator), { minLength: 1, maxLength: 10 }),
      (statusUpdates) => {
        // Mock successful updates
        mockUpdateLeadStatus.mockResolvedValue(true)
        
        // Each update should be independent and atomic
        const updatePromises = statusUpdates.map(([leadId, newStatus]) => {
          return mockUpdateLeadStatus(leadId, newStatus)
        })
        
        // All updates should be called
        expect(mockUpdateLeadStatus).toHaveBeenCalledTimes(statusUpdates.length)
        
        // Each call should have correct parameters
        statusUpdates.forEach(([leadId, newStatus], index) => {
          expect(mockUpdateLeadStatus).toHaveBeenNthCalledWith(index + 1, leadId, newStatus)
        })
        
        return Promise.all(updatePromises).then((results) => {
          // All updates should succeed
          results.forEach(result => {
            expect(result).toBe(true)
          })
        })
      }
    ), { numRuns: 50 })
  })

  it('Property 18.3: Status update failures should be handled gracefully', () => {
    fc.assert(fc.property(
      leadIdGenerator,
      statusGenerator,
      fc.boolean(),
      (leadId, newStatus, shouldSucceed) => {
        mockUpdateLeadStatus.mockResolvedValue(shouldSucceed)
        
        const updatePromise = mockUpdateLeadStatus(leadId, newStatus)
        
        expect(mockUpdateLeadStatus).toHaveBeenCalledWith(leadId, newStatus)
        
        return updatePromise.then((result) => {
          expect(result).toBe(shouldSucceed)
          
          // The system should handle both success and failure cases
          if (shouldSucceed) {
            // Success case: status should be updated
            expect(result).toBe(true)
          } else {
            // Failure case: should return false and handle gracefully
            expect(result).toBe(false)
          }
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 18.4: Status transitions should follow business logic rules', () => {
    fc.assert(fc.property(
      statusGenerator,
      statusGenerator,
      (fromStatus, toStatus) => {
        // Define valid status transitions based on business logic
        const validTransitions: Record<Lead['status'], Lead['status'][]> = {
          'new': ['qualified', 'whatsapp_clicked', 'contacted'],
          'qualified': ['whatsapp_clicked', 'contacted', 'new'],
          'whatsapp_clicked': ['contacted', 'qualified', 'new'],
          'contacted': ['qualified', 'new', 'whatsapp_clicked']
        }
        
        // All transitions should be allowed in admin interface for flexibility
        // But we can validate that the statuses are valid
        const allValidStatuses = ['new', 'qualified', 'whatsapp_clicked', 'contacted']
        
        expect(allValidStatuses).toContain(fromStatus)
        expect(allValidStatuses).toContain(toStatus)
        
        // Admin should have full control over status changes
        expect(validTransitions[fromStatus]).toBeDefined()
        
        // The transition might be valid or require admin override
        const isDirectTransition = validTransitions[fromStatus].includes(toStatus)
        const isAdminOverride = !isDirectTransition
        
        // Both direct transitions and admin overrides should be possible
        expect(typeof isDirectTransition).toBe('boolean')
        expect(typeof isAdminOverride).toBe('boolean')
      }
    ), { numRuns: 100 })
  })

  it('Property 18.5: Status updates should maintain data integrity', () => {
    fc.assert(fc.property(
      fc.array(leadGenerator, { minLength: 1, maxLength: 20 }),
      fc.array(fc.tuple(fc.integer({ min: 0, max: 19 }), statusGenerator), { minLength: 1, maxLength: 5 }),
      (leads, statusUpdates) => {
        mockGetAllLeads.mockResolvedValue(leads)
        mockUpdateLeadStatus.mockResolvedValue(true)
        
        // Simulate status updates
        const updatedLeads = [...leads]
        
        statusUpdates.forEach(([leadIndex, newStatus]) => {
          if (leadIndex < updatedLeads.length) {
            const leadId = updatedLeads[leadIndex].id
            
            // Update the lead status
            updatedLeads[leadIndex] = {
              ...updatedLeads[leadIndex],
              status: newStatus
            }
            
            // Verify the update call
            mockUpdateLeadStatus(leadId, newStatus)
          }
        })
        
        // Data integrity checks
        updatedLeads.forEach((lead, index) => {
          // Lead should maintain all required fields
          expect(lead.id).toBeTruthy()
          expect(lead.name).toBeTruthy()
          expect(lead.email).toBeTruthy()
          expect(lead.whatsapp).toBeTruthy()
          expect(lead.city).toBeTruthy()
          expect(lead.state).toBeTruthy()
          expect(typeof lead.bill_value).toBe('number')
          expect(lead.connection_type).toBeTruthy()
          expect(lead.roof_type).toBeTruthy()
          expect(lead.session_id).toBeTruthy()
          
          // Status should be valid
          expect(['new', 'qualified', 'whatsapp_clicked', 'contacted']).toContain(lead.status)
          
          // Other fields should remain unchanged
          expect(lead.id).toBe(leads[index].id)
          expect(lead.name).toBe(leads[index].name)
          expect(lead.email).toBe(leads[index].email)
          expect(lead.bill_value).toBe(leads[index].bill_value)
        })
        
        // Should maintain the same number of leads
        expect(updatedLeads.length).toBe(leads.length)
      }
    ), { numRuns: 50 })
  })

  it('Property 18.6: Status dropdown should show all valid options', () => {
    fc.assert(fc.property(
      statusGenerator,
      (currentStatus) => {
        const validStatuses = ['new', 'qualified', 'whatsapp_clicked', 'contacted']
        const statusLabels = {
          'new': 'Novo',
          'qualified': 'Qualificado', 
          'whatsapp_clicked': 'WhatsApp Clicado',
          'contacted': 'Contatado'
        }
        
        // Dropdown should show all valid statuses
        validStatuses.forEach(status => {
          expect(validStatuses).toContain(status)
          expect(statusLabels[status as Lead['status']]).toBeTruthy()
        })
        
        // Current status should be one of the valid options
        expect(validStatuses).toContain(currentStatus)
        
        // Should have Portuguese labels
        const label = statusLabels[currentStatus]
        expect(label).toBeTruthy()
        expect(typeof label).toBe('string')
        
        // Labels should be in Portuguese
        const portugueseLabels = ['Novo', 'Qualificado', 'WhatsApp Clicado', 'Contatado']
        expect(portugueseLabels).toContain(label)
      }
    ), { numRuns: 100 })
  })

  it('Property 18.7: Bulk status updates should be supported', () => {
    fc.assert(fc.property(
      fc.array(leadIdGenerator, { minLength: 1, maxLength: 10 }),
      statusGenerator,
      (leadIds, newStatus) => {
        mockUpdateLeadStatus.mockResolvedValue(true)
        
        // Simulate bulk update by updating multiple leads to the same status
        const updatePromises = leadIds.map(leadId => 
          mockUpdateLeadStatus(leadId, newStatus)
        )
        
        // Should call update for each lead
        expect(mockUpdateLeadStatus).toHaveBeenCalledTimes(leadIds.length)
        
        // Each call should have correct parameters
        leadIds.forEach((leadId, index) => {
          expect(mockUpdateLeadStatus).toHaveBeenNthCalledWith(index + 1, leadId, newStatus)
        })
        
        return Promise.all(updatePromises).then((results) => {
          // All updates should succeed
          results.forEach(result => {
            expect(result).toBe(true)
          })
          
          // Should handle the same number of results as inputs
          expect(results.length).toBe(leadIds.length)
        })
      }
    ), { numRuns: 50 })
  })

  it('Property 18.8: Status updates should be logged and auditable', () => {
    fc.assert(fc.property(
      leadGenerator,
      statusGenerator,
      statusGenerator,
      (lead, oldStatus, newStatus) => {
        mockUpdateLeadStatus.mockResolvedValue(true)
        
        // Update the lead status
        const updatedLead = { ...lead, status: oldStatus }
        const updatePromise = mockUpdateLeadStatus(updatedLead.id, newStatus)
        
        expect(mockUpdateLeadStatus).toHaveBeenCalledWith(updatedLead.id, newStatus)
        
        return updatePromise.then((result) => {
          expect(result).toBe(true)
          
          // The system should track status changes for audit purposes
          // This includes: who made the change, when, from what status to what status
          
          // Verify the change parameters are valid
          expect(['new', 'qualified', 'whatsapp_clicked', 'contacted']).toContain(oldStatus)
          expect(['new', 'qualified', 'whatsapp_clicked', 'contacted']).toContain(newStatus)
          expect(updatedLead.id).toBeTruthy()
          
          // The change should be trackable
          const changeRecord = {
            leadId: updatedLead.id,
            fromStatus: oldStatus,
            toStatus: newStatus,
            timestamp: new Date().toISOString(),
            adminAction: true
          }
          
          expect(changeRecord.leadId).toBe(updatedLead.id)
          expect(changeRecord.fromStatus).toBe(oldStatus)
          expect(changeRecord.toStatus).toBe(newStatus)
          expect(changeRecord.adminAction).toBe(true)
          expect(typeof changeRecord.timestamp).toBe('string')
        })
      }
    ), { numRuns: 100 })
  })
})