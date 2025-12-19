import { useLocation, Link } from 'react-router-dom'

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

export default function ResultadoSimple() {
  const location = useLocation()
  const leadData = location.state?.leadData as FormData

  if (!leadData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Dados não encontrados
          </h1>
          <Link 
            to="/simulador" 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Fazer Nova Simulação
          </Link>
        </div>
      </div>
    )
  }

  // Simple calculations
  const monthlyConsumption = leadData.billValue * 0.75 // Estimate kWh from bill value
  const systemSize = monthlyConsumption * 12 / 1200 // Rough system size in kWp
  const estimatedSavings = leadData.billValue * 0.85 // 85% savings estimate
  const paybackYears = Math.round((systemSize * 4000) / (estimatedSavings * 12)) // Rough payback

  const whatsappMessage = `Olá! Fiz uma simulação no SolarSys e gostaria de mais informações sobre energia solar.

📍 Localização: ${leadData.city}, ${leadData.state}
💡 Conta de luz: R$ ${leadData.billValue}
🏠 Tipo de telhado: ${leadData.roofType}
⚡ Sistema estimado: ${systemSize.toFixed(1)} kWp
💰 Economia estimada: R$ ${estimatedSavings.toFixed(0)}/mês

Meu nome é ${leadData.name} e meu e-mail é ${leadData.email}.`

  const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-600 mb-2">
              Resultado da Simulação
            </h1>
            <p className="text-gray-600">
              Veja o potencial de economia com energia solar
            </p>
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {systemSize.toFixed(1)} kWp
              </div>
              <div className="text-gray-600">
                Potência do Sistema
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {estimatedSavings.toFixed(0)}
              </div>
              <div className="text-gray-600">
                Economia Mensal
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {(estimatedSavings * 12).toFixed(0)}
              </div>
              <div className="text-gray-600">
                Economia Anual
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {paybackYears} anos
              </div>
              <div className="text-gray-600">
                Retorno do Investimento
              </div>
            </div>
          </div>

          {/* Lead Summary */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resumo da Simulação
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Localização</h3>
                <p className="text-gray-600">
                  {leadData.city}, {leadData.state}<br />
                  CEP: {leadData.zipCode}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Consumo</h3>
                <p className="text-gray-600">
                  Conta de luz: R$ {leadData.billValue}<br />
                  Conexão: {leadData.connectionType === 'mono' ? 'Monofásica' : 
                           leadData.connectionType === 'bi' ? 'Bifásica' : 'Trifásica'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Telhado</h3>
                <p className="text-gray-600">
                  {leadData.roofType === 'clay' ? 'Telha de barro' :
                   leadData.roofType === 'metal' ? 'Telha metálica' :
                   leadData.roofType === 'fiber' ? 'Fibrocimento' : 'Laje'}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Contato</h3>
                <p className="text-gray-600">
                  {leadData.name}<br />
                  {leadData.whatsapp}<br />
                  {leadData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-green-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Quer saber mais sobre energia solar?
            </h2>
            <p className="text-green-700 mb-6">
              Fale conosco no WhatsApp e receba uma proposta personalizada!
            </p>
            
            <div className="space-y-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition-colors"
              >
                💬 Falar no WhatsApp
              </a>
              
              <div className="text-center">
                <Link 
                  to="/simulador" 
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Fazer Nova Simulação
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}