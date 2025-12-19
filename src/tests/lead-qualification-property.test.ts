/**
 * Property-based tests for lead qualification rules
 * **Feature: solar-lead-platform, Property 5: Lead qualification rules**
 * **Validates: Requirements 2.2**
 */

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';
import { WhatsAppService, QualificationResult } from '../lib/whatsapp';
import { LeadData } from '../stores/simuladorStore';

// Mock the database module to avoid Supabase dependency
vi.mock('../lib/database', () => ({
  getHSPValue: vi.fn((state: string) => {
    // Mock HSP values for Brazilian states
    const hspValues: Record<string, number> = {
      'SP': 4.8, 'RJ': 5.1, 'MG': 5.2, 'RS': 4.5, 'PR': 4.7,
      'SC': 4.6, 'BA': 5.8, 'GO': 5.3, 'PE': 5.9, 'CE': 6.1
    };
    return Promise.resolve(hspValues[state] || 5.0);
  })
}));

describe('Lead Qualification Rules Properties', () => {
  describe('Property 5: Lead qualification rules', () => {
    // Generator for valid LeadData with monofásico connection
    const monoLeadDataArbitrary = fc.record({
      zipCode: fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d{5}-?\d{3}$/.test(s)),
      city: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
      state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'),
      billValue: fc.float({ min: 50, max: 500 }), // Range that includes both below and above 250
      connectionType: fc.constant('mono' as const),
      roofType: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<'clay' | 'metal' | 'fiber' | 'slab'>,
      name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
      whatsapp: fc.tuple(
        fc.constantFrom('11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'),
        fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d+$/.test(s))
      ).map(([ddd, number]) => `${ddd}${number.padStart(9, '0').slice(0, 9)}`),
      email: fc.emailAddress()
    }) as fc.Arbitrary<LeadData>;

    // Generator for LeadData with different connection types
    const allConnectionTypesLeadDataArbitrary = fc.record({
      zipCode: fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d{5}-?\d{3}$/.test(s)),
      city: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
      state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'),
      billValue: fc.float({ min: 50, max: 500 }),
      connectionType: fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<'mono' | 'bi' | 'tri'>,
      roofType: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<'clay' | 'metal' | 'fiber' | 'slab'>,
      name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
      whatsapp: fc.tuple(
        fc.constantFrom('11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'),
        fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d+$/.test(s))
      ).map(([ddd, number]) => `${ddd}${number.padStart(9, '0').slice(0, 9)}`),
      email: fc.emailAddress()
    }) as fc.Arbitrary<LeadData>;

    it('should display viability warnings for monofásico connection with bill below R$ 250', async () => {
      await fc.assert(
        fc.asyncProperty(
          monoLeadDataArbitrary.filter(lead => lead.billValue < 250),
          async (leadData) => {
            const qualification = await WhatsAppService.qualifyLead(leadData);
            
            // For monofásico connection with bill below R$ 250, should have warnings
            expect(qualification.warnings).toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            
            // Should still allow progression (isQualified should be true unless bill is below R$ 150)
            if (leadData.billValue >= 150) {
              expect(qualification.isQualified).toBe(true);
              expect(qualification.disqualificationReason).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not display monofásico warnings for bills R$ 250 or above', async () => {
      await fc.assert(
        fc.asyncProperty(
          monoLeadDataArbitrary.filter(lead => lead.billValue >= 250),
          async (leadData) => {
            const qualification = await WhatsAppService.qualifyLead(leadData);
            
            // For monofásico connection with bill R$ 250 or above, should not have the specific warning
            expect(qualification.warnings).not.toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            
            // Should be qualified (assuming bill is above minimum threshold)
            expect(qualification.isQualified).toBe(true);
            expect(qualification.disqualificationReason).toBeUndefined();
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not display monofásico warnings for bifásico and trifásico connections regardless of bill value', async () => {
      await fc.assert(
        fc.asyncProperty(
          allConnectionTypesLeadDataArbitrary.filter(lead => lead.connectionType !== 'mono'),
          async (leadData) => {
            const qualification = await WhatsAppService.qualifyLead(leadData);
            
            // For bifásico and trifásico connections, should never have the monofásico warning
            expect(qualification.warnings).not.toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            
            // Should be qualified if bill is above minimum threshold
            if (leadData.billValue >= 150) {
              expect(qualification.isQualified).toBe(true);
              expect(qualification.disqualificationReason).toBeUndefined();
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain qualification logic consistency across all connection types', async () => {
      await fc.assert(
        fc.asyncProperty(
          allConnectionTypesLeadDataArbitrary,
          async (leadData) => {
            const qualification = await WhatsAppService.qualifyLead(leadData);
            
            // Minimum bill rule should apply to all connection types
            if (leadData.billValue < 150) {
              expect(qualification.isQualified).toBe(false);
              expect(qualification.disqualificationReason).toBe('Conta de luz muito baixa para viabilidade solar');
            } else {
              expect(qualification.isQualified).toBe(true);
              expect(qualification.disqualificationReason).toBeUndefined();
            }
            
            // Fibrocimento roof warning should apply to all connection types
            if (leadData.roofType === 'fiber') {
              expect(qualification.warnings).toContain('Telhado de fibrocimento pode ter custos adicionais de instalação');
            }
            
            // Monofásico warning should only apply to monofásico connections with bill < 250
            const shouldHaveMonoWarning = leadData.connectionType === 'mono' && leadData.billValue < 250;
            if (shouldHaveMonoWarning) {
              expect(qualification.warnings).toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            } else {
              expect(qualification.warnings).not.toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            }
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow progression for monofásico connections with warnings', async () => {
      await fc.assert(
        fc.asyncProperty(
          monoLeadDataArbitrary.filter(lead => lead.billValue >= 150 && lead.billValue < 250),
          async (leadData) => {
            const qualification = await WhatsAppService.qualifyLead(leadData);
            
            // Should have the warning
            expect(qualification.warnings).toContain('Ligação monofásica com conta baixa - verificar viabilidade');
            
            // But should still be qualified (allow progression)
            expect(qualification.isQualified).toBe(true);
            expect(qualification.disqualificationReason).toBeUndefined();
            
            // Should have valid system calculations
            expect(qualification.systemSizeKwp).toBeGreaterThan(0);
            expect(qualification.estimatedSavings).toBeGreaterThan(0);
            expect(['small', 'medium', 'large']).toContain(qualification.packageType);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of exactly R$ 250 bill with monofásico connection', async () => {
      const exactBillLeadData = fc.sample(monoLeadDataArbitrary, 1)[0];
      exactBillLeadData.billValue = 250;
      
      const qualification = await WhatsAppService.qualifyLead(exactBillLeadData);
      
      // At exactly R$ 250, should not have the warning (>= 250 threshold)
      expect(qualification.warnings).not.toContain('Ligação monofásica com conta baixa - verificar viabilidade');
      expect(qualification.isQualified).toBe(true);
      expect(qualification.disqualificationReason).toBeUndefined();
    });

    it('should handle edge case of exactly R$ 249.99 bill with monofásico connection', async () => {
      const nearBillLeadData = fc.sample(monoLeadDataArbitrary, 1)[0];
      nearBillLeadData.billValue = 249.99;
      
      const qualification = await WhatsAppService.qualifyLead(nearBillLeadData);
      
      // At R$ 249.99, should have the warning (< 250 threshold)
      expect(qualification.warnings).toContain('Ligação monofásica com conta baixa - verificar viabilidade');
      expect(qualification.isQualified).toBe(true);
      expect(qualification.disqualificationReason).toBeUndefined();
    });
  });
});