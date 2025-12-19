/**
 * Comprehensive Error Handling Utilities
 * Provides centralized error handling with localized messages
 */

export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: string
}

export class SolarSysError extends Error {
  public readonly code: string
  public readonly details?: any
  public readonly timestamp: string

  constructor(code: string, message: string, details?: any) {
    super(message)
    this.name = 'SolarSysError'
    this.code = code
    this.details = details
    this.timestamp = new Date().toISOString()
  }
}

// Error codes and their Portuguese messages
export const ERROR_MESSAGES = {
  // Input validation errors
  INVALID_CEP: 'CEP deve ter o formato 99999-999',
  INVALID_PHONE: 'Número deve incluir DDD (ex: 11999999999)',
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_EMAIL: 'E-mail deve ter um formato válido',
  INVALID_BILL_VALUE: 'Valor da conta deve ser maior que zero',
  
  // API errors
  BRASILAPI_TIMEOUT: 'Não foi possível localizar automaticamente. Selecione manualmente.',
  BRASILAPI_ERROR: 'Erro ao buscar endereço. Verifique o CEP e tente novamente.',
  SUPABASE_CONNECTION: 'Erro de conexão. Tente novamente em alguns instantes.',
  SUPABASE_AUTH_ERROR: 'Erro de autenticação. Faça login novamente.',
  
  // Business logic errors
  LEAD_DISQUALIFIED: 'Solar pode não ser viável para seu perfil atual. Entre em contato para outras opções.',
  CALCULATION_ERROR: 'Erro no cálculo. Nossa equipe foi notificada.',
  INSUFFICIENT_DATA: 'Dados insuficientes para processar a solicitação.',
  
  // Security errors
  SESSION_EXPIRED: 'Sua sessão expirou. Por favor, recomece o processo.',
  UNAUTHORIZED_ACCESS: 'Acesso não autorizado.',
  RLS_VIOLATION: 'Erro de segurança. Operação não permitida.',
  
  // Generic errors
  UNKNOWN_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
  SERVER_ERROR: 'Erro no servidor. Nossa equipe foi notificada.'
} as const

export type ErrorCode = keyof typeof ERROR_MESSAGES

/**
 * Create a standardized error object
 */
export function createError(code: ErrorCode, details?: any): AppError {
  return {
    code,
    message: ERROR_MESSAGES[code],
    details,
    timestamp: new Date().toISOString()
  }
}

/**
 * Handle API errors with appropriate user messages
 */
export function handleAPIError(error: any): AppError {
  console.error('API Error:', error)
  
  if (error.name === 'AbortError' || error.code === 'TIMEOUT') {
    return createError('BRASILAPI_TIMEOUT', error)
  }
  
  if (error.message?.includes('fetch')) {
    return createError('NETWORK_ERROR', error)
  }
  
  if (error.status >= 500) {
    return createError('SERVER_ERROR', error)
  }
  
  if (error.status === 401 || error.status === 403) {
    return createError('UNAUTHORIZED_ACCESS', error)
  }
  
  return createError('UNKNOWN_ERROR', error)
}

/**
 * Handle Supabase errors with appropriate user messages
 */
export function handleSupabaseError(error: any): AppError {
  console.error('Supabase Error:', error)
  
  if (error.code === 'PGRST301' || error.message?.includes('RLS')) {
    return createError('RLS_VIOLATION', error)
  }
  
  if (error.code === 'PGRST116' || error.message?.includes('JWT')) {
    return createError('SESSION_EXPIRED', error)
  }
  
  if (error.message?.includes('connection') || error.message?.includes('network')) {
    return createError('SUPABASE_CONNECTION', error)
  }
  
  if (error.message?.includes('auth')) {
    return createError('SUPABASE_AUTH_ERROR', error)
  }
  
  return createError('UNKNOWN_ERROR', error)
}

/**
 * Handle business logic errors
 */
export function handleBusinessLogicError(type: 'disqualified' | 'calculation' | 'insufficient_data', details?: any): AppError {
  switch (type) {
    case 'disqualified':
      return createError('LEAD_DISQUALIFIED', details)
    case 'calculation':
      return createError('CALCULATION_ERROR', details)
    case 'insufficient_data':
      return createError('INSUFFICIENT_DATA', details)
    default:
      return createError('UNKNOWN_ERROR', details)
  }
}

/**
 * Validate input and return error if invalid
 */
export function validateInput(value: any, type: 'cep' | 'phone' | 'email' | 'required' | 'bill_value'): AppError | null {
  if (type === 'required' && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return createError('REQUIRED_FIELD')
  }
  
  if (type === 'cep' && value) {
    const cepRegex = /^\d{5}-?\d{3}$/
    if (!cepRegex.test(value)) {
      return createError('INVALID_CEP')
    }
  }
  
  if (type === 'phone' && value) {
    const phoneRegex = /^\d{10,11}$/
    const cleanPhone = value.replace(/\D/g, '')
    if (!phoneRegex.test(cleanPhone)) {
      return createError('INVALID_PHONE')
    }
  }
  
  if (type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return createError('INVALID_EMAIL')
    }
  }
  
  if (type === 'bill_value' && value !== undefined) {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue) || numValue <= 0) {
      return createError('INVALID_BILL_VALUE')
    }
  }
  
  return null
}

/**
 * Error boundary helper for React components
 */
export function logError(error: Error, errorInfo?: any) {
  console.error('Application Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    errorInfo,
    timestamp: new Date().toISOString()
  })
  
  // In production, you would send this to an error tracking service
  // like Sentry, LogRocket, or similar
}

/**
 * Retry mechanism for failed operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: any
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  throw lastError
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    const appError = error instanceof SolarSysError 
      ? { code: error.code, message: error.message, details: error.details, timestamp: error.timestamp }
      : handleAPIError(error)
    
    return { data: fallback || null, error: appError }
  }
}