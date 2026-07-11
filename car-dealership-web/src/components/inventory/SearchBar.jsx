import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import Input from '../ui/Input';

import { Search, CarFront, Filter } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');

  const debouncedMake = useDebounce(make, 500);
  const debouncedModel = useDebounce(model, 500);
  
  useEffect(() => {
    const filters = {};
    if (debouncedMake) filters.make = debouncedMake;
    if (debouncedModel) filters.model = debouncedModel;
    if (category) filters.category = category;
    
    onSearch(filters);
  }, [debouncedMake, debouncedModel, category, onSearch]);

  return (
    <div className="glass-card p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-3 items-center sticky top-24 z-30 transform -translate-y-1/2 max-w-4xl mx-auto shadow-2xl">
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          id="make" 
          placeholder="Search make..." 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
          className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-transparent focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>
      
      <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
      
      <div className="relative flex-1 w-full border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <CarFront className="h-5 w-5 text-slate-400" />
        </div>
        <input 
          id="model" 
          placeholder="Search model..." 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
          className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-transparent focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
        />
      </div>

      <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-700"></div>

      <div className="relative flex-1 w-full border-t md:border-t-0 border-slate-100 dark:border-slate-800">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-slate-400" />
        </div>
        <select 
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border-none rounded-xl bg-transparent focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-900 transition-all text-slate-900 dark:text-white appearance-none cursor-pointer"
        >
          <option value="" className="text-slate-900">All Categories</option>
          <option value="SEDAN" className="text-slate-900">Sedan</option>
          <option value="SUV" className="text-slate-900">SUV</option>
          <option value="TRUCK" className="text-slate-900">Truck</option>
          <option value="COUPE" className="text-slate-900">Coupe</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
