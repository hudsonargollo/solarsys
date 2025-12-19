import { useForm, UseFormReturn } from 'react-hook-form'
import { useSimuladorStore, LeadData, SIMULADOR_STEPS } from '../stores/simuladorStore'

// Form data types for each step
export type LocationFormData = Pick<LeadData, 'zipCode' | 'city' | 'state'>
export type ConsumptionFormData = Pick<LeadData, 'billValue' | 'connectionType'>
export type TechnicalFitFormData = Pick<LeadData, 'roofType'>
export type ContactFormData = Pick<LeadData, 'name' | 'whatsapp' | 'email'>

// Validation rules for each field
export const validationRules = {
  zipCode: {
    required: 'CEP é obrigatório',
    pattern: {
      value: /^\d{5}-?\d{3}$/,
      message: 'CEP deve ter o formato 99999-999'
    }
  },
  city: {
    required: 'Cidade é obrigatória',
    minLength: {
      value: 2,
      message: 'Cidade deve ter pelo menos 2 caracteres'
    }
  },
  state: {
    required: 'Estado é obrigatório',
    pattern: {
      value: /^[A-Z]{2}$/,
      message: 'Estado deve ser uma sigla válida (ex: SP, RJ)'
    }
  },
  billValue: {
    required: 'Valor da conta é obrigatório',
    min: {
      value: 0.01,
      message: 'Valor deve ser maior que zero'
    }
  },
  connectionType: {
    required: 'Tipo de conexão é obrigatório'
  },
  roofType: {
    required: 'Tipo de telhado é obrigatório'
  },
  name: {
    required: 'Nome é obrigatório',
    minLength: {
      value: 2,
      message: 'Nome deve ter pelo menos 2 caracteres'
    }
  },
  whatsapp: {
    required: 'WhatsApp é obrigatório',
    pattern: {
      value: /^\d{10,11}$/,
      message: 'Número deve incluir DDD (ex: 11999999999)'
    }
  },
  email: {
    required: 'Email é obrigatório',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  }
}

// Hook for location step form
export function useLocationForm(): UseFormReturn<LocationFormData> {
  const { leadData, updateLeadData } = useSimuladorStore()
  
  return useForm<LocationFormData>({
    defaultValues: {
      zipCode: leadData.zipCode || '',
      city: leadData.city || '',
      state: leadData.state || ''
    },
    mode: 'onChange'
  })
}

// Hook for consumption step form
export function useConsumptionForm(): UseFormReturn<ConsumptionFormData> {
  const { leadData, updateLeadData } = useSimuladorStore()
  
  return useForm<ConsumptionFormData>({
    defaultValues: {
      billValue: leadData.billValue || 0,
      connectionType: leadData.connectionType || undefined
    },
    mode: 'onChange'
  })
}

// Hook for technical fit step form
export function useTechnicalFitForm(): UseFormReturn<TechnicalFitFormData> {
  const { leadData, updateLeadData } = useSimuladorStore()
  
  return useForm<TechnicalFitFormData>({
    defaultValues: {
      roofType: leadData.roofType || undefined
    },
    mode: 'onChange'
  })
}

// Hook for contact step form
export function useContactForm(): UseFormReturn<ContactFormData> {
  const { leadData, updateLeadData } = useSimuladorStore()
  
  return useForm<ContactFormData>({
    defaultValues: {
      name: leadData.name || '',
      whatsapp: leadData.whatsapp || '',
      email: leadData.email || ''
    },
    mode: 'onChange'
  })
}

// Generic hook for any step
export function useSimuladorStepForm<T extends Partial<LeadData>>(
  step: typeof SIMULADOR_STEPS[keyof typeof SIMULADOR_STEPS]
): UseFormReturn<T> {
  const { leadData } = useSimuladorStore()
  
  return useForm<T>({
    defaultValues: leadData as T,
    mode: 'onChange'
  })
}
