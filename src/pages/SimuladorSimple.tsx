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
  const [formData, setFormData] = useState<Partial<FormData>>({})
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
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Consumo de Energia</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor da conta de luz (R$)
                </label>
                <input
                  type="number"
                  value={formData.billValue || ''}
                  onChange={(e) => updateFormData({ billValue: Number(e.target.value) })}
                  placeholder="150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de conexão
                </label>
                <select
                  value={formData.connectionType || ''}
                  onChange={(e) => updateFormData({ connectionType: e.target.value as 'mono' | 'bi' | 'tri' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione o tipo</option>
                  <option value="mono">Monofásico</option>
                  <option value="bi">Bifásico</option>
                  <option value="tri">Trifásico</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tipo de Telhado</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material do telhado
                </label>
                <select
                  value={formData.roofType || ''}
                  onChange={(e) => updateFormData({ roofType: e.target.value as 'clay' | 'metal' | 'fiber' | 'slab' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Selecione o material</option>
                  <option value="clay">Telha de barro</option>
                  <option value="metal">Telha metálica</option>
                  <option value="fiber">Fibrocimento</option>
                  <option value="slab">Laje</option>
                </select>
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