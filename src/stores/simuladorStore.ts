import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getSessionId } from '../lib/session'
import { UTMParameters, getCurrentUTMParameters } from '../lib/utm'

// Simulador step definitions
export const SIMULADOR_STEPS = {
  LOCATION: 0,
  CONSUMPTION: 1,
  TECHNICAL_FIT: 2,
  CONTACT: 3
} as const

export type SimuladorStep = typeof SIMULADOR_STEPS[keyof typeof SIMULADOR_STEPS]

// Lead data interface matching database schema
export interface LeadData {
  // Location step
  zipCode: string
  city: string
  state: string
  
  // Consumption step
  billValue: number
  connectionType: 'mono' | 'bi' | 'tri'
  
  // Technical fit step
  roofType: 'clay' | 'metal' | 'fiber' | 'slab'
  
  // Contact step
  name: string
  whatsapp: string
  email: string
}

// Validation state for each step
export interface StepValidation {
  [SIMULADOR_STEPS.LOCATION]: boolean
  [SIMULADOR_STEPS.CONSUMPTION]: boolean
  [SIMULADOR_STEPS.TECHNICAL_FIT]: boolean
  [SIMULADOR_STEPS.CONTACT]: boolean
}

// Main simulador state interface
export interface SimuladorState {
  // Current step and navigation
  currentStep: SimuladorStep
  completedSteps: Set<SimuladorStep>
  
  // Lead data
  leadData: Partial<LeadData>
  
  // Session management
  sessionId: string
  
  // UTM tracking
  utmParameters: UTMParameters
  
  // Validation state
  stepValidation: StepValidation
  
  // Constants
  SIMULADOR_STEPS: typeof SIMULADOR_STEPS
  
  // Actions
  setCurrentStep: (step: SimuladorStep) => void
  nextStep: () => void
  previousStep: () => void
  updateLeadData: (data: Partial<LeadData>) => void
  markStepComplete: (step: SimuladorStep) => void
  isStepValid: (step: SimuladorStep) => boolean
  canNavigateToStep: (step: SimuladorStep) => boolean
  resetSimulador: () => void
  getProgress: () => number
  getUTMParameters: () => UTMParameters
}

// Initial state
const initialState = {
  currentStep: SIMULADOR_STEPS.LOCATION,
  completedSteps: new Set<SimuladorStep>(),
  leadData: {},
  sessionId: getSessionId(),
  utmParameters: getCurrentUTMParameters(),
  stepValidation: {
    [SIMULADOR_STEPS.LOCATION]: false,
    [SIMULADOR_STEPS.CONSUMPTION]: false,
    [SIMULADOR_STEPS.TECHNICAL_FIT]: false,
    [SIMULADOR_STEPS.CONTACT]: false,
  }
}

// Step validation functions
const validateLocationStep = (data: Partial<LeadData>): boolean => {
  return !!(data.zipCode && data.city && data.state)
}

const validateConsumptionStep = (data: Partial<LeadData>): boolean => {
  return !!(data.billValue && data.billValue > 0 && data.connectionType)
}

const validateTechnicalFitStep = (data: Partial<LeadData>): boolean => {
  return !!(data.roofType)
}

const validateContactStep = (data: Partial<LeadData>): boolean => {
  return !!(data.name && data.whatsapp && data.email)
}

// Validation function mapping
const stepValidators = {
  [SIMULADOR_STEPS.LOCATION]: validateLocationStep,
  [SIMULADOR_STEPS.CONSUMPTION]: validateConsumptionStep,
  [SIMULADOR_STEPS.TECHNICAL_FIT]: validateTechnicalFitStep,
  [SIMULADOR_STEPS.CONTACT]: validateContactStep,
}

