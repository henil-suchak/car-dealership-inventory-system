import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const VehicleCard = ({ vehicle, onPurchase, onEdit, onRestock, onDelete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOutOfStock = vehicle.quantityInStock === 0;

  const statusColors = {
    AVAILABLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    IN_TRANSIT: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    MAINTENANCE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    RESERVED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    SOLD: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };

  const statusText = vehicle.status || (isOutOfStock ? 'SOLD' : 'AVAILABLE');
  const statusColor = statusColors[statusText] || statusColors.AVAILABLE;

  const getFallbackImage = (make, category) => {
    const catLower = category?.toLowerCase() || '';
    
    // Use locally generated car stock images
    const carImages = {
      sedan: '/images/cars/sedan.png',
      truck: '/images/cars/truck.png',
      suv: '/images/cars/suv.png',
      coupe: '/images/cars/sports.png',
      hatchback: '/images/cars/sedan.png', // Fallback hatchback to sedan
      sports: '/images/cars/sports.png',
      default: '/images/cars/default.png'
    };

    if (catLower && carImages[catLower]) return carImages[catLower];
    return carImages.default;
  };

  // Derive an image url from media array if it exists, fallback to curated stock images
  const primaryMedia = vehicle.media && vehicle.media.length > 0 ? (vehicle.media.find(m => m.isPrimary) || vehicle.media[0]) : null;
  const imageUrl = primaryMedia?.mediaUrl || getFallbackImage(vehicle.make, vehicle.category);

  return (
    <div 
      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
      className="group bg-zinc-900 border border-zinc-800 hover:border-gray-500 transition-all duration-700 cursor-pointer overflow-hidden relative"
    >
      <div className="relative h-64 w-full bg-black overflow-hidden flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
        ) : (
          <div className="absolute inset-0 bg-zinc-800"></div>
        )}
        
        <div className="absolute top-4 right-4 bg-white px-3 py-1 text-xs font-bold text-black uppercase tracking-widest">
          {vehicle.year || 'NEW'}
        </div>
        <div className="absolute top-4 left-4">
           <span className={`text-xs font-bold px-3 py-1 uppercase tracking-widest ${statusColor} text-white`}>
              {statusText.replace('_', ' ')}
           </span>
        </div>
      </div>

      <div className="p-8">
        <div>
           <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">{vehicle.make} • {vehicle.category}</p>
           <h3 className="text-3xl font-light text-white mb-2 font-serif line-clamp-1">
             {vehicle.model}
           </h3>
           <p className="text-zinc-500 text-xs mt-1 uppercase tracking-wider font-semibold">
             {vehicle.mileage ? vehicle.mileage.toLocaleString() + ' MI' : 'O MI'}
           </p>
        </div>
        
        <div className="mt-8 flex flex-wrap gap-2 text-xs text-zinc-400">
           {vehicle.engineType && <span className="border border-zinc-700 px-3 py-1 uppercase">{vehicle.engineType}</span>}
           {vehicle.transmission && <span className="border border-zinc-700 px-3 py-1 uppercase">{vehicle.transmission}</span>}
           {vehicle.color && <span className="border border-zinc-700 px-3 py-1 uppercase">{vehicle.color}</span>}
           {vehicle.quantityInStock !== undefined && <span className="text-white border border-white px-3 py-1 uppercase font-bold">{vehicle.quantityInStock} IN STOCK</span>}
        </div>
        
        <div className="mt-8 flex items-end justify-between border-b border-zinc-800 pb-8">
          <div>
            <p className="text-xs text-zinc-500 mb-1 uppercase tracking-widest">Valuation</p>
            <span className="text-3xl font-light text-white">
              ${Number(vehicle.price || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-600">
            {vehicle.vin?.substring(0, 8) || 'N/A'}
          </span>
        </div>

        <div className="mt-8">
          <button 
            className={`w-full py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              isOutOfStock || statusText === 'SOLD'
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-gray-200'
            }`} 
            disabled={isOutOfStock || statusText === 'SOLD'}
            onClick={(e) => {
               e.stopPropagation();
               onPurchase(vehicle.id);
            }}
          >
            {isOutOfStock || statusText === 'SOLD' ? 'Unavailable' : 'Commit to Purchase'}
          </button>

          {user?.isAdmin && (
            <div className="mt-4 flex justify-between gap-4">
              <button 
                type="button"
                className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-zinc-700 hover:bg-zinc-800 text-gray-300"
                onClick={(e) => { e.stopPropagation(); onEdit?.(vehicle); }}
              >
                Edit
              </button>
              <button 
                type="button"
                className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-zinc-700 hover:bg-zinc-800 text-gray-300"
                onClick={(e) => { e.stopPropagation(); onRestock?.(vehicle.id); }}
              >
                Restock
              </button>
              <button 
                type="button"
                className="flex-1 py-3 text-xs uppercase tracking-widest font-bold border border-red-900/50 hover:bg-red-900/20 text-red-500"
                onClick={(e) => { e.stopPropagation(); onDelete?.(vehicle.id); }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
