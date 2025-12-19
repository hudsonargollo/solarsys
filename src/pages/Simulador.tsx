import { useSimuladorStore, SIMULADOR_STEPS } from '../stores/simuladorStore'
import { 
  StepNavigation, 
  LocationStep, 
  ConsumptionStep, 
  TechnicalFitStep, 
  ContactStep 
} from '../components/simulador'

export default function Simulador() {
  const { currentStep } = useSimuladorStore()

  const renderStepContent = () => {
    switch (currentStep) {
      case SIMULADOR_STEPS.LOCATION:
        return <LocationStep />
      
      case SIMULADOR_STEPS.CONSUMPTION:
        return <ConsumptionStep />
      
      case SIMULADOR_STEPS.TECHNICAL_FIT:
        return <TechnicalFitStep />
      
      case SIMULADOR_STEPS.CONTACT:
        return <ContactStep />
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-solarsys-green mb-2">
              Simulador Solar
            </h1>
            <p className="text-gray-600">
              Descubra em poucos passos se a energia solar é ideal para você
            </p>
          </div>

          {/* Step Navigation */}
          <StepNavigation />

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mt-8">
            {renderStepContent()}
          </div>


        </div>
      </div>
    </div>
  )
}