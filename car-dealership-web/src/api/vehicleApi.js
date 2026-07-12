import apiClient from './apiClient';

const vehicleApi = {
  getVehicles: async (params) => {
    // We hit /vehicles/search because the backend uses a different endpoint for searching vs fetching all
    const response = await apiClient.get('/vehicles/search', { params });
    return response.data;
  },

  getVehicle: async (id) => {
    const response = await apiClient.get(`/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (data) => {
    const response = await apiClient.post('/vehicles', data);
    return response.data;
  },

  updateVehicle: async (id, data) => {
    const response = await apiClient.put(`/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await apiClient.delete(`/vehicles/${id}`);
    return response.data;
  },

  purchaseVehicle: async (id) => {
    const response = await apiClient.post(`/vehicles/${id}/purchase`);
    return response.data;
  },

  restockVehicle: async (id, quantity) => {
    const response = await apiClient.post(`/vehicles/${id}/restock`, { quantity });
    return response.data;
  }
};

export default vehicleApi;
