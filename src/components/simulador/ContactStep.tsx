import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSimuladorStore } from '../../stores/simuladorStore';
import { validationRules, type ContactFormData } from '../../hooks/useSimuladorForm';
import { Button } from '../ui/button';
import { safeInsertLead } from '../../lib/database';
import { ErrorDisplay } from '../ui/LoadingSpinner';
import type { AppError } from '../../lib/errors';

export const ContactStep: React.FC = () => {
  const { leadData, updateLeadData, previousStep, isStepValid, SIMULADOR_STEPS, getUTMParameters } = useSimuladorStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<AppError | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ContactFormData>({
    defaultValues: {
      name: leadData.name || '',
      whatsapp: leadData.whatsapp || '',
      email: leadData.email || ''
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Update store when form values change
  useEffect(() => {
    updateLeadData(watchedValues);
  }, [watchedValues, updateLeadData]);

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 11 digits (DDD + 9 digits)
    const limitedDigits = digits.slice(0, 11);
    
    // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (limitedDigits.length <= 10) {
      return limitedDigits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    } else {
      return limitedDigits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(event.target.value);
    event.target.value = formatted;
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Clean phone number for storage (digits only)
      const cleanedData = {
        ...data,
        whatsapp: data.whatsapp.replace(/\D/g, '')
      };
      
      updateLeadData(cleanedData);
      
      // Get complete lead data and UTM parameters
      const completeLeadData = { ...leadData, ...cleanedData };
      const utmParameters = getUTMParameters();
      
      // Validate required fields
      if (!completeLeadData.name || !completeLeadData.whatsapp || !completeLeadData.email ||
          !completeLeadData.zipCode || !completeLeadData.city || !completeLeadData.state ||
          !completeLeadData.billValue || !completeLeadData.connectionType || !completeLeadData.roofType) {
        setSubmitError({
          code: 'INSUFFICIENT_DATA',
          message: 'Dados incompletos para criar o lead',
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      // Create lead in database with UTM parameters using safe method
      const { data: lead, error } = await safeInsertLead({
        name: completeLeadData.name,
        whatsapp: completeLeadData.whatsapp,
        email: completeLeadData.email,
        zip_code: completeLeadData.zipCode,
        city: completeLeadData.city,
        state: completeLeadData.state,
        bill_value: completeLeadData.billValue,
        connection_type: completeLeadData.connectionType,
        roof_type: completeLeadData.roofType,
        status: 'new'
      }, utmParameters);
      
      if (error) {
        setSubmitError(error);
        return;
      }
      
      if (!lead) {
        setSubmitError({
          code: 'UNKNOWN_ERROR',
          message: 'Erro ao salvar os dados. Tente novamente.',
          timestamp: new Date().toISOString()
        });
        return;
      }
      
      // Navigate to results page
      window.location.href = '/resultado';
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError({
        code: 'UNKNOWN_ERROR',
        message: 'Erro inesperado. Tente novamente.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetrySubmit = () => {
    setSubmitError(null);
    // Re-trigger form submission
    const form = document.querySelector('form');
    if (form) {
      form.requestSubmit();
    }
  };

  const canProceed = isStepValid(SIMULADOR_STEPS.CONTACT);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOutCirc" }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-solarsys-green mb-4">
          Quase pronto!
        </h2>
        <p className="text-gray-600 text-lg">
          Deixe seus dados para receber sua proposta personalizada
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome completo *
          </label>
          <input
            {...register('name', validationRules.name)}
            type="text"
            className="input-solarsys w-full"
            placeholder="Seu nome completo"
            autoComplete="name"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* WhatsApp Input */}
        <div className="space-y-2">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
            WhatsApp *
          </label>
          <input
            {...register('whatsapp', validationRules.whatsapp)}
            type="tel"
            className="input-solarsys w-full"
            placeholder="(11) 99999-9999"
            onChange={handlePhoneChange}
            autoComplete="tel"
            inputMode="numeric"
          />
          {errors.whatsapp && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.whatsapp.message}
            </motion.p>
          )}
          <p className="text-xs text-gray-500">
            Incluir DDD. Ex: (11) 99999-9999
          </p>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            E-mail *
          </label>
          <input
            {...register('email', validationRules.email)}
            type="email"
            className="input-solarsys w-full"
            placeholder="seu@email.com"
            autoComplete="email"
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-gray-800 mb-1">
                Seus dados estão seguros
              </h4>
              <p className="text-sm text-gray-600">
                Utilizamos suas informações apenas para elaborar sua proposta personalizada. 
                Não compartilhamos seus dados com terceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-solarsys-green/5 border border-solarsys-green/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-solarsys-green mb-4">
            Resumo da sua simulação
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Localização:</span>
              <span className="font-medium">{leadData.city}, {leadData.state}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conta de luz:</span>
              <span className="font-medium">
                {leadData.billValue ? 
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(leadData.billValue) 
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Conexão:</span>
              <span className="font-medium">
                {leadData.connectionType === 'mono' ? 'Monofásico' : 
                 leadData.connectionType === 'bi' ? 'Bifásico' : 
                 leadData.connectionType === 'tri' ? 'Trifásico' : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Telhado:</span>
              <span className="font-medium">
                {leadData.roofType === 'clay' ? 'Telha Cerâmica' :
                 leadData.roofType === 'metal' ? 'Telha Metálica' :
                 leadData.roofType === 'fiber' ? 'Fibrocimento' :
                 leadData.roofType === 'slab' ? 'Laje' : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {submitError && (
          <div className="mt-6">
            <ErrorDisplay 
              error={submitError} 
              onRetry={handleRetrySubmit}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={previousStep}
            variant="outline"
            className="btn-solarsys-secondary"
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          
          <Button
            type="submit"
            disabled={!canProceed || isSubmitting}
            className="btn-solarsys-primary min-w-[200px]"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : (
              'Ver Minha Proposta'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ContactStep;