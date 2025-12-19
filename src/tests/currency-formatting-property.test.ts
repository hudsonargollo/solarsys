/**
 * Property-Based Test for Currency Formatting
 * **Feature: solar-lead-platform, Property 20: Currency formatting**
 * **Validates: Requirements 7.4**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Currency Formatting Properties', () => {
  // Brazilian currency formatter
  const formatBrazilianCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  // Generator for valid currency amounts
  const currencyAmountGenerator = fc.float({ 
    min: 0.01, 
    max: 999999.99,
    noDefaultInfinity: true,
    noNaN: true
  })

  // Generator for bill values (specific to solar context)
  const billValueGenerator = fc.float({
    min: 30,    // Minimum electricity bill in Brazil
    max: 50000, // Maximum reasonable residential bill
    noDefaultInfinity: true,
    noNaN: true
  })

  it('Property 20.1: Currency formatting should use Brazilian Real (R$) symbol', () => {
    fc.assert(fc.property(
      currencyAmountGenerator,
      (amount) => {
        const formatted = formatBrazilianCurrency(amount)
        
        // Should start with R$ symbol
        expect(formatted).toMatch(/^R\$/)
        
        // Should contain the R$ symbol
        expect(formatted).toContain('R$')
        
        // Should be a valid string
        expect(typeof formatted).toBe('string')
        expect(formatted.length).toBeGreaterThan(2) // At least "R$X"
      }
    ), { numRuns: 100 })
  })

  it('Property 20.2: Currency formatting should use comma as decimal separator', () => {
    fc.assert(fc.property(
      fc.float({ min: 0.01, max: 999.99, noDefaultInfinity: true, noNaN: true }),
      (amount) => {
        const formatted = formatBrazilianCurrency(amount)
        
        // Should use comma as decimal separator for Brazilian locale
        if (amount % 1 !== 0) { // Has decimal places
          expect(formatted).toMatch(/,\d{2}$/) // Should end with comma and 2 digits
        }
        
        // Should not use period as decimal separator in final output
        // (Note: thousands separator might use period)
        const decimalPart = formatted.split(',')[1]
        if (decimalPart) {
          expect(decimalPart).toMatch(/^\d{2}$/) // Exactly 2 decimal digits
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 20.3: Currency formatting should use period as thousands separator', () => {
    fc.assert(fc.property(
      fc.float({ min: 1000, max: 999999, noDefaultInfinity: true, noNaN: true }),
      (amount) => {
        const formatted = formatBrazilianCurrency(amount)
        
        // For amounts >= 1000, should use period as thousands separator
        if (amount >= 1000) {
          // Should contain period for thousands separation
          const beforeDecimal = formatted.split(',')[0] // Get part before decimal comma
          
          if (amount >= 1000) {
            expect(beforeDecimal).toMatch(/\d{1,3}(\.\d{3})+/) // Pattern: 1-3 digits, then groups of 3
          }
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 20.4: Currency formatting should always show exactly 2 decimal places', () => {
    fc.assert(fc.property(
      currencyAmountGenerator,
      (amount) => {
        const formatted = formatBrazilianCurrency(amount)
        
        // Should always end with comma followed by exactly 2 digits
        expect(formatted).toMatch(/,\d{2}$/)
        
        // Extract decimal part
        const parts = formatted.split(',')
        expect(parts.length).toBe(2) // Should have exactly one comma
        
        const decimalPart = parts[1]
        expect(decimalPart.length).toBe(2) // Exactly 2 decimal digits
        expect(decimalPart).toMatch(/^\d{2}$/) // Only digits
      }
    ), { numRuns: 100 })
  })

  it('Property 20.5: Currency formatting should handle bill values correctly', () => {
    fc.assert(fc.property(
      billValueGenerator,
      (billValue) => {
        const formatted = formatBrazilianCurrency(billValue)
        
        // Should format bill values appropriately
        expect(formatted).toMatch(/^R\$\s*[\d.,]+$/)
        
        // Should handle common bill ranges
        if (billValue < 100) {
          // Small bills: R$ XX,XX
          expect(formatted).toMatch(/^R\$\s*\d{1,2},\d{2}$/)
        } else if (billValue < 1000) {
          // Medium bills: R$ XXX,XX
          expect(formatted).toMatch(/^R\$\s*\d{3},\d{2}$/)
        } else {
          // Large bills: R$ X.XXX,XX or R$ XX.XXX,XX etc.
          expect(formatted).toMatch(/^R\$\s*\d{1,3}(\.\d{3})*,\d{2}$/)
        }
        
        // Should be parseable back to a number (approximately)
        const numericPart = formatted.replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.')
        const parsedValue = parseFloat(numericPart)
        expect(Math.abs(parsedValue - billValue)).toBeLessThan(0.01) // Allow for floating point precision
      }
    ), { numRuns: 100 })
  })

  it('Property 20.6: Currency formatting should be consistent across multiple calls', () => {
    fc.assert(fc.property(
      currencyAmountGenerator,
      (amount) => {
        const formatted1 = formatBrazilianCurrency(amount)
        const formatted2 = formatBrazilianCurrency(amount)
        const formatted3 = formatBrazilianCurrency(amount)
        
        // Multiple calls with same input should produce identical output
        expect(formatted1).toBe(formatted2)
        expect(formatted2).toBe(formatted3)
        expect(formatted1).toBe(formatted3)
      }
    ), { numRuns: 100 })
  })

  it('Property 20.7: Currency formatting should handle edge cases correctly', () => {
    fc.assert(fc.property(
      fc.constantFrom(0.01, 0.99, 1.00, 9.99, 10.00, 99.99, 100.00, 999.99, 1000.00, 9999.99),
      (edgeAmount) => {
        const formatted = formatBrazilianCurrency(edgeAmount)
        
        // Should handle edge cases properly
        expect(formatted).toMatch(/^R\$\s*[\d.,]+,\d{2}$/)
        
        // Specific edge case validations
        if (edgeAmount === 0.01) {
          expect(formatted).toMatch(/^R\$\s*0,01$/)
        } else if (edgeAmount === 1.00) {
          expect(formatted).toMatch(/^R\$\s*1,00$/)
        } else if (edgeAmount === 1000.00) {
          expect(formatted).toMatch(/^R\$\s*1\.000,00$/)
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 20.8: Currency formatting should maintain precision', () => {
    fc.assert(fc.property(
      fc.float({ min: 0.01, max: 9999.99, noDefaultInfinity: true, noNaN: true }),
      (amount) => {
        const formatted = formatBrazilianCurrency(amount)
        
        // Extract numeric value from formatted string
        const numericString = formatted
          .replace(/^R\$\s*/, '')  // Remove currency symbol
          .replace(/\./g, '')      // Remove thousands separators
          .replace(',', '.')       // Convert decimal separator
        
        const extractedValue = parseFloat(numericString)
        
        // Should maintain precision within floating point limits
        expect(Math.abs(extractedValue - amount)).toBeLessThan(0.01)
        
        // Should round to 2 decimal places
        const roundedOriginal = Math.round(amount * 100) / 100
        expect(Math.abs(extractedValue - roundedOriginal)).toBeLessThan(0.001)
      }
    ), { numRuns: 100 })
  })

  it('Property 20.9: Currency formatting should handle savings calculations', () => {
    fc.assert(fc.property(
      fc.tuple(billValueGenerator, fc.float({ min: 0.1, max: 0.9 })),
      ([billValue, savingsPercentage]) => {
        const monthlySavings = billValue * savingsPercentage
        const annualSavings = monthlySavings * 12
        
        const monthlyFormatted = formatBrazilianCurrency(monthlySavings)
        const annualFormatted = formatBrazilianCurrency(annualSavings)
        
        // Both should be valid currency formats
        expect(monthlyFormatted).toMatch(/^R\$\s*[\d.,]+,\d{2}$/)
        expect(annualFormatted).toMatch(/^R\$\s*[\d.,]+,\d{2}$/)
        
        // Annual should be larger than monthly (when both > 0)
        if (monthlySavings > 0) {
          const monthlyValue = parseFloat(monthlyFormatted.replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.'))
          const annualValue = parseFloat(annualFormatted.replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.'))
          
          expect(annualValue).toBeGreaterThan(monthlyValue)
          expect(Math.abs(annualValue - (monthlyValue * 12))).toBeLessThan(0.12) // Allow for rounding
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 20.10: Currency formatting should work with system size calculations', () => {
    fc.assert(fc.property(
      fc.tuple(
        billValueGenerator,
        fc.float({ min: 1, max: 50 }), // System size in kWp
        fc.float({ min: 4, max: 6 })   // HSP value
      ),
      ([billValue, systemSize, hsp]) => {
        // Calculate estimated system cost (rough estimate: R$ 4000-6000 per kWp)
        const costPerKwp = 5000
        const systemCost = systemSize * costPerKwp
        
        const billFormatted = formatBrazilianCurrency(billValue)
        const costFormatted = formatBrazilianCurrency(systemCost)
        
        // Both should be valid currency formats
        expect(billFormatted).toMatch(/^R\$\s*[\d.,]+,\d{2}$/)
        expect(costFormatted).toMatch(/^R\$\s*[\d.,]+,\d{2}$/)
        
        // System cost should typically be much larger than monthly bill
        const billNumeric = parseFloat(billFormatted.replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.'))
        const costNumeric = parseFloat(costFormatted.replace(/^R\$\s*/, '').replace(/\./g, '').replace(',', '.'))
        
        expect(costNumeric).toBeGreaterThan(billNumeric)
        expect(costNumeric).toBeGreaterThan(1000) // Minimum reasonable system cost
      }
    ), { numRuns: 100 })
  })
})