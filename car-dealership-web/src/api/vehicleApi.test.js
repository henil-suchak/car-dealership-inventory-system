import { describe, it, expect, vi } from 'vitest';
import vehicleApi from './vehicleApi';
import apiClient from './apiClient';

vi.mock('./apiClient');

describe('vehicleApi', () => {
  it('fetches vehicles with query params', async () => {
    const mockData = { content: [{ id: 1, make: 'Toyota' }] };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await vehicleApi.getVehicles({ make: 'Toyota' });
    
    expect(apiClient.get).toHaveBeenCalledWith('/vehicles', { params: { make: 'Toyota' } });
    expect(result).toEqual(mockData);
  });

  it('fetches a single vehicle by id', async () => {
    const mockData = { id: 1, make: 'Toyota' };
    apiClient.get.mockResolvedValueOnce({ data: mockData });

    const result = await vehicleApi.getVehicle(1);
    
    expect(apiClient.get).toHaveBeenCalledWith('/vehicles/1');
    expect(result).toEqual(mockData);
  });

  it('creates a vehicle', async () => {
    const vehicleData = { make: 'Ford', model: 'Mustang' };
    apiClient.post.mockResolvedValueOnce({ data: { id: 2, ...vehicleData } });

    await vehicleApi.createVehicle(vehicleData);
    expect(apiClient.post).toHaveBeenCalledWith('/vehicles', vehicleData);
  });

  it('purchases a vehicle', async () => {
    apiClient.post.mockResolvedValueOnce({ data: {} });

    await vehicleApi.purchaseVehicle(1);
    expect(apiClient.post).toHaveBeenCalledWith('/vehicles/1/purchase');
  });
});
