import { LeadData } from '../stores/simuladorStore'
import { getHSPValue } from './database'

export interface QualificationResult {
  isQualified: boolean
  disqualificationReason?: string
  warnings: string[]
  systemSizeKwp: number
  estimatedSavings: number
  packageType: 'small' | 'medium' | 'large'
}

export interface WhatsAppMessage {
  phone: string
  text: string
  url: string
}

export class WhatsAppService {
  /**
   * Generate a pre-formatted WhatsApp message with lead details
   * Requirements: 4.1, 4.2, 4.5
   */
  static async generateMessage(
    leadData: LeadData, 
    qualification: QualificationResult
  ): Promise<WhatsAppMessage> {
    // Format phone number for WhatsApp (remove non-digits and add country code)
    const cleanPhone = leadData.whatsapp.replace(/\D/g, '')
    const phone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    
    // Generate message text with Brazilian Portuguese labels
    const text = this.formatMessageText(leadData, qualification)
    
    // Generate WhatsApp URL
    const encodedText = encodeURIComponent(text)
    const url = `https://wa.me/${phone}?text=${encodedText}`
    
    return {
      phone,
      text,
      url
    }
  }

  /**
   * Format the WhatsApp message text with proper Brazilian Portuguese labels and line breaks
   * Requirements: 4.2, 4.5
   */
  private static formatMessageText(
    leadData: LeadData, 
    qualification: QualificationResult
  ): string {
    const roofTypeLabels = {
      clay: 'Telha Cerâmica',
      metal: 'Telha Metálica', 
      fiber: 'Fibrocimento',
      slab: 'Laje'
    }

    const connectionTypeLabels = {
      mono: 'Monofásico',
      bi: 'Bifásico',
      tri: 'Trifásico'
    }

    // Format currency in Brazilian Real
    const formatCurrency = (value: number): string => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    const lines = [
      '🌞 *Nova Simulação Solar - SolarSys*',
      '',
      `👤 *Nome:* ${leadData.name}`,
      `📍 *Localização:* ${leadData.city}, ${leadData.state}`,
      `💡 *Conta de Luz:* ${formatCurrency(leadData.billValue)}`,
      `🔌 *Tipo de Ligação:* ${connectionTypeLabels[leadData.connectionType]}`,
      `🏠 *Tipo de Telhado:* ${roofTypeLabels[leadData.roofType]}`,
      '',
      '📊 *Análise do Sistema:*',
      `⚡ *Potência Estimada:* ${qualification.systemSizeKwp.toFixed(1)} kWp`,
      `💰 *Economia Estimada:* ${formatCurrency(qualification.estimatedSavings)}/mês`,
      `📦 *Categoria:* ${this.getPackageLabel(qualification.packageType)}`,
      ''
    ]

    // Add warnings if any
    if (qualification.warnings.length > 0) {
      lines.push('⚠️ *Observações:*')
      qualification.warnings.forEach(warning => {
        lines.push(`• ${warning}`)
      })
      lines.push('')
    }

    lines.push('✅ Lead qualificado e pronto para atendimento!')
    lines.push('')
    lines.push('_Mensagem gerada automaticamente pelo SolarSys_')

    return lines.join('\n')
  }

  /**
   * Get package type label in Portuguese
   */
  private static getPackageLabel(packageType: 'small' | 'medium' | 'large'): string {
    const labels = {
      small: 'Residencial Pequeno',
      medium: 'Residencial Médio', 
      large: 'Residencial Grande'
    }
    return labels[packageType]
  }

  /**
   * Calculate system size using HSP data
   * Formula: Monthly kWh / (HSP × 30 × 0.80)
   * Requirements: 2.5
   */
  static async calculateSystemSize(billValue: number, state: string): Promise<number> {
    const hspValue = await getHSPValue(state)
    if (!hspValue) {
      throw new Error(`HSP data not found for state: ${state}`)
    }

    // Estimate monthly kWh from bill value (assuming R$ 0.65 per kWh average)
    const monthlyKwh = billValue / 0.65
    
    // Apply formula: Monthly kWh / (HSP × 30 × 0.80)
    const systemSizeKwp = monthlyKwh / (hspValue * 30 * 0.80)
    
    return Math.round(systemSizeKwp * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Qualify a lead based on business rules
   * Requirements: 2.1, 2.2, 2.3, 2.4
   */
  static async qualifyLead(leadData: LeadData): Promise<QualificationResult> {
    const warnings: string[] = []
    let isQualified = true
    let disqualificationReason: string | undefined

    // Rule 1: Minimum bill value (R$ 150)
    if (leadData.billValue < 150) {
      isQualified = false
      disqualificationReason = 'Conta de luz muito baixa para viabilidade solar'
    }

    // Rule 2: Monofásico connection with low bill warning
    if (leadData.connectionType === 'mono' && leadData.billValue < 250) {
      warnings.push('Ligação monofásica com conta baixa - verificar viabilidade')
    }

    // Rule 3: Fibrocimento roof additional costs
    if (leadData.roofType === 'fiber') {
      warnings.push('Telhado de fibrocimento pode ter custos adicionais de instalação')
    }

    // Rule 4: Shaded roof disqualification (this would need additional data)
    // For now, we'll assume all roofs are suitable unless specified otherwise

    // Calculate system size
    const systemSizeKwp = await this.calculateSystemSize(leadData.billValue, leadData.state)
    
    // Estimate monthly savings (assuming 90% of current bill)
    const estimatedSavings = leadData.billValue * 0.9

    // Determine package type based on system size
    let packageType: 'small' | 'medium' | 'large'
    if (systemSizeKwp <= 3) {
      packageType = 'small'
    } else if (systemSizeKwp <= 6) {
      packageType = 'medium'
    } else {
      packageType = 'large'
    }

    return {
      isQualified,
      disqualificationReason,
      warnings,
      systemSizeKwp,
      estimatedSavings,
      packageType
    }
  }
}