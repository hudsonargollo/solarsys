/**
 * Lazy-loaded components for better performance
 * These components are loaded only when needed
 */

import { lazy, Suspense } from 'react'
import { LoadingSpinner } from './ui/LoadingSpinner'

// Lazy load heavy components
export const LazyPainel = lazy(() => import('../pages/Painel'))
export const LazyResultado = lazy(() => import('../pages/Resultado'))

// Lazy load complex simulador steps
export const LazyLocationStep = lazy(() => import('./simulador/LocationStep'))
export const LazyConsumptionStep = lazy(() => import('./simulador/ConsumptionStep'))
export const LazyTechnicalFitStep = lazy(() => import('./simulador/TechnicalFitStep'))
export const LazyContactStep = lazy(() => import('./simulador/ContactStep'))

// Lazy load heavy illustrations
export const LazySolarHouse = lazy(() => 
  import('./illustrations').then(module => ({ default: module.SolarHouse }))
)

export const LazySun = lazy(() => 
  import('./illustrations').then(module => ({ default: module.Sun }))
)

// Wrapper component with loading fallback
interface LazyWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ 
  children, 
  fallback,
  className = '' 
}) => {
  const defaultFallback = (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <LoadingSpinner size="md" message="Carregando..." />
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  )
}

// Specific lazy wrappers for common use cases
export const LazyPageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyWrapper 
    fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Carregando página..." />
      </div>
    }
  >
    {children}
  </LazyWrapper>
)

export const LazyComponentWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyWrapper 
    fallback={<LoadingSpinner size="sm" />}
    className="min-h-[200px]"
  >
    {children}
  </LazyWrapper>
)