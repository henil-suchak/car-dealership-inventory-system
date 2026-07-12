import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Car, Tag, Activity, Calendar } from 'lucide-react';

const CustomerInventoryPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback beautiful mock data if backend isn't populated or CORS fails
  const mockVehicles = [
    {
      id: 1,
      make: 'Porsche',
      model: '911 GT3 RS',
      year: 2024,
      price: 245000,
      mileage: 120,
      status: 'AVAILABLE',
      color: 'Guards Red',
      transmission: 'PDK',
      engine: '4.0L Flat-6',
      imageUrl: 'https://images.unsplash.com/photo-1503376712341-ea40ce367c34?q=80&w=2070&auto=format&fit=crop'
    },
    {
      id: 2,
      make: 'Mercedes-Benz',
      model: 'G63 AMG',
      year: 2023,
      price: 179000,
      mileage: 4500,
      status: 'AVAILABLE',
      color: 'Obsidian Black',
      transmission: '9-Speed Auto',
      engine: '4.0L V8 Biturbo',
      imageUrl: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2069&auto=format&fit=crop'
    },
    {
      id: 3,
      make: 'BMW',
      model: 'M8 Competition',
      year: 2024,
      price: 138000,
      mileage: 500,
      status: 'AVAILABLE',
      color: 'Marina Bay Blue',
      transmission: '8-Speed M Steptronic',
      engine: '4.4L V8 TwinPower',
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('/api/vehicles');
        // Only use backend data if it exists, otherwise fall back to mock for presentation
        if (response.data && response.data.length > 0) {
          setVehicles(response.data);
        } else {
          setVehicles(mockVehicles);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles', error);
        setVehicles(mockVehicles); // Use mock data if API gets mad
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter(v => 
    `${v.make} ${v.model} ${v.year}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 py-12 px-6 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight mb-4">
          Premium Inventory
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Discover a curated collection of performance and luxury vehicles. Your next masterpiece awaits.
        </p>

        {/* Search Bar & Filters */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search by make, model, or year..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-lg placeholder-slate-500 backdrop-blur-md transition-all shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700/50 transition-all font-medium backdrop-blur-md shadow-lg w-full md:w-auto">
            <Filter size={20} /> Filters
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle) => (
              <div 
                key={vehicle.id} 
                className="group relative bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm transition-all hover:shadow-[0_0_40px_-15px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:bg-slate-800/60"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    {vehicle.status.replace('_', ' ')}
                  </div>
                  <img 
                    src={vehicle.imageUrl || `https://source.unsplash.com/800x600/?${vehicle.make},${vehicle.model},car`} 
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                       // Fallback gradient if image fails
                       e.target.style.display='none';
                       e.target.parentNode.classList.add('bg-gradient-to-br', 'from-slate-700', 'to-slate-800');
                    }}
                  />
                  <div className="absolute bottom-4 left-6 z-20">
                    <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">
                      {vehicle.year} {vehicle.make}
                    </h3>
                    <p className="text-slate-300 text-lg font-medium drop-shadow-md">{vehicle.model}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-1">Asking Price</p>
                      <p className="text-3xl font-bold text-white">
                        ${vehicle.price?.toLocaleString() || vehicle.basePrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/30">
                      <Activity size={18} className="text-emerald-400" />
                      <span className="text-sm font-medium">{vehicle.mileage?.toLocaleString() || 0} mi</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/30">
                      <Calendar size={18} className="text-purple-400" />
                      <span className="text-sm font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 p-3 rounded-2xl border border-slate-700/30 col-span-2">
                       <Tag size={18} className="text-blue-400" />
                       <span className="text-sm font-medium">{vehicle.engine || vehicle.trim || 'Standard Trim'} • {vehicle.transmission || 'Automatic'}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
                      View Details
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors border border-slate-600 outline outline-1 outline-transparent hover:outline-slate-500">
                      Calculate Deal
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInventoryPage;
