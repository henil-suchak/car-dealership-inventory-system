import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const VehicleCard = ({ vehicle, onPurchase }) => {
  const { user } = useAuth();
  const isOutOfStock = vehicle.quantityInStock === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </h3>
            <p className="text-sm text-gray-500 mt-1">{vehicle.category}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {vehicle.category}
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-gray-900">
            ${vehicle.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
            In Stock: {vehicle.quantityInStock}
          </span>
        </div>

        <div className="mt-6">
          <Button 
            className="w-full" 
            disabled={isOutOfStock}
            onClick={() => onPurchase(vehicle.id)}
          >
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
