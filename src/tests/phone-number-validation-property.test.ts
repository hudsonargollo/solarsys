/**
 * Property-Based Test for Phone Number Validation
 * **Feature: solar-lead-platform, Property 21: Phone number validation**
 * **Validates: Requirements 7.5**
 */

import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Phone Number Validation Properties', () => {
  // Brazilian DDD (area codes) - valid codes
  const validDDDs = [
    '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
    '21', '22', '24',                                     // Rio de Janeiro
    '27', '28',                                           // Espírito Santo
    '31', '32', '33', '34', '35', '37', '38',            // Minas Gerais
    '41', '42', '43', '44', '45', '46',                  // Paraná
    '47', '48', '49',                                     // Santa Catarina
    '51', '53', '54', '55',                              // Rio Grande do Sul
    '61',                                                 // Distrito Federal
    '62', '64',                                           // Goiás
    '63',                                                 // Tocantins
    '65', '66',                                           // Mato Grosso
    '67',                                                 // Mato Grosso do Sul
    '68',                                                 // Acre
    '69',                                                 // Rondônia
    '71', '73', '74', '75', '77',                        // Bahia
    '79',                                                 // Sergipe
    '81', '87',                                           // Pernambuco
    '82',                                                 // Alagoas
    '83',                                                 // Paraíba
    '84',                                                 // Rio Grande do Norte
    '85', '88',                                           // Ceará
    '86', '89',                                           // Piauí
    '91', '93', '94',                                     // Pará
    '92', '97',                                           // Amazonas
    '95',                                                 // Roraima
    '96',                                                 // Amapá
    '98', '99'                                            // Maranhão
  ]

  // Phone number validation function
  const validateBrazilianPhone = (phone: string): boolean => {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')
    
    // Must have 10 or 11 digits (DDD + number)
    if (digits.length !== 10 && digits.length !== 11) {
      return false
    }
    
    // Extract DDD (first 2 digits)
    const ddd = digits.substring(0, 2)
    
    // DDD must be valid
    if (!validDDDs.includes(ddd)) {
      return false
    }
    
    // For 11 digits, first digit after DDD must be 9 (mobile)
    if (digits.length === 11) {
      const firstDigitAfterDDD = digits.charAt(2)
      if (firstDigitAfterDDD !== '9') {
        return false
      }
    }
    
    // For 10 digits, first digit after DDD must be 2-5 (landline) or 7-8
    if (digits.length === 10) {
      const firstDigitAfterDDD = digits.charAt(2)
      if (!['2', '3', '4', '5', '7', '8'].includes(firstDigitAfterDDD)) {
        return false
      }
    }
    
    return true
  }

  // Phone number formatting function
  const formatBrazilianPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '')
    
    if (digits.length === 10) {
      // Format as (XX) XXXX-XXXX
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`
    } else if (digits.length === 11) {
      // Format as (XX) XXXXX-XXXX
      return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`
    }
    
    return phone // Return as-is if invalid length
  }

  // Generator for valid Brazilian DDDs
  const validDDDGenerator = fc.constantFrom(...validDDDs)

  // Generator for invalid DDDs
  const invalidDDDGenerator = fc.string({ minLength: 2, maxLength: 2 })
    .filter(ddd => /^\d{2}$/.test(ddd) && !validDDDs.includes(ddd))

  // Generator for valid mobile numbers (11 digits)
  const validMobileGenerator = fc.tuple(
    validDDDGenerator,
    fc.constantFrom('9'),
    fc.string({ minLength: 8, maxLength: 8 }).filter(s => /^\d{8}$/.test(s))
  ).map(([ddd, nine, number]) => ddd + nine + number)

  // Generator for valid landline numbers (10 digits)
  const validLandlineGenerator = fc.tuple(
    validDDDGenerator,
    fc.constantFrom('2', '3', '4', '5', '7', '8'),
    fc.string({ minLength: 7, maxLength: 7 }).filter(s => /^\d{7}$/.test(s))
  ).map(([ddd, firstDigit, number]) => ddd + firstDigit + number)

  // Generator for valid phone numbers (both mobile and landline)
  const validPhoneGenerator = fc.oneof(validMobileGenerator, validLandlineGenerator)

  it('Property 21.1: Valid Brazilian mobile numbers should be accepted', () => {
    fc.assert(fc.property(
      validMobileGenerator,
      (mobileNumber) => {
        expect(validateBrazilianPhone(mobileNumber)).toBe(true)
        
        // Should be 11 digits
        expect(mobileNumber.length).toBe(11)
        
        // Should start with valid DDD
        const ddd = mobileNumber.substring(0, 2)
        expect(validDDDs).toContain(ddd)
        
        // Third digit should be 9 (mobile indicator)
        expect(mobileNumber.charAt(2)).toBe('9')
        
        // Should be all digits
        expect(mobileNumber).toMatch(/^\d{11}$/)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.2: Valid Brazilian landline numbers should be accepted', () => {
    fc.assert(fc.property(
      validLandlineGenerator,
      (landlineNumber) => {
        expect(validateBrazilianPhone(landlineNumber)).toBe(true)
        
        // Should be 10 digits
        expect(landlineNumber.length).toBe(10)
        
        // Should start with valid DDD
        const ddd = landlineNumber.substring(0, 2)
        expect(validDDDs).toContain(ddd)
        
        // Third digit should be valid for landline
        const thirdDigit = landlineNumber.charAt(2)
        expect(['2', '3', '4', '5', '7', '8']).toContain(thirdDigit)
        
        // Should be all digits
        expect(landlineNumber).toMatch(/^\d{10}$/)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.3: Invalid DDD codes should be rejected', () => {
    fc.assert(fc.property(
      invalidDDDGenerator,
      fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d+$/.test(s)),
      (invalidDDD, restOfNumber) => {
        const invalidPhone = invalidDDD + restOfNumber
        
        if (invalidPhone.length === 10 || invalidPhone.length === 11) {
          expect(validateBrazilianPhone(invalidPhone)).toBe(false)
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 21.4: Phone numbers with incorrect length should be rejected', () => {
    fc.assert(fc.property(
      fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^\d+$/.test(s) && s.length !== 10 && s.length !== 11),
      (invalidLengthPhone) => {
        expect(validateBrazilianPhone(invalidLengthPhone)).toBe(false)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.5: Phone number formatting should preserve digits and add correct separators', () => {
    fc.assert(fc.property(
      validPhoneGenerator,
      (validPhone) => {
        const formatted = formatBrazilianPhone(validPhone)
        
        // Should contain parentheses and dash
        expect(formatted).toMatch(/^\(\d{2}\) \d{4,5}-\d{4}$/)
        
        // Should preserve all digits
        const originalDigits = validPhone.replace(/\D/g, '')
        const formattedDigits = formatted.replace(/\D/g, '')
        expect(formattedDigits).toBe(originalDigits)
        
        // Should format correctly based on length
        if (validPhone.length === 10) {
          expect(formatted).toMatch(/^\(\d{2}\) \d{4}-\d{4}$/)
        } else if (validPhone.length === 11) {
          expect(formatted).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/)
        }
      }
    ), { numRuns: 100 })
  })

  it('Property 21.6: Phone number formatting should handle various input formats', () => {
    fc.assert(fc.property(
      validPhoneGenerator,
      fc.constantFrom(
        (phone: string) => phone, // No formatting
        (phone: string) => `(${phone.substring(0, 2)}) ${phone.substring(2)}`, // Partial formatting
        (phone: string) => phone.split('').join('-'), // Dashes between digits
        (phone: string) => phone.split('').join(' '), // Spaces between digits
        (phone: string) => `+55 ${phone}`, // Country code
        (phone: string) => phone.replace(/(\d{2})(\d)/, '($1) $2') // Partial parentheses
      ),
      (validPhone, formatter) => {
        const inputFormat = formatter(validPhone)
        const formatted = formatBrazilianPhone(inputFormat)
        
        // Should always produce consistent output format
        expect(formatted).toMatch(/^\(\d{2}\) \d{4,5}-\d{4}$/)
        
        // Should preserve the original digits
        const originalDigits = validPhone.replace(/\D/g, '')
        const formattedDigits = formatted.replace(/\D/g, '')
        expect(formattedDigits).toBe(originalDigits)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.7: Mobile numbers should have 9 as third digit', () => {
    fc.assert(fc.property(
      validDDDGenerator,
      fc.string({ minLength: 8, maxLength: 8 }).filter(s => /^\d{8}$/.test(s)),
      fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8'), // Invalid third digits for mobile
      (ddd, number, invalidThirdDigit) => {
        const invalidMobile = ddd + invalidThirdDigit + number
        
        // 11-digit numbers with third digit != 9 should be invalid
        expect(validateBrazilianPhone(invalidMobile)).toBe(false)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.8: Landline numbers should have valid third digit', () => {
    fc.assert(fc.property(
      validDDDGenerator,
      fc.string({ minLength: 7, maxLength: 7 }).filter(s => /^\d{7}$/.test(s)),
      fc.constantFrom('0', '1', '6', '9'), // Invalid third digits for landline
      (ddd, number, invalidThirdDigit) => {
        const invalidLandline = ddd + invalidThirdDigit + number
        
        // 10-digit numbers with invalid third digit should be invalid
        expect(validateBrazilianPhone(invalidLandline)).toBe(false)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.9: Phone validation should handle non-numeric characters', () => {
    fc.assert(fc.property(
      validPhoneGenerator,
      fc.array(fc.constantFrom('(', ')', '-', ' ', '.', '+'), { minLength: 1, maxLength: 5 }),
      (validPhone, nonNumericChars) => {
        // Insert non-numeric characters at random positions
        let phoneWithChars = validPhone
        nonNumericChars.forEach(char => {
          const pos = Math.floor(Math.random() * phoneWithChars.length)
          phoneWithChars = phoneWithChars.slice(0, pos) + char + phoneWithChars.slice(pos)
        })
        
        // Should still validate correctly (ignoring non-numeric chars)
        expect(validateBrazilianPhone(phoneWithChars)).toBe(true)
        
        // Formatting should still work
        const formatted = formatBrazilianPhone(phoneWithChars)
        expect(formatted).toMatch(/^\(\d{2}\) \d{4,5}-\d{4}$/)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.10: Phone validation should be consistent across multiple calls', () => {
    fc.assert(fc.property(
      fc.oneof(validPhoneGenerator, fc.string({ minLength: 5, maxLength: 15 })),
      (phone) => {
        const result1 = validateBrazilianPhone(phone)
        const result2 = validateBrazilianPhone(phone)
        const result3 = validateBrazilianPhone(phone)
        
        // Multiple calls should return the same result
        expect(result1).toBe(result2)
        expect(result2).toBe(result3)
        
        // Formatting should also be consistent
        const formatted1 = formatBrazilianPhone(phone)
        const formatted2 = formatBrazilianPhone(phone)
        expect(formatted1).toBe(formatted2)
      }
    ), { numRuns: 100 })
  })

  it('Property 21.11: Common Brazilian phone patterns should be handled correctly', () => {
    fc.assert(fc.property(
      fc.constantFrom(
        '11999887766',  // São Paulo mobile
        '1133334444',   // São Paulo landline
        '21987654321',  // Rio mobile
        '2133445566',   // Rio landline
        '85988776655',  // Ceará mobile
        '8533224411',   // Ceará landline
        '47999888777',  // Santa Catarina mobile
        '4733556677'    // Santa Catarina landline
      ),
      (commonPhone) => {
        expect(validateBrazilianPhone(commonPhone)).toBe(true)
        
        const formatted = formatBrazilianPhone(commonPhone)
        
        if (commonPhone.length === 11) {
          expect(formatted).toMatch(/^\(\d{2}\) 9\d{4}-\d{4}$/)
        } else {
          expect(formatted).toMatch(/^\(\d{2}\) [2-58]\d{3}-\d{4}$/)
        }
      }
    ), { numRuns: 100 })
  })
})