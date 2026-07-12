import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import FinanceCalculator from '../components/inventory/FinanceCalculator';
import PurchaseAgreementModal from '../components/inventory/PurchaseAgreementModal';
import vehicleApi from '../api/vehicleApi';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [toast, setToast] = useState(null);

  const handleCheckoutClick = () => {
    if (!user) {
      setToast('Please login first to proceed with the acquisition.');
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
      }, 1500);
      return;
    }
    setShowAgreement(true);
  };

  const executePurchase = async () => {
    setShowAgreement(false);
    setIsPurchasing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      await vehicleApi.purchaseVehicle(id);
      setToast('Asset successfully acquired! View the Client Portal.');
      
      // Update local state to reflect purchase
      setVehicle(prev => ({ 
        ...prev, 
        quantityInStock: prev.quantityInStock - 1,
        status: prev.quantityInStock - 1 === 0 ? 'SOLD' : prev.status 
      }));
    } catch (err) {
      setToast('Acquisition failed. Please contact support.');
    } finally {
      setIsPurchasing(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await axios.get(`/api/vehicles/${id}`);
        setVehicle(response.data);
      } catch (err) {
        setError('Failed to load vehicle details. The vehicle may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24 text-white">
        <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 border-t-2 border-white rounded-full animate-spin"></div>
            <p className="mt-4 uppercase tracking-widest text-xs font-bold">Accessing Secure Fleet Data...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-24 text-white">
        <div className="text-center space-y-4">
            <p className="text-xl font-light font-serif">{error || 'Vehicle Not Found'}</p>
            <button onClick={() => navigate(-1)} className="px-6 py-2 border border-white text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition">Go Back</button>
        </div>
      </div>
    );
  }

  const imageUrl = vehicle.media && vehicle.media.length > 0 
        ? vehicle.media[0].mediaUrl 
        : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2070&auto=format&fit=crop';
  
  const statusText = vehicle.status || (vehicle.quantityInStock === 0 ? 'SOLD' : 'AVAILABLE');
  const isAvailable = statusText === 'AVAILABLE' && vehicle.quantityInStock > 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-24 overflow-x-hidden pt-20">
      
      {/* Hero Header */}
      <div className="relative h-[70vh] w-full">
        <div className="absolute inset-0 z-0">
          <img src={imageUrl} alt={vehicle.model} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full z-10 px-6 md:px-12 max-w-[1400px] mx-auto pb-16 hidden md:block">
           <Link to="/" className="text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold flex items-center mb-6 w-fit transition-colors">
              &larr; Back to Showroom
           </Link>
           <div className="flex justify-between items-end">
             <div>
                <p className="text-gray-300 uppercase tracking-widest text-sm font-bold mb-2">{vehicle.year} • {vehicle.make}</p>
                <h1 className="text-6xl md:text-8xl font-light font-serif">
                   {vehicle.model}
                </h1>
                <p className="text-gray-400 mt-4 text-xl font-light">{vehicle.trimLevel}</p>
             </div>
             
             <div className="text-right">
                <p className="text-gray-400 uppercase tracking-widest text-sm mb-2 font-bold">Market Valuation</p>
                <p className="text-5xl font-light">${vehicle.price.toLocaleString(undefined, {minimumFractionDigits: 0})}</p>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-20 mt-12 md:mt-0">
        
        {/* Mobile Header (visible only on mobile) */}
        <div className="md:hidden border-b border-zinc-800 pb-8 mb-8">
            <p className="text-gray-300 uppercase tracking-widest text-xs font-bold mb-1">{vehicle.year} • {vehicle.make}</p>
            <h1 className="text-5xl font-light font-serif mb-4">
               {vehicle.model}
            </h1>
            <p className="text-3xl font-light">${vehicle.price.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
           
           {/* Specs Column */}
           <div className="lg:col-span-2 space-y-16">
              
              <div>
                 <h3 className="text-2xl font-light font-serif mb-8 border-b border-zinc-800 pb-4">Vehicle <span className="font-bold text-gray-500">Specifications</span></h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Category</p>
                        <p className="text-lg font-light">{vehicle.category}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Mileage</p>
                        <p className="text-lg font-light">{vehicle.mileage ? vehicle.mileage.toLocaleString() + ' MI' : 'NEW'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Color</p>
                        <p className="text-lg font-light">{vehicle.color || 'Unspecified'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">VIN</p>
                        <p className="text-lg font-mono">{vehicle.vin || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Engine</p>
                        <p className="text-lg font-light">{vehicle.engineType || 'Unspecified'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Transmission</p>
                        <p className="text-lg font-light">{vehicle.transmission || 'Unspecified'}</p>
                    </div>
                    <div>
                        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-1">Status</p>
                        <p className={`text-lg font-bold ${isAvailable ? 'text-emerald-500' : 'text-zinc-500'}`}>{statusText}</p>
                    </div>
                 </div>
              </div>

              {/* Deal Calculator embedded seamlessly */}
              <div id="calculator">
                 <FinanceCalculator basePrice={vehicle.price} />
              </div>

           </div>

           {/* Call to Action Column */}
           <div className="lg:col-span-1">
              <div className="sticky top-32 bg-zinc-950 border border-zinc-800 p-8">
                 <h4 className="text-xl font-serif font-light mb-2">Acquisition</h4>
                 <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8 line-clamp-3">
                   Secure this {vehicle.year} {vehicle.make} {vehicle.model}. Reserve now to prevent acquisition by competing buyers.
                 </p>

                 <div className="space-y-4">
                    <button 
                       onClick={handleCheckoutClick}
                       className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-all ${
                         isAvailable ? 'bg-white text-black hover:bg-gray-200' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                       }`}
                       disabled={!isAvailable}
                    >
                       {isAvailable ? 'Proceed to Checkout' : 'Vehicle Unavailable'}
                    </button>

                    <button 
                       className="w-full py-4 border border-zinc-700 text-white uppercase tracking-widest text-xs font-bold hover:bg-zinc-800 transition-all"
                       onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                       Structure Finance Deal
                    </button>
                 </div>

                 {(!user || !user.isAdmin) && (
                    <div className="mt-8 pt-8 border-t border-zinc-800">
                      <p className="text-xs text-zinc-400 mb-2">Need assistance?</p>
                      <Link to="/login" className="text-sm font-bold border-b border-white hover:text-gray-300 transition-colors">
                        Speak with a Client Specialist
                      </Link>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>

      <PurchaseAgreementModal 
         isOpen={showAgreement}
         vehicle={vehicle}
         onClose={() => setShowAgreement(false)}
         onConfirm={executePurchase}
      />

      {/* Full screen acquisition overlay */}
      {isPurchasing && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-serif font-light mb-2">Finalizing Acquisition</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold max-w-sm text-center">
              Processing blockchain escrow and verifying client funds. Please do not close this window.
            </p>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 bg-white text-black px-6 py-4 font-mono text-xs uppercase tracking-widest shadow-2xl border border-black animate-in fade-in duration-300">
           {toast}
        </div>
      )}

    </div>
  );
};

export default VehicleDetailPage;
