import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FormData {
  zipCode: string
  city: string
  state: string
  billValue: number
  connectionType: 'mono' | 'bi' | 'tri'
  roofType: 'clay' | 'metal' | 'fiber' | 'slab'
  name: string
  whatsapp: string
  email: string
}

export default function SimuladorSimple() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<Partial<FormData>>({ billValue: 150 })
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState('')

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const lookupCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    setIsLoadingCep(true)
    setCepError('')

    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`)
      if (!response.ok) {
        throw new Error('CEP não encontrado')
      }

      const data = await response.json()
      updateFormData({
        zipCode: `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`,
        city: data.city,
        state: data.state
      })
    } catch (error) {
      setCepError('CEP não encontrado. Verifique e tente novamente.')
      updateFormData({ city: '', state: '' })
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleCepChange = (value: string) => {
    // Format CEP as user types
    const cleanValue = value.replace(/\D/g, '')
    let formattedValue = cleanValue
    if (cleanValue.length > 5) {
      formattedValue = `${cleanValue.slice(0, 5)}-${cleanValue.slice(5, 8)}`
    }
    
    updateFormData({ zipCode: formattedValue })

    // Auto-lookup when CEP is complete
    if (cleanValue.length === 8) {
      lookupCep(cleanValue)
    } else {
      // Clear city/state if CEP is incomplete
      updateFormData({ city: '', state: '' })
      setCepError('')
    }
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Final step - go to results
      navigate('/resultado', { state: { leadData: formData } })
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Localização</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.zipCode || ''}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={9}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {isLoadingCep && (
                  <p className="text-sm text-blue-600 mt-1">
                    Buscando endereço...
                  </p>
                )}
                {cepError && (
                  <p className="text-sm text-red-600 mt-1">
                    {cepError}
                  </p>
                )}
              </div>
              
              {formData.city && formData.state && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Endereço encontrado:
                      </p>
                      <p className="text-sm text-green-700">
                        {formData.city}, {formData.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Consumo de Energia</h2>
            
            {/* Bill Value Slider */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor da conta de luz
              </label>
              <div className="px-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>R$ 50</span>
                  <span className="text-2xl font-bold text-green-600">
                    R$ {formData.billValue || 150}
                  </span>
                  <span>R$ 1000+</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={formData.billValue || 150}
                  onChange={(e) => updateFormData({ billValue: Number(e.target.value) })}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((formData.billValue || 150) - 50) / (1000 - 50) * 100}%, #e5e7eb ${((formData.billValue || 150) - 50) / (1000 - 50) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Baixo</span>
                  <span>Médio</span>
                  <span>Alto</span>
                </div>
              </div>
            </div>

            {/* Connection Type Buttons */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Tipo de conexão
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { 
                    value: 'mono', 
                    label: 'Monofásico',
                    description: 'Residências pequenas',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    )
                  },
                  { 
                    value: 'bi', 
                    label: 'Bifásico',
                    description: 'Residências médias',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4-4m0 0l-4-4m4 4H3" />
                      </svg>
                    )
                  },
                  { 
                    value: 'tri', 
                    label: 'Trifásico',
                    description: 'Residências grandes',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4-4m0 0l-4-4m4 4H3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData({ connectionType: option.value as 'mono' | 'bi' | 'tri' })}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      formData.connectionType === option.value
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className={`flex flex-col items-center space-y-3 ${
                      formData.connectionType === option.value ? 'animate-pulse' : ''
                    }`}>
                      <div className={`transition-colors duration-300 ${
                        formData.connectionType === option.value ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {option.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm opacity-75">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Tipo de Telhado</h2>
            
            {/* Roof Type Buttons */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Material do telhado
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    value: 'clay', 
                    label: 'Telha de Barro',
                    description: 'Tradicional e resistente',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4" />
                      </svg>
                    )
                  },
                  { 
                    value: 'metal', 
                    label: 'Telha Metálica',
                    description: 'Moderna e durável',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )
                  },
                  { 
                    value: 'fiber', 
                    label: 'Fibrocimento',
                    description: 'Econômica e prática',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    )
                  },
                  { 
                    value: 'slab', 
                    label: 'Laje',
                    description: 'Estrutura plana',
                    icon: (
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    )
                  }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFormData({ roofType: option.value as 'clay' | 'metal' | 'fiber' | 'slab' })}
                    className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                      formData.roofType === option.value
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                    }`}
                  >
                    <div className={`flex flex-col items-center space-y-3 ${
                      formData.roofType === option.value ? 'animate-pulse' : ''
                    }`}>
                      <div className={`transition-colors duration-300 ${
                        formData.roofType === option.value ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {option.icon}
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{option.label}</div>
                        <div className="text-sm opacity-75">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Seus Dados</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Seu nome"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp || ''}
                  onChange={(e) => updateFormData({ whatsapp: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="seu@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.zipCode && formData.city && formData.state && !isLoadingCep && !cepError
      case 1:
        return formData.billValue && formData.connectionType
      case 2:
        return formData.roofType
      case 3:
        return formData.name && formData.whatsapp && formData.email
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #16a34a;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease-in-out;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
          }
          
          .slider::-moz-range-thumb {
            height: 24px;
            width: 24px;
            border-radius: 50%;
            background: #16a34a;
            cursor: pointer;
            border: 3px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
            transition: all 0.2s ease-in-out;
          }
          
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(22, 163, 74, 0.4);
          }
        `
      }} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Simulador Solar
            </h1>
            <p className="text-gray-600">
              Passo {step + 1} de 4
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 0}
              className="px-6 py-2 text-gray-600 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Anterior
            </button>
            
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="px-6 py-2 bg-green-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
            >
              {step === 3 ? 'Ver Resultado' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}