import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';

const vehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number({ invalid_type_error: 'Year must be valid' }).int().min(1886).max(new Date().getFullYear() + 1),
  price: z.number({ invalid_type_error: 'Price must be valid' }).min(0),
  quantityInStock: z.number({ invalid_type_error: 'Quantity must be valid' }).int().min(0),
  category: z.enum(['SEDAN', 'SUV', 'TRUCK', 'COUPE', 'CONVERTIBLE', 'HATCHBACK', 'VAN'], {
    invalid_type_error: 'Invalid category',
  }),
  mileage: z.number({ invalid_type_error: 'Mileage must be valid' }).int().min(0),
  vin: z.string().min(17, 'VIN must be 17 characters').max(17, 'VIN must be 17 characters'),
  trimLevel: z.string().optional(),
  engineType: z.string().optional(),
  transmission: z.string().optional(),
  color: z.string().optional(),
  status: z.enum(['AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE', 'RESERVED', 'SOLD']).default('AVAILABLE'),
});

const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
  const isEdit = !!initialData;
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      quantityInStock: 1,
      category: 'SEDAN',
      mileage: 0,
      vin: '',
      trimLevel: '',
      engineType: '',
      transmission: 'Automatic',
      color: '',
      status: 'AVAILABLE',
    },
  });

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  return (
    <div className="bg-zinc-950 p-8 border border-zinc-800 auth-form-container">
      <h2 className="text-2xl font-light font-serif uppercase tracking-widest text-white mb-8 border-b border-zinc-800 pb-4">
        {isEdit ? 'Modify ' : 'Acquire '}
        <span className="font-bold text-gray-500">Asset</span>
      </h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input id="make" label="Make" {...register('make')} error={errors.make?.message} />
          <Input id="model" label="Model" {...register('model')} error={errors.model?.message} />
          <Input id="year" label="Year" type="number" {...register('year', { valueAsNumber: true })} error={errors.year?.message} />
          <Input id="vin" label="VIN" {...register('vin')} error={errors.vin?.message} />
          <Input id="mileage" label="Mileage" type="number" {...register('mileage', { valueAsNumber: true })} error={errors.mileage?.message} />
          <Input id="price" label="Valuation" type="number" step="0.01" {...register('price', { valueAsNumber: true })} error={errors.price?.message} />
          <Input id="quantityInStock" label="Units" type="number" {...register('quantityInStock', { valueAsNumber: true })} error={errors.quantityInStock?.message} />
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="category" className="block uppercase tracking-widest font-bold text-[0.75rem] text-zinc-400">Category</label>
            <select 
              id="category"
              {...register('category')}
              className="block w-full bg-zinc-900/80 text-white border border-zinc-800 px-4 py-3 font-mono text-sm focus:outline-none focus:border-white transition-colors uppercase"
            >
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="TRUCK">Truck</option>
              <option value="COUPE">Coupe</option>
              <option value="CONVERTIBLE">Convertible</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="VAN">Van</option>
            </select>
            {errors.category && <p className="text-xs text-red-500 mt-1 uppercase tracking-widest">{errors.category.message}</p>}
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="status" className="block uppercase tracking-widest font-bold text-[0.75rem] text-zinc-400">Status</label>
            <select 
              id="status"
              {...register('status')}
              className="block w-full bg-zinc-900/80 text-white border border-zinc-800 px-4 py-3 font-mono text-sm focus:outline-none focus:border-white transition-colors uppercase"
            >
              <option value="AVAILABLE">Available</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
            </select>
            {errors.status && <p className="text-xs text-red-500 mt-1 uppercase tracking-widest">{errors.status.message}</p>}
          </div>

          <Input id="trimLevel" label="Trim Level" {...register('trimLevel')} error={errors.trimLevel?.message} />
          <Input id="engineType" label="Engine" {...register('engineType')} error={errors.engineType?.message} />
          <Input id="transmission" label="Transmission" {...register('transmission')} error={errors.transmission?.message} />
          <Input id="color" label="Color" {...register('color')} error={errors.color?.message} />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 mt-8 pt-8 border-t border-zinc-800">
          <button 
             type="button" 
             onClick={onCancel} 
             disabled={isSubmitting}
             className="px-8 py-3 border border-zinc-700 text-zinc-400 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
             type="submit" 
             disabled={isSubmitting}
             className="px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Confirm Action'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
