import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useSimuladorStore } from '../../stores/simuladorStore';
import { validationRules, type LocationFormData } from '../../hooks/useSimuladorForm';
import { CEPInput } from '../forms/CEPInput';
import { Button } from '../ui/button';
import type { AddressLookup } from '../../lib/brasilapi';

export const LocationStep: React.FC = () => {
  const { leadData, updateLeadData, nextStep, isStepValid, SIMULADOR_STEPS } = useSimuladorStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<LocationFormData>({
    defaultValues: {
      zipCode: leadData.zipCode || '',
      city: leadData.city || '',
      state: leadData.state || ''
    },
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Update store when form values change
  useEffect(() => {
    updateLeadData(watchedValues);
  }, [watchedValues, updateLeadData]);

  const handleAddressFound = (address: AddressLookup) => {
    setValue('city', address.city);
    setValue('state', address.state);
    
    // Update store immediately
    updateLeadData({
      zipCode: address.cep,
      city: address.city,
      state: address.state
    });
  };

  const handleCEPChange = (cep: string) => {
    setValue('zipCode', cep);
  };

  const onSubmit = (data: LocationFormData) => {
    updateLeadData(data);
    nextStep();
  };

  const canProceed = isStepValid(SIMULADOR_STEPS.LOCATION);

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
          Onde você mora?
        </h2>
        <p className="text-gray-600 text-lg">
          Informe seu CEP para calcularmos o potencial solar da sua região
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* CEP Input */}
        <div className="space-y-2">
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            CEP *
          </label>
          <CEPInput
            value={watchedValues.zipCode}
            onChange={handleCEPChange}
            onAddressFound={handleAddressFound}
            placeholder="00000-000"
            className="input-solarsys"
          />
          {errors.zipCode && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.zipCode.message}
            </motion.p>
          )}
        </div>

        {/* City Input */}
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade *
          </label>
          <input
            {...register('city', validationRules.city)}
            type="text"
            className="input-solarsys w-full"
            placeholder="Nome da cidade"
          />
          {errors.city && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.city.message}
            </motion.p>
          )}
        </div>

        {/* State Input */}
        <div className="space-y-2">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado *
          </label>
          <select
            {...register('state', validationRules.state)}
            className="input-solarsys w-full"
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </select>
          {errors.state && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm"
            >
              {errors.state.message}
            </motion.p>
          )}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-6">
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

export default LocationStep;