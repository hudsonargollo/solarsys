/**
 * Property-Based Test for UTM Parameter Tracking
 * **Feature: solar-lead-platform, Property 17: UTM parameter tracking**
 * **Validates: Requirements 6.4**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fc from 'fast-check'
import { 
  extractUTMFromURL, 
  hasUTMParameters, 
  storeUTMParameters, 
  getStoredUTMParameters, 
  clearUTMParameters,
  initializeUTMTracking,
  getCurrentUTMParameters,
  formatUTMForDisplay,
  UTMParameters 
} from '../lib/utm'

describe('UTM Parameter Tracking Properties', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    clearUTMParameters()
  })

  afterEach(() => {
    // Clean up after each test
    clearUTMParameters()
  })

  // Generator for valid UTM parameter names
  const utmParamName = fc.constantFrom('utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content')
  
  // Generator for valid UTM parameter values (non-empty strings)
  const utmParamValue = fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0)
  
  // Generator for UTM parameters object
  const utmParameters = fc.record({
    utm_source: fc.option(utmParamValue, { nil: null }),
    utm_medium: fc.option(utmParamValue, { nil: null }),
    utm_campaign: fc.option(utmParamValue, { nil: null }),
    utm_term: fc.option(utmParamValue, { nil: null }),
    utm_content: fc.option(utmParamValue, { nil: null }),
  })

  // Generator for URL search params with UTM parameters
  const urlWithUTMParams = fc.tuple(
    fc.array(fc.tuple(utmParamName, utmParamValue), { minLength: 1, maxLength: 5 }),
    fc.array(fc.tuple(fc.string({ minLength: 1, maxLength: 20 }), fc.string({ minLength: 1, maxLength: 20 })), { maxLength: 3 })
  ).map(([utmPairs, otherPairs]) => {
    const params = new URLSearchParams()
    
    // Add UTM parameters
    utmPairs.forEach(([key, value]) => {
      params.set(key, value)
    })
    
    // Add some non-UTM parameters
    otherPairs.forEach(([key, value]) => {
      if (!key.startsWith('utm_')) {
        params.set(key, value)
      }
    })
    
    return params
  })

  it('Property 17.1: UTM parameters extracted from URL should be preserved when stored and retrieved', () => {
    fc.assert(fc.property(urlWithUTMParams, (searchParams) => {
      // Extract UTM parameters from URL
      const extracted = extractUTMFromURL(searchParams)
      
      // Store the parameters
      storeUTMParameters(extracted)
      
      // Retrieve the parameters
      const retrieved = getStoredUTMParameters()
      
      // All non-null UTM parameters should be preserved
      Object.keys(extracted).forEach(key => {
        if (extracted[key as keyof UTMParameters] !== null) {
          expect(retrieved[key as keyof UTMParameters]).toBe(extracted[key as keyof UTMParameters])
        }
      })
    }), { numRuns: 100 })
  })

  it('Property 17.2: hasUTMParameters should return true if and only if at least one UTM parameter is non-null and non-empty', () => {
    fc.assert(fc.property(utmParameters, (params) => {
      const hasParams = hasUTMParameters(params)
      const actuallyHasParams = Object.values(params).some(value => 
        value !== null && value !== undefined && value !== ''
      )
      
      expect(hasParams).toBe(actuallyHasParams)
    }), { numRuns: 100 })
  })

  it('Property 17.3: formatUTMForDisplay should only include non-null, non-undefined, non-empty values', () => {
    fc.assert(fc.property(utmParameters, (params) => {
      const formatted = formatUTMForDisplay(params)
      
      // All values in formatted should be non-null, non-undefined, non-empty strings
      Object.values(formatted).forEach(value => {
        expect(typeof value).toBe('string')
        expect(value).not.toBe('')
        expect(value).not.toBe(null)
        expect(value).not.toBe(undefined)
      })
      
      // All non-null, non-undefined, non-empty values from params should be in formatted
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          expect(formatted[key]).toBe(value)
        } else {
          expect(formatted[key]).toBeUndefined()
        }
      })
    }), { numRuns: 100 })
  })

  it('Property 17.4: getCurrentUTMParameters should return stored parameters consistently', () => {
    fc.assert(fc.property(utmParameters, (params) => {
      // Only store if there are actual parameters
      if (hasUTMParameters(params)) {
        storeUTMParameters(params)
        
        const current = getCurrentUTMParameters()
        const stored = getStoredUTMParameters()
        
        // getCurrentUTMParameters should return the same as getStoredUTMParameters
        expect(current).toEqual(stored)
      }
    }), { numRuns: 100 })
  })

  it('Property 17.5: initializeUTMTracking should prioritize URL parameters over stored parameters', () => {
    fc.assert(fc.property(
      utmParameters.filter(params => hasUTMParameters(params)),
      utmParameters.filter(params => hasUTMParameters(params)),
      (storedParams, urlParams) => {
        // First store some parameters
        storeUTMParameters(storedParams)
        
        // Mock window.location.search with new UTM parameters
        const searchParams = new URLSearchParams()
        Object.entries(urlParams).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            searchParams.set(key, value)
          }
        })
        
        // Mock window.location.search
        const originalLocation = window.location
        delete (window as any).location
        window.location = { ...originalLocation, search: `?${searchParams.toString()}` }
        
        try {
          const initialized = initializeUTMTracking()
          
          // Should return the URL parameters, not the stored ones
          Object.entries(urlParams).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              expect(initialized[key as keyof UTMParameters]).toBe(value)
            }
          })
        } finally {
          // Restore original location
          window.location = originalLocation
        }
      }
    ), { numRuns: 50 })
  })

  it('Property 17.6: Clearing UTM parameters should result in empty parameters', () => {
    fc.assert(fc.property(utmParameters, (params) => {
      // Store some parameters
      if (hasUTMParameters(params)) {
        storeUTMParameters(params)
        
        // Verify they are stored
        const stored = getStoredUTMParameters()
        expect(hasUTMParameters(stored)).toBe(true)
        
        // Clear them
        clearUTMParameters()
        
        // Verify they are cleared
        const cleared = getStoredUTMParameters()
        expect(hasUTMParameters(cleared)).toBe(false)
      }
    }), { numRuns: 100 })
  })

  it('Property 17.7: UTM parameters should persist across page navigation within the same session', () => {
    fc.assert(fc.property(utmParameters.filter(params => hasUTMParameters(params)), (params) => {
      // Store UTM parameters (simulating initial page load with UTM params)
      storeUTMParameters(params)
      
      // Simulate navigation to different pages by calling getCurrentUTMParameters multiple times
      const firstCall = getCurrentUTMParameters()
      const secondCall = getCurrentUTMParameters()
      const thirdCall = getCurrentUTMParameters()
      
      // All calls should return the same parameters
      expect(firstCall).toEqual(params)
      expect(secondCall).toEqual(params)
      expect(thirdCall).toEqual(params)
      expect(firstCall).toEqual(secondCall)
      expect(secondCall).toEqual(thirdCall)
    }), { numRuns: 100 })
  })
})