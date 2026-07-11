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
    },
  });

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
        <Input id="make" label="Make" {...register('make')} error={errors.make?.message} />
        <Input id="model" label="Model" {...register('model')} error={errors.model?.message} />
        <Input id="year" label="Year" type="number" {...register('year', { valueAsNumber: true })} error={errors.year?.message} />
        <Input id="price" label="Price" type="number" step="0.01" {...register('price', { valueAsNumber: true })} error={errors.price?.message} />
        <Input id="quantityInStock" label="Quantity in Stock" type="number" {...register('quantityInStock', { valueAsNumber: true })} error={errors.quantityInStock?.message} />
        
        <div className="flex flex-col space-y-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select 
            id="category"
            {...register('category')}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border h-10"
          >
            <option value="SEDAN">Sedan</option>
            <option value="SUV">SUV</option>
            <option value="TRUCK">Truck</option>
            <option value="COUPE">Coupe</option>
            <option value="CONVERTIBLE">Convertible</option>
            <option value="HATCHBACK">Hatchback</option>
            <option value="VAN">Van</option>
          </select>
          {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>Save</Button>
        </div>
      </form>
    </div>
  );
};

export default VehicleForm;
