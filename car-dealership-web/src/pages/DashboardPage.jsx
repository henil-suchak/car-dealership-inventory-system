import React, { useState, useCallback } from 'react';
import useVehicles from '../hooks/useVehicles';
import vehicleApi from '../api/vehicleApi';
import VehicleCard from '../components/inventory/VehicleCard';
import SearchBar from '../components/inventory/SearchBar';
import Toast from '../components/ui/Toast';
import Modal from '../components/ui/Modal';
import VehicleForm from '../components/inventory/VehicleForm';
import PurchaseAgreementModal from '../components/inventory/PurchaseAgreementModal';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { vehicles, loading, error, fetchVehicles, purchaseVehicle } = useVehicles();
  const { user, logout } = useAuth();
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [restockingVehicle, setRestockingVehicle] = useState(null);
  const [restockAmount, setRestockAmount] = useState(1);
  
  // Purchasing State
  const [agreeingVehicle, setAgreeingVehicle] = useState(null);
  const [purchasingVehicle, setPurchasingVehicle] = useState(null);

  const initPurchase = (id) => {
    const v = vehicles.find(v => v.id === id);
    setAgreeingVehicle(v);
  };

  const executeSignedPurchase = async () => {
    if (!agreeingVehicle) return;
    const vehicleId = agreeingVehicle.id;
    
    setAgreeingVehicle(null);
    setPurchasingVehicle(vehicleId);
    
    // Simulate complex finance/blockchain/transaction processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      await purchaseVehicle(vehicleId);
      setToast({ type: 'success', message: 'Asset successfully acquired.' });
    } catch (err) {
      setToast({ type: 'error', message: 'Acquisition failed. Please contact client services.' });
    } finally {
      setPurchasingVehicle(null);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Are you sure you want to completely delete this asset?')) {
      try {
        await vehicleApi.deleteVehicle(id);
        fetchVehicles(); // Refresh list
        showToast('success', 'Asset removed from inventory.');
      } catch (err) {
        showToast('error', 'Failed to remove asset.');
      }
    }
  };

  const handleRestock = async () => {
    if (!restockingVehicle || isNaN(restockAmount)) return;
    try {
      await vehicleApi.restockVehicle(restockingVehicle.id, parseInt(restockAmount, 10));
      fetchVehicles(); // Refresh list
      showToast('success', 'Inventory successfully replenished.');
    } catch (err) {
      showToast('error', 'Failed to replenish inventory.');
    } finally {
      setRestockingVehicle(null);
      setRestockAmount(1);
    }
  };

  const initRestock = (id) => {
    const v = vehicles.find(v => v.id === id);
    setRestockingVehicle(v);
    setRestockAmount(1);
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden pt-32">
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in duration-300">
          <Toast 
            type={toast.type} 
            message={toast.message} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}

      <main className="relative max-w-[1400px] mx-auto px-6 md:px-12 pb-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-zinc-800 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-light uppercase tracking-widest text-white mb-2 font-serif">
              Inventory <span className="font-bold text-gray-500">Management</span>
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold">
              Client & Enterprise Portal
            </p>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase tracking-widest px-4 py-2 bg-zinc-900 border border-zinc-800 text-gray-400">
                {vehicles.length} Results
              </span>
              {user?.isAdmin && (
                <button 
                  onClick={openCreateModal}
                  className="px-6 py-2 border border-white text-white text-xs uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-colors"
                >
                  Add New Vehicle
                </button>
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
                  onPurchase={initPurchase} 
                  onEdit={openEditModal}
                  onRestock={initRestock}
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

        {restockingVehicle && (
          <Modal isOpen={true} onClose={() => setRestockingVehicle(null)}>
            <div className="bg-zinc-950 p-8 border border-zinc-800 auth-form-container">
               <h2 className="text-2xl font-light font-serif uppercase tracking-widest text-white mb-8 border-b border-zinc-800 pb-4">
                 Replenish <span className="font-bold text-gray-500">Inventory</span>
               </h2>
               <p className="text-zinc-500 text-xs mb-6 uppercase tracking-widest">
                 {restockingVehicle.year} {restockingVehicle.make} {restockingVehicle.model}
               </p>
               <div className="space-y-4">
                  <div className="flex flex-col space-y-1">
                     <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400">Add Units</label>
                     <input 
                        type="number" 
                        className="bg-black border border-zinc-800 text-white p-3 font-mono focus:border-white transition-colors outline-none"
                        value={restockAmount}
                        min="1"
                        onChange={(e) => setRestockAmount(e.target.value)}
                     />
                  </div>
                  <div className="flex justify-end pt-6 border-t border-zinc-800 mt-6 gap-4">
                     <button onClick={() => setRestockingVehicle(null)} className="px-6 py-3 border border-zinc-700 text-xs text-zinc-400 font-bold uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                     <button onClick={handleRestock} className="px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors">Confirm Restock</button>
                  </div>
               </div>
            </div>
          </Modal>
        )}

        <PurchaseAgreementModal 
           isOpen={!!agreeingVehicle}
           vehicle={agreeingVehicle}
           onClose={() => setAgreeingVehicle(null)}
           onConfirm={executeSignedPurchase}
        />

      </main>

      {/* Full screen acquisition overlay */}
      {purchasingVehicle && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 border-t-2 border-white rounded-full animate-spin mb-8"></div>
            <h2 className="text-3xl font-serif font-light mb-2">Finalizing Acquisition</h2>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold max-w-sm text-center">
              Processing blockchain escrow and verifying client funds. Please do not close this window.
            </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
