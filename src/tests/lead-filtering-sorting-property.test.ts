/**
 * Property-Based Test for Lead Filtering and Sorting
 * **Feature: solar-lead-platform, Property 16: Lead filtering and sorting**
 * **Validates: Requirements 6.3**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { Lead } from '../lib/supabase'

describe('Lead Filtering and Sorting Properties', () => {
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
  const leadsArrayGenerator = fc.array(leadGenerator, { minLength: 1, maxLength: 50 })

  // Filtering function implementation
  const filterLeadsByStatus = (leads: Lead[], statusFilter: string): Lead[] => {
    if (statusFilter === 'all') return leads
    return leads.filter(lead => lead.status === statusFilter)
  }

  const filterLeadsBySearch = (leads: Lead[], searchTerm: string): Lead[] => {
    if (!searchTerm) return leads
    const term = searchTerm.toLowerCase()
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term) ||
      lead.city.toLowerCase().includes(term) ||
      lead.whatsapp.includes(term)
    )
  }

  // Sorting function implementation
  const sortLeads = (leads: Lead[], sortField: keyof Lead, sortDirection: 'asc' | 'desc'): Lead[] => {
    return [...leads].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      let comparison = 0
      if (aValue < bValue) comparison = -1
      if (aValue > bValue) comparison = 1
      
      return sortDirection === 'desc' ? -comparison : comparison
    })
  }

  it('Property 16.1: Status filtering should return only leads with matching status', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('all', 'new', 'qualified', 'whatsapp_clicked', 'contacted'),
      (leads, statusFilter) => {
        const filtered = filterLeadsByStatus(leads, statusFilter)
        
        if (statusFilter === 'all') {
          // Should return all leads when filter is 'all'
          expect(filtered.length).toBe(leads.length)
          expect(filtered).toEqual(leads)
        } else {
          // Should return only leads with matching status
          filtered.forEach(lead => {
            expect(lead.status).toBe(statusFilter)
          })
          
          // Should not include leads with different status
          const expectedCount = leads.filter(lead => lead.status === statusFilter).length
          expect(filtered.length).toBe(expectedCount)
        }
        
        // Filtered results should be a subset of original leads
        expect(filtered.length).toBeLessThanOrEqual(leads.length)
      }
    ), { numRuns: 100 })
  })

  it('Property 16.2: Search filtering should match name, email, city, or phone', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.string({ minLength: 1, maxLength: 20 }),
      (leads, searchTerm) => {
        const filtered = filterLeadsBySearch(leads, searchTerm)
        
        // All filtered results should match the search term
        filtered.forEach(lead => {
          const term = searchTerm.toLowerCase()
          const matchesName = lead.name.toLowerCase().includes(term)
          const matchesEmail = lead.email?.toLowerCase().includes(term) || false
          const matchesCity = lead.city.toLowerCase().includes(term)
          const matchesPhone = lead.whatsapp.includes(term)
          
          const hasMatch = matchesName || matchesEmail || matchesCity || matchesPhone
          expect(hasMatch).toBe(true)
        })
        
        // Should not include leads that don't match
        const nonMatching = leads.filter(lead => {
          const term = searchTerm.toLowerCase()
          const matchesName = lead.name.toLowerCase().includes(term)
          const matchesEmail = lead.email?.toLowerCase().includes(term) || false
          const matchesCity = lead.city.toLowerCase().includes(term)
          const matchesPhone = lead.whatsapp.includes(term)
          
          return !(matchesName || matchesEmail || matchesCity || matchesPhone)
        })
        
        // Filtered + non-matching should equal original count
        expect(filtered.length + nonMatching.length).toBe(leads.length)
        
        // Filtered results should be a subset of original leads
        expect(filtered.length).toBeLessThanOrEqual(leads.length)
      }
    ), { numRuns: 100 })
  })

  it('Property 16.3: Empty search term should return all leads', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('', '   ', '\t', '\n'),
      (leads, emptyTerm) => {
        const filtered = filterLeadsBySearch(leads, emptyTerm.trim())
        
        // Empty search should return all leads
        expect(filtered.length).toBe(leads.length)
        expect(filtered).toEqual(leads)
      }
    ), { numRuns: 100 })
  })

  it('Property 16.4: Sorting by creation date should maintain chronological order', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, direction) => {
        const sorted = sortLeads(leads, 'created_at', direction)
        
        // Should maintain the same number of leads
        expect(sorted.length).toBe(leads.length)
        
        // Should be in correct chronological order
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = new Date(sorted[i].created_at).getTime()
          const next = new Date(sorted[i + 1].created_at).getTime()
          
          if (direction === 'asc') {
            expect(current).toBeLessThanOrEqual(next)
          } else {
            expect(current).toBeGreaterThanOrEqual(next)
          }
        }
        
        // Should contain all original leads
        leads.forEach(originalLead => {
          expect(sorted.some(sortedLead => sortedLead.id === originalLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 16.5: Sorting by bill value should maintain numerical order', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, direction) => {
        const sorted = sortLeads(leads, 'bill_value', direction)
        
        // Should maintain the same number of leads
        expect(sorted.length).toBe(leads.length)
        
        // Should be in correct numerical order
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i].bill_value
          const next = sorted[i + 1].bill_value
          
          if (direction === 'asc') {
            expect(current).toBeLessThanOrEqual(next)
          } else {
            expect(current).toBeGreaterThanOrEqual(next)
          }
        }
        
        // Should contain all original leads
        leads.forEach(originalLead => {
          expect(sorted.some(sortedLead => sortedLead.id === originalLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 16.6: Sorting by name should maintain alphabetical order', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, direction) => {
        const sorted = sortLeads(leads, 'name', direction)
        
        // Should maintain the same number of leads
        expect(sorted.length).toBe(leads.length)
        
        // Should be in correct alphabetical order
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i].name.toLowerCase()
          const next = sorted[i + 1].name.toLowerCase()
          
          if (direction === 'asc') {
            expect(current.localeCompare(next)).toBeLessThanOrEqual(0)
          } else {
            expect(current.localeCompare(next)).toBeGreaterThanOrEqual(0)
          }
        }
        
        // Should contain all original leads
        leads.forEach(originalLead => {
          expect(sorted.some(sortedLead => sortedLead.id === originalLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 16.7: Sorting by status should group leads by status', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, direction) => {
        const sorted = sortLeads(leads, 'status', direction)
        
        // Should maintain the same number of leads
        expect(sorted.length).toBe(leads.length)
        
        // Should be in correct status order
        const statusOrder = ['contacted', 'new', 'qualified', 'whatsapp_clicked']
        
        for (let i = 0; i < sorted.length - 1; i++) {
          const currentIndex = statusOrder.indexOf(sorted[i].status)
          const nextIndex = statusOrder.indexOf(sorted[i + 1].status)
          
          if (direction === 'asc') {
            expect(currentIndex).toBeLessThanOrEqual(nextIndex)
          } else {
            expect(currentIndex).toBeGreaterThanOrEqual(nextIndex)
          }
        }
        
        // Should contain all original leads
        leads.forEach(originalLead => {
          expect(sorted.some(sortedLead => sortedLead.id === originalLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 16.8: Combined filtering and sorting should work correctly', () => {
    fc.assert(fc.property(
      leadsArrayGenerator,
      fc.constantFrom('all', 'new', 'qualified', 'whatsapp_clicked', 'contacted'),
      fc.string({ minLength: 0, maxLength: 10 }),
      fc.constantFrom('created_at', 'name', 'bill_value', 'status') as fc.Arbitrary<keyof Lead>,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, statusFilter, searchTerm, sortField, sortDirection) => {
        // Apply filters first, then sorting
        let filtered = filterLeadsByStatus(leads, statusFilter)
        filtered = filterLeadsBySearch(filtered, searchTerm)
        const sorted = sortLeads(filtered, sortField, sortDirection)
        
        // Result should be properly filtered
        if (statusFilter !== 'all') {
          sorted.forEach(lead => {
            expect(lead.status).toBe(statusFilter)
          })
        }
        
        if (searchTerm.trim()) {
          sorted.forEach(lead => {
            const term = searchTerm.toLowerCase()
            const matchesName = lead.name.toLowerCase().includes(term)
            const matchesEmail = lead.email?.toLowerCase().includes(term) || false
            const matchesCity = lead.city.toLowerCase().includes(term)
            const matchesPhone = lead.whatsapp.includes(term)
            
            const hasMatch = matchesName || matchesEmail || matchesCity || matchesPhone
            expect(hasMatch).toBe(true)
          })
        }
        
        // Result should be properly sorted
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i][sortField]
          const next = sorted[i + 1][sortField]
          
          if (current !== null && current !== undefined && 
              next !== null && next !== undefined) {
            if (sortDirection === 'asc') {
              expect(current <= next).toBe(true)
            } else {
              expect(current >= next).toBe(true)
            }
          }
        }
        
        // Result should be a subset of original leads
        expect(sorted.length).toBeLessThanOrEqual(leads.length)
        
        // All results should exist in original leads
        sorted.forEach(resultLead => {
          expect(leads.some(originalLead => originalLead.id === resultLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })

  it('Property 16.9: Sorting should handle null values correctly', () => {
    fc.assert(fc.property(
      fc.array(fc.record({
        ...leadGenerator.constraints,
        system_size_kwp: fc.option(fc.float({ min: 1, max: 50 }), { nil: null }),
        est_savings: fc.option(fc.float({ min: 100, max: 10000 }), { nil: null })
      }), { minLength: 1, maxLength: 20 }),
      fc.constantFrom('system_size_kwp', 'est_savings') as fc.Arbitrary<keyof Lead>,
      fc.constantFrom('asc', 'desc') as fc.Arbitrary<'asc' | 'desc'>,
      (leads, sortField, direction) => {
        const sorted = sortLeads(leads, sortField, direction)
        
        // Should maintain the same number of leads
        expect(sorted.length).toBe(leads.length)
        
        // Null values should be handled consistently (moved to end)
        const nullCount = leads.filter(lead => lead[sortField] === null).length
        const nonNullCount = leads.length - nullCount
        
        if (nullCount > 0) {
          // Non-null values should come first, nulls at the end
          for (let i = 0; i < nonNullCount; i++) {
            expect(sorted[i][sortField]).not.toBeNull()
          }
          
          for (let i = nonNullCount; i < sorted.length; i++) {
            expect(sorted[i][sortField]).toBeNull()
          }
        }
        
        // Should contain all original leads
        leads.forEach(originalLead => {
          expect(sorted.some(sortedLead => sortedLead.id === originalLead.id)).toBe(true)
        })
      }
    ), { numRuns: 100 })
  })
})