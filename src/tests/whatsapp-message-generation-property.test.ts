/**
 * Property-based tests for WhatsApp message generation
 * **Feature: solar-lead-platform, Property 9: WhatsApp message generation**
 * **Validates: Requirements 4.1, 4.2, 4.5**
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

describe('WhatsApp Message Generation Properties', () => {
  describe('Property 9: WhatsApp message generation', () => {
    // Generator for valid LeadData
    const leadDataArbitrary = fc.record({
      zipCode: fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d{5}-?\d{3}$/.test(s)),
      city: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
      state: fc.constantFrom('SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'),
      billValue: fc.float({ min: 100, max: 2000 }),
      connectionType: fc.constantFrom('mono', 'bi', 'tri') as fc.Arbitrary<'mono' | 'bi' | 'tri'>,
      roofType: fc.constantFrom('clay', 'metal', 'fiber', 'slab') as fc.Arbitrary<'clay' | 'metal' | 'fiber' | 'slab'>,
      name: fc.string({ minLength: 2, maxLength: 100 }).filter(s => s.trim().length > 0),
      whatsapp: fc.oneof(
        // Brazilian phone with DDD (11 digits)
        fc.tuple(
          fc.constantFrom('11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'),
          fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d+$/.test(s))
        ).map(([ddd, number]) => `${ddd}${number.padStart(9, '0').slice(0, 9)}`),
        // With formatting
        fc.tuple(
          fc.constantFrom('11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'),
          fc.string({ minLength: 8, maxLength: 9 }).filter(s => /^\d+$/.test(s))
        ).map(([ddd, number]) => `(${ddd}) ${number.padStart(9, '0').slice(0, 9)}`)
      ),
      email: fc.emailAddress()
    }) as fc.Arbitrary<LeadData>;

    // Generator for QualificationResult
    const qualificationResultArbitrary = fc.record({
      isQualified: fc.boolean(),
      disqualificationReason: fc.option(fc.string({ minLength: 10, maxLength: 100 })),
      warnings: fc.array(fc.string({ minLength: 5, maxLength: 100 }), { maxLength: 3 }),
      systemSizeKwp: fc.float({ min: 1, max: 20 }),
      estimatedSavings: fc.float({ min: 50, max: 1800 }),
      packageType: fc.constantFrom('small', 'medium', 'large') as fc.Arbitrary<'small' | 'medium' | 'large'>
    }) as fc.Arbitrary<QualificationResult>;

    it('should generate WhatsApp message with all required lead information', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // Message should contain all required lead information
            expect(message.text).toContain(leadData.name);
            expect(message.text).toContain(leadData.city);
            expect(message.text).toContain(leadData.state);
            expect(message.text).toContain(leadData.billValue.toString());
            
            // Should contain roof type in Portuguese
            const roofTypeLabels = {
              clay: 'Telha Cerâmica',
              metal: 'Telha Metálica',
              fiber: 'Fibrocimento', 
              slab: 'Laje'
            };
            expect(message.text).toContain(roofTypeLabels[leadData.roofType]);
            
            // Should contain connection type in Portuguese
            const connectionTypeLabels = {
              mono: 'Monofásico',
              bi: 'Bifásico',
              tri: 'Trifásico'
            };
            expect(message.text).toContain(connectionTypeLabels[leadData.connectionType]);
            
            // Should contain system size
            expect(message.text).toContain(qualification.systemSizeKwp.toFixed(1));
            expect(message.text).toContain('kWp');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should use proper Brazilian Portuguese labels and formatting', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // Should contain Brazilian Portuguese labels
            expect(message.text).toContain('Nome:');
            expect(message.text).toContain('Localização:');
            expect(message.text).toContain('Conta de Luz:');
            expect(message.text).toContain('Tipo de Ligação:');
            expect(message.text).toContain('Tipo de Telhado:');
            expect(message.text).toContain('Potência Estimada:');
            expect(message.text).toContain('Economia Estimada:');
            
            // Should use Brazilian currency formatting (R$)
            expect(message.text).toContain('R$');
            
            // Should have proper line breaks (multiple lines)
            const lines = message.text.split('\n');
            expect(lines.length).toBeGreaterThan(5);
            
            // Should contain SolarSys branding
            expect(message.text).toContain('SolarSys');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid WhatsApp URL with proper phone formatting', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // URL should be valid WhatsApp format
            expect(message.url).toMatch(/^https:\/\/wa\.me\/\d+\?text=.+$/);
            
            // Phone should be properly formatted (digits only with country code)
            expect(message.phone).toMatch(/^55\d{10,11}$/);
            
            // URL should contain encoded message text
            const encodedText = encodeURIComponent(message.text);
            expect(message.url).toContain(encodedText);
            
            // Phone in URL should match phone field
            expect(message.url).toContain(`wa.me/${message.phone}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include warnings when present in qualification result', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary.filter(q => q.warnings.length > 0),
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // Should contain warnings section
            expect(message.text).toContain('Observações:');
            
            // Should contain all warnings
            qualification.warnings.forEach(warning => {
              expect(message.text).toContain(warning);
            });
            
            // Should use bullet points for warnings
            expect(message.text).toContain('•');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle different package types with correct Portuguese labels', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            const packageLabels = {
              small: 'Residencial Pequeno',
              medium: 'Residencial Médio',
              large: 'Residencial Grande'
            };
            
            // Should contain the correct package label
            expect(message.text).toContain(packageLabels[qualification.packageType]);
            expect(message.text).toContain('Categoria:');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain message structure consistency across all inputs', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // Should always start with SolarSys header
            expect(message.text).toMatch(/^🌞 \*Nova Simulação Solar - SolarSys\*/);
            
            // Should always end with generated message disclaimer
            expect(message.text).toContain('_Mensagem gerada automaticamente pelo SolarSys_');
            
            // Should contain qualified lead confirmation
            expect(message.text).toContain('Lead qualificado e pronto para atendimento!');
            
            // Should have consistent emoji usage
            expect(message.text).toContain('👤'); // Name
            expect(message.text).toContain('📍'); // Location
            expect(message.text).toContain('💡'); // Bill
            expect(message.text).toContain('🔌'); // Connection
            expect(message.text).toContain('🏠'); // Roof
            expect(message.text).toContain('📊'); // Analysis
            expect(message.text).toContain('⚡'); // Power
            expect(message.text).toContain('💰'); // Savings
            expect(message.text).toContain('📦'); // Package
            expect(message.text).toContain('✅'); // Qualified
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should properly format Brazilian currency values', async () => {
      await fc.assert(
        fc.asyncProperty(
          leadDataArbitrary,
          qualificationResultArbitrary,
          async (leadData, qualification) => {
            const message = await WhatsAppService.generateMessage(leadData, qualification);
            
            // Should contain properly formatted Brazilian currency
            // Brazilian format uses comma as decimal separator and period as thousands separator
            const currencyRegex = /R\$\s*\d{1,3}(?:\.\d{3})*(?:,\d{2})?/;
            expect(message.text).toMatch(currencyRegex);
            
            // Should not contain invalid currency formats
            expect(message.text).not.toMatch(/R\$\s*\d+\.\d{2}[^\/]/); // US format
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});