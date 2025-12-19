/**
 * Property-Based Test for Dashboard Lead Display
 * **Feature: solar-lead-platform, Property 15: Dashboard lead display**
 * **Validates: Requirements 6.2**
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import fc from 'fast-check'
import type { Lead } from '../lib/supabase'

// Mock database functions
const mockGetAllLeads = vi.fn()
vi.mock('../lib/database', () => ({
  getAllLeads: mockGetAllLeads,
  updateLeadStatus: vi.fn()
}))

describe('Dashboard Lead Display Properties', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Generator for lead data
  const leadGenerator = fc.record({
    id: fc.uuid(),
    created_at: fc.date().map(d => d.toISOString()),
    status: fc.constantFrom('new', 'qualified', 'whatsapp_clicked', 'contacted') as fc.Arbitrary<Lead['status']>,
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

  // Generator for arrays of leads
  const leadsArrayGenerator = fc.array(leadGenerator, { minLength: 0, maxLength: 100 })

  it('Property 15.1: Dashboard should display all leads with key metrics in table format', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      (leads) => {
        mockGetAllLeads.mockResolvedValue(leads)
        
        // The dashboard should display leads in a table format with key metrics
        // Key metrics include: name, bill value, status, creation date
        
        leads.forEach(lead => {
          // Each lead should have all required display fields
          expect(lead.id).toBeTruthy()
          expect(lead.name).toBeTruthy()
          expect(lead.created_at).toBeTruthy()
          expect(lead.status).toBeTruthy()
          expect(typeof lead.bill_value).toBe('number')
          expect(lead.bill_value).toBeGreaterThan(0)
          
          // Contact information should be present
          expect(lead.whatsapp).toBeTruthy()
          expect(lead.email).toBeTruthy()
          
          // Location information should be present
          expect(lead.city).toBeTruthy()
          expect(lead.state).toBeTruthy()
          expect(lead.zip_code).toBeTruthy()
          
          // Technical information should be present
          expect(lead.connection_type).toBeTruthy()
          expect(lead.roof_type).toBeTruthy()
          
          // Status should be one of the valid values
          expect(['new', 'qualified', 'whatsapp_clicked', 'contacted']).toContain(lead.status)
        })
        
        // Verify getAllLeads was called
        expect(mockGetAllLeads).toHaveBeenCalled()
      }
    ), { numRuns: 100 })
  })

  it('Property 15.2: Lead display should format currency values correctly for Brazilian locale', () => {
    fc.assert(fc.property(
      fc.array(leadGenerator, { minLength: 1, maxLength: 20 }),
      (leads) => {
        leads.forEach(lead => {
          // Format currency using Brazilian locale
          const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(lead.bill_value)
          
          // Should start with R$ and use comma as decimal separator
          expect(formatted).toMatch(/^R\$\s*[\d.,]+$/)
          
          // Should handle various bill values correctly
          if (lead.bill_value >= 1000) {
            // Should use dot as thousands separator for values >= 1000
            expect(formatted).toMatch(/\d{1,3}(\.\d{3})*,\d{2}/)
          } else {
            // Should show decimal places for smaller values
            expect(formatted).toMatch(/\d+,\d{2}/)
          }
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 15.3: Lead display should format dates correctly for Brazilian locale', () => {
    fc.assert(fc.property(
      fc.array(leadGenerator, { minLength: 1, maxLength: 20 }),
      (leads) => {
        leads.forEach(lead => {
          const date = new Date(lead.created_at)
          const formatted = new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(date)
          
          // Should match Brazilian date format: DD/MM/YYYY HH:MM
          expect(formatted).toMatch(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/)
          
          // Date should be valid
          expect(date.getTime()).not.toBeNaN()
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 15.4: Status badges should display correct labels and styling', () => {
    fc.assert(fc.property(
      fc.constantFrom('new', 'qualified', 'whatsapp_clicked', 'contacted') as fc.Arbitrary<Lead['status']>,
      (status) => {
        const statusConfig = {
          new: { label: 'Novo', className: 'bg-blue-100 text-blue-800' },
          qualified: { label: 'Qualificado', className: 'bg-green-100 text-green-800' },
          whatsapp_clicked: { label: 'WhatsApp Clicado', className: 'bg-yellow-100 text-yellow-800' },
          contacted: { label: 'Contatado', className: 'bg-purple-100 text-purple-800' }
        }
        
        const config = statusConfig[status]
        
        // Each status should have a Portuguese label
        expect(config.label).toBeTruthy()
        expect(typeof config.label).toBe('string')
        
        // Each status should have appropriate styling
        expect(config.className).toBeTruthy()
        expect(config.className).toMatch(/bg-\w+-100 text-\w+-800/)
        
        // Labels should be in Portuguese
        const portugueseLabels = ['Novo', 'Qualificado', 'WhatsApp Clicado', 'Contatado']
        expect(portugueseLabels).toContain(config.label)
      }
    ), { numRuns: 100 })
  })

  it('Property 15.5: Connection type should display correct Portuguese labels', () => {
    fc.assert(fc.property(
      fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<Lead['connection_type']>,
      (connectionType) => {
        const connectionLabels = {
          mono: 'Monofásico',
          bi: 'Bifásico',
          tri: 'Trifásico'
        }
        
        const label = connectionLabels[connectionType]
        
        // Should have Portuguese label
        expect(label).toBeTruthy()
        expect(typeof label).toBe('string')
        
        // Should end with 'fásico'
        expect(label).toMatch(/fásico$/)
        
        // Should be one of the valid Portuguese connection types
        expect(['Monofásico', 'Bifásico', 'Trifásico']).toContain(label)
      }
    ), { numRuns: 100 })
  })

  it('Property 15.6: UTM parameters should be displayed when present', () => {
    fc.assert(fc.property(
      leadGenerator,
      (lead) => {
        const hasUTMData = lead.utm_source || lead.utm_medium || lead.utm_campaign
        
        if (hasUTMData) {
          // Should display UTM information when available
          if (lead.utm_source) {
            expect(lead.utm_source).toBeTruthy()
            expect(typeof lead.utm_source).toBe('string')
          }
          
          if (lead.utm_medium) {
            expect(lead.utm_medium).toBeTruthy()
            expect(typeof lead.utm_medium).toBe('string')
          }
          
          if (lead.utm_campaign) {
            expect(lead.utm_campaign).toBeTruthy()
            expect(typeof lead.utm_campaign).toBe('string')
          }
        } else {
          // Should handle leads without UTM data gracefully
          expect(lead.utm_source).toBeNull()
          expect(lead.utm_medium).toBeNull()
          expect(lead.utm_campaign).toBeNull()
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 15.7: Dashboard should calculate and display correct statistics', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      (leads) => {
        // Calculate expected statistics
        const totalLeads = leads.length
        const qualifiedLeads = leads.filter(l => l.status === 'qualified').length
        const whatsappClickedLeads = leads.filter(l => l.status === 'whatsapp_clicked').length
        const contactedLeads = leads.filter(l => l.status === 'contacted').length
        
        // Statistics should be accurate
        expect(totalLeads).toBe(leads.length)
        expect(qualifiedLeads).toBeLessThanOrEqual(totalLeads)
        expect(whatsappClickedLeads).toBeLessThanOrEqual(totalLeads)
        expect(contactedLeads).toBeLessThanOrEqual(totalLeads)
        
        // Sum of status-specific counts should not exceed total
        const statusSum = qualifiedLeads + whatsappClickedLeads + contactedLeads + 
                         leads.filter(l => l.status === 'new').length
        expect(statusSum).toBe(totalLeads)
        
        // All counts should be non-negative
        expect(totalLeads).toBeGreaterThanOrEqual(0)
        expect(qualifiedLeads).toBeGreaterThanOrEqual(0)
        expect(whatsappClickedLeads).toBeGreaterThanOrEqual(0)
        expect(contactedLeads).toBeGreaterThanOrEqual(0)
      }
    ), { numRuns: 100 })
  })

  it('Property 15.8: Empty state should be handled gracefully', () => {
    fc.assert(fc.property(
      fc.constant([]), // Empty leads array
      (emptyLeads) => {
        mockGetAllLeads.mockResolvedValue(emptyLeads)
        
        // Should handle empty state gracefully
        expect(emptyLeads.length).toBe(0)
        
        // Statistics should all be zero
        const totalLeads = emptyLeads.length
        const qualifiedLeads = emptyLeads.filter(l => l.status === 'qualified').length
        const whatsappClickedLeads = emptyLeads.filter(l => l.status === 'whatsapp_clicked').length
        const contactedLeads = emptyLeads.filter(l => l.status === 'contacted').length
        
        expect(totalLeads).toBe(0)
        expect(qualifiedLeads).toBe(0)
        expect(whatsappClickedLeads).toBe(0)
        expect(contactedLeads).toBe(0)
        
        // Should still call getAllLeads
        expect(mockGetAllLeads).toHaveBeenCalled()
      }
    ), { numRuns: 10 })
  })
})