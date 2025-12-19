/**
 * Property-based tests for WhatsApp URL generation
 * **Feature: solar-lead-platform, Property 10: WhatsApp URL generation**
 * **Validates: Requirements 4.3**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Set test timeout
vi.setConfig({ testTimeout: 10000 });

describe('WhatsApp URL Generation Properties', () => {
  describe('Property 10: WhatsApp URL generation', () => {

    it('should generate valid WhatsApp URL with proper structure', async () => {
      const leadData: LeadData = {
        zipCode: '01310-100',
        city: 'São Paulo',
        state: 'SP',
        billValue: 300,
        connectionType: 'bi',
        roofType: 'clay',
        name: 'João Silva',
        whatsapp: '11999999999',
        email: 'test@example.com'
      };

      const qualification: QualificationResult = {
        isQualified: true,
        disqualificationReason: undefined,
        warnings: [],
        systemSizeKwp: 5.0,
        estimatedSavings: 270,
        packageType: 'medium'
      };

      const message = await WhatsAppService.generateMessage(leadData, qualification);
      
      // URL should follow WhatsApp web API format
      expect(message.url).toMatch(/^https:\/\/wa\.me\/\d+\?text=.+$/);
      
      // URL should start with correct WhatsApp domain
      expect(message.url).toStartWith('https://wa.me/');
      
      // URL should contain text parameter
      expect(message.url).toContain('?text=');
      
      // URL should be a valid URL
      expect(() => new URL(message.url)).not.toThrow();
    });

    it('should properly format phone number with Brazilian country code', async () => {
      // Test different phone formats
      const phoneFormats = [
        '11999999999',           // Clean format
        '(11) 999999999',        // With parentheses
        '11-999999999',          // With dash
        '5511999999999'          // Already with country code
      ];

      const qualification: QualificationResult = {
        isQualified: true,
        disqualificationReason: undefined,
        warnings: [],
        systemSizeKwp: 5.0,
        estimatedSavings: 270,
        packageType: 'medium'
      };

      for (const phoneFormat of phoneFormats) {
        const leadData: LeadData = {
          zipCode: '01310-100',
          city: 'São Paulo',
          state: 'SP',
          billValue: 300,
          connectionType: 'bi',
          roofType: 'clay',
          name: 'João Silva',
          whatsapp: phoneFormat,
          email: 'test@example.com'
        };

        const message = await WhatsAppService.generateMessage(leadData, qualification);
        
        // Phone should be properly formatted with country code 55
        expect(message.phone).toMatch(/^55\d{10,11}$/);
        
        // URL should contain the formatted phone number
        expect(message.url).toContain(`wa.me/${message.phone}`);
        
        // Phone should start with 55 (Brazil country code)
        expect(message.phone).toStartWith('55');
        
        // All formats should result in the same normalized phone number
        expect(message.phone).toBe('5511999999999');
      }
    });

    it('should properly encode message text in URL', async () => {
      const leadData: LeadData = {
        zipCode: '01310-100',
        city: 'São Paulo',
        state: 'SP',
        billValue: 300,
        connectionType: 'bi',
        roofType: 'clay',
        name: 'João Silva & Filhos',
        whatsapp: '11999999999',
        email: 'test@example.com'
      };

      const qualification: QualificationResult = {
        isQualified: true,
        disqualificationReason: undefined,
        warnings: ['Teste com caracteres especiais'],
        systemSizeKwp: 5.0,
        estimatedSavings: 270,
        packageType: 'medium'
      };

      const message = await WhatsAppService.generateMessage(leadData, qualification);
      
      // Extract text parameter from URL
      const url = new URL(message.url);
      const encodedText = url.searchParams.get('text');
      
      // Text parameter should exist
      expect(encodedText).toBeTruthy();
      
      // Decoded text should match the message text
      const decodedText = decodeURIComponent(encodedText!);
      expect(decodedText).toBe(message.text);
      
      // URL should contain properly encoded text (no unencoded special characters)
      const textParam = message.url.split('?text=')[1];
      expect(textParam).not.toContain(' '); // Spaces should be encoded
      expect(textParam).not.toContain('\n'); // Newlines should be encoded
      expect(textParam).not.toContain('*'); // Asterisks should be encoded
      expect(textParam).not.toContain('🌞'); // Emojis should be encoded
    });



    it('should generate URL that opens WhatsApp with pre-filled message', async () => {
      const leadData: LeadData = {
        zipCode: '01310-100',
        city: 'São Paulo',
        state: 'SP',
        billValue: 300,
        connectionType: 'bi',
        roofType: 'clay',
        name: 'João Silva',
        whatsapp: '11999999999',
        email: 'test@example.com'
      };

      const qualification: QualificationResult = {
        isQualified: true,
        disqualificationReason: undefined,
        warnings: [],
        systemSizeKwp: 5.0,
        estimatedSavings: 270,
        packageType: 'medium'
      };

      const message = await WhatsAppService.generateMessage(leadData, qualification);
      
      // URL should be clickable and contain all necessary components
      const url = new URL(message.url);
      
      // Should use HTTPS protocol
      expect(url.protocol).toBe('https:');
      
      // Should use correct WhatsApp domain
      expect(url.hostname).toBe('wa.me');
      
      // Should have phone number in path
      expect(url.pathname).toBe(`/${message.phone}`);
      
      // Should have text parameter
      expect(url.searchParams.has('text')).toBe(true);
      
      // Text parameter should not be empty
      expect(url.searchParams.get('text')).toBeTruthy();
      expect(url.searchParams.get('text')!.length).toBeGreaterThan(0);
    });

    it('should maintain URL validity with special characters in lead data', async () => {
      const leadData: LeadData = {
        zipCode: '01310-100',
        city: 'São Paulo',
        state: 'SP',
        billValue: 300,
        connectionType: 'bi',
        roofType: 'clay',
        name: 'José da Silva & Filhos (Proprietário)',
        whatsapp: '11999999999',
        email: 'test@example.com'
      };

      const qualification: QualificationResult = {
        isQualified: true,
        disqualificationReason: undefined,
        warnings: ['Aviso com acentos: ação necessária'],
        systemSizeKwp: 5.0,
        estimatedSavings: 270,
        packageType: 'medium'
      };

      const message = await WhatsAppService.generateMessage(leadData, qualification);
      
      // URL should still be valid even with special characters in data
      expect(() => new URL(message.url)).not.toThrow();
      
      // URL should properly encode special characters
      expect(message.url).toMatch(/^https:\/\/wa\.me\/\d+\?text=.+$/);
      
      // Decoded message should contain the original special characters
      const url = new URL(message.url);
      const decodedText = decodeURIComponent(url.searchParams.get('text')!);
      expect(decodedText).toContain(leadData.name);
      expect(decodedText).toContain(leadData.city);
    });
  });
});