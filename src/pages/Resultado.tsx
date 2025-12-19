import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSimuladorStore } from '../stores/simuladorStore'
import { WhatsAppService, type QualificationResult } from '../lib/whatsapp'
import { safeInsertLead, safeUpdateLeadStatus } from '../lib/database'
import { Button } from '../components/ui/button'
import { LoadingSpinner, ErrorDisplay } from '../components/ui/LoadingSpinner'
import type { AppError } from '../lib/errors'

export default function Resultado() {
  const navigate = useNavigate()
  const { leadData, getUTMParameters, resetSimulador } = useSimuladorStore()
  
  const [qualification, setQualification] = useState<QualificationResult | null>(null)
  const [leadId, setLeadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AppError | null>(null)
  const [whatsappLoading, setWhatsappLoading] = useState(false)

  // Check if we have complete lead data
  const isDataComplete = leadData.name && leadData.whatsapp && leadData.email && 
                        leadData.zipCode && leadData.city && leadData.state && 
                        leadData.billValue && leadData.connectionType && leadData.roofType

  useEffect(() => {
    if (!isDataComplete) {
      // Redirect to simulador if data is incomplete
      navigate('/simulador')
      return
    }

    processLead()
  }, [isDataComplete, navigate])

  const processLead = async () => {
    try {
      setLoading(true)
      setError(null)

      // Qualify the lead
      const qualificationResult = await WhatsAppService.qualifyLead(leadData as any)
      setQualification(qualificationResult)

      // Insert lead into database
      const utmParams = getUTMParameters()
      const { data: insertedLead, error: insertError } = await safeInsertLead({
        name: leadData.name!,
        whatsapp: leadData.whatsapp!,
        email: leadData.email!,
        zip_code: leadData.zipCode!,
        city: leadData.city!,
        state: leadData.state!,
        bill_value: leadData.billValue!,
        connection_type: leadData.connectionType!,
        roof_type: leadData.roofType!,
        system_size_kwp: qualificationResult.systemSizeKwp,
        est_savings: qualificationResult.estimatedSavings,
        status: qualificationResult.isQualified ? 'qualified' : 'new',
        disqualification_reason: qualificationResult.disqualificationReason || null,
        warnings: qualificationResult.warnings.length > 0 ? qualificationResult.warnings : null
      }, utmParams)

      if (insertError) {
        throw insertError
      }

      if (insertedLead) {
        setLeadId(insertedLead.id)
      }

    } catch (err) {
      console.error('Error processing lead:', err)
      setError(err as AppError)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = async () => {
    if (!qualification || !leadId) return

    try {
      setWhatsappLoading(true)
      
      // Generate WhatsApp message
      const whatsappMessage = await WhatsAppService.generateMessage(leadData as any, qualification)
      
      // Update lead status to whatsapp_clicked
      await safeUpdateLeadStatus(leadId, 'whatsapp_clicked')
      
      // Open WhatsApp
      window.open(whatsappMessage.url, '_blank')
      
    } catch (err) {
      console.error('Error opening WhatsApp:', err)
    } finally {
      setWhatsappLoading(false)
    }
  }

  const handleStartOver = () => {
    resetSimulador()
    navigate('/simulador')
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getRoofTypeLabel = (roofType: string): string => {
    const labels = {
      clay: 'Telha Cerâmica',
      metal: 'Telha Metálica',
      fiber: 'Fibrocimento',
      slab: 'Laje'
    }
    return labels[roofType as keyof typeof labels] || roofType
  }

  const getConnectionTypeLabel = (connectionType: string): string => {
    const labels = {
      mono: 'Monofásico',
      bi: 'Bifásico',
      tri: 'Trifásico'
    }
    return labels[connectionType as keyof typeof labels] || connectionType
  }

  const getPackageLabel = (packageType: string): string => {
    const labels = {
      small: 'Residencial Pequeno',
      medium: 'Residencial Médio',
      large: 'Residencial Grande'
    }
    return labels[packageType as keyof typeof labels] || packageType
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Processando sua simulação..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorDisplay 
          error={error} 
          onRetry={processLead}
          className="max-w-md"
        />
      </div>
    )
  }

  if (!qualification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro no processamento</h2>
          <Button onClick={handleStartOver}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resultado da Simulação
          </h1>
          <p className="text-lg text-gray-600">
            Análise completa do seu potencial solar
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lead Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">👤</span>
              Seus Dados
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium">{leadData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Localização:</span>
                <span className="font-medium">{leadData.city}, {leadData.state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Conta de Luz:</span>
                <span className="font-medium">{formatCurrency(leadData.billValue!)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Ligação:</span>
                <span className="font-medium">{getConnectionTypeLabel(leadData.connectionType!)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tipo de Telhado:</span>
                <span className="font-medium">{getRoofTypeLabel(leadData.roofType!)}</span>
              </div>
            </div>
          </motion.div>

          {/* System Analysis Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              Análise do Sistema
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Potência Estimada:</span>
                <span className="font-medium text-solarsys-green">
                  {qualification.systemSizeKwp.toFixed(1)} kWp
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Economia Mensal:</span>
                <span className="font-medium text-solarsys-green">
                  {formatCurrency(qualification.estimatedSavings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoria:</span>
                <span className="font-medium">{getPackageLabel(qualification.packageType)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Qualification Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          {qualification.isQualified ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">✅</span>
                <h3 className="text-2xl font-semibold text-green-800">
                  Parabéns! Você está qualificado para energia solar
                </h3>
              </div>
              
              {qualification.warnings.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Observações importantes:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {qualification.warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-700">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  onClick={handleWhatsAppClick}
                  disabled={whatsappLoading}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                  size="lg"
                >
                  {whatsappLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Abrindo WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl mr-2">📱</span>
                      Falar com Especialista
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  size="lg"
                >
                  Nova Simulação
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">❌</span>
                <h3 className="text-2xl font-semibold text-red-800">
                  Infelizmente, solar pode não ser viável no momento
                </h3>
              </div>
              
              {qualification.disqualificationReason && (
                <p className="text-red-700 mb-4">
                  <strong>Motivo:</strong> {qualification.disqualificationReason}
                </p>
              )}

              <p className="text-red-700 mb-6">
                Mas não desista! Entre em contato conosco para explorar outras opções 
                ou aguarde mudanças em seu perfil de consumo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleWhatsAppClick}
                  disabled={whatsappLoading}
                  variant="outline"
                  className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
                  size="lg"
                >
                  {whatsappLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Abrindo WhatsApp...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl mr-2">📱</span>
                      Falar Mesmo Assim
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  size="lg"
                >
                  Tentar Novamente
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-500">
            Esta simulação é uma estimativa baseada nos dados fornecidos. 
            Para um orçamento preciso, nossa equipe fará uma análise detalhada.
          </p>
        </motion.div>
      </div>
    </div>
  )
}