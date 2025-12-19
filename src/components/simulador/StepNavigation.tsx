import { useSimuladorStore, SIMULADOR_STEPS } from '../../stores/simuladorStore'

// Step labels in Portuguese
const STEP_LABELS = {
  [SIMULADOR_STEPS.LOCATION]: 'Localização',
  [SIMULADOR_STEPS.CONSUMPTION]: 'Consumo',
  [SIMULADOR_STEPS.TECHNICAL_FIT]: 'Adequação Técnica',
  [SIMULADOR_STEPS.CONTACT]: 'Contato'
}

export function StepNavigation() {
  const {
    currentStep,
    setCurrentStep,
    canNavigateToStep,
    isStepValid,
    getProgress
  } = useSimuladorStore()

  const progress = getProgress()

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-solarsys-peach h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center mb-8">
        {Object.entries(STEP_LABELS).map(([stepNum, label]) => {
          const step = parseInt(stepNum)
          const isActive = currentStep === step
          const isCompleted = isStepValid(step)
          const canNavigate = canNavigateToStep(step)

          return (
            <div key={step} className="flex flex-col items-center">
              <button
                onClick={() => setCurrentStep(step)}
                disabled={!canNavigate}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-solarsys-peach text-white'
                    : isCompleted
                    ? 'bg-solarsys-green text-white'
                    : canNavigate
                    ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isCompleted ? '✓' : step + 1}
              </button>
              <span
                className={`
                  mt-2 text-xs text-center max-w-20
                  ${isActive
                    ? 'text-solarsys-peach font-medium'
                    : isCompleted
                    ? 'text-solarsys-green'
                    : 'text-gray-500'
                  }
                `}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => useSimuladorStore.getState().previousStep()}
          disabled={currentStep === SIMULADOR_STEPS.LOCATION}
          className="
            px-6 py-2 rounded-lg border border-gray-300 text-gray-700
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-gray-50 transition-colors
          "
        >
          Anterior
        </button>
        
        <button
          onClick={() => useSimuladorStore.getState().nextStep()}
          disabled={!isStepValid(currentStep) || currentStep === SIMULADOR_STEPS.CONTACT}
          className="
            px-6 py-2 rounded-lg bg-solarsys-peach text-white
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-opacity-90 transition-colors
          "
        >
          {currentStep === SIMULADOR_STEPS.CONTACT ? 'Finalizar' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}