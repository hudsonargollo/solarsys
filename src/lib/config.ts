/**
 * Environment Configuration
 * Centralized configuration management for different environments
 */

export interface AppConfig {
  supabase: {
    url: string
    anonKey: string
  }
  api: {
    brasilApiUrl: string
    timeout: number
  }
  features: {
    enableAnalytics: boolean
    enableErrorTracking: boolean
    enablePerformanceMonitoring: boolean
    enableServiceWorker: boolean
  }
  ui: {
    animationsEnabled: boolean
    debugMode: boolean
  }
}

// Environment detection
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD
export const isTest = import.meta.env.MODE === 'test'

// Get environment variable with fallback
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback
}

// Get boolean environment variable
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key]
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

// Application configuration
export const config: AppConfig = {
  supabase: {
    url: getEnvVar('VITE_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnvVar('VITE_SUPABASE_ANON_KEY', 'placeholder-key'),
  },
  api: {
    brasilApiUrl: isProduction 
      ? '/api/cep' // Use Cloudflare Function in production
      : 'https://brasilapi.com.br/api/cep/v1', // Direct API in development
    timeout: 5000,
  },
  features: {
    enableAnalytics: isProduction,
    enableErrorTracking: isProduction,
    enablePerformanceMonitoring: true,
    enableServiceWorker: isProduction,
  },
  ui: {
    animationsEnabled: !getBooleanEnvVar('VITE_DISABLE_ANIMATIONS'),
    debugMode: isDevelopment,
  },
}

// Validate required environment variables
export function validateConfig(): void {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
  ]

  const missingVars = requiredVars.filter(varName => !getEnvVar(varName))

  if (missingVars.length > 0) {
    const error = `Missing required environment variables: ${missingVars.join(', ')}`
    console.error(error)
    console.warn('App will continue with limited functionality. Please configure environment variables in Cloudflare Pages.')
    
    // Don't throw in production to allow app to load with degraded functionality
    // if (isProduction) {
    //   throw new Error(error)
    // }
  }
}

// Initialize configuration
validateConfig()

// Export individual config sections for convenience
export const supabaseConfig = config.supabase
export const apiConfig = config.api
export const featureFlags = config.features
export const uiConfig = config.ui

// Runtime configuration updates (for A/B testing, feature flags, etc.)
export function updateFeatureFlag(flag: keyof AppConfig['features'], value: boolean): void {
  config.features[flag] = value
}

export function updateUIConfig(setting: keyof AppConfig['ui'], value: boolean): void {
  config.ui[setting] = value
}

// Configuration logging (development only)
if (isDevelopment) {
  console.group('App Configuration')
  console.log('Environment:', import.meta.env.MODE)
  console.log('Config:', config)
  console.groupEnd()
}