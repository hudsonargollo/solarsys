import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { brasilAPIService, BrasilAPIError, formatCEP, isValidCEPFormat, type AddressLookup } from '../../lib/brasilapi';

export interface CEPInputProps {
  value: string;
  onChange: (cep: string) => void;
  onAddressFound?: (address: AddressLookup) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface CEPInputState {
  isLoading: boolean;
  error: string | null;
  address: AddressLookup | null;
}

export const CEPInput: React.FC<CEPInputProps> = ({
  value,
  onChange,
  onAddressFound,
  onError,
  disabled = false,
  placeholder = "00000-000",
  className = "",
}) => {
  const [state, setState] = useState<CEPInputState>({
    isLoading: false,
    error: null,
    address: null,
  });

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Allow only numbers and hyphen, limit to 9 characters (99999-999)
    const cleanValue = inputValue.replace(/[^\d-]/g, '');
    let formattedValue = cleanValue;

    // Auto-format as user types
    if (cleanValue.length > 5 && !cleanValue.includes('-')) {
      formattedValue = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`;
    }

    // Limit to 9 characters
    if (formattedValue.length <= 9) {
      onChange(formattedValue);
      
      // Clear previous error when user starts typing
      if (state.error) {
        setState(prev => ({ ...prev, error: null }));
      }
    }
  }, [onChange, state.error]);

  const handleBlur = useCallback(async () => {
    if (!value || value.length < 8) return;

    if (!isValidCEPFormat(value)) {
      const errorMsg = 'CEP deve ter o formato 99999-999';
      setState(prev => ({ ...prev, error: errorMsg }));
      onError?.(errorMsg);
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const address = await brasilAPIService.lookupAddress(value);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        address,
        error: null 
      }));
      onAddressFound?.(address);
    } catch (error) {
      let errorMessage = 'Erro na consulta do CEP';
      
      if (error instanceof BrasilAPIError) {
        switch (error.code) {
          case 'INVALID_CEP':
            errorMessage = 'CEP deve ter o formato 99999-999';
            break;
          case 'NOT_FOUND':
            errorMessage = 'CEP não encontrado';
            break;
          case 'NETWORK_ERROR':
            errorMessage = 'Não foi possível localizar automaticamente. Tente novamente.';
            break;
        }
      }

      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      onError?.(errorMessage);
    }
  }, [value, onAddressFound, onError]);

  const inputClasses = `
    w-full px-4 py-3 text-lg border-2 rounded-lg
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-orange-200
    ${state.error 
      ? 'border-red-400 bg-red-50' 
      : 'border-gray-200 focus:border-orange-400'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          disabled={disabled || state.isLoading}
          placeholder={placeholder}
          className={inputClasses}
          maxLength={9}
          inputMode="numeric"
          autoComplete="postal-code"
        />
        
        {state.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 text-sm font-medium"
        >
          {state.error}
        </motion.div>
      )}

      {state.address && !state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-700 text-sm bg-green-50 p-3 rounded-lg border border-green-200"
        >
          <div className="font-medium">{state.address.street}</div>
          <div>{state.address.district}, {state.address.city} - {state.address.state}</div>
        </motion.div>
      )}
    </div>
  );
};

export default CEPInput;