import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import { Search, CarFront, Filter } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const debouncedMake = useDebounce(make, 500);
  const debouncedModel = useDebounce(model, 500);
  const debouncedMin = useDebounce(minPrice, 500);
  const debouncedMax = useDebounce(maxPrice, 500);
  
  useEffect(() => {
    const filters = {};
    if (debouncedMake) filters.make = debouncedMake;
    if (debouncedModel) filters.model = debouncedModel;
    if (category) filters.category = category;
    if (debouncedMin) filters.minPrice = debouncedMin;
    if (debouncedMax) filters.maxPrice = debouncedMax;
    
    onSearch(filters);
  }, [debouncedMake, debouncedModel, category, debouncedMin, debouncedMax, onSearch]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col md:flex-row gap-4 items-center w-full max-w-[1400px] mb-8 mt-4 mx-auto">
      
      {/* Make Search */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-500" />
        </div>
        <input 
          id="make" 
          placeholder="SEARCH MANUFACTURER" 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
          className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-900 focus:border-white transition-colors text-white uppercase tracking-widest text-xs font-bold font-mono outline-none placeholder:text-zinc-700"
        />
      </div>
      
      {/* Model Search */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <CarFront className="h-4 w-4 text-zinc-500" />
        </div>
        <input 
          id="model" 
          placeholder="SEARCH DESIGNATION" 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-900 focus:border-white transition-colors text-white uppercase tracking-widest text-xs font-bold font-mono outline-none placeholder:text-zinc-700"
        />
      </div>

      {/* Category Box */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Filter className="h-4 w-4 text-zinc-500" />
        </div>
        <select 
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-black border border-zinc-900 focus:border-white transition-colors text-zinc-300 uppercase tracking-widest text-xs font-bold font-mono outline-none cursor-pointer appearance-none"
        >
          <option value="">GLOBAL INVENTORY (ALL)</option>
          <option value="SEDAN">EXECUTIVE SALOON</option>
          <option value="SUV">SPORT UTILITY</option>
          <option value="SUPERCAR">SUPERCAR</option>
          <option value="COUPE">GRAND TOURER</option>
          <option value="ELECTRIC">ELECTRIC ASSET</option>
        </select>
      </div>

      {/* Valuation Range */}
      <div className="flex gap-2 flex-1 w-full">
         <input 
          type="number"
          placeholder="MIN $" 
          value={minPrice} 
          onChange={(e) => setMinPrice(e.target.value)} 
          className="block w-full px-4 py-4 bg-black border border-zinc-900 focus:border-white transition-colors text-white uppercase tracking-widest text-xs font-bold font-mono outline-none placeholder:text-zinc-700 max-w-[140px]"
        />
        <input 
          type="number"
          placeholder="MAX $" 
          value={maxPrice} 
          onChange={(e) => setMaxPrice(e.target.value)} 
          className="block w-full px-4 py-4 bg-black border border-zinc-900 focus:border-white transition-colors text-white uppercase tracking-widest text-xs font-bold font-mono outline-none placeholder:text-zinc-700 max-w-[140px]"
        />
      </div>

    </div>
  );
};

export default SearchBar;
