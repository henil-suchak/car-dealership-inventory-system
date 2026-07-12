import React, { useState, useCallback } from 'react';
import useVehicles from '../hooks/useVehicles';
import vehicleApi from '../api/vehicleApi';
import VehicleCard from '../components/inventory/VehicleCard';
import SearchBar from '../components/inventory/SearchBar';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/inventory/VehicleForm';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { vehicles, loading, error, fetchVehicles, purchaseVehicle } = useVehicles();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const handlePurchase = async (vehicleId) => {
    try {
      await purchaseVehicle(vehicleId);
      setToast({ type: 'success', message: 'Purchase successful!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Purchase failed. Please try again.' });
    }
    
    // Auto clear toast
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleApi.deleteVehicle(id);
        fetchVehicles(); // Refresh list
        showToast('success', 'Vehicle deleted successfully.');
      } catch (err) {
        showToast('error', 'Failed to delete vehicle.');
      }
    }
  };

  const handleRestock = async (id) => {
    const quantity = window.prompt('Enter quantity to restock:', '1');
    if (quantity && !isNaN(quantity)) {
      try {
        await vehicleApi.restockVehicle(id, parseInt(quantity, 10));
        fetchVehicles(); // Refresh list
        showToast('success', 'Vehicle restocked successfully.');
      } catch (err) {
        showToast('error', 'Failed to restock vehicle.');
      }
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingVehicle) {
        await vehicleApi.updateVehicle(editingVehicle.id, data);
        showToast('success', 'Vehicle updated successfully.');
      } else {
        await vehicleApi.createVehicle(data);
        showToast('success', 'Vehicle created successfully.');
      }
      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      showToast('error', 'Failed to save vehicle.');
      throw err;
    }
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleSearch = useCallback((filters) => {
    fetchVehicles(filters);
  }, [fetchVehicles]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary-500/10 via-accent-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-600/10 blur-[100px] pointer-events-none"></div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Find Your Dream <br/>
            <span className="text-gradient">Vehicle Today.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
            Browse our premium collection of cars, trucks, and SUVs. Experience seamless purchasing with real-time inventory updates.
          </p>
          
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Inventory</h3>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                {vehicles.length} Results
              </span>
              {user?.isAdmin && (
                <Button onClick={openCreateModal} size="sm">
                  Add New Vehicle
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Curating vehicles...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 p-6 rounded-2xl text-center font-medium shadow-sm">
              {error}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">No vehicles found matching your criteria.</p>
              <button onClick={() => fetchVehicles({})} className="mt-4 text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {vehicles.map(vehicle => (
                <VehicleCard 
                  key={vehicle.id} 
                  vehicle={vehicle} 
                  onPurchase={handlePurchase} 
                  onEdit={openEditModal}
                  onRestock={handleRestock}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <VehicleForm 
            initialData={editingVehicle} 
            onSubmit={handleSave} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      </main>
    </div>
  );
};

export default DashboardPage;
