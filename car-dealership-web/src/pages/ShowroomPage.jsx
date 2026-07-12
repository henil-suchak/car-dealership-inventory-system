import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FinanceCalculator from '../components/inventory/FinanceCalculator';


const ShowroomPage = () => {
  const [premiumCars, setPremiumCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarPrice, setSelectedCarPrice] = useState(147100);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('/api/vehicles?size=50');
        setPremiumCars(response.data.content || response.data);
      } catch (error) {
        console.error('Failed to fetch showroom vehicles', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const getFallbackImage = (make, model, category) => {
    const makeLower = make?.toLowerCase() || '';
    const modelLower = model?.toLowerCase() || '';
    const catLower = category?.toLowerCase() || '';
    
    // Map specific models directly to new local assets
    if (modelLower.includes('911')) return '/images/cars/porsche_911.png';
    if (modelLower.includes('urus')) return '/images/cars/urus.png';
    if (modelLower.includes('db12')) return '/images/cars/db12.png';
    if (modelLower.includes('camry')) return '/images/cars/camry.png';
    if (modelLower.includes('rav4') || modelLower.includes('rav14')) return '/images/cars/rav4.png';
    if (modelLower.includes('m8')) return '/images/cars/m8.png';
    
    // Use locally generated car stock images
    const carImages = {
      sedan: '/images/cars/sedan.png',
      truck: '/images/cars/truck.png',
      suv: '/images/cars/suv.png',
      coupe: '/images/cars/sports.png',
      hatchback: '/images/cars/sedan.png', 
      sports: '/images/cars/sports.png',
      default: '/images/cars/default.png'
    };

    if (catLower && carImages[catLower]) return carImages[catLower];
    return carImages.default;
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      
      {/* Immersive Full-Screen Hero */}
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Dynamic Background Image - Rolls Royce Phantom or similar premium asset */}
        <div className="absolute inset-0">
           <img 
              src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" 
              alt="Luxury Showroom Background" 
              className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
           />
        </div>
        
        {/* Gradient Overlay for aesthetic fade out at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
          <div className="w-1 px-4 py-8 mb-8 border-l border-r border-white/20 h-24 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-[2px] bg-white animate-[bounce_2s_infinite]"></div>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light font-serif tracking-tight leading-none mb-6">
            The Pinnacle <br/> <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600">of Motion.</span>
          </h1>
          
          <p className="text-zinc-400 text-sm md:text-base font-mono uppercase tracking-[0.3em] max-w-2xl mx-auto mb-12">
            Acquire the world's most prestigious automotive assets. Engineering masterpieces curated for the elite. 
          </p>

          <button 
            onClick={() => document.getElementById('inventory')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            Explore Fleet
          </button>
        </div>
      </div>

      <div id="inventory" className="max-w-[1400px] mx-auto px-6 md:px-12 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-zinc-800 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-2 font-serif">
              Curated <span className="font-bold text-gray-500">Collection</span>
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
              Global availability: {premiumCars.length} Assets
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {premiumCars.map((car, idx) => {
             // ENTIRELY IGNORE DB MEDIA 
             const imageUrl = getFallbackImage(car.make, car.model, car.category);
             return (
            <div 
              key={car.id} 
              onClick={() => navigate(`/vehicles/${car.id}`)}
              className={`group relative overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-gray-500 transition-all duration-700 cursor-pointer ${idx % 2 !== 0 ? 'md:mt-24' : ''}`}
            >
              <div className="h-[400px] w-full overflow-hidden">
                <img 
                  src={imageUrl} 
                  alt={car.model} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="text-gray-400 uppercase tracking-widest text-xs font-bold mb-1">{car.make}</p>
                <h3 className="text-3xl font-light text-white mb-2 font-serif">{car.model}</h3>
                <p className="text-gray-400 text-sm hidden group-hover:block transition-all duration-300 mb-4">{car.status === 'AVAILABLE' ? 'Available Now' : 'Out of Stock'}</p>
                
                <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <span className="text-xl font-light text-white">${Number(car.price).toLocaleString()}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCarPrice(car.price);
                      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="px-6 py-2 border border-white text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
                  >
                    Finance
                  </button>
                </div>
              </div>
            </div>
             );
          })}
        </div>
        
        {/* Deal Calculator Section */}
        <div className="mt-32 max-w-5xl mx-auto" id="calculator">
            <FinanceCalculator basePrice={selectedCarPrice} />
        </div>
      </div>
    </div>
  );
};

export default ShowroomPage;
