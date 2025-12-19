import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSimuladorStore } from '../../stores/simuladorStore';
import { validationRules, type ConsumptionFormData } from '../../hooks/useSimuladorForm';
import { Button } from '../ui/button';

export const ConsumptionStep: React.FC = () => {
  const { leadData, updateLeadData, nextStep, previousStep, isStepValid, SIMULADOR_STEPS } = useSimuladorStore();
  const [formattedValue, setFormattedValue] = useState('');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ConsumptionFormData>({
    defaultValues: {
      billValue: leadData.billValue || 0,
      connectionType: leadData.connectionType || undefined
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Update store when form values change
  useEffect(() => {
    updateLeadData(watchedValues);
  }, [watchedValues, updateLeadData]);

  // Format currency display
  useEffect(() => {
    if (watchedValues.billValue) {
      setFormattedValue(
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(watchedValues.billValue)
      );
    }
  }, [watchedValues.billValue]);

  const handleBillValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    const numericValue = parseInt(value) / 100; // Convert cents to reais
    setValue('billValue', numericValue);
  };

  const onSubmit = (data: ConsumptionFormData) => {
    updateLeadData(data);
    nextStep();
  };

  const canProceed = isStepValid(SIMULADOR_STEPS.CONSUMPTION);

  // Show warning for low bills or monofásico + low bills
  const showWarning = () => {
    const { billValue, connectionType } = watchedValues;
    
    if (billValue < 150) {
      return {
        type: 'error',
        message: 'Contas abaixo de R$ 150 geralmente não são viáveis para energia solar devido ao custo de disponibilidade.'
      };
    }
    
    if (connectionType === 'mono' && billValue < 250) {
      return {
        type: 'warning',
        message: 'Atenção: Conexões monofásicas com contas baixas podem ter retorno mais longo. Nossa equipe avaliará sua viabilidade.'
      };
    }
    
    return null;
  };

  const warning = showWarning();

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
          Qual o valor da sua conta de luz?
        </h2>
        <p className="text-gray-600 text-lg">
          Informe o valor médio mensal para calcularmos sua economia
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bill Value Input */}
        <div className="space-y-2">
          <label htmlFor="billValue" className="block text-sm font-medium text-gray-700">
            Valor médio da conta de luz *
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
              R$
            </span>
            <input
              type="text"
              value={formattedValue}
              onChange={handleBillValueChange}
              className="input-solarsys w-full pl-12 text-lg"
              placeholder="0,00"
              inputMode="numeric"
            />
          </div>
          {errors.billValue && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.billValue.message}
            </motion.p>
          )}
        </div>

        {/* Connection Type */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de conexão elétrica *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'mono', label: 'Monofásico', description: 'Até 12 kW' },
              { value: 'bi', label: 'Bifásico', description: 'Até 25 kW' },
              { value: 'tri', label: 'Trifásico', description: 'Acima de 25 kW' }
            ].map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  card-solarsys cursor-pointer border-2 transition-all duration-200
                  ${watchedValues.connectionType === option.value 
                    ? 'border-solarsys-green bg-solarsys-green/5' 
                    : 'border-gray-200 hover:border-solarsys-green/50'
                  }
                `}
              >
                <input
                  {...register('connectionType', validationRules.connectionType)}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="font-semibold text-gray-900 mb-1">
                    {option.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {option.description}
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
          {errors.connectionType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.connectionType.message}
            </motion.p>
          )}
        </div>

        {/* Warning Message */}
        {warning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
              p-4 rounded-xl border-l-4 
              ${warning.type === 'error' 
                ? 'bg-red-50 border-red-400 text-red-800' 
                : 'bg-yellow-50 border-yellow-400 text-yellow-800'
              }
            `}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {warning.type === 'error' ? (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {warning.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            type="button"
            onClick={previousStep}
            variant="outline"
            className="btn-solarsys-secondary"
          >
            Voltar
          </Button>
          
          <Button
            type="submit"
            disabled={!canProceed}
            className="btn-solarsys-primary min-w-[200px]"
          >
            Continuar
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ConsumptionStep;