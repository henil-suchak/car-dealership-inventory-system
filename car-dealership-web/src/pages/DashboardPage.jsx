import React, { useState, useCallback } from 'react';
import useVehicles from '../hooks/useVehicles';
import VehicleCard from '../components/inventory/VehicleCard';
import SearchBar from '../components/inventory/SearchBar';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { vehicles, loading, error, fetchVehicles } = useVehicles();
  const { user, logout } = useAuth();

  const handlePurchase = async (vehicleId) => {
    // We will implement purchase API logic in TASK-046.
    // For now, it's just a placeholder or we can wire it here.
    console.log('Purchasing vehicle', vehicleId);
  };

  const handleSearch = useCallback((filters) => {
    fetchVehicles(filters);
  }, [fetchVehicles]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600">
              Welcome, {user?.sub}
            </span>
            <button 
              onClick={logout} 
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500 text-lg">Loading vehicles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            {error}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vehicles found in inventory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {vehicles.map(vehicle => (
              <VehicleCard 
                key={vehicle.id} 
                vehicle={vehicle} 
                onPurchase={handlePurchase} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