export const useSimuladorStore = create<SimuladorState>()(
  persist(
    (set, get) => ({
      ...initialState,
      SIMULADOR_STEPS, // Add SIMULADOR_STEPS to the store
      
      setCurrentStep: (step: SimuladorStep) => {
        const state = get()
        if (state.canNavigateToStep(step)) {
          set({ currentStep: step })
        }
      },
      
      nextStep: () => {
        const state = get()
        const currentStep = state.currentStep
        const nextStep = currentStep + 1
        
        if (nextStep <= SIMULADOR_STEPS.CONTACT && state.canNavigateToStep(nextStep)) {
          set({ currentStep: nextStep })
        }
      },
      
      previousStep: () => {
        const state = get()
        const currentStep = state.currentStep
        const previousStep = currentStep - 1
        
        if (previousStep >= SIMULADOR_STEPS.LOCATION) {
          set({ currentStep: previousStep })
        }
      },
      
      updateLeadData: (data: Partial<LeadData>) => {
        set((state) => {
          const newLeadData = { ...state.leadData, ...data }
          
          // Update validation for all steps
          const newStepValidation = {
            [SIMULADOR_STEPS.LOCATION]: stepValidators[SIMULADOR_STEPS.LOCATION](newLeadData),
            [SIMULADOR_STEPS.CONSUMPTION]: stepValidators[SIMULADOR_STEPS.CONSUMPTION](newLeadData),
            [SIMULADOR_STEPS.TECHNICAL_FIT]: stepValidators[SIMULADOR_STEPS.TECHNICAL_FIT](newLeadData),
            [SIMULADOR_STEPS.CONTACT]: stepValidators[SIMULADOR_STEPS.CONTACT](newLeadData),
          }
          
          return {
            leadData: newLeadData,
            stepValidation: newStepValidation
          }
        })
      },
      
      markStepComplete: (step: SimuladorStep) => {
        set((state) => ({
          completedSteps: new Set([...state.completedSteps, step])
        }))
      },
      
      isStepValid: (step: SimuladorStep) => {
        const state = get()
        return state.stepValidation[step]
      },
      
      canNavigateToStep: (step: SimuladorStep) => {
        const state = get()
        
        // Can always go to first step
        if (step === SIMULADOR_STEPS.LOCATION) {
          return true
        }
        
        // Can navigate to a step if all previous steps are valid
        for (let i = SIMULADOR_STEPS.LOCATION; i < step; i++) {
          if (!state.stepValidation[i]) {
            return false
          }
        }
        
        return true
      },
      
      resetSimulador: () => {
        set({
          ...initialState,
          sessionId: getSessionId(), // Generate new session ID
          utmParameters: getCurrentUTMParameters() // Preserve UTM parameters across reset
        })
      },
      
      getProgress: () => {
        const state = get()
        const totalSteps = Object.keys(SIMULADOR_STEPS).length
        const validSteps = Object.values(state.stepValidation).filter(Boolean).length
        return (validSteps / totalSteps) * 100
      },
      
      getUTMParameters: () => {
        const state = get()
        return state.utmParameters
      }
    }),
    {
      name: 'simulador-storage',
      partialize: (state) => ({
        leadData: state.leadData,
        sessionId: state.sessionId,
        currentStep: state.currentStep,
        completedSteps: Array.from(state.completedSteps), // Convert Set to Array for serialization
        utmParameters: state.utmParameters,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert Array back to Set after rehydration
          state.completedSteps = new Set(state.completedSteps as unknown as SimuladorStep[])
          
          // Recalculate validation state
          const newStepValidation = {
            [SIMULADOR_STEPS.LOCATION]: stepValidators[SIMULADOR_STEPS.LOCATION](state.leadData),
            [SIMULADOR_STEPS.CONSUMPTION]: stepValidators[SIMULADOR_STEPS.CONSUMPTION](state.leadData),
            [SIMULADOR_STEPS.TECHNICAL_FIT]: stepValidators[SIMULADOR_STEPS.TECHNICAL_FIT](state.leadData),
            [SIMULADOR_STEPS.CONTACT]: stepValidators[SIMULADOR_STEPS.CONTACT](state.leadData),
          }
          
          state.stepValidation = newStepValidation
        }
      }
    }
  )
)