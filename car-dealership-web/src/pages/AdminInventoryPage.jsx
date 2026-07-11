import React, { useEffect } from 'react';
import useVehicles from '../hooks/useVehicles';
import vehicleApi from '../api/vehicleApi';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';
import VehicleForm from '../components/inventory/VehicleForm';
import { useAuth } from '../context/AuthContext';

const AdminInventoryPage = () => {
  const { vehicles, loading, error, fetchVehicles } = useVehicles();
  const { user } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingVehicle, setEditingVehicle] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch immediately on mount
  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await vehicleApi.deleteVehicle(id);
        fetchVehicles(); // Refresh list
        showToast('success', 'Vehicle deleted successfully.');
      } catch (err) {
        console.error('Failed to delete vehicle', err);
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
        console.error('Failed to restock vehicle', err);
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
      console.error('Failed to save vehicle', err);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <Button onClick={openCreateModal}>Add New Vehicle</Button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make/Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((v) => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.make} {v.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${v.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.quantityInStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => openEditModal(v)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleRestock(v.id)} className="text-green-600 hover:text-green-900">Restock</button>
                      <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <VehicleForm 
            initialData={editingVehicle} 
            onSubmit={handleSave} 
            onCancel={() => setIsModalOpen(false)} 
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminInventoryPage;
