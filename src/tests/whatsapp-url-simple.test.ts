/**
 * Simple test for WhatsApp URL generation
 * **Feature: solar-lead-platform, Property 10: WhatsApp URL generation**
 * **Validates: Requirements 4.3**
 */

import { describe, it, expect, vi } from 'vitest';
import { WhatsAppService, QualificationResult } from '../lib/whatsapp';
import { LeadData } from '../stores/simuladorStore';

// Mock the database module to avoid Supabase dependency
vi.mock('../lib/database', () => ({
  getHSPValue: vi.fn(() => Promise.resolve(5.0))
}));

describe('WhatsApp URL Generation - Simple Test', () => {
  it('should generate a valid WhatsApp URL', async () => {
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
    
    // Basic URL structure validation
    expect(message.url).toContain('https://wa.me/');
    expect(message.url).toContain('?text=');
    expect(message.phone).toMatch(/^55\d{10,11}$/);
    
    // URL should be parseable
    const url = new URL(message.url);
    expect(url.hostname).toBe('wa.me');
    expect(url.protocol).toBe('https:');
    
    console.log('Generated URL:', message.url);
    console.log('Phone:', message.phone);
  });
});