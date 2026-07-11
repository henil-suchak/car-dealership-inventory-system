import { useState, useEffect, useCallback } from 'react';
import vehicleApi from '../api/vehicleApi';

const useVehicles = (initialParams = {}) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  const fetchVehicles = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehicleApi.getVehicles({ ...initialParams, ...params });
      // Depending on the backend pagination structure (Page<Vehicle>), we extract content
      if (data.content) {
        setVehicles(data.content);
        setTotalElements(data.totalElements || data.content.length);
      } else {
        setVehicles(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  const purchaseVehicle = useCallback(async (id) => {
    try {
      await vehicleApi.purchaseVehicle(id);
      // Refresh the list to update stock numbers
      await fetchVehicles();
    } catch (err) {
      throw err;
    }
  }, [fetchVehicles]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return { vehicles, loading, error, totalElements, fetchVehicles, purchaseVehicle };
};

export default useVehicles;
