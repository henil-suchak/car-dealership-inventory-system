import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useVehicles from './useVehicles';
import vehicleApi from '../api/vehicleApi';

vi.mock('../api/vehicleApi');

describe('useVehicles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initially has loading state and fetches vehicles', async () => {
    const mockVehicles = { content: [{ id: 1, make: 'Honda' }] };
    vehicleApi.getVehicles.mockResolvedValueOnce(mockVehicles);

    const { result } = renderHook(() => useVehicles());

    expect(result.current.loading).toBe(true);
    expect(result.current.vehicles).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.vehicles).toEqual(mockVehicles.content);
    expect(vehicleApi.getVehicles).toHaveBeenCalledTimes(1);
  });

  it('handles API errors', async () => {
    vehicleApi.getVehicles.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useVehicles());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch vehicles');
    expect(result.current.vehicles).toEqual([]);
  });
});
