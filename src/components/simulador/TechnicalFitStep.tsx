import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSimuladorStore } from '../../stores/simuladorStore';
import { validationRules, type TechnicalFitFormData } from '../../hooks/useSimuladorForm';
import { Button } from '../ui/button';

export const TechnicalFitStep: React.FC = () => {
  const { leadData, updateLeadData, nextStep, previousStep, isStepValid, SIMULADOR_STEPS } = useSimuladorStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<TechnicalFitFormData>({
    defaultValues: {
      roofType: leadData.roofType || undefined
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Update store when form values change
  useEffect(() => {
    updateLeadData(watchedValues);
  }, [watchedValues, updateLeadData]);

  const onSubmit = (data: TechnicalFitFormData) => {
    updateLeadData(data);
    nextStep();
  };

  const canProceed = isStepValid(SIMULADOR_STEPS.TECHNICAL_FIT);

  // Show warning for problematic roof types
  const showRoofWarning = () => {
    const { roofType } = watchedValues;
    
    if (roofType === 'fiber') {
      return {
        type: 'warning',
        message: 'Telhados de fibrocimento podem requerer reforços estruturais, o que pode aumentar o custo da instalação.'
      };
    }
    
    return null;
  };

  const roofWarning = showRoofWarning();

  const roofOptions = [
    {
      value: 'clay',
      label: 'Telha Cerâmica',
      description: 'Telhas de barro tradicionais',
      icon: '🏠',
      recommended: true
    },
    {
      value: 'metal',
      label: 'Telha Metálica',
      description: 'Telhas de aço ou alumínio',
      icon: '🏭',
      recommended: true
    },
    {
      value: 'fiber',
      label: 'Fibrocimento',
      description: 'Telhas de amianto ou fibra',
      icon: '🏢',
      recommended: false
    },
    {
      value: 'slab',
      label: 'Laje',
      description: 'Cobertura em concreto',
      icon: '🏬',
      recommended: true
    }
  ];

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
          Como é o seu telhado?
        </h2>
        <p className="text-gray-600 text-lg">
          Essas informações nos ajudam a avaliar a viabilidade da instalação
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Roof Type Selection */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de telhado *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roofOptions.map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  card-solarsys cursor-pointer border-2 transition-all duration-200 relative
                  ${watchedValues.roofType === option.value 
                    ? 'border-solarsys-green bg-solarsys-green/5' 
                    : 'border-gray-200 hover:border-solarsys-green/50'
                  }
                `}
              >
                <input
                  {...register('roofType', validationRules.roofType)}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                
                {/* Recommended Badge */}
                {option.recommended && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Recomendado
                    </span>
                  </div>
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </div>
              </motion.label>
            ))}
          </div>
          {errors.roofType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.roofType.message}
            </motion.p>
          )}
        </div>

        {/* Roof Warning */}
        {roofWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl border-l-4 bg-yellow-50 border-yellow-400 text-yellow-800"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {roofWarning.message}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Informação importante
              </h4>
              <p className="text-sm text-blue-700">
                Nossa equipe técnica fará uma avaliação completa do seu telhado durante a visita técnica, 
                incluindo análise estrutural e de sombreamento.
              </p>
            </div>
          </div>
        </div>

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

export default TechnicalFitStep;