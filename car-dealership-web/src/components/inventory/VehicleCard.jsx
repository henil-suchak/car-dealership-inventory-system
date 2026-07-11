import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const VehicleCard = ({ vehicle, onPurchase }) => {
  const { user } = useAuth();
  const isOutOfStock = vehicle.quantityInStock === 0;

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      {/* Premium Image Placeholder Area */}
      <div className="relative h-48 w-full bg-gradient-to-br from-primary-500 to-accent-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary-700 dark:text-primary-400 shadow-lg">
          {vehicle.year}
        </div>
        {/* Subtle geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_10%,_transparent_20%)] bg-[length:20px_20px]"></div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              {vehicle.category}
            </p>
          </div>
        </div>
        
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Starting at</p>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              ${vehicle.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isOutOfStock ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
            {isOutOfStock ? 'Out of Stock' : `${vehicle.quantityInStock} Available`}
          </span>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
          <Button 
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
              isOutOfStock 
                ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 border-none' 
                : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50'
            }`} 
            disabled={isOutOfStock}
            onClick={() => onPurchase(vehicle.id)}
          >
            {isOutOfStock ? 'Sold Out' : 'Purchase Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
