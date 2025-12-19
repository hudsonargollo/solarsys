import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  message,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-4 border-solarsys-green border-t-transparent rounded-full animate-spin`}
      />
      {message && (
        <p className="mt-3 text-sm text-gray-600 text-center">
          {message}
        </p>
      )}
    </div>
  )
}

interface ErrorDisplayProps {
  error: {
    message: string
    code?: string
  }
  onRetry?: () => void
  className?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Erro
      </h3>
      
      <p className="text-gray-600 text-center mb-4 max-w-md">
        {error.message}
      </p>
      
      {error.code && (
        <p className="text-xs text-gray-400 mb-4">
          Código: {error.code}
        </p>
      )}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-solarsys-primary"
        >
          Tentar Novamente
        </button>
      )}
    </div>
  )
}

interface LoadingStateProps {
  loading: boolean
  error?: { message: string; code?: string } | null
  onRetry?: () => void
  loadingMessage?: string
  children: React.ReactNode
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  onRetry,
  loadingMessage,
  children,
  className = ''
}) => {
  if (loading) {
    return (
      <div className={className}>
        <LoadingSpinner size="lg" message={loadingMessage} />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorDisplay error={error} onRetry={onRetry} />
      </div>
    )
  }

  return <>{children}</>
}