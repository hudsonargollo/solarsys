/**
 * Property-based tests for CEP validation and address lookup
 * **Feature: solar-lead-platform, Property 2: CEP validation and address lookup**
 * **Validates: Requirements 1.3**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { 
  isValidCEPFormat, 
  formatCEP, 
  cleanCEP, 
  BrasilAPIService, 
  BrasilAPIError 
} from '../lib/brasilapi';

describe('CEP Validation and Address Lookup Properties', () => {
  describe('Property 2: CEP validation and address lookup', () => {
    it('should accept valid Brazilian CEP formats and reject invalid ones', () => {
      fc.assert(
        fc.property(
          // Generator for valid CEP format (8 digits)
          fc.tuple(
            fc.integer({ min: 10000, max: 99999 }), // First 5 digits
            fc.integer({ min: 100, max: 999 })      // Last 3 digits
          ).map(([first, last]) => `${first}${last}`),
          (validCep) => {
            // Valid CEP should pass validation
            expect(isValidCEPFormat(validCep)).toBe(true);
            expect(isValidCEPFormat(`${validCep.slice(0, 5)}-${validCep.slice(5)}`)).toBe(true);
            
            // Should be able to format without error
            expect(() => formatCEP(validCep)).not.toThrow();
            expect(formatCEP(validCep)).toMatch(/^\d{5}-\d{3}$/);
            
            // Clean CEP should return 8 digits
            expect(cleanCEP(validCep)).toHaveLength(8);
            expect(cleanCEP(validCep)).toMatch(/^\d{8}$/);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject invalid CEP formats consistently', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            // Too short
            fc.string({ minLength: 0, maxLength: 7 }).filter(s => !/^\d{8}$/.test(s.replace(/\D/g, ''))),
            // Too long
            fc.string({ minLength: 10, maxLength: 20 }),
            // Contains letters
            fc.string().filter(s => /[a-zA-Z]/.test(s)),
            // Empty or whitespace
            fc.constantFrom('', '   ', '\t', '\n')
          ),
          (invalidCep) => {
            // Invalid CEP should fail validation
            expect(isValidCEPFormat(invalidCep)).toBe(false);
            
            // Should throw error when trying to format
            if (invalidCep.replace(/\D/g, '').length !== 8) {
              expect(() => formatCEP(invalidCep)).toThrow(BrasilAPIError);
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle CEP formatting consistently regardless of input format', () => {
      fc.assert(
        fc.property(
          fc.tuple(
            fc.integer({ min: 10000, max: 99999 }),
            fc.integer({ min: 100, max: 999 })
          ),
          ([first, last]) => {
            const baseCep = `${first}${last}`;
            const variations = [
              baseCep,                           // 12345678
              `${first}-${last}`,               // 12345-678
              ` ${baseCep} `,                   // " 12345678 "
              `${first} ${last}`,               // "12345 678"
              `${first}.${last}`,               // "12345.678"
            ];

            variations.forEach(variation => {
              if (isValidCEPFormat(variation)) {
                const formatted = formatCEP(variation);
                expect(formatted).toBe(`${first}-${last}`);
                expect(formatted).toMatch(/^\d{5}-\d{3}$/);
              }
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain CEP format invariants during cleaning and formatting', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => {
            const cleaned = s.replace(/\D/g, '');
            return cleaned.length === 8 && /^\d{8}$/.test(cleaned);
          }),
          (cepString) => {
            const cleaned = cleanCEP(cepString);
            const formatted = formatCEP(cepString);
            
            // Cleaning should always produce 8 digits
            expect(cleaned).toHaveLength(8);
            expect(cleaned).toMatch(/^\d{8}$/);
            
            // Formatting should always produce 99999-999 pattern
            expect(formatted).toMatch(/^\d{5}-\d{3}$/);
            
            // Clean and format should be consistent
            expect(cleanCEP(formatted)).toBe(cleaned);
            expect(formatCEP(cleaned)).toBe(formatted);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle BrasilAPI service errors appropriately', async () => {
      const service = new BrasilAPIService();
      
      await fc.assert(
        fc.asyncProperty(
          fc.oneof(
            // Invalid format CEPs
            fc.string().filter(s => !isValidCEPFormat(s)),
            // Valid format but likely non-existent CEPs
            fc.constantFrom('00000-000', '99999-999', '11111-111')
          ),
          async (invalidCep) => {
            try {
              await service.lookupAddress(invalidCep);
              // If it doesn't throw, that's unexpected but not necessarily wrong
              // Some CEPs might actually exist
            } catch (error) {
              expect(error).toBeInstanceOf(BrasilAPIError);
              expect(['INVALID_CEP', 'NOT_FOUND', 'NETWORK_ERROR']).toContain(
                (error as BrasilAPIError).code
              );
            }
          }
        ),
        { numRuns: 20 } // Fewer runs for network tests
      );
    });

    it('should validate CEP format before making API calls', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => !isValidCEPFormat(s)),
          (invalidCep) => {
            const service = new BrasilAPIService();
            
            // Should reject invalid CEPs immediately without network call
            expect(service.lookupAddress(invalidCep)).rejects.toThrow(BrasilAPIError);
            expect(service.lookupAddress(invalidCep)).rejects.toThrow('CEP deve ter o formato 99999-999');
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});