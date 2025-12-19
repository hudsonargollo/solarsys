/**
 * BrasilAPI integration service for CEP lookup
 * Provides address lookup functionality using the BrasilAPI service
 */

import { withRetry, safeAsync, validateInput } from './errors'
import type { AppError } from './errors'

export interface AddressLookup {
  cep: string;
  city: string;
  state: string;
  district: string;
  street?: string;
}

export interface BrasilAPIResponse {
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
}

export class BrasilAPIError extends Error {
  public code: 'INVALID_CEP' | 'NETWORK_ERROR' | 'NOT_FOUND';
  
  constructor(message: string, code: 'INVALID_CEP' | 'NETWORK_ERROR' | 'NOT_FOUND') {
    super(message);
    this.name = 'BrasilAPIError';
    this.code = code;
  }
}

/**
 * Validates CEP format (99999-999 or 99999999)
 */
export function isValidCEPFormat(cep: string): boolean {
  const cleanCep = cep.replace(/\D/g, '');
  return cleanCep.length === 8 && /^\d{8}$/.test(cleanCep);
}

/**
 * Formats CEP to standard format (99999-999)
 */
export function formatCEP(cep: string): string {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    throw new BrasilAPIError('CEP deve ter 8 dígitos', 'INVALID_CEP');
  }
  return `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
}

/**
 * Cleans CEP by removing non-numeric characters
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

/**
 * BrasilAPI service for address lookup
 */
import { apiConfig } from './config'

export class BrasilAPIService {
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor() {
    this.baseUrl = apiConfig.brasilApiUrl;
    this.timeout = apiConfig.timeout;
  }

  /**
   * Looks up address information for a given CEP
   */
  async lookupAddress(cep: string): Promise<AddressLookup> {
    // Validate CEP format first
    const validationError = validateInput(cep, 'cep')
    if (validationError) {
      throw new BrasilAPIError(validationError.message, 'INVALID_CEP');
    }

    const cleanedCep = cleanCEP(cep);
    
    // Use retry mechanism for network requests
    return withRetry(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(`${this.baseUrl}/${cleanedCep}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 404) {
            throw new BrasilAPIError('CEP não encontrado', 'NOT_FOUND');
          }
          throw new BrasilAPIError('Erro na consulta do CEP', 'NETWORK_ERROR');
        }

        const data: BrasilAPIResponse = await response.json();

        // Validate response data
        if (!data.cep || !data.city || !data.state) {
          throw new BrasilAPIError('Resposta inválida da API', 'NETWORK_ERROR');
        }

        // Transform to our interface
        return {
          cep: formatCEP(data.cep),
          city: data.city,
          state: data.state,
          district: data.district || '',
          street: data.street,
        };
      } catch (error) {
        if (error instanceof BrasilAPIError) {
          throw error;
        }
        
        if (error instanceof Error && error.name === 'AbortError') {
          throw new BrasilAPIError('Timeout na consulta do CEP', 'NETWORK_ERROR');
        }

        throw new BrasilAPIError('Erro de conexão', 'NETWORK_ERROR');
      }
    }, 2, 1000); // Retry up to 2 times with 1 second delay
  }

  /**
   * Safe address lookup with error handling
   */
  async safeAddressLookup(cep: string): Promise<{ data: AddressLookup | null; error: AppError | null }> {
    return safeAsync(() => this.lookupAddress(cep));
  }
}

// Export singleton instance
export const brasilAPIService = new BrasilAPIService();