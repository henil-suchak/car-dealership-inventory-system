import React, { useState, useEffect } from 'react';
import useDebounce from '../../hooks/useDebounce';
import Input from '../ui/Input';

const SearchBar = ({ onSearch }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');

  const debouncedMake = useDebounce(make, 500);
  const debouncedModel = useDebounce(model, 500);
  
  // Notice we don't debounce category since it's a select field and changes instantly
  
  useEffect(() => {
    const filters = {};
    if (debouncedMake) filters.make = debouncedMake;
    if (debouncedModel) filters.model = debouncedModel;
    if (category) filters.category = category;
    
    onSearch(filters);
  }, [debouncedMake, debouncedModel, category, onSearch]);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 mb-6 items-end">
      <div className="flex-1 w-full">
        <Input 
          id="make" 
          placeholder="Search make..." 
          value={make} 
          onChange={(e) => setMake(e.target.value)} 
        />
      </div>
      <div className="flex-1 w-full">
        <Input 
          id="model" 
          placeholder="Search model..." 
          value={model} 
          onChange={(e) => setModel(e.target.value)} 
        />
      </div>
      <div className="flex-1 w-full">
        <select 
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border h-10"
        >
          <option value="">All Categories</option>
          <option value="SEDAN">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="TRUCK">Truck</option>
          <option value="COUPE">Coupe</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
